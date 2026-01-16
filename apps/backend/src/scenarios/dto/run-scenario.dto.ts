import { IsString, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RunScenarioDto {
  @ApiProperty({ enum: ['success', 'validation_error', 'system_error', 'slow_request', 'teapot'] })
  @IsString()
  @IsIn(['success', 'validation_error', 'system_error', 'slow_request', 'teapot'])
  type: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;
}
