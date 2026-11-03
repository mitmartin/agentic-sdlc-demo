# Lean agentic SDLC demo

One app, four moments, approximately 15-20 minutes. No custom-agent roster or
agentic-workflow orchestration.

## Before the session

- Open this repository in VS Code and start the dashboard using Node 22:
  `npm ci`, `npm run build`, `npm start`.
- Confirm the intended identity: `gh api user --jq .login` must be `mitmartin`.
  Use `gh auth switch --user mitmartin` if necessary.
- Use the intended browser profile; open GitHub links yourself.
- Confirm normal CI is green and open a prepared cloud-agent PR.
- Confirm the `COPILOT_GITHUB_TOKEN` Actions secret is set and rehearse the
  release-notes action. See the credential checkpoint below.

The local HVE Core extension was verified as
`ise-hve-essentials.hve-core@3.2.2`. That installed version provides **Task Planner**
and **RPI Agent**, plus the `/task-plan` prompt. Use the existing extension:
do not copy its agent roster into this repository.

## 1. Scope the change with HVE (0-4 minutes)

Open [feature issue #1](https://github.com/mitmartin/agentic-sdlc-demo/issues/1).
In VS Code Copilot Chat, select **Task Planner** or use `/task-plan`:

> Plan only. Inspect this repository and help refine issue #1: filter work orders
> by status and priority in the API and dashboard. Preserve the existing domain,
> keep the fleet-wide KPIs unchanged, validate query values, and add focused
> tests. Identify likely files, acceptance criteria, and boundaries. Do not
> implement, install dependencies, create cloud-agent sessions, or make GitHub
> changes. End with a concise issue body that I can approve and paste into GitHub.

Attach the issue text when GitHub context is not connected. HVE's planner may
create local `.copilot-tracking` planning artifacts and use its own built-in
helpers; those are not new repository agents. Show only the useful plan excerpt.
Prepare it ahead of time if planning latency would dominate the live session.
Use **Task Planner**, not the RPI implementation handoff, for this act.

Review the proposed acceptance criteria and update the issue manually. The issue
is the handoff contract; the local planner does not automatically implement it
or hand off to GitHub's cloud agent.

## 2. Issue to cloud-agent PR (4-9 minutes)

On issue #1, select **Assignees -> Copilot**. Choose this repository and `main`
when offered. Keep the default agent; no custom-agent picker is needed.

Show the linked session, then the draft PR and the tests the agent ran.
Workflows on a Copilot PR may require **Approve and run workflows**; use that
human gate rather than bypassing it.

Agent sessions take minutes. Start the live assignment, explain the issue-to-PR
trail, then switch to the prepared PR for
[bug issue #2](https://github.com/mitmartin/agentic-sdlc-demo/issues/2).
That rehearsal fixes the original due-today bug and adds a regression test.
Do not merge the prepared PR before it is needed.

## 3. Review, iterate, and merge (9-14 minutes)

On the prepared PR, mark it ready when appropriate and request **Copilot**
through the Reviewers control. Inspect the diff, code review, and CI together.

If review finds a material issue, comment:

> @copilot Address the actionable review feedback and add a focused regression
> test where needed. Keep this PR scoped to its linked issue. Do not merge it.

If review finds nothing actionable, say so. Do not invent findings or claim a
review proves correctness. A legitimate follow-up, if not already covered, is:

> @copilot Add a regression test showing UTC date-boundary behavior, without
> changing unrelated logic. Run the required checks and report what you ran.

A human checks the final diff and green CI, then merges. Copilot review is
advisory; it is not a human approval or a merge authorization. If automatic
review is enabled for your account, it is convenient but not required here.

## 4. Copilot CLI inside GitHub Actions (14-18 minutes)

Open **Actions -> Draft release notes with Copilot CLI -> Run workflow** on
`main`, or run:

```powershell
gh workflow run release-notes.yml -R mitmartin/agentic-sdlc-demo --ref main
```

Show the workflow's permission boundary and actual command:
`copilot -p ... --silent --no-ask-user`. Only the shell tool is exposed and only
`git log` is preapproved; built-in MCP servers are disabled. The repository token
is read-only and checkout credentials are not persisted.

The job reads the latest ten commits on `main`, creates AI-drafted release notes,
adds them to the run summary, and uploads `release-notes-draft`. Open the summary
or download the artifact. It does not create a release, tag, PR, or commit.

Use the prepared successful run if live execution is slow. Human review remains
necessary before anyone publishes the notes.

## Credential checkpoint

This personal-account workflow needs one separately supplied token:

1. Open <https://github.com/settings/personal-access-tokens/new> in the intended
   profile. Create a fine-grained token owned by `mitmartin`, with **Copilot
   Requests** permission and only the repository access it actually needs.
2. Set `COPILOT_GITHUB_TOKEN` in
   [Actions secrets](https://github.com/mitmartin/agentic-sdlc-demo/settings/secrets/actions),
   or run this in your own terminal and paste at its hidden prompt:

```powershell
gh secret set COPILOT_GITHUB_TOKEN -R mitmartin/agentic-sdlc-demo
```

Never paste the token into chat, commit it, or copy your saved local login into
Actions. No `GH_AW_AGENT_TOKEN` or second assignment token is needed.
Cloud-agent sessions, code review, and CLI calls consume the account's
applicable Copilot usage; GitHub Actions also consumes runner time.

## Reseed and repeat

`scripts\demo\seed.ps1` creates the two initial issues if their exact titles are
absent. It does not reopen closed issues, reset code, close PRs, or delete
branches. Preserve useful rehearsal artifacts.

For another live run after an issue has been merged, create a fresh, small issue
with explicit acceptance criteria using the repository's **Scoped change** form.

## References

- [HVE Core](https://github.com/microsoft/hve-core): current upstream documentation
  can differ from the installed extension version.
- [Copilot cloud agent via the API](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-via-the-api)
- [Customizing cloud-agent setup](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment)
- [Copilot CLI in Actions](https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/automate-with-actions)
