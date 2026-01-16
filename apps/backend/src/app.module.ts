import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MetricsModule } from './metrics/metrics.module';
import { ScenariosModule } from './scenarios/scenarios.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [PrismaModule, MetricsModule, ScenariosModule, HealthModule],
})
export class AppModule {}
