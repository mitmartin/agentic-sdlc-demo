# Business intake: GitHub demonstration

This repository is public. Use fictional data only. Do not enter customer,
employee, confidential, or credential information.

1. Open **Issues → New issue → Business intake**. Submit a fictional request:
   fleet coordinators need to filter work orders by status and priority, while
   fleet-wide KPI totals remain unchanged.
2. Open **Actions → Research and plan an intake → Run workflow**, enter the
   issue number, and run it on the default branch. The maintainer manually
   starts this workflow; issue creation alone does not run it.
3. Open the run summary or download `intake-research-plan`. The Copilot CLI
   produces a draft BRD, research, plan, and proposed issue. Review the sources,
   missing information, assumptions, and acceptance criteria.
4. A human copies an approved implementation issue into GitHub and assigns
   Copilot. Show the resulting cloud-agent session and PR, or use the prepared
   [separate bug PR](https://github.com/mitmartin/agentic-sdlc-demo/pull/3).
   Review the diff, approve required CI, and make the merge decision.

The workflow uses HVE-inspired research and planning, but does **not** install
or invoke the HVE skills. The HVE plugin's `/rpi-research` and `/rpi-plan` can
also be shown separately in VS Code. Work IQ, automatic repository creation,
automatic issue publishing, and deployment are not implemented. Those are
potential future integrations, not demo capabilities.

The run requires the existing `COPILOT_GITHUB_TOKEN` secret and Actions/Copilot
access. Repository access is read-only and the CLI is limited to the view tool.
The output is an untrusted AI draft; review it before copying it into an issue.
Do not use the workflow for sensitive input or treat prompt instructions as a
security boundary.
