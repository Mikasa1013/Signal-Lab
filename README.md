# Signal Lab

Observability playground — run scenarios, watch signals in Grafana, Loki, and Sentry.

## Prerequisites

- Docker 24+ and Docker Compose v2
- Node.js 20+ (for local development only)

## Quick Start

```bash
# 1. Copy env file
cp .env.example .env
# Optional: add your SENTRY_DSN to .env

# 2. Start everything
docker compose up -d

# 3. Verify
curl http://localhost:3001/api/health
# → { "status": "ok", "timestamp": "..." }
```

## Services

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend UI | http://localhost:3000 | — |
| Backend API | http://localhost:3001 | — |
| Swagger Docs | http://localhost:3001/api/docs | — |
| Prometheus Metrics | http://localhost:3001/metrics | — |
| Prometheus | http://localhost:9090 | — |
| Grafana | http://localhost:3100 | admin / admin |
| Loki | http://localhost:3200 | — |

## Stop

```bash
docker compose down
# With data cleanup:
docker compose down -v
```

---

## Verification Walkthrough (5 minutes)

### 1. Run scenarios

Open http://localhost:3000

- Select **Success** → Run → green badge appears in history
- Select **System Error** → Run → red badge + error toast
- Select **Slow Request** → Run → takes 2-5s, then green badge
- Select **Validation Error** → Run → error toast

### 2. Check Prometheus metrics

```bash
curl http://localhost:3001/metrics | grep scenario_runs_total
```

Expected output:
```
scenario_runs_total{type="success",status="success"} 1
scenario_runs_total{type="system_error",status="error"} 1
```

### 3. Check Grafana dashboard

1. Open http://localhost:3100
2. Login: admin / admin
3. Go to **Dashboards** → **Signal Lab** → **Signal Lab**
4. You should see:
   - Scenario Runs by Type (counter graph)
   - Latency Distribution (p50/p95)
   - Error Rate by Type
   - HTTP Requests Total
   - Signal Lab Logs (Loki panel)

### 4. Check Loki logs

In Grafana → Explore → select **Loki** datasource → run query:
```
{service="backend"}
```

You should see JSON logs with `scenarioType`, `scenarioId`, `duration`.

Filter by type:
```
{service="backend"} | json | scenarioType="system_error"
```

### 5. Check Sentry

If `SENTRY_DSN` is configured in `.env`:
- Open your Sentry project
- You should see a captured exception: `Simulated system error from Signal Lab`

---

## Easter Egg 🫖

Select **Teapot** scenario in the UI. The backend returns HTTP 418 with `{ "signal": 42 }`.

---

## Cursor AI Layer

The `.cursor/` directory contains everything needed for a new Cursor chat to continue development without manual onboarding.

### Rules (`.cursor/rules/`)

| File | What it enforces |
|------|-----------------|
| `stack-constraints.md` | Allowed/forbidden libraries. Prevents Redux, SWR, TypeORM, etc. |
| `observability-conventions.md` | Metric naming, log JSON format, Sentry usage patterns |
| `prisma-patterns.md` | Prisma-only ORM, no raw SQL, migration workflow |
| `frontend-patterns.md` | TanStack Query for state, RHF for forms, shadcn/ui for UI |
| `error-handling.md` | NestJS exceptions, Sentry capture, frontend toast patterns |

### Custom Skills (`.cursor/skills/`)

| Skill | When to use |
|-------|-------------|
| `observability` | Adding metrics/logs/Sentry to any new endpoint |
| `nestjs-endpoint` | Scaffolding a new NestJS endpoint with full observability |
| `frontend-form` | Adding a shadcn/ui form with RHF + Zod + TanStack mutation |
| `signal-lab-orchestrator` | Running a PRD through the multi-phase executor |

### Commands (`.cursor/commands/`)

| Command | What it does |
|---------|-------------|
| `/add-endpoint` | Scaffold new NestJS endpoint with observability |
| `/check-obs` | Verify observability is correctly wired |
| `/run-prd` | Execute a PRD via the orchestrator |
| `/health-check` | Check Docker stack status |

### Hooks (`.cursor/hooks/`)

| Hook | Problem it solves |
|------|------------------|
| `after-schema-change` | Reminds to run migration + regenerate client after `schema.prisma` edit |
| `after-new-endpoint` | Checks observability wiring when a new controller/service is created |

### Marketplace Skills (`.cursor/marketplace-skills.md`)

7 marketplace skills connected — see `.cursor/marketplace-skills.md` for justification.

### Orchestrator

The `signal-lab-orchestrator` skill implements a 7-phase PRD executor:

1. PRD Analysis (fast model)
2. Codebase Scan (fast model)
3. Planning (default model)
4. Decomposition (default model)
5. Implementation (fast 80% / default 20%)
6. Review with retry loop (fast model)
7. Final Report (fast model)

State persists in `.execution/<timestamp>/context.json`. Supports resume from any phase.

**Usage**: `/run-prd prds/002_prd-observability-demo.md`

---

## Project Structure

```
signal-lab/
├── apps/
│   ├── frontend/          # Next.js 14 (App Router)
│   └── backend/           # NestJS
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── infra/
│   ├── prometheus/
│   ├── grafana/
│   ├── loki/
│   └── promtail/
├── .cursor/
│   ├── rules/             # 5 rule files
│   ├── skills/            # 4 custom skills
│   ├── commands/          # 4 commands
│   └── hooks/             # 2 hooks
├── docker-compose.yml
└── .env.example
```
