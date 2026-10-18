# ACME Salary Management

ACME's HR team manages salary data for about 10,000 employees in several countries in Excel. This web
application replaces those spreadsheets for the **HR Manager**: one place to maintain employees and their
current salary, find people quickly, and answer questions about how the organisation pays people.

## Live demo

| What  | Link                                                                       |
| ----- | -------------------------------------------------------------------------- |
| App   | <https://incubyte-invoice-web.onrender.com>                                |
| API   | <https://incubyte-invoice-api.onrender.com/api/health/live> (health check) |
| Video | <https://salujalavesh.neetorecord.com/watch/e0eac2a9177f225a0a8f>          |

- **Sign-in credentials** for the deployed app are shared by email and are not stored in this repository.
- The live database is seeded with the 10,000 demo employees.
- The app runs on Render's free plan, so the first request after a period of inactivity can take up to a
  minute while the API starts.

## Features

- **Sign in:** one preconfigured HR account. There is no sign-up, and every page and API needs a session.
- **Employees and salaries:** create, view, edit and list employees, each with one current salary
  (annual CTC, base pay, PF, other components, effective date). The currency comes from the country.
- **Notice period:** start one (30 days by default, 0–365), and the employee becomes inactive when it ends.
  Removing it reactivates the employee. Inactive employees are read-only and are never deleted.
- **Search and filters:** search by name, email or code; filter by status, department, country and
  "notice ends within N days". Filters live in the URL.
- **Departments:** managed list with headcount per department.
- **Dashboard:** headcount, active, on-notice and inactive counts; a department breakdown; the next 10
  departures. Every number links to the matching employee list.
- **Pay:** median, average, lowest and highest annual CTC per country in its own currency, with a
  department breakdown. Figures are never mixed across currencies.
- **CSV import:** up to 10,000 rows, checked in full and previewed before anything is saved. All or
  nothing, and it only ever creates employees. See [docs/csv-import.md](docs/csv-import.md).
- **CSV export:** the current filtered list, with salaries, generated in the background with progress,
  auto-download and a 24-hour export history.

## Tech stack

| Layer          | Choice                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| Backend        | Ruby 3.3, Rails 8.1 (API only), Pundit, Jbuilder, Solid Queue (runs inside Puma)                                    |
| Database       | PostgreSQL 16                                                                                                       |
| Frontend       | React 19 (JavaScript), Vite, React Router, TanStack Query, Formik + Yup, i18next                                    |
| UI             | Tailwind CSS v4, shadcn/ui, lucide icons, Sonner toasts                                                             |
| Tests and lint | Minitest + FactoryBot, RuboCop, Brakeman, ESLint, Prettier, Lefthook Git hooks                                      |
| Infrastructure | Docker image on GitHub Container Registry, Render (API, static site, database), GitHub Actions CI and manual deploy |

## Local setup

Prerequisites: Ruby 3.3.10 (from `.ruby-version`), Node.js 22 (from `.nvmrc`) and a running PostgreSQL
(16, or 14+) that your OS user can connect to. See [docs/development-guide.md](docs/development-guide.md)
for database options.

```bash
bin/setup          # gems, npm packages, Git hooks, dev and test databases, seed data
bin/rails server   # terminal 1: API on http://localhost:3000
npm run dev        # terminal 2: app on http://localhost:5173
```

Sign in locally with the development account created by the seed: `hr@acme.test` / `password1234`.
It exists only in development; production creates its HR account from the `HR_NAME`, `HR_EMAIL` and
`HR_PASSWORD` environment variables.

## Seed data

`bin/setup` runs `bin/rails db:seed`, which creates the development HR account and **10,000 demo
employees with salaries** (10 countries, 8 departments, a mix of statuses), in about 5 seconds.

| Where      | Command                                                                    |
| ---------- | -------------------------------------------------------------------------- |
| Locally    | `bin/rails db:seed`                                                        |
| Any env    | `COUNT=10000 bin/rails employees:seed_demo`                                |
| Deployment | Set `SEED_DEMO_EMPLOYEES=10000`; `bin/migrate-and-start` seeds on start-up |

Seeding only tops up to the target count, so running it again adds nothing. Demo employees use the
`seed.acme.test` email domain.

## Testing

```bash
bin/rails test           # backend tests (needs PostgreSQL)
bin/rubocop              # Ruby lint
bin/brakeman             # security scan
npm run lint             # ESLint
npm run format:check     # Prettier
npm run build            # production build
make check               # everything CI runs
```

Tests cover the backend: models, services, policies and API endpoints. There are no frontend tests; the UI
was checked in the browser. Lefthook runs the linters on commit and the full test suite on push.

## Documentation

- [docs/01-requirements.md](docs/01-requirements.md): goal, scope, non-functional requirements, what was
  left out and why
- [docs/02-architecture.md](docs/02-architecture.md): system and data-model diagrams, import and export
  flows, authentication and authorization
- [docs/03-technical-decisions.md](docs/03-technical-decisions.md): key decisions and trade-offs,
  including the design for 10,000 employees
- [docs/04-ai-usage.md](docs/04-ai-usage.md): how AI tools were used and verified; the main prompts are in
  [docs/prompts/](docs/prompts/)
- [docs/05-testing-and-deployment.md](docs/05-testing-and-deployment.md): test commands and results, CSV
  test coverage, CI/CD, outstanding verification
- [docs/csv-import.md](docs/csv-import.md): import format, validation rules and limits
- [docs/development-guide.md](docs/development-guide.md): local setup in detail: PostgreSQL options,
  running the app, useful commands and troubleshooting
