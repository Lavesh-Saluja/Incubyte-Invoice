# Testing and deployment

## Commands

| Check            | Command                | Notes                                                              |
| ---------------- | ---------------------- | ------------------------------------------------------------------ |
| Backend tests    | `bin/rails test`       | Minitest + FactoryBot; needs PostgreSQL; runs in parallel          |
| Ruby lint        | `bin/rubocop`          | `rubocop-rails-omakase`                                            |
| Security scan    | `bin/brakeman`         |                                                                    |
| ESLint           | `npm run lint`         | Fails on any warning; also enforces i18n (no text literals in JSX) |
| Prettier         | `npm run format:check` |                                                                    |
| Production build | `npm run build`        |                                                                    |
| Everything above | `make check`           |                                                                    |

**There are no frontend tests.** The frontend test setup (Vitest) was removed on purpose, and the UI was
checked with scripted browser runs and by hand. Backend Minitest is the only test suite.

## Latest results

Run locally on `main` at commit `6108c8f`, 2026-10-18 19:41 UTC:

| Check                  | Result                                                                |
| ---------------------- | --------------------------------------------------------------------- |
| `bin/rails test`       | **275 runs, 1,135 assertions, 0 failures, 0 errors, 0 skips** (2.3 s) |
| `bin/rubocop`          | 161 files inspected, no offenses                                      |
| `bin/brakeman`         | 0 errors, 0 security warnings                                         |
| `npm run lint`         | No problems                                                           |
| `npm run format:check` | All files formatted                                                   |
| `npm run build`        | Built successfully                                                    |

CI on GitHub passed for the same commit:
[run 39158540768](https://github.com/Lavesh-Saluja/Incubyte-Invoice/actions/runs/39158540768).

The 40 test files cover models, services, policies, jobs and every API controller: sign-in and sessions,
employees and notice periods, departments, dashboard, pay summary, exports, imports, settings and health
checks.

## CSV import scenarios covered by tests

| Area          | Scenarios                                                                                                                                                                                                                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| File          | Rejects non-`.csv`, non-UTF-8 (including UTF-16), malformed CSV, empty files, header-only files, oversize files and too many rows. Accepts any column order, header case and spacing, and a UTF-8 byte order mark. Keeps quoted commas and quotes. Skips blank lines and keeps spreadsheet row numbers |
| Headers       | Missing, duplicated and unexpected columns are reported                                                                                                                                                                                                                                                |
| Required data | Every value except the notice dates is required; rows with too few or too many values are reported                                                                                                                                                                                                     |
| Field rules   | Email format; name length; employee code length and the reserved `INC-` prefix; unknown departments (never created); unknown countries; currency must match the country; plain non-negative amounts with up to 2 decimals; unknown statuses; real `YYYY-MM-DD` dates                                   |
| Status dates  | Active: no notice dates. On notice: both dates, ending today or later, within 365 days. Inactive: both dates or neither, ending no later than today                                                                                                                                                    |
| Duplicates    | Codes and emails repeated within the file (emails ignoring case); codes and emails already in the database, checked with two queries for the whole file                                                                                                                                                |
| Persistence   | Creates each employee with one salary effective from the import date; imports nothing when any row is invalid; rolls everything back when a later batch fails; never changes existing employees; a repeated import creates nothing; currency matches the manual form                                   |
| API           | Template download; preview writes nothing; row and file errors; `201` on import, `422` with errors otherwise; file required; sign-in required; cross-site uploads rejected; other endpoints stay JSON-only                                                                                             |

## Seed data (10,000 employees)

| Question                  | Answer                                                                                                                                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Does a seed script exist? | Yes: `Employees::SeedService`, run by `bin/rails db:seed` (development) or `bin/rails employees:seed_demo` (any environment, `COUNT` defaults to 10,000)                                                     |
| What does it create?      | 10,000 employees, each with one salary in the country's currency, across 10 countries and 8 departments (missing departments are created), with active, on-notice and inactive statuses and consistent dates |
| Is it safe to run again?  | Yes. It counts existing demo employees (email domain `seed.acme.test`) and only adds the missing ones                                                                                                        |
| Is it tested?             | Yes: `test/services/employees/seed_service_test.rb` (5 tests: count and validity, top-up, lifecycle dates, salary components, department reuse)                                                              |
| Has it been run?          | Locally: 10,000 employees in about 4 s, and a second run added 0. **Not yet in production** (see below)                                                                                                      |

## CI/CD

```mermaid
flowchart LR
  push["Pull request or<br/>push to main"] --> ci["CI workflow<br/>backend: RuboCop, Brakeman, Minitest<br/>frontend: ESLint, Prettier, build"]
  ci --> merge["Merge to main"]
  merge --> deploy["Deploy workflow (manual)<br/>1. CI passed for this commit?<br/>2. build and push API image<br/>3. deploy API, wait for health check<br/>4. deploy static site, check version"]
```

- **CI** (`.github/workflows/ci.yml`) runs on every pull request and every push to `main`, against PostgreSQL 16.
- **Deploy** (`.github/workflows/deploy.yml`) is started by hand (Actions → Deploy). It refuses to run
  unless CI passed for that commit. It builds the API image to GitHub Container Registry, triggers Render,
  and waits until `/api/health/live` and `/version.txt` report the new commit.
- **Hosting:** Render free plan. The [web app](https://incubyte-invoice-web.onrender.com) and the
  [API health check](https://incubyte-invoice-api.onrender.com/api/health/live) are both live.
- **Latest deploy:** [run 39150761035](https://github.com/Lavesh-Saluja/Incubyte-Invoice/actions/runs/39150761035)
  succeeded for commit `188f952` (CSV import), and both services report that commit.
  **`main` (`6108c8f`) hasn't been deployed yet,** so the "Notice ends" filter, the Pay page and the seed
  script aren't live.

## Performance for 10,000 employees

Design choices and local measurements are in [03-technical-decisions.md](03-technical-decisions.md#6-designing-for-10000-employees).
In short:

- Lists are paginated, filtered and sorted on the server, using indexes.
- The dashboard and Pay figures are grouped SQL aggregates.
- Imports check codes, emails and departments with one query each for the whole file, and insert in batches.
- Exports run in a background job, in batches.

Measured on a development laptop only: seed about 4 s; import check about 6–8 s and confirm about 8–10 s;
export about 5 s; pay summary about 30 ms.

## Known limitations and outstanding verification

- **Production is behind `main`.** Deploy `6108c8f`, then confirm the live app reports it.
- **Production seed:** after the deploy, with `SEED_DEMO_EMPLOYEES=10000` set on Render, check that the
  live app shows the seeded employees. This hasn't been verified yet.
- **Speed on Render isn't measured.** The free plan has 0.1 CPU and 512 MB. A synchronous 10,000-row import
  may be slow there; if it is, the next step is moving the confirm step into a background job.
- **No frontend tests.** The UI was verified with scripted browser runs and by hand, not automated tests in CI.
- **Notice expiry** is applied when the main pages load, not on a schedule (see [02-architecture.md](02-architecture.md#known-limitations)).
