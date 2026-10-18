# AI usage

The solution was built with **Claude Code**, Anthropic's coding agent, running in this repository. It read
the code, ran commands and tests, edited files and checked the UI in a headless browser. I set the scope,
made the product decisions, reviewed the changes, and merged every pull request (24 merged PRs, 58 commits on
`main`). The agent committed and pushed only when I said "commit and push", and I ran every deploy.

**Where the prompts come from:** the main prompts are taken from the Claude Code session history and
saved in [`docs/prompts/`](prompts/). Spelling, grammar and formatting were corrected for readability; the
instructions and decisions are unchanged. Shorter conversational instructions (reviews, small fixes,
"commit and push") are not all included. Some longer specifications were written outside the coding session
and pasted in.

## Planning

- **Context before code.** The problem, constraints and feature list came first, with an explicit "don't
  start implementing" ([project context](prompts/02-project-context.md), [feature list](prompts/03-feature-list.md)).
- **Each feature was discussed before it was built.** The agent read the existing code, proposed a design and
  listed open questions. For example, before the CSV import it reported four mismatches between my spec and
  the models (employee codes, country names, notice dates, salary effective date) and asked about each one
  ([CSV import prompt](prompts/10-csv-import.md)).
- **Checking against the brief.** Before submission, the agent compared the repository with the assessment
  brief. That check found the missing 10,000-employee seed script and the weak "how the org pays people"
  coverage ([submission prompts](prompts/11-submission.md)).

## Implementation

- **Conventions given upfront:** the rules for services, Pundit, Jbuilder, React Query, i18n, routes and
  constants were set once ([starter prompt](prompts/01-starter-repository.md)), and the agent followed them
  in every feature.
- **Detailed specs for the larger features:** login ([prompt](prompts/05-login.md)), employee model
  ([prompt](prompts/06-employee-model.md)), dashboard ([prompt](prompts/07-dashboard.md)), export
  ([prompt](prompts/09-export.md)) and CSV import.
- **Rules from corrections:** when I corrected the agent, the correction was saved as a persistent rule for
  later work. Examples: wait for the go-ahead before building, check the branch and the remote before
  reporting a push, never build on an unmerged branch, no unnecessary code comments.

## Debugging

Real issues from this project, and how they were found:

| Issue                                                                          | Found by                   | Fix                                                                           |
| ------------------------------------------------------------------------------ | -------------------------- | ----------------------------------------------------------------------------- |
| API calls returned 403 through Render's `/api` rewrite                         | Production request logs    | Added the web host to the API's allowed hosts (`APP_HOSTS`)                   |
| `npm ci` failed in CI ("missing from lock file")                               | CI                         | My global `legacy-peer-deps` npm setting; project `.npmrc` added              |
| Solid Queue in fork mode used about 600 MB on a 512 MB instance                | Agent's measurement        | Switched to async mode inside Puma (about 120 MB)                             |
| "Export downloaded" toast appeared before the file arrived                     | My testing on the live app | Download fetches the file and confirms when it's saved                        |
| CSV parser gave wrong row numbers after blank lines, and accepted UTF-16 files | Agent's own tests          | Blank lines skipped manually; NUL bytes rejected                              |
| A 10,000-row import used about 300 MB of memory                                | Agent's measurement        | Rows keep plain values instead of ActiveRecord objects (about 120 MB)         |
| Brakeman flagged string-built SQL                                              | Security scan              | Parameterised query                                                           |
| IDE warned about an N+1 query in the import                                    | IDE inspection             | False alarm: the import was measured at 24 queries for 10,000 rows; no change |

## UI refinement

- A [UI direction](prompts/04-ui-direction.md) prompt, then a full [redesign prompt](prompts/08-ui-redesign.md)
  with a reference mockup, set the visual system: shadcn/ui, Tailwind tokens, Inter, an app shell.
- I gave feedback while looking at the running app, and the agent applied it. Examples:
  - move search and filters out of the white card;
  - remove descriptions that only restate the page;
  - use spinners instead of "…" labels;
  - move toasts to the top-right corner.
- The agent checked each UI change with scripted browser runs at desktop and mobile widths. It took
  screenshots, checked for console errors and sideways scrolling, and fixed several mobile overflow issues.

## How generated changes were reviewed and verified

- **Automated checks:** backend tests, RuboCop, Brakeman, ESLint, Prettier and the production build ran
  before every hand-off. Lefthook runs them on commit and push, and CI must pass before the deploy workflow
  runs. Results are in [05-testing-and-deployment.md](05-testing-and-deployment.md).
- **Browser checks:** Playwright scripts drove the local app through each feature's main flows. I also
  tested every feature myself in the browser before asking for a commit.
- **Measurements:** query counts, timings and memory for 10,000-row runs, done locally inside rolled-back
  transactions.
- **Pull requests:** every change went through a PR that I reviewed and merged.

## Decisions that stayed with me

| Topic          | Decision                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Scope          | No sign-up, roles or multi-tenancy; no salary history or payroll; employees become inactive instead of being deleted      |
| Infrastructure | Rejected the agent's proposal to configure trusted proxies for rate limiting ("not a devops project, keep it simple")     |
| Tests          | Removed the frontend test setup; backend Minitest is the only suite                                                       |
| Dashboard      | Dropped org-wide average and median salary; added a per-country Pay page after the brief check                            |
| Export         | One export at a time (a new one cancels the old); files kept in the database for 24 hours                                 |
| CSV import     | Keep the file's employee codes; accept country names or codes; strict notice dates; salary effective from the import date |
| CSV import     | Strict all-or-nothing instead of skipping existing employees; departments are never created by import                     |
