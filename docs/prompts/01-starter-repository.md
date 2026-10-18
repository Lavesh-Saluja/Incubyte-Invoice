# Prompt: Starter repository

From the Claude Code session history. Spelling, grammar and formatting have been corrected; the instructions themselves are unchanged.

## 16 Oct 2026, 08:04 UTC

### Build a Reusable Rails + React Starter Repository for Two-Day Web App Assignments

#### 1. Your role and objective

Act as a Senior Ruby on Rails Engineer, React/TypeScript Engineer, DevOps Engineer, and CI/CD Architect.

Build a complete, maintainable, reusable starter repository for my future web application assignments, where I may have only two days to implement, test, deploy, and submit an application.

The objective is to eliminate repetitive infrastructure and configuration work so that future assignments can focus primarily on their business requirements.

Do not merely recommend files, generate snippets, or provide a theoretical plan. Inspect the working repository, implement the project, run available checks, fix failures, and document the actual results.

Prioritize:

- Fast native local development.
- A clean separation of frontend and backend responsibilities.
- Simple, reliable database configuration.
- Automated testing and code quality checks.
- Lightweight Git hooks.
- Continuous integration and straightforward deployment.
- Minimal dependencies and low operational overhead.
- Reproducible setup from a fresh clone.
- Clear documentation for future developers.

Do not overengineer the starter.

#### 2. Reference project

Use my existing QuizIt project as an engineering reference:

https://github.com/Lavesh-Saluja/quiz-it-devops

Inspect it if repository access is available. Look for useful practices related to:

- Rails application configuration.
- React and frontend development.
- Database configuration and migrations.
- Docker and container builds.
- Health endpoints.
- GitHub Actions.
- Environment variables and secrets.
- Production deployment.
- Application logging and troubleshooting.
- Separation of development and production concerns.

Do not blindly copy the QuizIt infrastructure.

This starter is for small, independent applications, not a reproduction of QuizIt's production architecture.

Do not introduce project-specific infrastructure such as Google Cloud Managed Instance Groups, load balancers, autoscaling, worker MIGs, Sidekiq, or complex cloud provisioning unless a concrete requirement justifies it.

If the reference repository is inaccessible, explicitly acknowledge that and continue without pretending to have inspected it.

Do not modify my existing QuizIt repository. Work in the current starter repository only.

#### 3. Technology stack

Use this stack:

##### Backend

- Ruby on Rails in API-only mode.
- PostgreSQL.
- Active Record.
- Minitest.
- RuboCop for linting and formatting.
- JSON API responses.
- Standard Rails routing, controllers, models, migrations, and configuration.

##### Frontend

- React.
- TypeScript.
- Vite.
- ESLint.
- Prettier.
- A lightweight CSS approach.
- A reusable API client.

##### Development and automation

- Native Rails and Vite development servers.
- Locally installed PostgreSQL as the default database.
- Optional Docker Compose for PostgreSQL.
- Dockerfile for container-based production deployment where appropriate.
- GitHub Actions for CI.
- Lightweight Git hooks.
- A Makefile or similarly simple command interface where useful.

##### Version selection

Choose mutually compatible, currently supported versions of Ruby, Rails, Node.js, React, TypeScript, Vite, PostgreSQL, and the selected tooling.

Use a supported Node.js LTS release.

Pin runtime versions consistently and commit the appropriate dependency lockfiles.

Do not automatically select the newest version if it introduces compatibility problems. Document the actual versions chosen.

Use npm as the default frontend package manager unless there is a concrete reason to choose Yarn. Do not maintain multiple competing frontend lockfiles.

#### 4. Repository structure

Create a clean monorepo with separate frontend and backend directories.

Use this as a starting point, adapting it to the conventions of the selected framework versions:

    rails-react-starter/
    ├── backend/
    │   ├── app/
    │   │   ├── controllers/
    │   │   └── models/
    │   ├── bin/
    │   ├── config/
    │   │   └── initializers/
    │   ├── db/
    │   │   └── migrate/
    │   ├── lib/
    │   │   └── tasks/
    │   ├── test/
    │   │   ├── controllers/
    │   │   ├── models/
    │   │   └── integration/
    │   ├── .env.example
    │   ├── .rubocop.yml
    │   ├── .ruby-version
    │   ├── Dockerfile
    │   ├── Gemfile
    │   └── config.ru
    ├── frontend/
    │   ├── src/
    │   │   ├── api/
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   └── pages/
    │   ├── public/
    │   ├── .env.example
    │   ├── eslint.config.js
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── vite.config.ts
    ├── .github/
    │   └── workflows/
    │       ├── ci.yml
    │       └── deploy.yml
    ├── .githooks/
    ├── .gitignore
    ├── .gitattributes
    ├── .editorconfig
    ├── lefthook.yml
    ├── compose.yaml
    ├── Makefile
    └── README.md

This is not a requirement to create every file regardless of need.

Follow Rails conventions within the backend directory. Avoid empty initializers, duplicate scripts, unnecessary configuration, and generated files that should not be committed.

Use one coherent Git-hook solution. If a root-level Git-hook manager is incompatible with the chosen setup, select an equally lightweight alternative and explain the decision.

#### 5. Local development: native execution is mandatory

**Docker must not be required to develop or debug the application locally.**

The primary workflow must use native development servers, similar to my existing QuizIt workflow.

##### Terminal 1: Rails backend

From the repository root:

    cd backend
    bin/rails server

##### Terminal 2: React frontend

From the repository root:

    cd frontend
    npm run dev

##### Database

Use a locally installed PostgreSQL server as the default development database.

Document:

- The required PostgreSQL version.
- How to verify the PostgreSQL service is running.
- How to create the development database role.
- How to create the database.
- How authentication and connection settings work.
- How to configure environment variables.
- How to create, migrate, and inspect the database.
- How to troubleshoot common connection failures.

Do not assume that a PostgreSQL role matching the current operating-system username already exists.

Do not hardcode my machine's username, password, database directory, or other machine-specific settings.

##### Optional Docker Compose database

Provide an optional Docker Compose configuration that runs PostgreSQL in a container.

Requirements:

- Use a named volume for persistence.
- Configure credentials through environment variables.
- Include a database health check.
- Avoid port conflicts with a locally installed PostgreSQL instance.
- Explain how to select the native database or the containerized database.
- Ensure Rails can connect to either option using documented configuration.
- Never make the developer start Docker simply to run Rails or Vite.

If Docker is unavailable, the native workflow must still be complete.

##### Frontend proxy

Configure Vite to proxy API requests to Rails in development if this simplifies integration.

Prefer a setup in which the React application calls a stable API path such as `/api/...` instead of scattering backend URLs across components.

Document the proxy target and how to change it.

Keep production configuration separate from development configuration.

#### 6. Sample Rails API

Create a working Rails API with a simple resource named `SampleItem`.

Implement the following attributes:

- `name`: required string.
- `description`: optional text.
- Timestamps.

Implement the following endpoints:

- `GET /api/sample_items`
- `GET /api/sample_items/:id`
- `POST /api/sample_items`
- `PATCH /api/sample_items/:id`
- `PUT /api/sample_items/:id`, if supported consistently.
- `DELETE /api/sample_items/:id`

Use standard HTTP methods, appropriate status codes, JSON responses, strong parameters, and model validations.

Handle invalid input and missing records gracefully.

Do not expose internal stack traces or database errors in API responses.

Use conventional Rails patterns. Avoid unnecessary service objects or abstractions for this small example.

Add a migration and tests for the resource.

Document that the sample has no authentication or authorization and is intended only as a starter demonstration. Do not present it as a secure, multi-user production application.

#### 7. Health endpoints

Implement two health endpoints.

##### Liveness

`GET /api/health/live`

Purpose: Determine whether the Rails process is responding.

Requirements:

- Return a success status when the process can respond.
- Return a small JSON response.
- Do not depend on database connectivity.
- Do not reveal internal configuration.

##### Readiness

`GET /api/health/ready`

Purpose: Determine whether the application is ready to serve requests.

Requirements:

- Verify database connectivity using an appropriate lightweight check.
- Return success when ready.
- Return a suitable failure status when the database is unavailable.
- Handle connection failures without leaking credentials or stack traces.
- Avoid expensive queries and unnecessary external service checks.

Ensure both endpoints are accessible without authentication.

Add Minitest coverage for successful responses and relevant failure cases. Stub or simulate database failures where appropriate so the test suite does not depend on unreliable external conditions.

Document the difference between liveness and readiness and explain how a hosting platform can use these endpoints.

#### 8. React frontend

Create a functional React + TypeScript application demonstrating the sample API.

The UI should support:

- Listing sample items.
- Viewing an item if useful for the chosen design.
- Creating an item.
- Editing an item.
- Deleting an item.
- Form validation.
- Loading states.
- Empty states.
- Success feedback.
- Error feedback.
- Basic responsive styling.
- Accessible labels and keyboard-friendly controls.

Use TypeScript interfaces or types for API payloads and responses.

Create a reusable API client in `src/api/`.

Avoid scattering raw fetch requests and hardcoded API URLs throughout the application.

Handle non-success HTTP responses explicitly.

Do not silently treat network errors as successful operations.

Keep the interface attractive but simple. This is a starter, not a full design system.

Include a small number of meaningful frontend tests using a lightweight React-compatible testing tool, such as Vitest and React Testing Library, if appropriate.

#### 9. Rails and React integration

Make the development and production integration explicit.

##### Development

- Use a Vite proxy or a documented direct API connection.
- Ensure the default native development workflow works without manual browser configuration.
- Avoid unnecessary CORS complexity when a same-origin development proxy can solve the problem.

##### Production

- Configure Rails CORS for the actual frontend origin when the frontend and backend are hosted separately.
- Use environment-based configuration.
- Do not use unrestricted wildcard origins for credentialed requests.
- Document cookie, CSRF, and authentication considerations if authentication is added later.

Use a frontend environment variable such as:

    VITE_API_BASE_URL=

Explain that Vite variables prefixed with `VITE_` are exposed to browser code.

Never put passwords, database URLs, API secrets, Rails master keys, or other sensitive values into frontend environment variables.

Provide `.env.example` files with placeholders only.

Ensure the production API URL can be changed without modifying application source code.

#### 10. Rails configuration and initializers

Inspect which configuration files and initializers are actually needed.

Configure the application appropriately for:

- Development.
- Test.
- Production.
- Database connectivity.
- Secret handling.
- API serialization and errors.
- CORS.
- Health endpoints.
- Standard-output logging in containerized environments.
- Production host settings where necessary.
- Environment variable validation where useful.

Use Rails conventions and secure defaults.

Do not create empty initializers just to populate `config/initializers/`.

Avoid machine-specific paths and uncommitted local configuration dependencies.

Document the purpose of every non-obvious custom configuration file.

#### 11. PostgreSQL and migrations

Use Active Record migrations and a proper test database.

Provide documented commands for:

- Creating the database.
- Running migrations.
- Checking migration status.
- Generating new migrations.
- Preparing the test database.
- Resetting a development database when genuinely necessary.

Clearly label destructive reset commands.

Do not make ordinary startup commands destroy or reset database data.

Do not run migrations automatically from every application replica.

Provide a documented one-time migration procedure for deployment.

Explain basic migration safety, particularly when a future deployment may involve old and new application versions.

Keep the sample migration simple and conventional.

#### 12. Rake task and executable scripts

Create a useful custom Rake task under:

`backend/lib/tasks/starter.rake`

Expose a command such as:

    cd backend
    bin/rails starter:check

The task should verify useful development prerequisites or project configuration without modifying data.

Use meaningful error messages and correct exit behavior.

Add a simple root-level Makefile or executable script if it genuinely improves convenience.

For example, provide convenient targets for:

- Starting Rails.
- Starting React.
- Running backend tests.
- Running backend linting.
- Running frontend linting and type checks.
- Running the frontend production build.
- Running the combined quality checks.

Keep the commands understandable and avoid duplicating maintenance logic unnecessarily.

Ensure scripts have the correct executable permissions where required.

#### 13. Testing with Minitest

Use Minitest for all Rails tests. Do not replace it with RSpec.

Include tests covering:

##### Health checks

- Liveness success.
- Readiness success.
- Readiness when the database is unavailable.

##### Models

- Valid sample item.
- Missing required name.
- Relevant invalid inputs.

##### API integration

- Listing items.
- Creating an item.
- Updating an item.
- Deleting an item.
- Invalid request bodies.
- Missing records.
- Expected HTTP status codes.
- JSON response structures.

Use Rails integration tests where appropriate.

Keep tests deterministic and fast.

Ensure the test database is isolated from development and production.

Do not write tests that silently pass when an endpoint is broken.

Add frontend tests for important user interactions or API-client behavior.

Document commands for running all tests and individual test files.

#### 14. Linting and formatting

Use a simple, consistent quality toolchain.

##### Ruby

- RuboCop.
- Appropriate Rails-specific rules if useful.
- A reasonable rule set that does not create excessive configuration work.

##### Frontend

- ESLint with React and TypeScript support.
- Prettier for formatting.
- TypeScript type checking.
- Vite production build.

Provide working commands, adapting paths to the actual repository structure.

Typical commands may include:

    cd backend
    bin/rails test
    bundle exec rubocop

    cd frontend
    npm run lint
    npm run typecheck
    npm test
    npm run build

Make sure the scripts actually execute the checks.

Do not use commands that silently skip required tests or report success without testing.

Document any intentional lint exceptions.

#### 15. Git hooks: lightweight and useful

Configure lightweight Git hooks to catch common mistakes without slowing down every small change.

Use one hook manager, preferably Lefthook if compatible with the repository.

##### Pre-commit

Run fast checks where practical:

- Relevant Ruby linting.
- Frontend linting for changed files where feasible.
- Formatting checks where they can be run reliably.

Avoid running the entire test suite on every commit.

Do not automatically rewrite unrelated files or unexpectedly stage changes.

##### Pre-push

Run a reasonable set of checks, such as:

- Backend tests.
- Backend linting.
- Frontend linting.
- Type checking.
- Frontend tests and production build.

If execution time becomes excessive, optimize the commands rather than introducing a large hook framework.

##### Installation and bypass behavior

Document hook installation after cloning.

Ensure the hooks are actually installed and executable.

Explain how to bypass a hook intentionally when necessary, while warning that bypassing checks does not bypass CI.

Do not treat local hooks as a security boundary.

Keep GitHub Actions as the authoritative quality gate.

#### 16. GitHub Actions CI

Create a working `.github/workflows/ci.yml`.

Run CI for:

- Pull requests.
- Pushes to the production branch, normally `main`.

Configure:

- Appropriate workflow permissions.
- Correct Ruby and Node.js versions.
- Dependency installation and caching.
- A PostgreSQL service for Rails tests.
- Test database configuration.
- Rails Minitest.
- RuboCop.
- Frontend linting.
- Type checking.
- Frontend tests.
- Production build.

Use reproducible dependency installation based on the committed lockfiles.

Make sure every command matches the repository structure.

Keep the pipeline fast enough for a two-day assignment workflow.

Avoid duplicate checks and unnecessary infrastructure.

CI must fail when required checks fail.

Do not expose secrets in logs.

Do not claim CI is successful unless it has actually run successfully. If it cannot be run in the current environment, report the limitation and explain how to verify it.

#### 17. Deployment and CD

The repository should be straightforward to deploy, but the final hosting platform has not yet been chosen.

Do not assume that Vercel is suitable for the Rails backend simply because it is suitable for the React frontend.

Provide a production-compatible Rails Dockerfile and explain which hosting approaches it supports.

Keep local development independent of Docker.

Document deployment for a suitable Rails hosting platform, with a clear separation between frontend and backend deployment if they are hosted independently.

The documentation should cover:

- Creating or provisioning the database.
- Setting production environment variables.
- Configuring the frontend API URL.
- Configuring production CORS.
- Applying database migrations.
- Building and deploying the frontend.
- Building and deploying the backend.
- Health-check configuration.
- Verifying the live application.
- Checking production logs.
- Troubleshooting failed deployments.

Create `.github/workflows/deploy.yml` only when it can be implemented meaningfully and safely.

If a provider must be chosen first, prepare a documented deployment template or provider-neutral design rather than inventing provider-specific credentials or actions.

Do not automatically create cloud resources, modify external services, or deploy to production without explicit authorization.

Prefer preview deployments for feature branches when supported.

Production deployments should run from the intended production branch and depend on the required quality checks.

Avoid running destructive migrations automatically.

Include a smoke-test checklist for the live frontend, backend, and database-backed sample workflow.

#### 18. Secrets and security

Ensure that:

- `.env` files containing real credentials are excluded from Git.
- Example environment files contain placeholders only.
- Rails secrets are handled securely.
- Database credentials are never committed.
- Frontend variables are treated as public.
- API parameters are validated.
- Database errors do not expose internal details.
- Production logging avoids credentials and sensitive request data.
- CORS is explicitly configured.
- GitHub Actions use least-privilege permissions.
- CI does not use production database credentials.

Document any security limitations of the sample application.

Do not add authentication merely to make the starter appear production-ready. Instead, document when authentication and authorization become necessary for a particular assignment.

#### 19. README and developer experience

Write a concise but complete README containing:

1. Project purpose.
2. Architecture overview.
3. Technology stack and versions.
4. Prerequisites.
5. Repository structure.
6. Native local development setup.
7. PostgreSQL installation and configuration.
8. Optional Docker Compose database setup.
9. Starting Rails and React.
10. Environment variable reference.
11. Database creation and migration commands.
12. Running backend tests.
13. Running frontend tests.
14. Running linting and type checking.
15. Installing and using Git hooks.
16. GitHub Actions workflow.
17. Deployment instructions.
18. Health-check endpoints.
19. Troubleshooting common errors.
20. Replacing the sample feature with assignment-specific functionality.
21. Security limitations.
22. Known limitations and manual setup requirements.

The README must work for someone cloning the repository onto a fresh machine.

Do not assume the developer knows which directory to enter or which commands must run first.

#### 20. Engineering principles

Throughout implementation:

- Keep the code simple and maintainable.
- Prefer conventional Rails patterns.
- Avoid unnecessary dependencies.
- Avoid overengineering.
- Do not add Kubernetes, Terraform, Redis, Sidekiq, or microservices without a genuine need.
- Do not require Docker for local development.
- Do not commit generated dependency directories or build artifacts.
- Do not commit real secrets.
- Do not hardcode machine-specific configuration.
- Do not introduce duplicate package managers or competing lockfiles.
- Do not create configuration files that serve no real purpose.
- Do not hide failing tests.
- Do not use placeholder commands that pretend to work.
- Do not claim deployment readiness without appropriate verification.
- Do not overwrite existing user work without inspecting it first.
- Do not push to GitHub or deploy without authorization.

#### 21. Execution plan

Follow this sequence.

##### Step 1 — Inspect

Inspect the current working directory, repository status, available runtimes, and existing files.

Inspect the QuizIt reference repository if accessible.

Do not assume the working directory is empty.

##### Step 2 — Propose the implementation

Briefly state the chosen architecture, versions, package manager, testing strategy, Git-hook approach, local development workflow, and deployment approach.

Use sensible defaults rather than asking unnecessary questions.

If a decision genuinely requires my input, ask before making a potentially destructive or expensive change.

##### Step 3 — Implement

Create the Rails backend, React frontend, PostgreSQL configuration, sample CRUD workflow, health endpoints, Minitest tests, frontend tests, linting, Git hooks, Docker configuration, GitHub Actions, and README.

Keep the implementation coherent and minimal.

##### Step 4 — Verify

Run all checks supported by the environment:

- Dependency installation.
- Rails boot.
- Database connectivity.
- Database creation and migrations.
- Health endpoints.
- CRUD API behavior.
- Minitest.
- RuboCop.
- Frontend linting.
- Type checking.
- Frontend tests.
- Production build.
- Git-hook installation and execution.
- Docker Compose configuration validation, if Docker is available.
- Docker image build, if Docker is available.

Fix discovered problems before continuing.

Do not claim that commands passed unless you have inspected their actual results.

If a service, dependency, or external resource is unavailable, state what could not be verified.

##### Step 5 — Review

Inspect the completed repository for:

- Secrets.
- Inconsistent dependency versions.
- Broken scripts.
- Unnecessary dependencies.
- Missing tests.
- Incorrect API integration.
- Incorrect CORS configuration.
- Unsafe database behavior.
- Health-check errors.
- Inconsistent environment variables.
- CI commands that do not match the project.
- Undocumented manual steps.
- Unverified deployment assumptions.

##### Step 6 — Report

Provide a concise completion report including:

- Files and functionality created.
- Important engineering decisions.
- Actual runtime and dependency versions.
- Commands executed and their results.
- Tests that passed or failed.
- Checks that could not be performed.
- Native local development instructions.
- Optional Docker instructions.
- Git-hook behavior.
- CI behavior.
- Deployment instructions.
- Required environment variables.
- Remaining limitations.

Do not push, publish, or deploy without my explicit authorization.

#### Definition of done

The starter is complete when a developer can clone it, configure PostgreSQL, run Rails and React natively in separate terminals, use the sample CRUD workflow, execute Minitest and frontend tests, run linting and builds, benefit from lightweight Git hooks, and use GitHub Actions to validate changes.

The repository must also include meaningful health endpoints, optional Docker support, safe environment configuration, production-oriented deployment files, and clear documentation.

**Primary goal: build the smallest reliable engineering foundation that can be reused across future two-day assignments without repeatedly rebuilding the development, testing, and deployment setup.**

## 16 Oct 2026, 08:51 UTC

Feedback:

1. Don't use a separate folder for the backend; it doesn't look good when browsing the repository on GitHub.
2. Add factories for tests.
3. The frontend will use i18n translations; we will never put text directly in the code.
4. We will use React Query to call the APIs, so make a separate React Query folder under `hooks`.
5. Constants go in separate files; we will never define a constant inline in the code.
6. Use JSX, not TSX.
7. Routes go in a separate `routes.js` file; we will never hard-code routes in the code.
8. Any utility functions should go in a separate utilities folder, in the relevant file, so they can be
   reused and the code doesn't get cluttered.
9. Use JavaScript, not TypeScript.
