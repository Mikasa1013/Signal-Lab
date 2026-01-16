import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ScenariosService } from './scenarios.service';
import { RunScenarioDto } from './dto/run-scenario.dto';

@ApiTags('scenarios')
@Controller('scenarios')
export class ScenariosController {
  constructor(private readonly scenariosService: ScenariosService) {}

  @Post('run')
  @ApiOperation({ summary: 'Run a scenario' })
  async run(@Body() dto: RunScenarioDto) {
    return this.scenariosService.runScenario(dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get run history' })
  async history(@Query('limit') limit?: string) {
    return this.scenariosService.getHistory(limit ? parseInt(limit) : 20);
  }
}
