# Contoso Fleet Ops

Node 22, strict TypeScript, Express, plain HTML/CSS/JS, Vitest and supertest.
Source is in `src/server/`, the dashboard in `public/`, tests in `tests/`, and
the API contract in `docs/API.md`.

For code changes, run:

```sh
npm ci
npm run lint
npm run typecheck
npm run test:coverage
npm run build
```

Keep routes thin and behavior in services. Avoid `any`. Add a focused test for
each behavior change and update API docs when routes change. Preserve unrelated
changes. Use Conventional Commits and small PRs.

The overdue "due today" bug is intentional until its issue is assigned. Do not
silently fix unrelated backlog work. There is no authentication or persistence:
use fictional data only and do not deploy publicly.

PR descriptions: Summary, Linked issue (`Fixes #N`), How to test, Risk.
Humans merge. Never add credentials, copy local authentication into Actions,
change global package-feed settings, or add agent orchestration.

Documentation-only tasks and read-only release-summary tasks do not require
application checks. Release summaries must report actual commits, not invent
features, test outcomes, reviews, or releases.
