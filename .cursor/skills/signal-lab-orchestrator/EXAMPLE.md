# Orchestrator Example

## Running PRD 002

```
/run-prd prds/002_prd-observability-demo.md
```

### Expected context.json after decomposition

```json
{
  "executionId": "2026-04-08-14-30",
  "prdPath": "prds/002_prd-observability-demo.md",
  "status": "in_progress",
  "currentPhase": "implementation",
  "signal": 42,
  "phases": {
    "analysis": {
      "status": "completed",
      "result": "F1: UI Scenario Runner, F2: Run History, F3: Obs Links, F4: Backend execution, F5: Prometheus, F6: Loki, F7: Sentry, F8: Grafana, F9: Docker"
    },
    "codebase": {
      "status": "completed",
      "result": "Backend: NestJS with PrismaService, MetricsService. Frontend: Next.js with TanStack Query. Missing: scenario execution logic, Prometheus metrics, Loki config."
    },
    "planning": {
      "status": "completed",
      "result": "Order: 1) Prisma model, 2) Backend service, 3) Metrics, 4) Logging, 5) Sentry, 6) Frontend form, 7) Run history, 8) Docker observability stack, 9) Grafana dashboard"
    },
    "decomposition": { "status": "completed", "result": "9 tasks created" },
    "implementation": { "status": "pending", "completedTasks": 0, "totalTasks": 9 },
    "review": { "status": "pending" },
    "report": { "status": "pending" }
  },
  "tasks": [
    { "id": "task-001", "title": "Add ScenarioRun model to Prisma schema", "type": "database", "complexity": "low", "model": "fast", "status": "pending", "retries": 0 },
    { "id": "task-002", "title": "Create RunScenarioDto with class-validator", "type": "backend", "complexity": "low", "model": "fast", "status": "pending", "retries": 0 },
    { "id": "task-003", "title": "Implement ScenariosService with 4 scenario handlers", "type": "backend", "complexity": "medium", "model": "default", "status": "pending", "retries": 0 },
    { "id": "task-004", "title": "Add Prometheus metrics to MetricsService", "type": "backend", "complexity": "low", "model": "fast", "status": "pending", "retries": 0 },
    { "id": "task-005", "title": "Add structured logging to scenario handlers", "type": "backend", "complexity": "low", "model": "fast", "status": "pending", "retries": 0 },
    { "id": "task-006", "title": "Integrate Sentry for system_error scenario", "type": "backend", "complexity": "low", "model": "fast", "status": "pending", "retries": 0 },
    { "id": "task-007", "title": "Build ScenarioRunner form component", "type": "frontend", "complexity": "medium", "model": "fast", "status": "pending", "retries": 0 },
    { "id": "task-008", "title": "Build RunHistory list with TanStack Query", "type": "frontend", "complexity": "low", "model": "fast", "status": "pending", "retries": 0 },
    { "id": "task-009", "title": "Configure Grafana dashboard with 3+ panels", "type": "infra", "complexity": "medium", "model": "default", "status": "pending", "retries": 0 }
  ]
}
```

### Expected final report

```
Signal Lab PRD 002 Execution — Complete

Tasks: 9 completed, 0 failed, 1 retry
Duration: ~35 min
Model usage: 7 fast, 2 default

Completed:
  ✓ Prisma schema + migration
  ✓ RunScenarioDto
  ✓ ScenariosService (4 scenarios + teapot easter egg)
  ✓ Prometheus metrics (3 metrics)
  ✓ Structured logging
  ✓ Sentry integration
  ✓ ScenarioRunner form
  ✓ RunHistory list
  ✓ Grafana dashboard (5 panels)

Next steps:
  - Run docker compose up -d
  - Run verification walkthrough from PRD 002
  - Set SENTRY_DSN in .env
```
