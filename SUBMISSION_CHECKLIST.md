# Signal Lab — Submission Checklist

---

## Репозиторий

- **URL**: `(your repo URL)`
- **Ветка**: `main`
- **Время работы** (приблизительно): `8` часов

---

## Запуск

```bash
# Команда запуска:
cp .env.example .env && docker compose up -d

# Команда проверки:
curl http://localhost:3001/api/health

# Команда остановки:
docker compose down
```

**Предусловия**: Docker 24+, Docker Compose v2. Node.js не требуется для запуска.

---

## Стек — подтверждение использования

| Технология | Используется? | Где посмотреть |
|-----------|:------------:|----------------|
| Next.js (App Router) | ✅ | `apps/frontend/src/app/` |
| shadcn/ui | ✅ | `apps/frontend/src/components/ui/` |
| Tailwind CSS | ✅ | `apps/frontend/tailwind.config.ts`, все компоненты |
| TanStack Query | ✅ | `apps/frontend/src/components/run-history.tsx`, `scenario-runner.tsx` |
| React Hook Form | ✅ | `apps/frontend/src/components/scenario-runner.tsx` |
| NestJS | ✅ | `apps/backend/src/` |
| PostgreSQL | ✅ | `docker-compose.yml`, `prisma/schema.prisma` |
| Prisma | ✅ | `prisma/schema.prisma`, `apps/backend/src/prisma/` |
| Sentry | ✅ | `apps/backend/src/scenarios/scenarios.service.ts`, `main.ts` |
| Prometheus | ✅ | `apps/backend/src/metrics/`, `infra/prometheus/` |
| Grafana | ✅ | `infra/grafana/`, dashboard at `localhost:3100` |
| Loki | ✅ | `infra/loki/`, `infra/promtail/` |

---

## Observability Verification

| Сигнал | Как воспроизвести | Где посмотреть результат |
|--------|-------------------|------------------------|
| Prometheus metric | Run any scenario from UI | `curl localhost:3001/metrics \| grep scenario_runs_total` |
| Grafana dashboard | Run several scenarios | `localhost:3100` → Dashboards → Signal Lab |
| Loki log | Run any scenario | Grafana → Explore → Loki → `{service="backend"}` |
| Sentry exception | Run "System Error" scenario | Sentry project dashboard (requires SENTRY_DSN in .env) |

---

## Cursor AI Layer

### Custom Skills

| # | Skill name | Назначение |
|---|-----------|-----------|
| 1 | `observability` | Добавить метрики, логи и Sentry к новому endpoint |
| 2 | `nestjs-endpoint` | Scaffold нового NestJS endpoint с observability |
| 3 | `frontend-form` | shadcn/ui форма с RHF + Zod + TanStack mutation |
| 4 | `signal-lab-orchestrator` | Многофазный исполнитель PRD с context.json и resume |

### Commands

| # | Command | Что делает |
|---|---------|-----------|
| 1 | `/add-endpoint` | Scaffold нового NestJS endpoint с observability |
| 2 | `/check-obs` | Проверить observability wiring в файле/endpoint |
| 3 | `/run-prd` | Запустить PRD через orchestrator |
| 4 | `/health-check` | Проверить состояние Docker stack |

### Hooks

| # | Hook | Какую проблему решает |
|---|------|----------------------|
| 1 | `after-schema-change` | Напоминает запустить миграцию и regenerate после изменения schema.prisma |
| 2 | `after-new-endpoint` | Проверяет наличие observability при создании нового controller/service |

### Rules

| # | Rule file | Что фиксирует |
|---|----------|---------------|
| 1 | `stack-constraints.md` | Разрешённые и запрещённые библиотеки |
| 2 | `observability-conventions.md` | Naming метрик, формат логов, Sentry patterns |
| 3 | `prisma-patterns.md` | Только Prisma, без raw SQL, workflow миграций |
| 4 | `frontend-patterns.md` | TanStack Query, RHF, shadcn/ui conventions |
| 5 | `error-handling.md` | NestJS exceptions, Sentry capture, frontend toasts |

### Marketplace Skills

| # | Skill | Зачем подключён |
|---|-------|----------------|
| 1 | `nestjs-best-practices` | NestJS DI, модульная структура, guards |
| 2 | `prisma-orm` | Schema syntax, миграции, relation patterns |
| 3 | `next-best-practices` | App Router, server/client components |
| 4 | `shadcn-ui` | Component API, variants, theming |
| 5 | `tailwind-v4-shadcn` | Tailwind utilities, responsive, dark mode |
| 6 | `docker-expert` | Compose syntax, health checks, networking |
| 7 | `postgresql-table-design` | Index design, constraints, query optimization |

**Что закрыли custom skills, чего нет в marketplace:**
Observability skill покрывает специфичную интеграцию Prometheus + Loki + Sentry для NestJS с нашими naming conventions. Orchestrator skill уникален — нет marketplace аналога для многофазного PRD executor с context persistence.

---

## Orchestrator

- **Путь к skill**: `.cursor/skills/signal-lab-orchestrator/SKILL.md`
- **Путь к context file** (пример): `.execution/2026-04-08-14-30/context.json`
- **Сколько фаз**: 7
- **Какие задачи для fast model**: PRD Analysis, Codebase Scan, добавление полей в schema, создание DTO, простые endpoints, добавление метрик/логов, UI компоненты без сложной логики, Review (readonly), Report
- **Поддерживает resume**: да

---

## Скриншоты / видео

- [ ] UI приложения
- [ ] Grafana dashboard с данными
- [ ] Loki logs
- [ ] Sentry error

---

## Что не успел и что сделал бы первым при +4 часах

- Seed script с тестовыми данными для быстрой демонстрации
- E2E тест verification walkthrough (Playwright)
- Grafana alert rules для error rate threshold
- Более детальный Loki pipeline с label extraction

---

## Вопросы для защиты (подготовься)

1. **Почему именно такая декомпозиция skills?** — Каждый skill закрывает один workflow: observability skill для любого нового endpoint, nestjs-endpoint для scaffold, frontend-form для форм. Orchestrator объединяет их в pipeline.

2. **Какие задачи подходят для малой модели и почему?** — Задачи с чётким шаблоном и минимальным контекстом: добавить поле в schema, создать DTO, добавить метрику. Малая модель справляется, когда есть конкретный образец для копирования.

3. **Какие marketplace skills подключил, а какие заменил custom — и почему?** — Marketplace покрывает общие паттерны (NestJS, Prisma, Next.js). Custom skills закрывают специфику проекта: наши naming conventions для метрик, конкретный формат JSON логов, интеграцию всех трёх observability инструментов вместе.

4. **Какие hooks реально снижают ошибки в повседневной работе?** — after-schema-change предотвращает забытые миграции (частая ошибка). after-new-endpoint предотвращает endpoints без observability — без него легко забыть добавить метрику.

5. **Как orchestrator экономит контекст по сравнению с одним большим промптом?** — Основной чат держит только координацию (~15k токенов). Каждый subagent получает фокусированный промпт с минимальным контекстом. 80% задач идут в fast model с коротким контекстом. Без orchestrator весь PRD + весь codebase + вся история решений живёт в одном чате.
