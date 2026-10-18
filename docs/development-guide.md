# Local development setup

How to get this repository running on your machine. macOS and Linux are supported directly; on Windows
use WSL2.

## 1. Prerequisites

| Tool       | Version          | Notes                                              |
| ---------- | ---------------- | -------------------------------------------------- |
| Ruby       | 3.3.10           | From `.ruby-version`, via rbenv, asdf, mise or rvm |
| Node.js    | 22 LTS (≥ 22.13) | From `.nvmrc` (`nvm install`)                      |
| npm        | 10.9             | The only package manager: `package.json` pins it   |
| PostgreSQL | 16 (14+ works)   | Server and client headers (`libpq-dev` / `libpq`)  |
| Docker     | optional         | Only for the Docker database in section 3          |

Make sure your shell loads your Ruby and Node version managers. For example, rbenv users on zsh need
`eval "$(rbenv init - zsh)"` in `~/.zshrc`.

## 2. PostgreSQL

### Install and start

|                | Ubuntu / Debian                                         | macOS (Homebrew)                    |
| -------------- | ------------------------------------------------------- | ----------------------------------- |
| Install        | `sudo apt install postgresql libpq-dev`                 | `brew install postgresql@16`        |
| Start          | `sudo systemctl start postgresql`                       | `brew services start postgresql@16` |
| Is it running? | `pg_isready` → `accepting connections`; `pg_lsclusters` | `pg_isready`; `brew services list`  |

`pg_lsclusters` shows each cluster's port. If several versions are installed they use different ports
(e.g. 16 on 5432, 14 on 5433), so set `DB_PORT` to match.

### How Rails connects

`config/database.yml` reads these optional variables in development and test. Put them in `.env`
(copy `.env.example`; it is git-ignored) or export them in your shell.

| Variable      | When unset           |
| ------------- | -------------------- |
| `DB_HOST`     | Unix socket (no TCP) |
| `DB_PORT`     | 5432                 |
| `DB_USERNAME` | your OS username     |
| `DB_PASSWORD` | none                 |

The databases are `starter_development` and `starter_test`. Choose one way to authenticate:

**Option A: Unix socket with peer authentication (no password, simplest on Linux).** Create a role named
after your OS user once, and leave every `DB_*` variable unset:

```bash
sudo -u postgres createuser --createdb "$USER"
```

Homebrew on macOS already creates this role, so there is nothing to do.

**Option B: TCP with a password.**

```bash
sudo -u postgres psql -c "CREATE ROLE starter WITH LOGIN CREATEDB PASSWORD 'choose-a-local-password';"
```

```bash
# .env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=starter
DB_PASSWORD=choose-a-local-password
```

## 3. Optional: PostgreSQL in Docker

Use this only if you don't want a native PostgreSQL. Rails and Vite still run natively.

```bash
docker compose up -d db         # docker-compose v1 also works
docker compose ps               # wait for "healthy"
```

It runs `postgres:16-alpine` on **127.0.0.1:5434**, so it never clashes with a native server on 5432.
Point Rails at it in `.env`:

```bash
DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=starter
DB_PASSWORD=starter_local_only
```

`docker compose down` stops it and keeps the data; `docker compose down -v` **deletes the data**.

## 4. Install and prepare

```bash
git clone <repository-url> && cd <repository-folder>
bin/setup
```

`bin/setup` is safe to rerun and never drops data. It:

1. installs gems and npm packages (which also installs the Lefthook Git hooks);
2. creates and migrates the development and test databases;
3. seeds the development database with the HR account and 10,000 demo employees with salaries;
4. checks the configuration (`bin/rails starter:check`).

## 5. Run

```bash
bin/rails server                # terminal 1: API on http://localhost:3000
npm run dev                     # terminal 2: app on http://localhost:5173
```

Open <http://localhost:5173> and sign in with `hr@acme.test` / `password1234`. This account exists only in
development.

Vite proxies `/api/*` to `http://localhost:3000`. To run Rails on another port, set `DEV_API_PROXY_TARGET`
in `.env` (for example `http://localhost:3001`).

Background jobs (CSV exports) run inside the Rails server through Solid Queue, so no separate worker is
needed.

## 6. Useful commands

| Task                                     | Command                                                      |
| ---------------------------------------- | ------------------------------------------------------------ |
| Check Ruby, database and migrations      | `bin/rails starter:check`                                    |
| Create if missing and migrate            | `bin/rails db:prepare`                                       |
| Seed again (only tops up what's missing) | `bin/rails db:seed`                                          |
| Change the number of demo employees      | `COUNT=500 bin/rails employees:seed_demo`                    |
| ⚠️ Reset the development database        | `bin/rails db:reset` (drops, recreates, loads schema, seeds) |

## 7. Optional settings

All optional; set them in `.env`. See `.env.example` for the full list.

| Variable                      | Default | Purpose                                       |
| ----------------------------- | ------- | --------------------------------------------- |
| `NOTICE_PERIOD_DAYS`          | 30      | Default notice period offered when one starts |
| `EMPLOYEE_IMPORT_MAX_ROWS`    | 10000   | Maximum employees per CSV import              |
| `EMPLOYEE_IMPORT_MAX_FILE_MB` | 5       | Maximum CSV import file size                  |
| `PORT`                        | 3000    | Rails server port                             |

## 8. Troubleshooting

| Problem                                                                | Fix                                                                                                         |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `role "<name>" does not exist`                                         | Create the role (section 2, option A or B)                                                                  |
| `Peer authentication failed for user "starter"`                        | You set `DB_USERNAME` but not `DB_HOST`. Set `DB_HOST=localhost` to use password authentication             |
| `fe_sendauth: no password supplied` / `password authentication failed` | Set or correct `DB_PASSWORD`                                                                                |
| `Connection refused` / `No such file or directory … .s.PGSQL.5432`     | The server isn't running (`pg_isready`), or it listens on another port (`pg_lsclusters`), so set `DB_PORT`  |
| `permission denied to create database`                                 | `sudo -u postgres psql -c 'ALTER ROLE "<name>" CREATEDB;'`                                                  |
| `database "starter_development" does not exist`                        | `bin/rails db:prepare`                                                                                      |
| `ActiveRecord::PendingMigrationError`                                  | `bin/rails db:migrate`                                                                                      |
| `pg` gem fails to install                                              | Install the client headers: `sudo apt install libpq-dev` / `brew install libpq`                             |
| `rbenv: version '3.3.10' is not installed`                             | `rbenv install 3.3.10` (or your version manager's equivalent)                                               |
| `command not found: rails` / `bundle`                                  | Your shell isn't loading the Ruby version manager (see section 1)                                           |
| Port 3000 or 5173 already in use                                       | `bin/rails server -p 3001` with `DEV_API_PROXY_TARGET=http://localhost:3001`; Vite picks the next free port |
| The app says it can't reach the server                                 | Rails isn't running on the proxy target                                                                     |
| `This project is configured to use npm` when running `yarn`            | Use npm. If Yarn already ran, delete `yarn.lock`, `.yarn/`, `.pnp.*` and `node_modules`, then run `npm ci`  |
| Git hooks don't run                                                    | `npx lefthook install`, and check that `git config core.hooksPath` is unset                                 |
