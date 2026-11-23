# Business intake: GitHub demonstration

This repository is public. Use fictional data only. Do not enter customer,
employee, confidential, or credential information.

## Existing application: HVE-inspired draft

1. Open **Issues → New issue → Business intake**. Submit a fictional request:
   fleet coordinators need to filter work orders by status and priority, while
   fleet-wide KPI totals remain unchanged.
2. Open **Actions → Research and plan an intake → Run workflow**, choose
   `draft`, enter the issue number, and run it on the default branch. The
   maintainer manually starts the workflow; issue creation alone does not run it.
3. Open the run summary or download `intake-research-plan`. The Copilot CLI
   produces a draft BRD, research, plan, and proposed issue. Review the sources,
   missing information, assumptions, and acceptance criteria.
4. A human copies an approved implementation issue into GitHub and assigns
   Copilot. Show the resulting cloud-agent session and PR, or use the prepared
   [separate bug PR](https://github.com/mitmartin/agentic-sdlc-demo/pull/3).
   Review the diff, approve required CI, and make the merge decision.

The `draft` mode is HVE-inspired; it does **not** invoke the actual HVE skills.
The HVE plugin's `/rpi-research` and `/rpi-plan` can also be shown separately
in VS Code.

The run requires the existing `COPILOT_GITHUB_TOKEN` secret and Actions/Copilot
access. Repository access is read-only and the CLI is limited to the view tool.
The output is an untrusted AI draft; review it before copying it into an issue.
Do not use the workflow for sensitive input or treat prompt instructions as a
security boundary.

## New application: private workspace and actual HVE skills

This prototype uses the intake issue as the brief for a **new** application.
The existing fleet app is only the controller. It does not create application
code, implement the plan, deploy, invoke Work IQ, or merge a PR.

1. Submit a complete fictional greenfield request using the intake form.
   Include the users, desired behavior, boundaries, meaningful success checks,
   and known decisions. Missing material facts can stop HVE before planning.
2. Manually run the workflow in `create` mode with the issue number. The fixed
   destination is `mitmartin/hve-intake-<issue-number>`; an existing name is
   never reused automatically. The `mitmartin/hve-intake-template` template
   and destination are private.
3. If template generation returns HTTP 422 after creating the destination, the
   workflow checks that the repository belongs to the expected owner, is
   private, uses `main`, and has no branches. It then mints a write token
   scoped to that exact repository and initializes it from the pinned blank
   template. It stops rather than reusing a pre-existing repository or
   overwriting any branch. The separate `recover-empty` mode remains available
   for manually recovering an already-created empty repo.
4. Manually run `rpi` with the issue number and exact repository ID. The
   workflow launches the real HVE RPI Agent, which invokes Research and Plan
   when its gates permit, and stops before implementation. A separate CLI pass
   drafts the BRD from the intake and any available HVE evidence. A separate
   privileged job opens a draft PR containing the BRD and generated evidence. Check
   `docs/hve-run-status.md` and the HVE session state: skill invocation does
   not mean that planning completed or that anything was approved.
5. Review the draft, resolve blockers and assumptions, and decide whether to
   proceed. If publishing fails after a branch was created, inspect the repo
   before retrying; the workflow never overwrites an existing draft branch.

### Setup and security

Install a dedicated GitHub App with **All repositories** access so its
read-only inventory token can verify the newly created destination. The
workflow still scopes template reads and destination writes to the specific
repositories needed for each step. The App needs Administration, Contents,
and Pull requests read/write permissions. Store its client ID in
`HVE_APP_CLIENT_ID` and private key in `HVE_APP_PRIVATE_KEY` on this controller
repository. The CLI also needs `COPILOT_GITHUB_TOKEN`.

The model job receives no App private key or App token and cannot run shell
commands. The separate publisher validates the exact private repository ID and
restricts files to draft documentation and HVE tracking artifacts. Drafts are
encrypted for transfer between jobs; the public controller's Actions artifact
contains ciphertext, not the model transcript or plaintext draft. Treat all
intake and model output as untrusted. All-repository installation access is
broad; workflow tokens request only the permissions and repository scope
needed for each operation.

Creation, App access, HVE gate completion, and the draft PR must each be
verified for the particular run. A successful CLI exit or skill invocation is
not evidence that the whole flow succeeded.
