# Prompt: Ui direction

From the Claude Code session history. Spelling, grammar and formatting have been corrected; the instructions themselves are unchanged.

## 17 Oct 2026, 10:53 UTC

#### UI/UX Design Direction — ACME Salary Management

Create a clean, modern, professional HR administration dashboard suitable for managing salary information for approximately 10,000 employees.

##### Visual theme

- Use a light enterprise dashboard theme.
- Use white and light-grey surfaces, dark navy text, and blue primary actions.
- Keep borders, shadows, and decorative elements subtle.
- Prioritize readability, information density, and clear visual hierarchy.
- Make the application responsive and usable on smaller screens.

##### Layout

- Use a consistent application shell with sidebar navigation and a top header.
- Keep page titles, action placement, spacing, and content widths consistent.
- Design tables for efficient scanning, with pagination, filters, sorting where useful, and clear empty states.
- Present dashboard statistics using consistent cards and appropriate charts.
- Use status badges and confirmation dialogs where they improve clarity or prevent mistakes.

##### Component library

Inspect the existing frontend dependencies before choosing a component library.

Prefer shadcn/ui if Tailwind CSS is already configured or can be added with minimal effort. Otherwise, choose the simplest suitable option that integrates with the existing starter.

Use reusable components for common UI patterns rather than independently styling every page.

##### Frontend conventions

- JavaScript and JSX only; no TypeScript or TSX.
- All user-facing text must use the existing i18n conventions.
- Use React Query for API requests through the existing hooks/react-query structure.
- Reuse centralized constants, route definitions, and utilities.
- Keep components reasonably small and focused.

##### UX requirements

- Provide loading, empty, success, and error states.
- Use form validation and actionable error messages.
- Confirm destructive or irreversible actions.
- Make employee and compensation information easy to read without overcrowding the interface.
- Ensure salary information is displayed with its explicit currency.
- Maintain accessible labels, keyboard navigation, and adequate contrast.

##### Scope constraints

Do not design every page in a separate planning exercise before implementation. Establish the shared layout, theme, and reusable components, then design each page as its feature is implemented.

Avoid unnecessary animations, complex design systems, multiple component libraries, and excessive customization. Focus on a consistent, polished interface that can be completed and tested within the assessment deadline.
