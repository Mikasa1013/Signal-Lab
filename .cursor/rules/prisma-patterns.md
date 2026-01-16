---
description: How to work with Prisma — patterns and anti-patterns
---

# Prisma Patterns

## Schema location
- Schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`
- Always run `prisma generate` after schema changes

## Allowed operations
```typescript
// ✅ Use PrismaService (injected via NestJS DI)
const run = await this.prisma.scenarioRun.create({ data: { ... } });
const runs = await this.prisma.scenarioRun.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });
```

## Forbidden
```typescript
// ❌ Raw SQL
await this.prisma.$queryRaw`SELECT * FROM ...`;

// ❌ Any other ORM
import { Repository } from 'typeorm'; // NEVER

// ❌ Direct PrismaClient instantiation
const prisma = new PrismaClient(); // Use PrismaService instead
```

## Migration workflow
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name <description>` locally
3. Commit the migration file
4. In production/Docker: `npx prisma migrate deploy`

## Model conventions
- IDs: `@id @default(cuid())`
- Timestamps: `createdAt DateTime @default(now())`
- Optional JSON: `metadata Json?`
- Enums: prefer string fields with validation in DTO over Prisma enums (easier to extend)

## PrismaService
- Lives in `src/prisma/prisma.service.ts`
- Is `@Global()` — import `PrismaModule` once in `AppModule`
- Never inject `PrismaClient` directly
