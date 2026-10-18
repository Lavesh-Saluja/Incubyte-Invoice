# Prompt: Submission

From the Claude Code session history. Spelling, grammar and formatting have been corrected; the instructions themselves are unchanged. The assessment brief is reproduced with its original wording; only its formatting was restored.

## 18 Oct 2026, 19:06 UTC: the assessment brief

This is the assignment we were given:

### Assessment with Product Framing

#### Expectations

This exercise is intentionally designed to assess how you think, design, and build software in an AI‑driven environment.

You are required to use AI tools to accelerate your work. We care about how you use them, the clarity of your thinking, and the quality of your engineering decisions.

We expect you to:

- Demonstrate clarity in thought and structured problem solving
- Show strong engineering fundamentals & product thinking
- Make thoughtful architectural and design decisions
- Write production‑quality code and tests
- Use AI intentionally while maintaining correctness and quality

Please make incremental commits so we can understand how your solution evolved.

#### Goal

Build employee salary management software for an organization with 10,000 employees.

#### User persona

HR Manager of the org

#### Problem statement

Currently, ACME org's HR team manages salary data for 10,000 employees across multiple countries, with everything managed via excels, which is tedious. We want the HR manager to manage the salaries data via web-based software and be able to answer questions about how the org pays people.

#### Requirements

Write a one-page requirements document before building the software, outlining the goal, scope & features, and what you are deliberately leaving out, and reasoning for it.

#### Technical constraints

You should build end-to-end, fully functional software, including backend & UI.

- **Backend:** {Language & Framework as per the role you've applied for (preferred) or any other framework of your choice. Relational database of your choice, like SQLite.}
- **UI:** ReactJS or NextJS. AngularJS for Java. Component library of your choice.
- **Seeding:** Seed script with 10,000 employees.
- **Readiness:** Fully functional deployed software. Any video demo of the software.

#### Development approach

Using agentic AI tools of your choice, build the solution while maintaining high standards of code quality and test coverage.

Your solution should include:

- A meaningful set of unit tests that cover the core functionality
- Tests that are fast, deterministic, and easy to understand
- Good code structure, readability, and maintainability

Your commit history should show the evolution of your solution through incremental commits. This helps us understand how you approached the problem and how your implementation developed over time.

#### Artifacts

Along with your solution, please commit any artifacts that help us understand your thinking and approach. Examples might include:

- Requirements document
- Planning or design notes
- Architecture diagrams
- Prompts or instructions used with AI tools
- Trade‑off explanations
- Performance considerations

There is no required format — use whatever helps best explain your approach.

#### How to succeed in this assessment

The strongest submissions typically show:

- Clear thinking and structured problem solving
- Thoughtful architecture and design decisions
- Clean, maintainable code
- Meaningful tests
- Intentional use of AI tools
- Evidence of product thinking

We are not looking for the most complex system, but for good engineering judgment.

#### Submission instructions

- Commit your code to a Git repository
- Ensure commits show your development process
- Include all artifacts mentioned above
- Share the repository link by replying to the same email once you are done

## 18 Oct 2026, 19:05 UTC: requirements document

PR merged. Let's move towards submission.

We are preparing the final submission for the ACME Employee Salary Management assessment. You already have context about this project and its implementation.

Read the assessment requirements and inspect the existing repository before making changes.

**Task:** Create `docs/01-requirements.md` as a concise, one-page requirements document.

Cover only:

- Goal and HR Manager persona
- MVP features actually implemented or originally planned
- Key non-functional requirements
- Deliberately excluded features and why
- Success criteria

Keep it crisp, using short sections and bullets. No essay, generic filler, or repeated information.

Important:

- Preserve the original product scope and decisions.
- Do not claim features exist unless verified in the repository.
- Distinguish planned requirements from implemented functionality where necessary.
- Do not modify application code or other files.
- Do not create a commit yet.

After creating the file, show me its contents and summarize any gaps or discrepancies you found against the assessment instructions.

## 18 Oct 2026, 19:23 UTC: README

PR merged, let's move forward

We are preparing the final submission for the ACME Employee Salary Management assessment. You already know this project, so inspect the current repository, deployment configuration, and `docs/01-requirements.md` before making changes.

**Task:** Create or update the root `README.md` as the main entry point for reviewers.

Keep it short, professional, and scannable. Include:

1. **Overview** — the problem solved and target HR user.
2. **Features** — only features verified in the current implementation.
3. **Tech stack** — actual backend, frontend, database, and relevant infrastructure.
4. **Live demo** — deployed URL and demo video link, if available. Use placeholders only when a URL is genuinely unavailable.
5. **Local setup** — concise, verified installation and startup commands.
6. **Testing** — actual commands to run backend tests, frontend tests, and lint checks.
7. **Documentation** — links to files under `docs/`.
8. **Seed data** — explain how to seed the required 10,000 employees, but only if this capability exists. If it is missing, report the gap instead of pretending it is implemented.

Rules:

- Do not invent URLs, commands, credentials, test results, or capabilities.
- Never include secrets or production credentials.
- Avoid essay-style explanations, badges, and unnecessary sections.
- Do not modify application code.
- Do not create a commit yet.

After editing, report what changed, which details still need my input, and whether the mandatory 10,000-employee seed script exists. If it does not, recommend the smallest appropriate next step.

## 18 Oct 2026, 19:33 UTC: architecture and technical decisions

Continue preparing the ACME Employee Salary Management assessment artifacts. Inspect the repository and existing documentation before editing.

**Task:** Create two concise documents:

##### 1. `docs/02-architecture.md`

Include:

- A simple Mermaid architecture diagram showing the actual frontend, backend, database, and deployment components.
- A compact description of the main models and their relationships.
- Brief summaries of the CSV import and export workflows.
- Authentication and authorization boundaries.

##### 2. `docs/03-technical-decisions.md`

Document only the most meaningful decisions:

- Why CSV import/export was selected.
- Why salary history and payroll processing are excluded.
- How employee inactivation and notice periods work.
- How country-specific currencies are handled.
- How CSV validation, duplicate detection, and transaction safety work.
- How the design addresses the 10,000-employee target.

Rules:

- Inspect the actual implementation and describe what exists, not what was merely planned.
- Keep both documents concise, using diagrams, tables, and bullets where useful.
- State limitations honestly. Do not claim 10,000-record performance has been verified unless it has.
- Do not include credentials, secrets, or sensitive data.
- Do not modify application code or create commits.

Afterwards, summarize the files created and identify any important architectural or assessment gaps that remain.

## 18 Oct 2026, 19:41 UTC: AI usage, testing and deployment

Use this prompt for the AI-usage document:

Continue preparing the final ACME Employee Salary Management assessment submission. Inspect the repository, existing docs, tests, Git history, and CI/CD configuration first.

Complete these tasks:

##### 1. Create `docs/04-ai-usage.md`

Briefly document:

- How AI coding tools were used during planning, implementation, debugging, and UI refinement.
- Representative prompts or instructions actually available in the repository, chat artifacts, or project history.
- How generated changes were reviewed and verified.
- What engineering decisions remained deliberate human decisions.

Do not invent prompts, conversations, reviews, or verification steps. If exact prompt history is unavailable, state that and summarize the documented workflow instead.

##### 2. Create `docs/05-testing-and-deployment.md`

Include:

- Actual backend and frontend test commands.
- Tests and checks that have been run, with verified results only.
- CSV import validation scenarios covered by tests.
- Deployment and CI/CD overview, including verified links if available.
- Performance considerations for 10,000 employees.
- Known limitations and outstanding verification.

Run the relevant existing test and lint commands if practical, and report the actual results. Do not claim a test passed if it was not run successfully.

##### 3. Verify the mandatory seed-data requirement

The assessment explicitly requires a seed script containing 10,000 employees.

Inspect the repository and determine:

- Whether a reproducible seed script exists.
- Whether it creates 10,000 employees and the required associated data.
- Whether it can run safely without duplicating records.
- Whether it has been tested.

If missing, report the gap and propose the smallest safe implementation. Do not generate a large dataset or change application code without first reporting your findings.

Keep both documents concise. Do not modify application code or create commits in this task.

Finally, give me a short checklist of remaining submission blockers.
