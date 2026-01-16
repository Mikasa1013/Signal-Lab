---
description: Enforces the required tech stack and prohibits replacements
---

# Stack Constraints

## Frontend — ALLOWED
- Next.js (App Router only, no Pages Router)
- shadcn/ui components
- Tailwind CSS for styling
- TanStack Query (`@tanstack/react-query`) for server state
- React Hook Form + Zod for forms and validation
- `sonner` for toasts

## Frontend — FORBIDDEN
- Redux, Zustand, Jotai, or any global state manager (use TanStack Query)
- SWR (use TanStack Query)
- Axios (use native fetch)
- CSS Modules or styled-components (use Tailwind)
- Any UI library other than shadcn/ui (no MUI, Chakra, Ant Design)

## Backend — ALLOWED
- NestJS with TypeScript strict mode
- Prisma ORM
- `prom-client` for Prometheus metrics
- `@sentry/node` for error tracking
- `class-validator` + `class-transformer` for DTOs

## Backend — FORBIDDEN
- TypeORM, Sequelize, Mongoose, or any ORM other than Prisma
- Raw SQL queries (use Prisma)
- Express directly (use NestJS)
- Any other HTTP framework

## Infra — REQUIRED
- Docker Compose for all services
- PostgreSQL 16
- Prometheus + Grafana + Loki + Promtail

## When adding a new dependency
1. Check this list first.
2. If not listed, ask before adding.
3. Never replace a required library with an alternative.
