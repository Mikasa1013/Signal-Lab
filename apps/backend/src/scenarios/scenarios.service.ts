import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';
import { RunScenarioDto } from './dto/run-scenario.dto';
import { log } from '../common/logger';

@Injectable()
export class ScenariosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  async runScenario(dto: RunScenarioDto) {
    const start = Date.now();

    switch (dto.type) {
      case 'success':
        return this.handleSuccess(dto, start);
      case 'validation_error':
        return this.handleValidationError(dto, start);
      case 'system_error':
        return this.handleSystemError(dto, start);
      case 'slow_request':
        return this.handleSlowRequest(dto, start);
      case 'teapot':
        return this.handleTeapot(dto, start);
      default:
        throw new BadRequestException(`Unknown scenario type: ${dto.type}`);
    }
  }

  private async handleSuccess(dto: RunScenarioDto, start: number) {
    const duration = Date.now() - start;
    const run = await this.prisma.scenarioRun.create({
      data: { type: dto.type, status: 'completed', duration },
    });
    this.metrics.scenarioRunsTotal.inc({ type: dto.type, status: 'success' });
    this.metrics.scenarioRunDuration.observe({ type: dto.type }, duration / 1000);
    log('info', 'Scenario completed', { scenarioType: dto.type, scenarioId: run.id, duration });
    return { id: run.id, status: 'completed', duration };
  }

  private async handleValidationError(dto: RunScenarioDto, start: number) {
    const duration = Date.now() - start;
    const run = await this.prisma.scenarioRun.create({
      data: { type: dto.type, status: 'error', duration, error: 'Validation failed' },
    });
    this.metrics.scenarioRunsTotal.inc({ type: dto.type, status: 'error' });
    log('warn', 'Scenario validation error', { scenarioType: dto.type, scenarioId: run.id, duration });
    Sentry.addBreadcrumb({ message: 'validation_error scenario triggered', level: 'warning' });
    throw new BadRequestException('Validation failed: invalid scenario input');
  }

  private async handleSystemError(dto: RunScenarioDto, start: number) {
    const duration = Date.now() - start;
    const run = await this.prisma.scenarioRun.create({
      data: { type: dto.type, status: 'error', duration, error: 'Internal server error' },
    });
    this.metrics.scenarioRunsTotal.inc({ type: dto.type, status: 'error' });
    log('error', 'Scenario system error', { scenarioType: dto.type, scenarioId: run.id, duration });
    const error = new Error('Simulated system error from Signal Lab');
    Sentry.captureException(error);
    throw new InternalServerErrorException('A system error occurred');
  }

  private async handleSlowRequest(dto: RunScenarioDto, start: number) {
    const delay = Math.floor(Math.random() * 3000) + 2000; // 2-5s
    await new Promise((resolve) => setTimeout(resolve, delay));
    const duration = Date.now() - start;
    const run = await this.prisma.scenarioRun.create({
      data: { type: dto.type, status: 'completed', duration },
    });
    this.metrics.scenarioRunsTotal.inc({ type: dto.type, status: 'success' });
    this.metrics.scenarioRunDuration.observe({ type: dto.type }, duration / 1000);
    log('warn', 'Scenario slow request completed', { scenarioType: dto.type, scenarioId: run.id, duration });
    return { id: run.id, status: 'completed', duration };
  }

  private async handleTeapot(dto: RunScenarioDto, start: number) {
    const duration = Date.now() - start;
    const run = await this.prisma.scenarioRun.create({
      data: { type: dto.type, status: 'completed', duration, metadata: { easter: true } },
    });
    this.metrics.scenarioRunsTotal.inc({ type: dto.type, status: 'success' });
    log('info', 'Teapot scenario — easter egg triggered', { scenarioType: dto.type, scenarioId: run.id, duration });
    throw new HttpException({ signal: 42, message: "I'm a teapot" }, HttpStatus.I_AM_A_TEAPOT);
  }

  async getHistory(limit = 20) {
    return this.prisma.scenarioRun.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
