# Prompt: Csv import

From the Claude Code session history. Spelling, grammar and formatting have been corrected; the instructions themselves are unchanged.

## 18 Oct 2026, 15:59 UTC

### Implement CSV Import for ACME Employee Salary Management

You are working in my existing ACME employee salary management application. Implement the CSV import feature according to the requirements below.

**Important:** Before changing any code, inspect the existing repository, database schema, Employee and Salary models, employee lifecycle logic, authentication/authorization, department model, frontend structure, API patterns, React Query hooks, i18n setup, and existing tests. Reuse the established architecture. Do not restructure the repository or introduce unnecessary dependencies.

#### 1. Business requirements

ACME HR manages employee and salary information for approximately 10,000 employees across multiple countries.

Implement CSV import that allows authorized HR users to create employees and their current salary records in bulk.

The import must be:

- Create-only: never update existing employees.
- All-or-nothing: either every valid row is imported or none are.
- Validated on the backend, regardless of frontend validation.
- Compatible with the existing employee lifecycle, salary associations, soft deletion, and authorization.
- Designed to handle large imports efficiently without unnecessary database queries.

Do not implement salary history, payroll processing, salary payments, or currency conversion.

#### 2. Exact CSV schema

Use the following columns in the downloadable CSV template:

```csv
employee_code,first_name,last_name,email,job_title,department,country,status,notice_period_start_date,notice_period_end_date,currency,annual_ctc,annual_base_pay,annual_pf,annual_other_components
```

Example valid row:

```csv
ACME-00125,Priya,Sharma,priya@example.com,Software Engineer,Engineering,India,active,,,INR,1800000.00,1200000.00,144000.00,456000.00
```

##### Schema rules

- Do not include `employment_date`.
- Do not include `effective_from`.
- Do not introduce either field as a separate required CSV column.
- Inspect the existing Salary model. If it already has an `effective_from` field, preserve the existing application convention and derive its value from the appropriate existing source rather than asking for a separate CSV value. Do not add a new employment-date field solely for this import.
- Use the existing model associations and validations.
- All required employee, department, country, currency, status, and salary fields must be validated.
- Allow header columns in any order, but require every expected header exactly once.
- Reject missing, duplicate, or unexpected headers with clear errors.
- Handle valid CSV quoting and commas within quoted fields.
- Accept only `.csv` files encoded in UTF-8. Reject unsupported or malformed input clearly.
- Do not silently default missing business data.

#### 3. Employee and salary validation

##### Employee fields

Validate the existing Employee model's required fields and business rules, including:

- Employee code must be unique.
- Email must be valid and unique.
- Employee code and email must not duplicate another row in the same file.
- Names, job title, country, and department must meet existing model requirements.
- Trim surrounding whitespace from text fields.
- Normalize email consistently with existing application conventions.
- Do not bypass model validations or database constraints.

##### Department

Departments are managed separately.

- Resolve each CSV department against an existing department, using the repository's established normalization and matching conventions.
- Reject unknown departments with row-specific errors.
- Never automatically create departments during CSV import.
- Do not create duplicate departments through case or whitespace variations.

##### Country and currency

Country determines the employee's currency.

- Reuse the application's existing country-to-currency mapping, supported-country list, and validation logic.
- Treat the CSV `currency` column as an explicit validation field.
- Reject unsupported countries and country/currency mismatches.
- Never trust the submitted currency without backend verification.
- Do not silently default currency or perform foreign-exchange conversion.
- Ensure the manual employee/salary creation workflow and CSV import use consistent country-currency rules.

##### Salary fields

The current Salary model contains or is intended to contain:

- `annual_ctc`
- `annual_base_pay`
- `annual_pf`
- `annual_other_components`
- `currency`

Inspect the real schema before implementing. Use decimal/numeric types for monetary amounts, not floating-point arithmetic.

Validate required values, numeric formats, precision, permitted ranges, and existing business rules. Do not invent a rule requiring CTC to equal the sum of components unless that rule already exists or has explicitly been adopted.

Each imported employee must receive exactly one current salary record, using the existing association and validations.

##### Employee status and notice periods

The accepted status values are:

- `active`
- `notice_period`
- `inactive`

Apply the existing employee lifecycle and status implementation. Do not create a parallel status system.

Rules:

- **Active:** Both notice-period dates must be blank.
- **Notice period:** Both `notice_period_start_date` and `notice_period_end_date` are required. The end date must not precede the start date.
- **Inactive:** If the existing lifecycle requires notice dates for employees who completed notice, preserve that behavior. Otherwise, both dates may be blank. Follow the existing model's actual rules and report any ambiguity before changing lifecycle behavior.
- Imported inactive employees must remain represented in the application and visible through the existing inactive/soft-delete workflow. Never physically delete imported employees.
- An employee on notice must not be soft-deleted prematurely.
- Preserve the existing scheduled transition or lifecycle mechanism for employees whose notice period has ended.

Use ISO date format (`YYYY-MM-DD`) for notice-period dates. Blank dates must be represented by empty CSV cells, not placeholder strings.

#### 4. Two-stage import process

Implement a safe two-stage process.

##### Stage A: Validate and preview

When a user uploads a CSV:

1. Authenticate and authorize the user.
2. Validate file extension, encoding, file size, row count, headers, and CSV structure.
3. Parse the entire file.
4. Validate all rows, including employee fields, departments, country/currency, status, notice dates, salary fields, and duplicates.
5. Check existing employee codes and emails efficiently.
6. Return a summary of total rows, valid rows, invalid rows, and row-specific errors.
7. Display a preview of the data to be imported.
8. Do not create or modify any database records during this stage.

If any row is invalid, the import must not be confirmed until the errors are resolved and the file is validated again.

Set reasonable, configurable file-size and row-count limits appropriate for the application. Document the limits.

##### Stage B: Confirm and import

After the user explicitly confirms a fully valid preview:

1. Revalidate database-dependent constraints to handle changes made since the preview.
2. Import all employees and associated salary records within a database transaction.
3. Roll back every write if any employee or salary record fails validation or any database constraint fails.
4. Never leave partially imported data.
5. Return an accurate success summary only after the transaction commits.

Protect against duplicate submissions and concurrent imports. Use database unique constraints and appropriate transaction handling. Do not rely exclusively on frontend checks or validation results from an earlier request.

If a background job or persisted import token is needed to support the existing architecture safely, implement the simplest reliable approach and explain the decision. Do not add unnecessary infrastructure.

#### 5. Frontend experience

Follow the existing frontend architecture, styling conventions, and design system.

Implement an intuitive import page or section with:

1. A downloadable CSV template.
2. A clear list of required columns and formatting rules.
3. A CSV file upload control.
4. A validation and preview stage.
5. A summary of total, valid, and invalid rows.
6. Row-level errors identifying the CSV row number, column, and reason.
7. A confirmation action available only when validation succeeds.
8. A final import result showing the number of employees and salary records created.

Additional requirements:

- Prevent accidental duplicate submissions.
- Show meaningful loading, empty, success, and error states.
- Make errors understandable to HR users rather than exposing raw exceptions.
- Do not claim that records have been imported before the server confirms success.
- Use i18n for all frontend text.
- Use React Query and the project's existing API conventions.
- Place API hooks under `hooks/react-query/` in the existing frontend structure.
- Reuse centralized routes, constants, and utilities where appropriate.
- Preserve the existing UI design system and responsive behavior.

#### 6. Backend architecture and performance

- Use a dedicated service object or equivalent existing project pattern for import orchestration.
- Keep parsing, validation, and persistence responsibilities clearly separated.
- Avoid N+1 queries and per-row duplicate queries.
- Query existing employee codes, emails, and departments in batches where practical.
- Use appropriate database indexes and constraints.
- Use a transaction for the complete persistence stage.
- Do not perform writes during preview.
- Ensure temporary files are cleaned up and cannot be accessed by unauthorized users.
- Do not expose sensitive employee or salary data in logs.
- Ensure only authorized HR/admin users can upload, validate, confirm, or inspect import results.
- Do not log complete CSV contents or salary details unnecessarily.

For this MVP, prefer a straightforward implementation over a complex distributed import system. If synchronous processing is insufficient for the configured limits, explain why before introducing background processing.

#### 7. Tests

Use the project's existing testing framework and conventions. Add meaningful tests for:

##### Parsing and validation

- Valid CSV.
- Missing, duplicate, and unexpected headers.
- Header columns supplied in a different order.
- Malformed CSV and invalid encoding.
- Missing required values.
- Invalid email and duplicate employee code/email.
- Duplicates within the CSV and against existing database records.
- Unknown department.
- Unsupported country.
- Country/currency mismatch.
- Invalid currency or salary values.
- Invalid status.
- Missing or incorrectly ordered notice dates.
- Active employees with unexpected notice dates.
- Invalid file extension and configured size/row limits.

##### Persistence and safety

- Valid import creates employees and salary records.
- Invalid import creates no records.
- A failure during persistence rolls back the entire import.
- Existing employees are never updated.
- Existing employees are never physically deleted.
- Each imported employee has exactly one current salary record.
- Repeated confirmation cannot create duplicate records.
- Unauthorized users cannot access import endpoints.
- Country/currency rules match the normal employee creation workflow.

##### Frontend

Test the principal import states, validation error display, disabled confirmation for invalid data, and successful completion using the project's existing frontend test setup.

#### 8. Documentation and delivery

Update the appropriate project documentation with:

- The CSV schema and one example.
- Supported countries and currency mapping, sourced from the actual application.
- Required and conditional fields.
- File-size and row-count limits.
- How validation and confirmation work.
- The all-or-nothing guarantee.
- How to run the relevant tests.

Do not claim unsupported features or tests that have not been run.

#### 9. Required workflow

Before coding:

1. Inspect the repository and report the relevant models, routes, controllers, associations, schema, existing country/currency logic, and employee lifecycle implementation.
2. Identify any mismatch between these requirements and the current implementation.
3. Propose the smallest implementation plan.

Then implement the feature in small, coherent steps.

After implementation:

1. Run the relevant backend and frontend tests.
2. Run the project's linting or formatting checks where available.
3. Fix regressions introduced by your changes.
4. Summarize changed files and architectural decisions.
5. Report exactly which checks passed or failed.
6. List any remaining limitations or decisions requiring my approval.

Do not rewrite unrelated features, change existing behavior unnecessarily, or add fields outside the agreed schema. Preserve the existing repository structure and keep the implementation focused on the ACME MVP.

Follow this. If you find any discrepancies, ask.
