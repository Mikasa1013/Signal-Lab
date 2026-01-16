# /check-obs

Verify that observability is correctly wired for a given file or endpoint.

## Usage
```
/check-obs [file or endpoint path]
```

## What to check

### Metrics
- [ ] `MetricsService` is injected in the service/controller
- [ ] `httpRequestsTotal` is incremented with correct labels
- [ ] Domain counter is incremented (e.g., `scenarioRunsTotal`)
- [ ] Histogram is observed for operations with variable duration
- [ ] Metric names follow snake_case and end in `_total` / `_seconds`

### Logging
- [ ] `log()` helper is imported from `../common/logger`
- [ ] Success path logs at `info` level
- [ ] Slow/warning paths log at `warn` level
- [ ] Error paths log at `error` level
- [ ] Log includes `scenarioType`, `scenarioId`, `duration` where applicable

### Sentry
- [ ] `system_error` or 5xx paths call `Sentry.captureException(error)`
- [ ] Notable events call `Sentry.addBreadcrumb(...)`
- [ ] `SENTRY_DSN` is read from env, not hardcoded

### Verification steps
1. Run `docker compose up -d`
2. Trigger the endpoint
3. Check `localhost:3001/metrics` for the metric
4. Check Grafana → Explore → Loki: `{service="backend"}` for the log
5. For errors: check Sentry dashboard

Report any missing items with file path and line number.
