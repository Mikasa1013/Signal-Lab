# /run-prd

Execute a PRD through the Signal Lab orchestrator.

## Usage
```
/run-prd <path-to-prd>
```

## What to do

1. Read `.cursor/skills/signal-lab-orchestrator/SKILL.md` for the full orchestrator protocol.
2. Load the PRD from the given path.
3. Create execution directory: `.execution/<timestamp>/`
4. Create `context.json` with initial state.
5. Run through all 7 phases:
   - Phase 1: PRD Analysis (fast model)
   - Phase 2: Codebase Scan (fast model)
   - Phase 3: Planning (default model)
   - Phase 4: Decomposition (default model)
   - Phase 5: Implementation (fast 80% / default 20%)
   - Phase 6: Review (fast, readonly)
   - Phase 7: Report (fast)
6. Update `context.json` after each phase.
7. Output final report.

## Resume
If `context.json` already exists for this PRD, resume from `currentPhase`.
Completed phases are skipped.
