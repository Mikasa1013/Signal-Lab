---
name: observability
description: Add Prometheus metrics, structured logs, and Sentry integration to a new NestJS endpoint
---

# Observability Skill

## When to Use
- Adding a new NestJS endpoint or service method
- Reviewing whether an existing endpoint has proper observability
- Debugging missing metrics or logs in Grafana/Loki

## Checklist for every new endpoint

### 1. Prometheus metrics
Inject `MetricsService` and add:
```typescript
// Counter — increment on every call
this.metrics.httpRequestsTotal.inc({
  method: req.method,
  path: '/api/your-path',
  status_code: String(res.statusCode),
});

// Domain counter — increment with business labels
this.metrics.scenarioRunsTotal.inc({ type: dto.type, status: 'success' });

// Histogram — observe duration
const start = Date.now();
// ... do work ...
this.metrics.scenarioRunDuration.observe({ type: dto.type }, (Date.now() - start) / 1000);
```

### 2. Structured logging
Use the `log()` helper from `src/common/logger.ts`:
```typescript
import { log } from '../common/logger';

// Success
log('info', 'Operation completed', { scenarioType, scenarioId, duration });

// Warning (slow, validation)
log('warn', 'Slow operation detected', { scenarioType, duration });

// Error
log('error', 'Operation failed', { scenarioType, error: err.message });
```

### 3. Sentry
```typescript
import * as Sentry from '@sentry/node';

// For exceptions (5xx)
Sentry.captureException(error);

// For notable events
Sentry.addBreadcrumb({ message: 'event description', level: 'warning' });
```

## Adding a new metric
1. Add to `MetricsService` constructor in `src/metrics/metrics.service.ts`
2. Follow naming: `snake_case`, counters end in `_total`, histograms in `_seconds`
3. Add labels that make the metric filterable in Grafana
4. Update Grafana dashboard JSON if needed

## Verification
After adding observability:
1. Hit the endpoint
2. Check `localhost:3001/metrics` — new metric should appear
3. Check Grafana → Explore → Loki: `{service="backend"}` — log should appear
4. For errors: check Sentry dashboard
