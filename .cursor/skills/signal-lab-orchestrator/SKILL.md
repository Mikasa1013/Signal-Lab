---
name: signal-lab-orchestrator
description: Multi-phase PRD executor for Signal Lab. Decomposes PRDs into atomic tasks, delegates to subagents, tracks state in context.json, and supports resume.
---

# Signal Lab Orchestrator

## When to Use
- Implementing a new PRD from scratch
- Resuming an interrupted PRD execution
- Getting a structured implementation plan for a feature
- Use via `/run-prd <path>` command

## Overview

The orchestrator runs 7 phases. It creates `.execution/<timestamp>/context.json` to persist state. If interrupted, re-running reads the context file and resumes from `currentPhase`.

**Context economy**: The orchestrator itself uses ~15k tokens. Heavy work is delegated to subagents with focused prompts.

---

## Phase Protocol

### Phase 1 — PRD Analysis (fast model)
**Goal**: Extract requirements, features, constraints from the PRD.

Prompt for subagent:
```
Read the PRD at <path>. Extract:
1. List of functional requirements (F1, F2, ...)
2. List of acceptance criteria
3. Tech stack constraints
4. Dependencies between features
Output as structured JSON.
```

### Phase 2 — Codebase Scan (fast model)
**Goal**: Understand current project structure.

Prompt for subagent:
```
Scan the project structure. Report:
1. Existing modules and their responsibilities
2. Current Prisma models
3. Existing metrics and log patterns
4. What's already implemented vs what's missing for this PRD
Output as structured JSON.
```

### Phase 3 — Planning (default model)
**Goal**: High-level implementation plan.

Prompt for subagent:
```
Given PRD analysis: <phase1_result>
And codebase state: <phase2_result>
Create a high-level implementation plan:
1. What needs to be built
2. Order of implementation (dependencies first)
3. Risk areas
Output as structured plan.
```

### Phase 4 — Decomposition (default model)
**Goal**: Break plan into atomic tasks.

Each task must be:
- Completable in 5-10 minutes
- Described in 1-3 sentences
- Tagged with `complexity: low|medium|high`
- Tagged with `model: fast|default`
- Tagged with `type: database|backend|frontend|infra|docs`

**fast model tasks** (80%):
- Add field to Prisma schema
- Create DTO with validation
- Create simple endpoint
- Add metric or log line
- Create UI component without complex logic
- Write migration SQL

**default model tasks** (20%):
- Architecture decisions
- Complex business logic
- Multi-system integration
- Review with trade-off analysis

### Phase 5 — Implementation (fast 80% / default 20%)
**Goal**: Execute tasks in dependency order.

For each task group (no dependencies between tasks in group):
1. Read `context.json` → get pending tasks
2. For each task: create focused subagent prompt
3. Execute subagent
4. Update `context.json` → mark task completed/failed
5. On failure: retry up to 3 times with error context

### Phase 6 — Review (fast model, readonly)
**Goal**: Verify implementation quality per domain.

For each domain (database, backend, frontend):
```
Review the implementation of <domain> against these criteria:
- Acceptance criteria from PRD
- Observability conventions (.cursor/rules/observability-conventions.md)
- Stack constraints (.cursor/rules/stack-constraints.md)
Report: passed/failed with specific issues.
```

If failed → run implementer subagent with feedback → retry up to 3 times.

### Phase 7 — Report (fast model)
**Goal**: Generate final summary.

Format:
```
Signal Lab PRD Execution — Complete

Tasks: X completed, Y failed, Z retries
Duration: ~N min
Model usage: X fast, Y default

Completed: [list with ✓]
Failed: [list with ✗ and reason]

Next steps: [manual actions needed]
```

---

## Context File Structure

```json
{
  "executionId": "2026-04-08-14-30",
  "prdPath": "prds/002_prd-observability-demo.md",
  "status": "in_progress",
  "currentPhase": "implementation",
  "signal": 42,
  "phases": {
    "analysis": { "status": "completed", "result": "..." },
    "codebase": { "status": "completed", "result": "..." },
    "planning": { "status": "completed", "result": "..." },
    "decomposition": { "status": "completed", "result": "..." },
    "implementation": { "status": "in_progress", "completedTasks": 5, "totalTasks": 8 },
    "review": { "status": "pending" },
    "report": { "status": "pending" }
  },
  "tasks": [
    {
      "id": "task-001",
      "title": "Add ScenarioRun model to Prisma schema",
      "type": "database",
      "complexity": "low",
      "model": "fast",
      "status": "completed",
      "retries": 0
    }
  ]
}
```

## Resume Protocol

On start:
1. Check if `.execution/` has a context file for this PRD
2. If yes: load it, skip completed phases, resume from `currentPhase`
3. If no: create new execution with timestamp ID

## Integration with Other Skills

- Use `observability` skill for any endpoint implementation task
- Use `nestjs-endpoint` skill for backend scaffolding tasks
- Use `frontend-form` skill for form implementation tasks
- Reference `.cursor/rules/` for all implementation constraints

## Example Usage

```
/run-prd prds/002_prd-observability-demo.md
```

The orchestrator will:
1. Create `.execution/2026-04-08-14-30/context.json`
2. Run phases 1-7
3. Output final report
4. Leave context.json for audit/resume
