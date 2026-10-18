# Prompt: Dashboard

From the Claude Code session history. Spelling, grammar and formatting have been corrected; the instructions themselves are unchanged.

## 18 Oct 2026, 09:06 UTC

PR merged. Let's move on to the next feature: the dashboard, or home page. Let's discuss what it should
contain. In my view it should show the total employee count, the employee count per department and the
number of people on notice. Clicking an active count should open the employees page with that department and
the active status applied, and the same for the notice-period count. I'm not sure whether we need median or
average salary per country, per department or overall. Also suggest anything else you think would help HR
or the manager.

## 18 Oct 2026, 09:17 UTC

Let's not do median and average; they don't make sense for the company. Let's keep point 4 (leaving soon),
but I have a question: since we show the notice-period count overall and per department, and each one can be
clicked to see the full list, is point 4 still needed? What's your view? We don't need point 5, because
salary is mandatory when adding an employee, and we expect CSV imports to have complete data. Give me the
final short list of what we're including.

## 18 Oct 2026, 09:35 UTC

### Final dashboard requirements: ACME Salary Management

We'll lock the dashboard scope with your updated decisions. The dashboard will focus on workforce status and
upcoming departures, without average salary, median salary, or data-completeness metrics.

#### 1. Headline cards

Four clickable cards at the top of the dashboard.

| Card              | What it displays                                                                             | Navigation                        |
| ----------------- | -------------------------------------------------------------------------------------------- | --------------------------------- |
| Current headcount | Active + on-notice employees                                                                 | `/employees`                      |
| Active            | Employees currently active and not on notice                                                 | `/employees?status=active`        |
| On notice         | Total employees currently on notice, with a subtitle such as "5 leaving in the next 10 days" | `/employees?status=notice_period` |
| Inactive (left)   | Employees whose employment has ended                                                         | `/employees?status=inactive`      |

Rules:

- Current headcount = Active + On notice.
- Inactive employees are excluded from current headcount.
- The On notice card shows the total number on notice, but its subtitle counts only employees whose notice
  ends within the next 10 days.
- The On notice card opens the full notice-period list, not just those leaving within 10 days.

#### 2. Headcount by department

One row per department, with three counts and a simple bar representing the department's total current
headcount.

| Department  | Active | On notice | Total |
| ----------- | -----: | --------: | ----: |
| Engineering |     85 |         5 |    90 |
| Finance     |     24 |         1 |    25 |
| HR          |     12 |         2 |    14 |

Illustrative numbers only.

Click behaviour:

- Active count: `/employees?department=Engineering&status=active`
- On notice count: `/employees?department=Engineering&status=notice_period`
- Total count: `/employees?department=Engineering`

Rules:

- Department total = Active + On notice.
- Inactive employees must be excluded from department totals and from all current-headcount calculations.
- Clicking an On notice count must show employees sorted by notice end date, earliest first.
- Clicking an Active count may use the normal list ordering; no notice-date sorting is needed.
- Clicking a department's Total count includes both active and on-notice employees.

#### 3. Upcoming departures preview

A compact section listing employees whose notice period ends within the next 10 days. Each row shows the
employee's name, department, and notice end date (last working day).

Behaviour:

- Include only employees currently on notice whose notice end date falls within the next 10 days.
- Sort by notice end date, earliest first.
- Clicking an employee opens their details page.
- Include a "View all employees on notice" link to `/employees?status=notice_period`.
- If no one is leaving within the next 10 days, show a clear empty state.

#### 4. Notice-period sorting on the Employees page

Whenever the employee list is filtered to employees on notice, sort them by notice end date in ascending
order. This applies to:

- `/employees?status=notice_period`;
- `/employees?department=Engineering&status=notice_period`;
- clicking the On notice count for any department;
- any other filter combination that includes `status=notice_period`.

Implementation rules:

- The employee leaving soonest appears first.
- Sorting must happen on the backend, so it stays correct across pagination.
- Employees with no notice end date, if any, appear last.
- Sorting is unchanged for Active and the other statuses.

#### Final calculation rules

| Metric                  | Calculation                                                             |
| ----------------------- | ----------------------------------------------------------------------- |
| Current headcount       | Active + On notice                                                      |
| Active                  | Employees with active status                                            |
| On notice               | Employees currently serving notice                                      |
| Leaving in next 10 days | On-notice employees whose notice end date falls within the next 10 days |
| Inactive                | Employees whose employment has ended                                    |
| Department total        | Active + On notice within that department                               |
