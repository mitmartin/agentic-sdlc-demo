# Contoso Fleet Ops

An agentic software development lifecycle showcase for
[`mitmartin/agentic-sdlc-demo`](https://github.com/mitmartin/agentic-sdlc-demo).

A fictional maintenance work-order app for aircraft, vessels, trucks, and factory
machines supports a focused four-part demonstration:

1. Use the existing HVE Core extension in VS Code to scope a change.
2. Assign its GitHub issue to Copilot cloud agent and inspect the resulting PR.
3. Request Copilot code review, iterate on feedback, and merge as a human.
4. Run Copilot CLI inside a manual GitHub Action to draft release notes.

The core demo has no external cloud dependency and contains no customer data.

> **Demo only.** The app has no authentication or persistence. Do not use it in
> production or with real data.

## Run locally

Use Node.js 22 LTS:

```sh
npm ci
npm run build
npm start
```

Open <http://localhost:3000>. Local runs bind to `127.0.0.1` by default.
`npm run dev` starts the TypeScript watch server. Data is held in memory:
12 fictional assets and 25 work orders, with due dates relative to startup.
The dashboard supports creation and status updates.

## Checks

```sh
npm run lint
npm run typecheck
npm run test:coverage
npm run build
```

Tests cover services and API behavior, including the overdue due-today boundary
with a frozen clock.

## Package feeds

The project respects your configured npm registry. It does not override your
machine's Microsoft package feed or require public npm access from your laptop.
The lockfile keeps exact versions and integrity hashes without registry-specific
download URLs, so GitHub-hosted runners can use their normal registry.

## Demo guide

See [runbook](docs/DEMO-RUNBOOK.md), [build status](docs/DEMO-STATUS.md), and
[API reference](docs/API.md). No custom-agent roster, gh-aw orchestration,
scheduled automation, security exploit demonstration, or Azure deployment is
required.
