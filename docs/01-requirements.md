# Requirements — ACME Employee Salary Management

## Goal

ACME's HR team keeps salary data for about 10,000 employees in several countries in Excel. Replace this with a
secure web application where HR can maintain employee and salary records, find people quickly, and answer
questions about how the organisation pays people.

**Persona — the HR Manager.** One preconfigured account. Their daily work is adding and correcting employee
records, handling leavers, bulk-loading data from spreadsheets, and answering headcount and pay questions
by country and department.

## MVP scope

| #   | Feature                | Scope                                                                                                                                                                                    | Status                            |
| --- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| 1   | Sign in                | Single HR account provisioned from env vars (never in Git); hashed password; no sign-up                                                                                                  | Implemented                       |
| 2   | Employees and salaries | Create, view, edit and list (paginated). One current salary per employee: CTC, base, PF, other components, effective date. Currency comes from the country                               | Implemented                       |
| 3   | Notice period          | Start a notice period (default 30 days, 0–365 configurable). The employee becomes inactive when it ends (soft delete). It can be removed to reactivate. Inactive records are read-only   | Implemented                       |
| 4   | Search and filters     | Name, email or code search; status, department, country and "notice ends within N days" filters; all in the URL                                                                          | Implemented                       |
| 5   | Departments            | Managed list with per-department headcount; picked from a dropdown, with inline create                                                                                                   | Implemented (added during design) |
| 6   | Dashboard              | Headcount, active, on-notice and inactive cards; department breakdown; the 10 soonest departures; every number links to the filtered list                                                | Implemented                       |
| 7   | CSV import             | Up to 10k rows; full validation and preview before anything is written; all-or-nothing, create-only. See [csv-import.md](csv-import.md)                                                  | Implemented                       |
| 8   | CSV export             | Exports the current filters (e.g. one country), including salary, as a background job with progress, auto-download and 24-hour history                                                   | Implemented                       |
| 9   | Pay by country         | Median, average, lowest and highest annual CTC of current employees per country, in its own currency, with a department breakdown; links to the matching employees                       | Implemented                       |
| 10  | Seed data              | `bin/rails db:seed` (development) or `employees:seed_demo` (any environment, opt-in on deploy via `SEED_DEMO_EMPLOYEES`) creates 10,000 realistic employees with salaries; safe to rerun | Implemented                       |

## Non-functional requirements

- **Security:** every endpoint needs sign-in and a policy check. HttpOnly encrypted session cookie with a
  12-hour lifetime. Sign-in is limited to 5 attempts per minute. Same-origin requests only. No secrets in
  code or in the frontend bundle.
- **Data integrity:** money is stored as `decimal(15,2)`, never as floats. Currency is recorded explicitly.
  Database constraints back the model validations (unique code and email, non-negative amounts, allowed
  statuses).
- **Scale:** 10,000 employees. Lists, filters and sorting are paginated on the server. Import and export
  run in batches. A 10k export runs in the background without blocking the UI.
- **Usability:** responsive; loading, empty and error states throughout; confirmation before irreversible
  actions; all UI text internationalised.
- **Quality:** fast, deterministic backend tests for the business rules. CI runs lint and tests before
  every manual deploy.

## Deliberately left out

| Excluded                                          | Reason                                                                                                                                                         |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Org-wide pay figures across currencies            | Without exchange rates, a combined median or total of INR, USD and EUR salaries would be misleading. Pay is summarised per country, in that country's currency |
| Salary history                                    | One current package covers the spreadsheet use case. History needs its own model and UI                                                                        |
| Payroll, payslips, currency conversion            | Not a payroll engine. The app stores what HR enters, and CTC is not derived from its components                                                                |
| Multiple roles, sign-up, multi-tenancy            | One organisation and one HR Manager. Extra roles add permission work with no requirement behind them                                                           |
| Hard delete of employees                          | Leavers become inactive, so headcount history, exports and salary records stay intact                                                                          |
| Updating employees or creating departments by CSV | Create-only imports avoid silent overwrites. Auto-created departments would turn typos into new departments                                                    |
| Renaming or merging departments                   | Not needed for the MVP; may be added later                                                                                                                     |

## Success criteria

- The HR Manager can sign in on the deployed app and add, edit, find and offboard employees end to end.
- 10,000 employees can be loaded: seeded for the demo, or imported from CSV with every invalid row reported.
  A file with any error writes nothing.
- HR can answer "how many people, where and in which department, and who is leaving soon" from the
  dashboard, "what do we pay engineers in India?" from the Pay page, and get salary data for any filter as a CSV.
- No salary data is reachable without signing in, and no credentials are committed.
- Backend tests pass in CI, and the commit history shows the solution evolving feature by feature.
