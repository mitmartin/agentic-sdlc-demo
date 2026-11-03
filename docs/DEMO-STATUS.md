# Demo readiness

As of 2026-11-03. Approved scope is the lean four-part flow in the runbook.
This is not a claim that every live demonstration has been rehearsed.

| Item                                    | Status                       | Evidence / remaining work                                                                                                                        |
| --------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Public repository owned by `mitmartin`  | Verified                     | Identity, repository visibility, Issues and Discussions checked.                                                                                 |
| Fleet dashboard and API                 | Verified locally             | Compiled server responds with 12 assets, 25 orders, populated KPIs, and the dashboard.                                                           |
| Application checks                      | Verified locally             | Node 22: clean install, lint, formatting, typecheck, 14 tests, 98.97% line coverage, build.                                                      |
| Package-feed portability                | Verified locally             | Install and clean install use the configured Microsoft feed. Lockfile has no registry-specific resolved URLs.                                    |
| HVE integration                         | Available locally            | HVE Core 3.2.2 installed; Task Planner, RPI Agent and `/task-plan` verified from its installed contributions. Live planning is a presenter step. |
| Minimal agent onboarding and issue form | Built                        | `AGENTS.md`, repository instructions, one issue form, extension recommendation, setup workflow.                                                  |
| Ordinary CI and setup workflow          | Awaiting remote verification | Dispatch and inspect successful runs after publishing workflow files.                                                                            |
| Feature and rehearsal issues            | Awaiting seed                | Run `scripts\demo\seed.ps1` twice to confirm duplicate-safe creation.                                                                            |
| Cloud-agent rehearsal PR                | Awaiting assignment          | Assign the due-today bug after CI and setup are green; keep its PR unmerged.                                                                     |
| Copilot review and human merge          | Presenter checkpoint         | Request review on the real PR; inspect feedback and CI. No automatic human approval or merge.                                                    |
| Copilot CLI release-notes action        | Built, credential pending    | Provide the `COPILOT_GITHUB_TOKEN` Actions secret, then verify the real summary and nonempty artifact.                                           |

No Azure resources, scheduled agents, gh-aw workflows, custom-agent roster,
security exploit endpoint, automatic release publishing, or automatic merges
are part of this demo.
