# Prompt: Export

From the Claude Code session history. Spelling, grammar and formatting have been corrected; the instructions themselves are unchanged.

## 18 Oct 2026, 12:53 UTC

When we click Export, does it open a dialog that blocks the user from using the app? I think we should use a
toast at the top that shows the progress. Let's keep the loading more natural instead of the four stages;
design it as you think best. Also, if the user refreshes, where can they see the download progress? Let's
decide all of this.

## 18 Oct 2026, 13:11 UTC

Let's use this approach. We won't allow concurrent exports: if the user clicks Export while an export is in
progress, cancel the previous one, delete anything it created, and start fresh. Export only what is currently
filtered, across all pages. It exports all employees; there's no need to group, since users can filter if
they want a group. Yes, export every employee field including salary, and adjust the columns as you see fit.
For now there is only one role, so don't worry about who can see exports.

### Recommended design

#### 1. When HR clicks Export

A toast shows, for example: **Exporting employees** · 4,200 of 10,000 employees · 42%. This is illustrative;
the actual progress comes from the backend.

- The toast appears in the top-right corner.
- HR can keep using the application.
- If the job is queued, show "Preparing export" with an indeterminate progress indicator.
- Animate progress smoothly between real backend updates.
- For 10,000 employees, updating progress after batches of 500 is reasonable.

#### 2. When the export finishes

The toast changes to **Export ready** · 10,000 employees · CSV.

- Download the file automatically in the tab where the export was started.
- Keep the toast visible with a Download action, in case the automatic download is blocked or the user wants
  to download it again.
- Save the completed export record on the server, so the file stays available from Export History.

#### 3. Export History page

A dedicated route such as `/exports`, showing recent exports. Illustrative entries:

| Export                | Requested                      | Status      |
| --------------------- | ------------------------------ | ----------- |
| All employees · India | 18 Oct 2026 · 15:42 · 812 rows | Ready       |
| Active · Engineering  | 18 Oct 2026 · 15:35 · 246 rows | Ready       |
| All employees         | Started just now               | In progress |

Each export record should show:

- the export name and applied filters, such as country or department;
- the requested date and time;
- the number of exported rows, when available;
- the status: Queued, In progress, Ready or Failed;
- a Download action for completed exports;
- error information and a Retry action for failed exports.

Keep the history limited to recent exports; 24 hours is a sensible starting point for this assessment.
Expired files should be cleaned up, and downloads must require authentication.

#### 4. What happens after a refresh

This is where the hybrid approach pays off.

| Situation                            | Expected behaviour                                                            |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| Refresh while an export is running   | The toast reappears with the actual current progress                          |
| Navigate to another page             | The export continues and its progress stays available                         |
| Export completes in the original tab | Download automatically, with a manual download option remaining               |
| Refresh after completion             | Don't trigger an unexpected automatic download; the file is in Export History |
| Export fails                         | Show an error toast and allow retrying                                        |
| File expires                         | Show that it's no longer available rather than offering a broken download     |

#### Architecture

Keep this as a small background-job workflow rather than a sophisticated export management system.

1. **Export model:** records the requesting user, filters, status, progress, row count, file location and
   timestamps.
2. **Background job:** processes the export in batches and updates progress after each batch.
3. **React Query:** polls the export status while jobs are running and stops when they finish.
4. **Toast:** shows immediate progress and completion feedback.
5. **Export History:** fetches the user's recent exports from the backend.
6. **Secure download endpoint:** checks authorization and returns the generated CSV.
7. **Expiry cleanup:** removes old export files and their records on a defined retention schedule.

Don't store the CSV contents in the database. Store the file in an appropriate storage location and keep its
reference on the export record. One detail to decide during implementation: whether a background job can
reliably reach the chosen file storage in our deployment environment. Avoid relying on a temporary local file
that may disappear or be inaccessible to another worker.

#### Final decision

Use the toast plus an Export History page. It covers immediate feedback, refresh recovery and repeat
downloads, while staying simpler than a persistent top-bar menu with separate export-management logic.

## 18 Oct 2026, 13:13 UTC

Use the database for now; we'll clear it out every 24 hours. Also clear the stored export files on the server.
