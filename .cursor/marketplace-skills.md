# Marketplace Skills

The following marketplace skills are connected to this project. Each is justified below.

## Connected Skills

| # | Skill | Why |
|---|-------|-----|
| 1 | `nestjs-best-practices` | Enforces NestJS module structure, DI patterns, guards, interceptors. Prevents anti-patterns like direct PrismaClient instantiation. |
| 2 | `prisma-orm` | Covers Prisma schema syntax, migration commands, relation patterns. Complements our custom prisma-patterns rule. |
| 3 | `next-best-practices` | App Router conventions, server vs client components, metadata API. Prevents Pages Router patterns. |
| 4 | `shadcn-ui` | Component API, variant usage, theming with CSS variables. Reduces need to look up shadcn docs. |
| 5 | `tailwind-v4-shadcn` | Tailwind utility patterns, responsive design, dark mode. Works alongside shadcn-ui skill. |
| 6 | `docker-expert` | Docker Compose syntax, health checks, volume mounts, networking. Critical for our multi-service setup. |
| 7 | `postgresql-table-design` | Index design, constraint patterns, query optimization. Useful when extending the Prisma schema. |

## What custom skills cover that marketplace doesn't

- **observability skill**: No marketplace skill covers Prometheus + Loki + Sentry integration patterns specific to NestJS. The observability skill provides exact code templates for this project's metric naming and log format.
- **nestjs-endpoint skill**: Marketplace NestJS skill covers general patterns but not our specific scaffold with observability wired in from the start.
- **frontend-form skill**: Marketplace skills cover RHF and TanStack Query separately. Our skill combines them with our specific API client pattern and shadcn/ui components.
- **orchestrator skill**: Unique to this project — no marketplace equivalent for multi-phase PRD execution with context persistence.
