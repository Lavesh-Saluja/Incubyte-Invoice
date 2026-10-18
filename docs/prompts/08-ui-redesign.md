# Prompt: Ui redesign

From the Claude Code session history. Spelling, grammar and formatting have been corrected; the instructions themselves are unchanged.

## 18 Oct 2026, 11:05 UTC

### ACME Salary Management — Complete UI/UX Redesign

Act as a senior product designer and frontend engineer. Redesign the existing ACME Salary Management application into a polished, professional, production-quality enterprise SaaS product.

The application already has working pages and business logic. The objective is to significantly improve its visual design, typography, layout, consistency, and usability without breaking existing functionality.

#### 1. Reference images and design intent

I have provided two categories of visual references:

1. **Existing application screenshots:** Show the current login, employee listing, add employee form, dashboard, employee details, and notice-period dialog.
2. **Proposed design reference image:** Shows the visual direction I want, including the dashboard, employee table, forms, details page, login screen, color palette, and typography.

Use the existing screenshots to understand the actual application features, content, fields, and workflows. Use the proposed design reference to guide the new visual design.

The existing styling is not the target. I find the current UI generic and childish, particularly its typography and overall presentation. Create a noticeably more refined interface.

Do not reproduce the reference image pixel by pixel. It is a visual guide, not a replacement for the real application. Use the actual project data, routes, and business rules.

#### 2. Desired visual identity

Design a mature, modern enterprise HR SaaS product.

The interface should communicate:

- Professionalism and trust.
- Clear information hierarchy.
- Precise, organized data presentation.
- Efficient HR workflows.
- Consistency across all pages.

Use a restrained, cohesive design system:

- Deep navy or a similarly sophisticated neutral for navigation.
- A deliberate primary accent color, such as indigo or blue.
- White and subtle neutral backgrounds.
- Light, understated borders.
- Restrained semantic colors for active, on-notice, inactive, success, warning, and error states.
- Consistent spacing, alignment, component sizing, and border radii.
- Subtle shadows only where they improve visual separation.
- Clean, consistent icons.

Avoid:

- Childish typography.
- Generic starter-template styling.
- Excessive purple or blue surfaces.
- Too many colorful cards.
- Huge empty spaces and unnecessarily narrow content.
- Overly rounded components and pill-shaped buttons everywhere.
- Excessive gradients, glassmorphism, animations, and decorative graphics.
- Inconsistent font sizes, weights, spacing, and component styles.

Aim for a refined enterprise product rather than a flashy startup landing page.

#### 3. Typography — mandatory

The current font treatment is one of the main problems. Give typography particular attention.

**Preferred font: Inter.** First inspect the current project and existing font setup. If there is no suitable professional font already available, use Inter through a reliable, compatible loading method.

Use a consistent typography scale:

- Page titles: 28–32px, weight 600–700.
- Section headings: 18–20px, weight 600.
- Card labels and form labels: 13–14px, weight 500.
- Body text and table cells: approximately 14px, weight 400–500.
- Supporting text and metadata: 12–13px with readable contrast.
- Dashboard metrics: 28–32px, weight 600–700.
- Table numbers and monetary amounts should align consistently; use tabular numerals where appropriate.

Additional rules:

- Use readable line heights and consistent text spacing.
- Avoid playful, decorative, overly rounded, or display-style fonts.
- Do not make every label bold.
- Do not introduce unnecessary font weights or sizes.
- Keep secondary text readable and accessible.
- Use monospace sparingly for identifiers only when it improves readability.

Typography must feel calm, precise, mature, and suitable for HR and compensation data.

#### 4. Application shell and navigation

Create one consistent application shell for authenticated pages.

##### Desktop

- A persistent left sidebar containing ACME branding and navigation.
- Dashboard and Employees navigation items.
- A clear visual indication of the current page.
- A compact top bar for page context and HR Manager account/logout actions.
- A well-aligned main content area with consistent horizontal padding.
- A sensible content width that makes tables and dashboards comfortable to use.

##### Responsive layouts

- Collapse or adapt the sidebar on smaller screens.
- Make forms usable on mobile.
- Allow tables to scroll horizontally or adapt their columns without breaking.
- Stack dashboard sections when necessary.
- Prevent dialogs, navigation, and buttons from overflowing the viewport.

Keep the shell consistent across the dashboard, employee list, forms, and employee details.

#### 5. Dashboard redesign

Preserve the finalized dashboard requirements exactly.

##### Headline cards

Display four cards:

1. **Current headcount:** Active + On notice.
2. **Active:** Employees currently active.
3. **On notice:** Total employees currently on notice, with a subtitle showing how many are leaving in the next 10 days.
4. **Inactive:** Employees whose employment has ended.

Navigation:

- Current headcount → `/employees`
- Active → `/employees?status=active`
- On notice → `/employees?status=notice_period`
- Inactive → `/employees?status=inactive`

The cards must be clickable, keyboard-accessible, and visually indicate their interactive behavior.

##### Department overview

Display one row per department with:

- Department name.
- Active count.
- On-notice count.
- Total current headcount.
- A simple horizontal bar representing the department's share of current headcount.

Navigation examples:

- Active Engineering employees → `/employees?department=Engineering&status=active`
- Engineering employees on notice → `/employees?department=Engineering&status=notice_period`
- All current Engineering employees → `/employees?department=Engineering`

Rules:

- Department Total = Active + On notice.
- Exclude inactive employees from department totals and current headcount.
- Clicking an On notice count must open the filtered employee list sorted by notice end date, earliest first.
- Active employee counts may use the normal list sorting behavior.

Keep the visualization simple and readable. Do not add a chart library just to render a basic bar.

##### Upcoming departures

Display a compact section showing employees whose notice period ends within the next 10 days.

Show:

- Employee name.
- Department.
- Notice end date.
- Optional concise relative date information, such as days remaining.

Rules:

- Include only employees currently on notice whose notice end date falls within the next 10 days.
- Sort by notice end date ascending.
- Clicking an employee opens their details page.
- Include a link to `/employees?status=notice_period`.
- Show a useful empty state when there are no upcoming departures.

Do not add average salary, median salary, payroll totals, or a salary-data-completeness card.

#### 6. Employee listing redesign

Preserve and improve the existing employee directory.

Existing functionality to retain:

- Search by employee name, email, or employee code.
- Filter by status, department, and country.
- Add employee action.
- Employee name and email.
- Employee code.
- Job title.
- Department.
- Country.
- Employment status.
- Existing row actions.
- Pagination and result counts.

Improve:

- Table typography and column alignment.
- Row spacing and readability.
- Header styling and subtle dividers.
- Hover and focus states.
- Search and filter controls.
- Status indicators.
- Row action menus.
- Empty and filtered-empty states.
- Pagination controls.
- Responsive table behavior.

Keep the table information-dense but comfortable to scan.

##### Notice-period sorting

Whenever the employee list is filtered by `status=notice_period`, sort on the backend by notice end date ascending.

This must work for:

- `/employees?status=notice_period`
- `/employees?department=Engineering&status=notice_period`
- Department counts linking to notice-period employees.
- Any other filter combination that includes notice-period status.

The soonest departure must appear first across pagination. Employees with missing notice end dates, if any exist, should appear last.

Do not change normal sorting for Active or other non-notice employee lists.

Preserve query parameters and existing filtering behavior.

#### 7. Add and edit employee forms

Create a refined form experience with clear sections and consistent field styling.

##### Employee details

- First name.
- Last name.
- Work email.
- Job title.
- Department.
- Country.

##### Salary information

- Annual CTC.
- Annual base pay.
- Annual PF.
- Other annual components.
- Effective-from date.

Improve:

- Section hierarchy.
- Label placement and typography.
- Input sizing and alignment.
- Required-field indicators.
- Help text.
- Validation messages.
- Error feedback.
- Primary and secondary button placement.
- Loading and submission states.

Preserve existing behavior:

- Employee code is generated automatically.
- Country determines salary currency according to the existing implementation.
- Salary values represent annual amounts.
- Existing validations and API integration remain intact.

Use a consistent two-column layout on sufficiently wide screens and a single column on smaller screens.

Do not add fields or change the database schema merely to improve the design.

#### 8. Employee details page

Make employee information easy to scan.

Display:

- Employee name and employee code.
- Employment status.
- Job title.
- Department.
- Country.
- Work email.
- Current salary information.
- Salary currency and effective date.
- Existing record metadata, where available.

Provide clear Edit and Put on notice actions.

Give the employee identity and employment status a strong visual hierarchy. Present compensation details in a well-organized section with correctly formatted monetary values and currency.

Avoid making every field equally prominent.

#### 9. Put-on-notice dialog

Redesign the existing confirmation dialog while preserving its functionality.

Include:

- Employee name.
- Clear explanation of the status change.
- Notice period in days, defaulting to 30.
- Calculated notice end date.
- Cancel action.
- Confirm action.

Make the consequences clear: the employee remains visible during the notice period and becomes inactive when the notice period ends, according to the existing implementation.

Use accessible dialog behavior, clear action hierarchy, validation, and appropriate success/error feedback.

Do not change the underlying notice-period logic as part of this visual task.

#### 10. Login page

Create a polished sign-in page consistent with the rest of the product.

Include:

- ACME Salary branding.
- Clear sign-in heading and supporting text.
- Email field.
- Password field.
- Sign-in action.
- Existing validation and error feedback.

Use restrained styling and a professional layout. No public signup, social login, or unnecessary decorative elements.

#### 11. Shared design system

Before styling each page independently, establish reusable design tokens and components.

Define consistent tokens for:

- Typography.
- Colors.
- Spacing.
- Borders.
- Border radii.
- Shadows.
- Focus rings.
- Status colors.
- Input heights.
- Button sizes.
- Responsive breakpoints.

Reuse shared components for:

- Buttons.
- Form controls.
- Cards.
- Status indicators.
- Tables.
- Page headings.
- Empty states.
- Dialogs.
- Loading states.
- Error and success messages.

Avoid duplicating styling rules across pages when a shared component or token is appropriate.

#### 12. Technical constraints

Inspect the repository before changing code. Understand the current component structure, dependencies, styling system, routes, API integration, and available tests.

Preserve these project conventions:

- Rails application remains at the repository root.
- Existing frontend directory structure remains intact.
- Use JavaScript and JSX, not TypeScript or TSX.
- Continue using React Query for API calls under the existing `hooks/react-query/` structure.
- Continue using the existing internationalization approach for frontend text.
- Keep routes centralized in the existing routes module.
- Keep constants and utilities in their existing centralized locations.
- Reuse compatible existing dependencies and components.
- Do not add multiple competing UI frameworks.
- Do not rewrite the backend or alter API contracts for visual reasons.
- Do not replace real application behavior with static mockups or hardcoded dashboard data.
- Do not remove existing functionality.
- Do not expose or hardcode credentials.
- Do not make unrelated infrastructure or deployment changes.

If a UI library is already installed, evaluate whether it fits the redesign. If no suitable library exists, choose the smallest compatible approach.

#### 13. Implementation workflow

Work methodically rather than rewriting the whole application in one uncontrolled pass.

##### Phase 1: Inspect

- Inspect the repository structure and existing frontend.
- Identify the current styling approach and font.
- Identify shared components and page routes.
- Identify the existing build, lint, and test commands.
- Summarize the proposed design-system changes briefly.

##### Phase 2: Design system and application shell

- Establish the typography and color systems.
- Implement the sidebar, top bar, content layout, and responsive behavior.
- Create or refine reusable components.

##### Phase 3: Main pages

Redesign the dashboard and employee listing first. Review their actual appearance before continuing with forms, employee details, login, and the notice dialog.

##### Phase 4: Verification

- Run the existing build and lint commands.
- Run relevant tests.
- Fix regressions introduced by the redesign.
- Verify navigation and query-parameter filters.
- Verify employee create, edit, details, and notice workflows.
- Check responsive behavior, keyboard navigation, focus states, and text contrast.
- Check for broken imports, missing translations, and new console errors.

Do not claim that a test passed unless you ran it.

#### 14. Final acceptance criteria

The redesign is complete when:

- The application has a cohesive and recognizable enterprise SaaS visual identity.
- The typography is visibly more professional and no longer looks childish.
- The dashboard and employee list have significantly improved visual hierarchy and spacing.
- All existing pages follow the same design system.
- The UI remains responsive and accessible.
- Existing functionality and business rules continue to work.
- Build, lint, and relevant tests have been checked.
- Any remaining issues are documented honestly.

At the end, summarize the changes made, the shared components and design tokens introduced, the pages redesigned, the verification commands run, their actual results, and any remaining issues.

**Priority:** Deliver a substantial visual improvement without compromising functionality or introducing unnecessary complexity. Treat the supplied design reference as guidance for visual quality, not as permission to invent new business requirements.

Attached UI image: (a design reference mockup, not included in the repository)
