---
name: ledger-tasks-yylo
description: 'Operate the YYLO Ledger task board from a developer or agent shell: create, search, and mark tasks, manage blockers with ready/order planning, and run receipt-backed multi-directory merges. Use when structured task state for coding-agent work should live in the git repository instead of a SaaS tracker.'
metadata:
  author: yylo-dev
  version: 1.0.0
  category: development
  tags:
    - task-management
    - kanban
    - coding-agents
    - agent-workflow
    - cli
    - git
---

# YYLO Ledger Tasks

YYLO Ledger is the task-management surface of YYLO, a command-line orchestrator for coding agents. Tasks are records in a git repository (`.juno_task/`), so board state is diffable, reviewable, and safe to automate around. This skill is the working reference for the `yy ledger` command family: task lifecycle, dependencies and safe parallel ordering, immutable cold archives, and multi-directory consolidation.

## When to use this skill

- You are operating a development board from a terminal or an agent session and want task state stored with the code it tracks.
- You need dependency-aware planning: which tasks are safe to start now, and in what order parallel work should proceed.
- You are consolidating scattered task directories (sub-repos, experiments, migrations) into one canonical board.

## When not to use this skill

- You need a hosted team tracker with Gantt charts, swimlanes, or cross-organization dashboards — YYLO Ledger is deliberately repository-local.
- You want to edit task files by hand. Direct edits bypass lifecycle validation and mutation receipts; always go through the CLI.
- You are archiving production boards without an owner's explicit authorization (see the archive safety rules below).

## Setup

YYLO Ledger ships inside the YYLO CLI (npm, Node 20.10+):

```bash
npm install --global @yylo/cli
yy --version
yy ledger --version
```

All examples below use `yy ledger`. Output formats are uniform: add `-f json`, `-f ndjson` (default), `-f xml`, or `-f table`; add `--raw` for compact output and `-p` for pretty printing.

## Task lifecycle commands

**CREATE** — add a new task:

```bash
yy ledger create "Ship retry handling for the import job" --status backlog --tags feature,backend
```

Options: `--status` (backlog|todo|in_progress|done), `--tags` (comma or space separated), `--blocked-by` (task IDs), `--related-tasks` (task IDs).

**LIST** — browse with summary stats:

```bash
yy ledger list --limit 5 --sort asc
yy ledger list --status todo,in_progress --limit 10
```

**SEARCH** — find tasks by criteria:

```bash
yy ledger search --status todo --tag backend --limit 10
yy ledger search --body "OAuth" --open
yy ledger search --commit abc123
```

Filters: `--status`, `--tag`, `--body`, `--response`, `--commit`, `--open` (no agent response yet), `--recent`, `--exclude` (exclude tags).

**GET** — full details, including resolved dependency and related-task info:

```bash
yy ledger get TASK_ID
```

**MARK** — status transitions always carry a response message:

```bash
yy ledger mark in_progress --id TASK_ID --response "Starting: reproducing the failure first"
yy ledger mark done --id TASK_ID --response "Done: implemented retry with backoff, 14 tests green" --commit abc123def
yy ledger mark todo --id TASK_ID --response "Reopening: regression found in staging"
```

`--id` and `--response` are required; `--commit` is recommended when marking done.

**UPDATE** — modify fields without a status change:

```bash
yy ledger update TASK_ID --status todo --tags backend,urgent
yy ledger update TASK_ID --commit abc123def
yy ledger update TASK_ID --response "Additional context from code review"
```

**ARCHIVE** — soft delete (data preserved, status becomes `archive`):

```bash
yy ledger archive TASK_ID
```

## Dependencies and safe parallel planning

**DEPS** — inspect and edit the blocker graph (cycle detection is automatic):

```bash
yy ledger deps TASK_ID
yy ledger deps add --id TASK_ID --blocked-by BLOCKER1 BLOCKER2
yy ledger deps remove --id TASK_ID --blocked-by BLOCKER1
```

**READY** — tasks whose blockers are all satisfied (safe to start now):

```bash
yy ledger ready
yy ledger ready --tag backend --limit 5
```

**ORDER** — topological sort of open tasks, optionally with priority scores:

```bash
yy ledger order
yy ledger order --scores
```

Dependencies can also be declared inline in the task body; they are parsed on create and update:

```
[blocked_by]TASK_ID[/blocked_by]
[blocked_by]ID1, ID2[/blocked_by]
[task_id]RELATED_ID[/task_id]
```

## Merging scattered boards

When tasks accumulate in multiple directories, first produce a deterministic plan, review it, then apply exactly that plan and keep the receipt:

```bash
yy ledger merge ./sub1/.juno_task ./sub2/.juno_task --into ./.juno_task \
  --dry-run --plan-file /external/ledger-merge-plan.json

yy ledger merge ./sub1/.juno_task ./sub2/.juno_task --into ./.juno_task \
  --apply-plan /external/ledger-merge-plan.json \
  --receipt-file /external/ledger-merge-receipt.json
```

## Immutable cold archives

Normal `list`, `search`, `ready`, and `order` are hot-only. `get TASK_ID` transparently resolves archived tasks; `history TASK_ID` shows a task's ledger. Bounded discovery over cold storage uses projected output:

```bash
yy ledger archive-search --tag backend --before 2026-01-01 --limit 20 --projection metadata
```

Archive maintenance (`archive-pack plan/create/doctor`) requires explicit owner authorization, a clean repository and index, and durable report paths outside the repository. A stale plan or a selected-task conflict must fail closed: discard the plan, resolve the conflict, and plan again. Never automate archival, edit packs or manifests, restore archived IDs, or enumerate archive files directly — create follow-up work as a new hot task instead.

## Working rules that keep the board trustworthy

1. Read current task state before mutating it; preserve mutation receipts where offered.
2. Keep tasks small enough to finish in one iteration.
3. Always pass `--response` on `mark`; attach `--commit` when marking done, then link history with `update TASK_ID --commit HASH`.
4. Run `ready` before starting work and `order --scores` when planning parallel execution.
5. Cross-project routing is opt-in: it stays disabled until the source config sets `kanbanRegistry.enabled: true` with an explicit `allowedProjects` list; routing failures never fall back to the source board.
6. Task state is authoritative in the controller workspace: run orchestration from the controller, not from a task checkout.
7. Related environment variables: `JUNO_TASK_ROOT` (canonical controller root), `JUNO_CONTROLLER_BRANCH`, `JUNO_WORKSPACE_ROLE` (controller|task|integration-owner), `JUNO_WORKSPACE_ENFORCEMENT` (off|warn|strict), `JUNO_DEBUG`, `JUNO_VERBOSE`.

## Evaluation checklist

Score a task-lifecycle run against this checklist (each item is pass/fail):

- [ ] Every task was created with a one-iteration-sized description and useful tags.
- [ ] No task started before its blockers were `done` or `archive` (verified with `ready`).
- [ ] Every `mark` carried a `--response` that says what was done and how it was tested.
- [ ] Completed tasks link the verifying commit via `--commit` / `update --commit`.
- [ ] Parallel plans came from `order --scores`, not ad-hoc guessing.
- [ ] Merge operations ran from a reviewed plan file and kept the receipt file.
- [ ] No archive operation ran without owner authorization and a clean repository.
- [ ] The final board state round-trips: `list`, `ready`, and `order` agree with the intended plan.

## Common mistakes

- **Marking without `--response`.** The command refuses; the response text is the audit trail that makes the board trustworthy.
- **Editing task files directly.** Hand edits bypass validation, receipts, and history; the CLI is the only write path.
- **Starting a task whose blockers are open.** Check `ready` first — `deps` cycles are caught automatically, but semantic readiness is your call.
- **Forgetting `--commit` on done.** Without the hash, the done-marker cannot be traced to the change that satisfied the task.
- **Treating `archive` as delete.** Archived tasks are immutable history; new work references them by ID as a new hot task.
- **Automating `archive-pack`.** Pack creation mutates durable storage; it is an owner-authorized, plan-reviewed operation.
- **Assuming cross-project routing is on.** It is disabled by default and configured per source project.

## Source and license

This skill is adapted from the upstream YYLO skill pack — [yylo-dev/yylo-skills](https://github.com/yylo-dev/yylo-skills) (MIT), where it ships as `ledger-tasks-yylo` alongside six sibling skills (kanban planning, wiki, workflow, artifact, ralph-loop execution, project understanding). Install the pack with:

```bash
npx skills add yylo-dev/yylo-skills
```

The parent CLI lives at [yylo-dev/yylo](https://github.com/yylo-dev/yylo) (`@yylo/cli` on npm): a command-line orchestrator for coding agents with typed task, validation, merge, and release-readiness boundaries, a dedicated branch/worktree per task, and a risk-based merge queue.
