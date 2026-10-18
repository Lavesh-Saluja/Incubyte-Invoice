# Prompt: Project context

From the Claude Code session history. Spelling, grammar and formatting have been corrected; the instructions themselves are unchanged.

## 17 Oct 2026, 07:56 UTC

### Project Context: ACME Employee Salary Management

#### Problem statement

ACME is an organization with approximately 10,000 employees across multiple countries. Its HR team currently manages employee salary information using Excel spreadsheets, which makes maintaining records and answering questions about the organization's compensation time-consuming.

We need to build a web-based employee salary management application that centralizes employee and compensation data and enables the HR Manager to understand how the organization pays its employees.

#### Business goal

Replace the existing spreadsheet-based workflow with a simple, reliable, and secure web application. The application should make employee salary data easier to maintain, search, analyze, and report.

This is a two-day development assessment. The objective is not to build a complete enterprise HRMS or payroll platform. We should demonstrate good product thinking, sound engineering decisions, maintainable code, meaningful tests, and a working deployed application.

#### Organization and authentication model

For the initial version, the application is built exclusively for one organization: ACME.

This is a single-organization application, not a multi-tenant SaaS product. We do not need organization registration, public sign-up, organization onboarding, or organization switching.

The initial application will have a preconfigured HR Manager account created before use.

The account credentials will be provided through a secure setup process. The initial password may be predefined for the assessment, but it must not be hardcoded into application source code or committed to Git. Use environment variables or an appropriate one-time account setup mechanism for provisioning the account.

The application must require authentication before allowing access to employee and salary information. There should be no public registration page. Passwords must be securely hashed, and the existing Rails authentication conventions should be reused where appropriate.

Do not introduce multiple roles, organization membership, or complex permission workflows unless a concrete requirement emerges.

#### Salary data model

Employee identity and organizational details should be separate from compensation data.

Use an Employee model for employee information and an associated Salary model for the employee's current compensation package.

The current Salary record should accommodate annual CTC, annual base pay, annual PF, other compensation components, currency, and the date from which the compensation is effective.

Each employee has one current salary record in this version. Salary history and compensation-change tracking are deferred.

Treat compensation amounts as monetary decimal values, not floating-point values. Record currency explicitly instead of inferring it from country.

Do not assume that CTC is simply the sum of the listed components unless the business defines that formula. The application manages the compensation data supplied by HR; it is not a payroll calculation engine.

#### How we will proceed

We will work in a structured sequence:

1. Understand the problem and clarify business assumptions.
2. Finalize the requirements document, scope, and feature priorities.
3. Design the data model, user flows, and API contracts before implementation.
4. Implement the agreed MVP using the existing reusable starter.
5. Test the main workflows and important failure cases.
6. Deploy the application using our existing CI/CD setup.
7. Verify the deployed application and prepare the assessment artifacts at the end.

Do not start implementing additional features merely because they seem useful. The agreed feature list will be provided separately and will define the implementation scope.

#### Engineering principles

- Prioritize a complete, working end-to-end solution within two days.
- Prefer simple, conventional Rails and React patterns.
- Reuse the existing starter and its conventions.
- Keep frontend user-facing text internationalized.
- Use React Query for API calls and centralized route definitions and constants.
- Validate data at appropriate boundaries.
- Protect salary information and avoid exposing secrets.
- Write meaningful tests for important business behavior.
- Use AI deliberately, review generated code, and verify actual results.
- Avoid unnecessary infrastructure, abstractions, and dependencies.

At the end, we will document the actual architecture, decisions, trade-offs, AI usage, tests, and other assessment artifacts in the repository.

For now, treat this as context only. Wait for the finalized requirements and feature list before implementing application features.

## 17 Oct 2026, 08:01 UTC

The salary model will have a fixed set of compensation components. For now we are not introducing exchange
rates: we will group by country and other filters that don't need a conversion rate. There will be several
models, and we will discuss their attributes in detail while implementing each feature. Yes, there will be a
feature to import a CSV file of 10,000 employees, and we will validate that CSV for the right columns and
data. We will decide how deletion works when we implement that feature.
