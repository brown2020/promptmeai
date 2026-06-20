# Orchestration Plan

## Mode Selection

- Repo: /Users/stephenbrown/Code/OPENSOURCE/promptmeai
- Branch: dev
- Work mode: full
- Run folder: agent-runs/2026-06-20-codebase-pass
- Verifiable gates: git remote read, fast-forward sync, dry-run push, `npm run lint`, `npm run test`, `npx tsc --noEmit`, `npm run build`, `bash scripts/malware-scan.sh tree`
- Human-decision blockers: new secrets, new paid services, broad product behavior changes outside `spec.md`, weakening auth/credit/payment trust boundaries, or unsafe local changes
- Resume policy: re-run Git preflight, read `run-state.md` and `task-queue.md`, push any validated local phase commit before new edits, then continue the recorded next action

## Startup Evidence

- Working tree before reports: clean (`git status --short --branch` showed `## dev...origin/dev`).
- Remote: `git@github.com:brown2020/promptmeai.git`.
- Remote read: `git ls-remote --exit-code origin HEAD` succeeded.
- Sync: `git pull --ff-only origin dev` reported already up to date.
- Push proof: `git push --dry-run origin dev` reported everything up to date.
- Skill scaffold: `validate_skill.py --skill-dir /Users/stephenbrown/.agents/skills/codebase-improvement --run-dir agent-runs/2026-06-20-codebase-pass` returned `ok`.

## Loop Plan

| Phase | Loop | Verify Gate | Stop Condition |
| --- | --- | --- | --- |
| Preflight and Repo Docs | Orchestration Planning Loop, Docs Sweep Loop | Plan, queue, state, and docs match current repo evidence; docs-safe gate passes | Docs/report checkpoint pushed |
| Baseline Validation | Baseline Validation Loop | Lint, tests, typecheck, build, and malware scan pass or failures are classified | Baseline report pushed |
| Findings Backlog | Findings Queue Loop, Architecture Fitness Loop, Lean Code Loop | Evidence-backed backlog and scorecard with verification methods | Backlog report pushed |
| Execute Fixes and Improvements | Task Queue Loop, Fix Validation Loop, Architecture Fitness Loop, Lean Code Loop | Highest-priority safe task passes targeted and quality gates | Focused fix checkpoint pushed |
| Package and Dead-Code Cleanup | Package Cleanup Loop, Dead Code Loop | Only proven-safe updates/removals; quality gates pass | Cleanup checkpoint pushed or deferred with evidence |
| Review | Judge Loop | No P0/P1 findings, no introduced regressions, no unowned diffs | Review report pushed |
| Stabilization | Stabilization Loop, Judge Loop | Completion criteria pass or exact blocker is recorded | Stabilization checkpoint pushed |
| Integrator | Final Completion Gate | dev matches origin/dev, tree clean, final gates recorded | Final report pushed |

## File Ownership

| Task | Owned Files | Notes |
| --- | --- | --- |
| T-001 | AGENTS.md, spec.md, README.md, agent-runs/2026-06-20-codebase-pass/* | Startup planning and current docs drift |
| T-002 | agent-runs/2026-06-20-codebase-pass/02-baseline-validation.md, run-state.md, task-queue.md | Baseline command results |
| T-003 | src/proxy.ts, src/utils/routes.ts, src/actions/*, src/firebase/*, src/zustand/*, src/services/*, src/screens/chat/**, src/screens/payment-*/**, agent-runs/2026-06-20-codebase-pass/03-findings-backlog.md | Findings evidence only until tasks are selected |
| T-004 | To be narrowed after findings | Highest-priority locally verifiable fix |

## First Executable Task

Run the Preflight and Repo Docs quality gate, then commit and push the docs/report checkpoint before baseline validation.
