---
name: nestjs-endpoint
description: Scaffold a new NestJS endpoint with DTO, service method, controller, and observability
---

# NestJS Endpoint Skill

## When to Use
- Creating a new REST endpoint in the backend
- Adding a new domain to the NestJS app
- Scaffolding a CRUD resource

## Step-by-step

### 1. Create the DTO
```typescript
// src/<domain>/dto/create-<resource>.dto.ts
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResourceDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
```

### 2. Create the service method
```typescript
// src/<domain>/<domain>.service.ts
async createResource(dto: CreateResourceDto) {
  const start = Date.now();

  const record = await this.prisma.resource.create({ data: dto });

  const duration = Date.now() - start;
  this.metrics.httpRequestsTotal.inc({ method: 'POST', path: '/api/<domain>', status_code: '201' });
  log('info', 'Resource created', { resourceId: record.id, duration });

  return record;
}
```

### 3. Create the controller method
```typescript
@Post()
@ApiOperation({ summary: 'Create resource' })
async create(@Body() dto: CreateResourceDto) {
  return this.service.createResource(dto);
}
```

### 4. Register in module
```typescript
@Module({
  imports: [MetricsModule],
  controllers: [ResourceController],
  providers: [ResourceService],
})
export class ResourceModule {}
```

### 5. Add to AppModule
```typescript
imports: [PrismaModule, MetricsModule, ResourceModule, ...]
```

## Checklist
- [ ] DTO with `class-validator` decorators
- [ ] Swagger `@ApiProperty` on all DTO fields
- [ ] Service method with Prisma
- [ ] Metrics increment in controller or service
- [ ] Structured log on success and error
- [ ] Module registered in AppModule
