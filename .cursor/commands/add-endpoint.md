# /add-endpoint

Scaffold a new NestJS endpoint with full observability.

## Usage
```
/add-endpoint <domain> <method> <path> <description>
```

## What to do

1. Read `.cursor/skills/nestjs-endpoint/SKILL.md` for the scaffold template.
2. Read `.cursor/rules/observability-conventions.md` for metric naming.
3. Create the following files:
   - `apps/backend/src/<domain>/dto/<action>-<domain>.dto.ts`
   - `apps/backend/src/<domain>/<domain>.service.ts` (or add method to existing)
   - `apps/backend/src/<domain>/<domain>.controller.ts` (or add method to existing)
   - `apps/backend/src/<domain>/<domain>.module.ts` (if new domain)
4. Register the module in `apps/backend/src/app.module.ts` if new.
5. Add observability:
   - Increment `httpRequestsTotal` counter
   - Add structured log with `log()` helper
   - Add Sentry capture for error paths
6. Verify: `GET /metrics` shows new metric after hitting the endpoint.
