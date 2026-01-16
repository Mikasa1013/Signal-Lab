---
description: Naming conventions for metrics, log format, and Sentry usage
---

# Observability Conventions

## Prometheus Metrics

### Naming
- Use snake_case: `scenario_runs_total`, `http_requests_total`
- Counters end in `_total`
- Histograms end in `_seconds` or `_bytes`
- Gauges describe current state: `active_connections`

### Required labels
- Counters: always include `type` and `status` labels
- Histograms: always include `type` label
- HTTP metrics: `method`, `path`, `status_code`

### Where to add metrics
- Every new endpoint must increment `http_requests_total`
- Every new domain operation must have a counter + histogram

## Structured Logging

All logs MUST be JSON with this shape:
```json
{
  "timestamp": "ISO8601",
  "level": "info|warn|error",
  "message": "human readable",
  "app": "signal-lab",
  "scenarioType": "...",
  "scenarioId": "...",
  "duration": 123
}
```

### Log levels
- `info` — successful operations
- `warn` — recoverable issues, slow requests, validation errors
- `error` — unhandled exceptions, 5xx responses

### Never log
- Passwords, tokens, secrets
- Full request/response bodies (log IDs and metadata only)

## Sentry

- `captureException(error)` — for all 5xx / unhandled errors
- `addBreadcrumb(...)` — for validation errors and notable events
- DSN must come from `process.env.SENTRY_DSN` — never hardcode
- Initialize Sentry before NestJS app creation in `main.ts`
