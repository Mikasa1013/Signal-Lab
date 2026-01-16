---
description: Error handling conventions for backend and frontend
---

# Error Handling

## Backend

### Global exception filter
- `HttpExceptionFilter` in `src/common/filters/http-exception.filter.ts` handles all errors
- Returns consistent JSON: `{ statusCode, message }`
- Logs 5xx errors via structured logger
- Captures 5xx to Sentry via `captureException`

### Throwing errors in services
```typescript
// ✅ Use NestJS built-in exceptions
throw new BadRequestException('Validation failed');
throw new NotFoundException('Resource not found');
throw new InternalServerErrorException('Something went wrong');

// ✅ Custom HTTP status
throw new HttpException({ signal: 42, message: "I'm a teapot" }, HttpStatus.I_AM_A_TEAPOT);

// ❌ Never throw raw Error in a service
throw new Error('something'); // use NestJS exceptions
```

### Sentry in services
```typescript
// For 5xx / unhandled
Sentry.captureException(error);

// For notable events (not errors)
Sentry.addBreadcrumb({ message: '...', level: 'warning' });
```

## Frontend

### API errors
- All errors from `src/lib/api.ts` throw `Error` with a human-readable message
- Mutations handle errors in `onError` callback with `toast.error(err.message)`
- Never show raw stack traces to users

### Loading states
- Always show loading state on buttons during mutations: `disabled={mutation.isPending}`
- Use `isLoading` from `useQuery` to show skeleton or spinner

### Never
- `console.error` in production code (use toast)
- Silent catch blocks: `catch (e) {}`
- Expose internal error details to users
