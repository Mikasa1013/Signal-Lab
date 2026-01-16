import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry: client.Registry;

  readonly scenarioRunsTotal: client.Counter<string>;
  readonly scenarioRunDuration: client.Histogram<string>;
  readonly httpRequestsTotal: client.Counter<string>;

  constructor() {
    this.registry = new client.Registry();
    client.collectDefaultMetrics({ register: this.registry });

    this.scenarioRunsTotal = new client.Counter({
      name: 'scenario_runs_total',
      help: 'Total number of scenario runs',
      labelNames: ['type', 'status'],
      registers: [this.registry],
    });

    this.scenarioRunDuration = new client.Histogram({
      name: 'scenario_run_duration_seconds',
      help: 'Duration of scenario runs in seconds',
      labelNames: ['type'],
      buckets: [0.1, 0.5, 1, 2, 5, 10],
      registers: [this.registry],
    });

    this.httpRequestsTotal = new client.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status_code'],
      registers: [this.registry],
    });
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  getContentType(): string {
    return this.registry.contentType;
  }
}
