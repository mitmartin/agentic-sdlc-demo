#!/usr/bin/env bash
set -euo pipefail

readonly REPO="mitmartin/agentic-sdlc-demo"
[[ "$(gh api user --jq .login)" == "mitmartin" ]] || {
  echo "Switch to mitmartin with: gh auth switch --user mitmartin" >&2
  exit 1
}

while IFS='|' read -r name color description; do
  gh label create "$name" --repo "$REPO" --color "$color" \
    --description "$description" --force
done <<'LABELS'
type:feature|0E8A16|New behavior
type:bug|D73A4A|Incorrect behavior
type:docs|0075CA|Documentation
type:test|1D76DB|Tests and coverage
type:security|B60205|Security remediation
priority:p0|B60205|Urgent
priority:p1|D93F0B|High priority
priority:p2|FBCA04|Normal priority
priority:p3|BFD4F2|Low priority
area:api|0052CC|HTTP API and services
area:ui|1D76DB|Dashboard
area:security|006B75|Security controls and legacy module
area:ci|5319E7|Automation and checks
epic|7057FF|Parent initiative
agent:plan|5319E7|Request epic decomposition
copilot-ready|0E8A16|Scoped and ready for Copilot
needs-human|D93F0B|Needs human clarification or approval
demo|EDEDED|Demo-created artifact
report|C5DEF5|Repository health report
LABELS
