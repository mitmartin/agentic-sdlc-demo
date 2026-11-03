[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$repo = 'mitmartin/agentic-sdlc-demo'
if ((gh api user --jq .login) -ne 'mitmartin' -or $LASTEXITCODE -ne 0) {
    throw 'Run gh auth switch --user mitmartin before seeding this repository.'
}

$issues = @(
    @{
        Title = 'Filter work orders by status and priority (API + UI)'
        Label = 'type:feature'
        Body = @'
## Problem
The dashboard lists every work order. A maintenance coordinator needs to focus
on a status, a priority, or both without changing the underlying work list.

## Acceptance criteria
- [ ] GET /api/work-orders supports optional status and priority query parameters.
- [ ] Each parameter accepts the existing enum values; invalid values return 400 with the documented JSON error shape.
- [ ] Combined filters use AND; no filters preserve the existing behavior.
- [ ] Dashboard controls apply and clear these filters, with an accessible empty state.
- [ ] Dashboard KPI cards continue to summarize the whole fleet, not the filtered rows.
- [ ] Tests cover single filters, combined filters, invalid input, and no matching work.
- [ ] docs/API.md documents the query parameters.

## Out of scope
Do not fix the separately tracked overdue bug, add dependencies, change the data
model, add authentication, or introduce automation or custom agents.

## Files likely involved
src/server/routes/workOrders.ts, src/server/services/workOrders.ts,
public/index.html, public/app.js, tests/api.test.ts, docs/API.md.
'@
    },
    @{
        Title = 'Bug: work orders due today are counted as overdue'
        Label = 'type:bug'
        Body = @'
## Problem
Unfinished work due today is incorrectly included in Overdue.

Reproduction:
1. Start the app and note the current UTC date.
2. Record the Overdue KPI.
3. Create an open work order due on that UTC date.
4. Refresh: Overdue incorrectly increases by one.

## Acceptance criteria
- [ ] Overdue means a due date strictly before the current UTC calendar date.
- [ ] Today and future dates are not overdue.
- [ ] Completed work is never overdue, even when its due date is in the past.
- [ ] Add regression cases for past, today, and future dates using a frozen clock.
- [ ] Demonstrate that the due-today regression fails against the old comparison.
- [ ] Update the intentional-baseline notes in README.md, docs/API.md, AGENTS.md, and .github/copilot-instructions.md so they no longer describe the resolved bug as present. Keep the runbook's historical rehearsal description.
- [ ] Run npm ci, npm run lint, npm run typecheck, npm run test:coverage, and npm run build; report actual results.

## Out of scope
Do not add filters, change the UI, add dependencies, alter workflows, or merge
the PR. Keep this a focused date-boundary fix for the cloud-agent rehearsal.

## Files likely involved
src/server/services/workOrders.ts, tests/workOrders.test.ts, README.md,
docs/API.md, AGENTS.md, .github/copilot-instructions.md.
'@
    }
)

$existing = @(gh issue list --repo $repo --state all --limit 100 --json title,number,url | ConvertFrom-Json)
if ($LASTEXITCODE -ne 0) { throw 'Could not list existing issues.' }
foreach ($issue in $issues) {
    $match = $existing | Where-Object { $_.title -ceq $issue.Title }
    if ($match) {
        Write-Output "Already exists: $($match.url)"
        continue
    }
    gh issue create --repo $repo --title $issue.Title --body $issue.Body `
        --label demo --label copilot-ready --label $issue.Label
    if ($LASTEXITCODE -ne 0) { throw "Could not create issue: $($issue.Title)" }
}
