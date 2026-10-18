# CSV employee import

HR can create employees and their current salary in bulk from **Employees → Import**
(`/employees/import`). The import only creates employees, and it is all or nothing.

## CSV schema

Download the template from the import page. It has the header row and this example:

```csv
employee_code,first_name,last_name,email,job_title,department,country,status,notice_period_start_date,notice_period_end_date,currency,annual_ctc,annual_base_pay,annual_pf,annual_other_components
ACME-00125,Priya,Sharma,priya@example.com,Software Engineer,Engineering,India,active,,,INR,1800000.00,1200000.00,144000.00,456000.00
```

- The file must be a `.csv` file encoded as UTF-8. A UTF-8 byte order mark (Excel's "CSV UTF-8") is fine.
- Every column must appear exactly once, in any order. Header names are trimmed and are not case-sensitive.
  Missing, repeated and unknown columns are rejected.
- Standard CSV quoting works, e.g. `"Becker, Jr"`. Blank lines are ignored.
- Spaces around values are trimmed. Empty cells mean "no value". Placeholders such as `N/A` are not accepted.

| Column                     | Required          | Rules                                                                                               |
| -------------------------- | ----------------- | --------------------------------------------------------------------------------------------------- |
| `employee_code`            | Yes               | Unique, at most 50 characters. Must not start with `INC-`, the prefix of codes the app generates    |
| `first_name`, `last_name`  | Yes               | At most 100 characters                                                                              |
| `email`                    | Yes               | Valid email, unique ignoring case. Stored in lower case                                             |
| `job_title`                | Yes               |                                                                                                     |
| `department`               | Yes               | Name of an **existing** department, matched ignoring case and extra spaces. Never created by import |
| `country`                  | Yes               | Country name or ISO 3166 alpha-2 code (`India`, `india`, `IN`). Stored as the code                  |
| `status`                   | Yes               | `active`, `notice_period` or `inactive`                                                             |
| `notice_period_start_date` | Depends on status | `YYYY-MM-DD`. See below                                                                             |
| `notice_period_end_date`   | Depends on status | `YYYY-MM-DD`. See below                                                                             |
| `currency`                 | Yes               | ISO 4217 code. Must equal the country's currency (see the table below)                              |
| `annual_ctc`               | Yes               | Plain number `>= 0`, up to 13 digits and 2 decimals, no commas or symbols, e.g. `1800000.00`        |
| `annual_base_pay`          | Yes               | Same as `annual_ctc`                                                                                |
| `annual_pf`                | Yes               | Same as `annual_ctc`                                                                                |
| `annual_other_components`  | Yes               | Same as `annual_ctc`                                                                                |

CTC is not checked against the sum of the components; the app never derives one from the other.

### Status and notice period dates

These follow the rules of the app's own notice period workflow.

| Status          | Start date                   | End date                                                        |
| --------------- | ---------------------------- | --------------------------------------------------------------- |
| `active`        | Must be empty                | Must be empty                                                   |
| `notice_period` | Required, not after today    | Required, not before the start, today or later, within 365 days |
| `inactive`      | Optional; both dates or none | Optional; not before the start, not after today                 |

An employee on notice whose end date has already passed should be imported as `inactive`.
The start date is stored as the start of that day and the end date as the end of that day (UTC). So an imported
employee stays on notice through the end date, and then the app marks them inactive the same way it does
for notice periods started in the app. Imported inactive employees appear under the Inactive filter like
any other. Nothing is ever deleted.

### Salary

Each imported employee gets exactly one current salary record. Its currency comes from the country, just like
the manual employee form; the `currency` column is checked against it, never trusted. `effective_from`
is not a CSV column: it is set to the date the import is confirmed. Amounts are stored as `decimal(15,2)`.
There is no currency conversion.

## Limits

| Setting             | Default | Environment variable                  |
| ------------------- | ------- | ------------------------------------- |
| Rows per file       | 10,000  | `EMPLOYEE_IMPORT_MAX_ROWS`            |
| File size           | 5 MB    | `EMPLOYEE_IMPORT_MAX_FILE_MB`         |
| Errors returned     | 500     | (fixed; the total is always reported) |
| Rows in the preview | 50      | (fixed)                               |

The import page shows the configured limits (via `GET /api/settings`).

## How it works

1. **Check (preview).** `POST /api/employee_imports/preview` with the file as `multipart/form-data`. The server
   parses the whole file and validates every row, then returns the counts (total, valid, invalid), row errors
   (`row`, `column`, `message`, where `row` is the spreadsheet row number and the header is row 1) and a preview.
   **Nothing is written.** File problems (encoding, headers, size) come back as errors without a row number.
2. **Confirm.** The Import button is enabled only when every row is valid, and it asks for confirmation.
   The browser then sends the **same file** to `POST /api/employee_imports`. The server does not trust the earlier
   check: inside one database transaction it takes a Postgres advisory lock (so imports run one at a time),
   parses and validates the file again against the current database, and then inserts all employees and salaries.
   It responds `201` with the number of employees and salary records created, after the transaction commits.
   If anything is invalid it responds `422` with the new errors and imports nothing.

Nothing is stored between the two steps, so there are no temporary files or import records to clean up or secure.

### All-or-nothing guarantee

All inserts happen in a single transaction. If any row fails validation, or the database rejects any write
(unique code or email, check constraints, foreign keys), the whole transaction rolls back and no employee or
salary is saved. Submitting the same file twice imports it once; the second attempt fails because
the codes and emails already exist.

### Validation and performance

- Each row is checked with the `Employee` and `Salary` model validations, run in a custom `:import` validation
  context. That context skips the per-record uniqueness queries; the import checks those for the whole file at once:
  one query for existing employee codes, one for existing emails (using the `lower(email)` index), and one to load
  departments. Codes and emails repeated within the file are reported with the other row numbers.
- Rows are written with `insert_all!` in batches of 1,000. The database's unique indexes and check constraints
  still apply, as the final safeguard against concurrent changes.
- On a development machine, 10,000 rows take about 6 s to check and about 8 s to import, using about
  120 MB of extra memory.

### Security

Only signed-in HR users can download the template, check a file or import one (`EmployeeImportPolicy`). The two
upload endpoints accept `multipart/form-data` and still require same-origin requests (`Sec-Fetch-Site`). All other
endpoints remain JSON-only. Rack writes each upload to a request tempfile, which `Rack::TempfileReaper` deletes when the request ends; the app never stores the file.
File contents and salary values are not logged.

## Not supported

- Updating existing employees, or creating departments, from a file.
- Re-importing an export: export files use readable headers and extra columns.
- Salary history, payroll, payments or currency conversion.
- Skipping rows that already exist. A file that repeats an existing employee code or email is refused as a whole,
  and the error list names every clashing row. This is deliberate: a failed import writes nothing, so there is
  never a half-finished import to resume, and an overlap usually means an outdated or wrong file. A
  "skip employees that already exist" option, off by default, could be added if HR regularly re-imports a master sheet.

## Tests

```bash
bin/rails test test/services/employee_imports test/controllers/api/employee_imports_controller_test.rb \
  test/policies/employee_import_policy_test.rb
```

The import page was also checked end to end in the browser: template download, a file with header errors,
a file with row errors, a valid import, and re-uploading an imported file.

## Supported countries and currencies

The `countries` gem (v8.1.0) provides every ISO 3166 country. The app (`Employee::COUNTRIES`) uses it for the
country list, the currency of a country, and import validation. The `country` column accepts the code or the name below.

| Country                                      | Code | Currency |
| -------------------------------------------- | ---- | -------- |
| Afghanistan                                  | `AF` | `AFN`    |
| Albania                                      | `AL` | `ALL`    |
| Algeria                                      | `DZ` | `DZD`    |
| American Samoa                               | `AS` | `USD`    |
| Andorra                                      | `AD` | `EUR`    |
| Angola                                       | `AO` | `AOA`    |
| Anguilla                                     | `AI` | `XCD`    |
| Antarctica                                   | `AQ` | `USD`    |
| Antigua and Barbuda                          | `AG` | `XCD`    |
| Argentina                                    | `AR` | `ARS`    |
| Armenia                                      | `AM` | `AMD`    |
| Aruba                                        | `AW` | `AWG`    |
| Australia                                    | `AU` | `AUD`    |
| Austria                                      | `AT` | `EUR`    |
| Azerbaijan                                   | `AZ` | `AZN`    |
| Bahamas                                      | `BS` | `BSD`    |
| Bahrain                                      | `BH` | `BHD`    |
| Bangladesh                                   | `BD` | `BDT`    |
| Barbados                                     | `BB` | `BBD`    |
| Belarus                                      | `BY` | `BYN`    |
| Belgium                                      | `BE` | `EUR`    |
| Belize                                       | `BZ` | `BZD`    |
| Benin                                        | `BJ` | `XOF`    |
| Bermuda                                      | `BM` | `BMD`    |
| Bhutan                                       | `BT` | `BTN`    |
| Bolivia                                      | `BO` | `BOB`    |
| Bonaire, Sint Eustatius and Saba             | `BQ` | `USD`    |
| Bosnia and Herzegovina                       | `BA` | `BAM`    |
| Botswana                                     | `BW` | `BWP`    |
| Bouvet Island                                | `BV` | `NOK`    |
| Brazil                                       | `BR` | `BRL`    |
| British Indian Ocean Territory               | `IO` | `USD`    |
| Brunei Darussalam                            | `BN` | `BND`    |
| Bulgaria                                     | `BG` | `EUR`    |
| Burkina Faso                                 | `BF` | `XOF`    |
| Burundi                                      | `BI` | `BIF`    |
| Cabo Verde                                   | `CV` | `CVE`    |
| Cambodia                                     | `KH` | `KHR`    |
| Cameroon                                     | `CM` | `XAF`    |
| Canada                                       | `CA` | `CAD`    |
| Cayman Islands                               | `KY` | `KYD`    |
| Central African Republic                     | `CF` | `XAF`    |
| Chad                                         | `TD` | `XAF`    |
| Chile                                        | `CL` | `CLP`    |
| China                                        | `CN` | `CNY`    |
| Christmas Island                             | `CX` | `AUD`    |
| Cocos (Keeling) Islands                      | `CC` | `AUD`    |
| Colombia                                     | `CO` | `COP`    |
| Comoros                                      | `KM` | `KMF`    |
| Congo                                        | `CG` | `XAF`    |
| Congo, The Democratic Republic of the        | `CD` | `CDF`    |
| Cook Islands                                 | `CK` | `NZD`    |
| Costa Rica                                   | `CR` | `CRC`    |
| Croatia                                      | `HR` | `EUR`    |
| Cuba                                         | `CU` | `CUP`    |
| Curaçao                                      | `CW` | `XCG`    |
| Cyprus                                       | `CY` | `EUR`    |
| Czechia                                      | `CZ` | `CZK`    |
| Côte d'Ivoire                                | `CI` | `XOF`    |
| Denmark                                      | `DK` | `DKK`    |
| Djibouti                                     | `DJ` | `DJF`    |
| Dominica                                     | `DM` | `XCD`    |
| Dominican Republic                           | `DO` | `DOP`    |
| Ecuador                                      | `EC` | `USD`    |
| Egypt                                        | `EG` | `EGP`    |
| El Salvador                                  | `SV` | `USD`    |
| Equatorial Guinea                            | `GQ` | `XAF`    |
| Eritrea                                      | `ER` | `ERN`    |
| Estonia                                      | `EE` | `EUR`    |
| Eswatini                                     | `SZ` | `SZL`    |
| Ethiopia                                     | `ET` | `ETB`    |
| Falkland Islands (Malvinas)                  | `FK` | `FKP`    |
| Faroe Islands                                | `FO` | `DKK`    |
| Fiji                                         | `FJ` | `FJD`    |
| Finland                                      | `FI` | `EUR`    |
| France                                       | `FR` | `EUR`    |
| French Guiana                                | `GF` | `EUR`    |
| French Polynesia                             | `PF` | `XPF`    |
| French Southern Territories                  | `TF` | `EUR`    |
| Gabon                                        | `GA` | `XAF`    |
| Gambia                                       | `GM` | `GMD`    |
| Georgia                                      | `GE` | `GEL`    |
| Germany                                      | `DE` | `EUR`    |
| Ghana                                        | `GH` | `GHS`    |
| Gibraltar                                    | `GI` | `GIP`    |
| Greece                                       | `GR` | `EUR`    |
| Greenland                                    | `GL` | `DKK`    |
| Grenada                                      | `GD` | `XCD`    |
| Guadeloupe                                   | `GP` | `EUR`    |
| Guam                                         | `GU` | `USD`    |
| Guatemala                                    | `GT` | `GTQ`    |
| Guernsey                                     | `GG` | `GBP`    |
| Guinea                                       | `GN` | `GNF`    |
| Guinea-Bissau                                | `GW` | `XOF`    |
| Guyana                                       | `GY` | `GYD`    |
| Haiti                                        | `HT` | `HTG`    |
| Heard Island and McDonald Islands            | `HM` | `AUD`    |
| Holy See (Vatican City State)                | `VA` | `EUR`    |
| Honduras                                     | `HN` | `HNL`    |
| Hong Kong                                    | `HK` | `HKD`    |
| Hungary                                      | `HU` | `HUF`    |
| Iceland                                      | `IS` | `ISK`    |
| India                                        | `IN` | `INR`    |
| Indonesia                                    | `ID` | `IDR`    |
| Iran                                         | `IR` | `IRR`    |
| Iraq                                         | `IQ` | `IQD`    |
| Ireland                                      | `IE` | `EUR`    |
| Isle of Man                                  | `IM` | `GBP`    |
| Israel                                       | `IL` | `ILS`    |
| Italy                                        | `IT` | `EUR`    |
| Jamaica                                      | `JM` | `JMD`    |
| Japan                                        | `JP` | `JPY`    |
| Jersey                                       | `JE` | `GBP`    |
| Jordan                                       | `JO` | `JOD`    |
| Kazakhstan                                   | `KZ` | `KZT`    |
| Kenya                                        | `KE` | `KES`    |
| Kiribati                                     | `KI` | `AUD`    |
| Kuwait                                       | `KW` | `KWD`    |
| Kyrgyzstan                                   | `KG` | `KGS`    |
| Lao People's Democratic Republic             | `LA` | `LAK`    |
| Latvia                                       | `LV` | `EUR`    |
| Lebanon                                      | `LB` | `LBP`    |
| Lesotho                                      | `LS` | `LSL`    |
| Liberia                                      | `LR` | `LRD`    |
| Libya                                        | `LY` | `LYD`    |
| Liechtenstein                                | `LI` | `CHF`    |
| Lithuania                                    | `LT` | `EUR`    |
| Luxembourg                                   | `LU` | `EUR`    |
| Macao                                        | `MO` | `MOP`    |
| Madagascar                                   | `MG` | `MGA`    |
| Malawi                                       | `MW` | `MWK`    |
| Malaysia                                     | `MY` | `MYR`    |
| Maldives                                     | `MV` | `MVR`    |
| Mali                                         | `ML` | `XOF`    |
| Malta                                        | `MT` | `EUR`    |
| Marshall Islands                             | `MH` | `USD`    |
| Martinique                                   | `MQ` | `EUR`    |
| Mauritania                                   | `MR` | `MRU`    |
| Mauritius                                    | `MU` | `MUR`    |
| Mayotte                                      | `YT` | `EUR`    |
| Mexico                                       | `MX` | `MXN`    |
| Micronesia, Federated States of              | `FM` | `USD`    |
| Moldova                                      | `MD` | `MDL`    |
| Monaco                                       | `MC` | `EUR`    |
| Mongolia                                     | `MN` | `MNT`    |
| Montenegro                                   | `ME` | `EUR`    |
| Montserrat                                   | `MS` | `XCD`    |
| Morocco                                      | `MA` | `MAD`    |
| Mozambique                                   | `MZ` | `MZN`    |
| Myanmar                                      | `MM` | `MMK`    |
| Namibia                                      | `NA` | `NAD`    |
| Nauru                                        | `NR` | `AUD`    |
| Nepal                                        | `NP` | `NPR`    |
| Netherlands                                  | `NL` | `EUR`    |
| New Caledonia                                | `NC` | `XPF`    |
| New Zealand                                  | `NZ` | `NZD`    |
| Nicaragua                                    | `NI` | `NIO`    |
| Niger                                        | `NE` | `XOF`    |
| Nigeria                                      | `NG` | `NGN`    |
| Niue                                         | `NU` | `NZD`    |
| Norfolk Island                               | `NF` | `AUD`    |
| North Korea                                  | `KP` | `KPW`    |
| North Macedonia                              | `MK` | `MKD`    |
| Northern Mariana Islands                     | `MP` | `USD`    |
| Norway                                       | `NO` | `NOK`    |
| Oman                                         | `OM` | `OMR`    |
| Pakistan                                     | `PK` | `PKR`    |
| Palau                                        | `PW` | `USD`    |
| Palestine, State of                          | `PS` | `ILS`    |
| Panama                                       | `PA` | `PAB`    |
| Papua New Guinea                             | `PG` | `PGK`    |
| Paraguay                                     | `PY` | `PYG`    |
| Peru                                         | `PE` | `PEN`    |
| Philippines                                  | `PH` | `PHP`    |
| Pitcairn                                     | `PN` | `NZD`    |
| Poland                                       | `PL` | `PLN`    |
| Portugal                                     | `PT` | `EUR`    |
| Puerto Rico                                  | `PR` | `USD`    |
| Qatar                                        | `QA` | `QAR`    |
| Romania                                      | `RO` | `RON`    |
| Russian Federation                           | `RU` | `RUB`    |
| Rwanda                                       | `RW` | `RWF`    |
| Réunion                                      | `RE` | `EUR`    |
| Saint Barthélemy                             | `BL` | `EUR`    |
| Saint Helena, Ascension and Tristan da Cunha | `SH` | `SHP`    |
| Saint Kitts and Nevis                        | `KN` | `XCD`    |
| Saint Lucia                                  | `LC` | `XCD`    |
| Saint Martin (French part)                   | `MF` | `EUR`    |
| Saint Pierre and Miquelon                    | `PM` | `EUR`    |
| Saint Vincent and the Grenadines             | `VC` | `XCD`    |
| Samoa                                        | `WS` | `WST`    |
| San Marino                                   | `SM` | `EUR`    |
| Sao Tome and Principe                        | `ST` | `STN`    |
| Saudi Arabia                                 | `SA` | `SAR`    |
| Senegal                                      | `SN` | `XOF`    |
| Serbia                                       | `RS` | `RSD`    |
| Seychelles                                   | `SC` | `SCR`    |
| Sierra Leone                                 | `SL` | `SLE`    |
| Singapore                                    | `SG` | `SGD`    |
| Sint Maarten (Dutch part)                    | `SX` | `XCG`    |
| Slovakia                                     | `SK` | `EUR`    |
| Slovenia                                     | `SI` | `EUR`    |
| Solomon Islands                              | `SB` | `SBD`    |
| Somalia                                      | `SO` | `SOS`    |
| South Africa                                 | `ZA` | `ZAR`    |
| South Georgia and the South Sandwich Islands | `GS` | `GBP`    |
| South Korea                                  | `KR` | `KRW`    |
| South Sudan                                  | `SS` | `SSP`    |
| Spain                                        | `ES` | `EUR`    |
| Sri Lanka                                    | `LK` | `LKR`    |
| Sudan                                        | `SD` | `SDG`    |
| Suriname                                     | `SR` | `SRD`    |
| Svalbard and Jan Mayen                       | `SJ` | `NOK`    |
| Sweden                                       | `SE` | `SEK`    |
| Switzerland                                  | `CH` | `CHF`    |
| Syrian Arab Republic                         | `SY` | `SYP`    |
| Taiwan                                       | `TW` | `TWD`    |
| Tajikistan                                   | `TJ` | `TJS`    |
| Tanzania                                     | `TZ` | `TZS`    |
| Thailand                                     | `TH` | `THB`    |
| Timor-Leste                                  | `TL` | `IDR`    |
| Togo                                         | `TG` | `XOF`    |
| Tokelau                                      | `TK` | `NZD`    |
| Tonga                                        | `TO` | `TOP`    |
| Trinidad and Tobago                          | `TT` | `TTD`    |
| Tunisia                                      | `TN` | `TND`    |
| Turkmenistan                                 | `TM` | `TMT`    |
| Turks and Caicos Islands                     | `TC` | `USD`    |
| Tuvalu                                       | `TV` | `AUD`    |
| Türkiye                                      | `TR` | `TRY`    |
| Uganda                                       | `UG` | `UGX`    |
| Ukraine                                      | `UA` | `UAH`    |
| United Arab Emirates                         | `AE` | `AED`    |
| United Kingdom                               | `GB` | `GBP`    |
| United States                                | `US` | `USD`    |
| United States Minor Outlying Islands         | `UM` | `USD`    |
| Uruguay                                      | `UY` | `UYU`    |
| Uzbekistan                                   | `UZ` | `UZS`    |
| Vanuatu                                      | `VU` | `VUV`    |
| Venezuela                                    | `VE` | `VES`    |
| Vietnam                                      | `VN` | `VND`    |
| Virgin Islands, British                      | `VG` | `USD`    |
| Virgin Islands, U.S.                         | `VI` | `USD`    |
| Wallis and Futuna                            | `WF` | `XPF`    |
| Western Sahara                               | `EH` | `MAD`    |
| Yemen                                        | `YE` | `YER`    |
| Zambia                                       | `ZM` | `ZMW`    |
| Zimbabwe                                     | `ZW` | `USD`    |
| Åland Islands                                | `AX` | `EUR`    |
