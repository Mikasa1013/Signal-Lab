# /health-check

Check the status of the Signal Lab Docker stack.

## What to do

Run these checks in order and report status for each:

1. **Docker services**
   ```bash
   docker compose ps
   ```
   Expected: all services `Up` and healthy.

2. **Backend health**
   ```bash
   curl -s http://localhost:3001/api/health
   ```
   Expected: `{ "status": "ok", "timestamp": "..." }`

3. **Prometheus metrics**
   ```bash
   curl -s http://localhost:3001/metrics | head -20
   ```
   Expected: Prometheus text format with `scenario_runs_total`.

4. **Prometheus scraping**
   Open `http://localhost:9090/targets` — backend should be UP.

5. **Grafana**
   Open `http://localhost:3100` — login admin/admin, Signal Lab dashboard should exist.

6. **Loki**
   In Grafana → Explore → Loki: query `{service="backend"}` — should return logs.

7. **Frontend**
   Open `http://localhost:3000` — UI should load.

Report any failures with suggested fix.
