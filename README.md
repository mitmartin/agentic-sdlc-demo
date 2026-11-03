# Contoso Fleet Ops

An agentic software development lifecycle showcase for
[`mitmartin/agentic-sdlc-demo`](https://github.com/mitmartin/agentic-sdlc-demo).

A fictional maintenance work-order app for aircraft, vessels, trucks, and factory
machines takes a feature from idea to release with planner, coder, reviewer,
CI-doctor, security-fixer, and release-writer agents. Humans remain in control
through issues, pull requests, required checks, and approvals.

The core demo has no external cloud dependency and contains no customer data.

> **Demo only.** The baseline intentionally includes an overdue-date bug and a
> vulnerable legacy manual endpoint for the security demonstration. Do not deploy
> it to production or expose it to untrusted users.

## Build progress

The repository is being built phase by phase. Agent credentials and policy
changes require separate human confirmation. Main-branch protection is applied
only after bootstrap and rehearsal.
