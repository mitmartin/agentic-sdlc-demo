# Repository instructions

Follow `AGENTS.md` for the stack, commands, boundaries, and PR format.

- Use existing service and route patterns; strict TypeScript without `any`.
- For code changes: `npm ci`, `npm run lint`, `npm run typecheck`,
  `npm run test:coverage`, and `npm run build`.
- Add regression tests for changed behavior; use a fixed clock for date logic.
- Keep the UI semantic, keyboard accessible, and dependency-free.
- Return API errors as `{ error: { code, message } }`; update `docs/API.md`.
- Preserve overdue behavior: only unfinished work due before the current UTC
  calendar date is overdue. Change it only when the issue explicitly requests it.
- Never add real customer data, secrets, deployment infrastructure, or more agents.

## Review checklist

Check correctness, date boundaries, API error behavior, input validation,
accessibility, regression tests, and documentation accuracy. Report only
material findings with actionable guidance. Do not invent findings or require
unrelated changes.
