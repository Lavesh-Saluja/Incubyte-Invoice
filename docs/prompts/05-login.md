# Prompt: Login

From the Claude Code session history. Spelling, grammar and formatting have been corrected; the instructions themselves are unchanged.

## 17 Oct 2026, 11:20 UTC

Let's start with the login feature.

### 1. User model

Users will be added by us, never through a registration page. The User model has basic details: `id`
(UUID), `name`, `email`, `role` (initially only "HR"), a password using `has_secure_password`, and
`created_at` / `updated_at`.

### 2. Important implementation decisions

- **UUID:** use UUIDs as the primary key, provided the existing Rails starter supports them cleanly.
- **Email:** normalise email addresses consistently and enforce uniqueness at both the application and
  database levels.
- **Role:** use a constrained value, initially only HR. We don't need a superuser role for this submission.
- **Password:** store only the password digest, never the plain-text password.
- **Account provisioning:** create the initial user through a seed or setup task, using credentials
  supplied securely through environment configuration. Do not commit the actual password.

### 3. Authentication behaviour

The login feature should support:

1. Login with email and password.
2. A secure authenticated session.
3. Logout that invalidates the session.
4. Protection of all employee and salary API endpoints.
5. Clear handling of invalid credentials.

Write the required backend tests for whatever we build. Since the React frontend and the Rails API are
hosted separately, check the starter's existing session and CORS configuration before choosing the
cookie-based authentication details.

Make a sound plan first and let me finalise it.

## 17 Oct 2026, 11:30 UTC

We will set up the HR account in a migration that runs by default.

Please revise your previous login implementation plan based on these decisions. Keep all other parts of
your original plan unchanged unless they conflict with the changes below.

1. **Session storage:** we don't want a separate `sessions` table by default. Prefer Rails' cookie-based
   session store to keep the implementation simple for this two-day MVP. Inspect the existing Rails
   API-only configuration and determine the minimal changes needed. If a database-backed session store is
   genuinely necessary, explain why before proposing it.
2. **Session security:** use an `HttpOnly` cookie, `Secure` in production, and an appropriate `SameSite`
   setting. Enforce a 12-hour maximum session lifetime, make sure logout clears the session, and explain the
   limitations of cookie-based logout compared with server-side session revocation.
3. **Render deployment:** our frontend and API currently have separate Render URLs. Before committing to
   cookie authentication, verify whether the proposed same-origin `/api/*` forwarding reliably preserves
   request bodies, `Set-Cookie`, and cookies on later requests. Don't assume it works. If forwarding needs
   configuration changes or a redeploy, explain them first. If same-origin cookies aren't viable, recommend
   the simplest secure alternative and explain the trade-offs.
4. **CSRF and authorization:** explain how CSRF protection will work with cookie-based authentication in
   our Rails API-only application. Make sure protected endpoints use the authenticated `current_user` and
   the existing Pundit authorization. Frontend route guards must not replace backend authorization.
5. **Keep the rest of the plan:** preserve your original user model, login/logout/current-user endpoints,
   HR account provisioning, frontend implementation, rate limiting, tests and build order, unless any of
   them conflict with these decisions.

First inspect the existing code and revise the plan. **Do not modify files or deploy anything until I
approve the revised plan.**

## 17 Oct 2026, 11:35 UTC

The revised plan looks good overall. Please make these final adjustments before implementation:

1. Do not provision the initial HR user through a database migration. Use an idempotent provisioning
   task or service integrated with the existing deployment process. It must create the account only when
   it's absent, and never overwrite an existing password.
2. For this MVP, accept the limitations of cookie-only logout. Don't add a `sessions` table or a
   `session_version` unless a concrete requirement makes it necessary.
3. Reorder the work so that the proposed Render `/api/*` forwarding is verified with harmless requests
   before committing to the authentication implementation. Once the login API exists, verify cookie
   creation, reuse, expiry and logout through the frontend origin before implementing the frontend login
   flow.

Keep the rest of the plan unchanged. Do not modify files, change the Render configuration or deploy until I
approve the final plan.

Go ahead with the implementation of the login feature.
