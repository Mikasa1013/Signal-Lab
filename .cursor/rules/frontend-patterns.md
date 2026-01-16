---
description: Frontend conventions — TanStack Query, RHF, shadcn/ui
---

# Frontend Patterns

## Server State — TanStack Query

```typescript
// ✅ Fetching data
const { data, isLoading } = useQuery({
  queryKey: ['history'],
  queryFn: () => getHistory(20),
  refetchInterval: 5000,
});

// ✅ Mutations
const mutation = useMutation({
  mutationFn: runScenario,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['history'] }),
  onError: (err: Error) => toast.error(err.message),
});
```

## Forms — React Hook Form + Zod

```typescript
// ✅ Always use zodResolver
const { register, handleSubmit } = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: { type: 'success' },
});
```

## UI Components — shadcn/ui

- Always use components from `@/components/ui/`
- Never write raw HTML buttons, inputs, or selects
- Use `Badge` for status indicators with semantic variants: `success`, `error`, `warning`
- Use `Card` + `CardHeader` + `CardContent` for sections
- Use `sonner` toast for feedback: `toast.success(...)`, `toast.error(...)`

## File structure
```
src/
  app/          # Next.js App Router pages
  components/
    ui/         # shadcn/ui primitives
    *.tsx       # feature components
  lib/
    api.ts      # all fetch calls
    utils.ts    # cn() and helpers
```

## Rules
- No `useEffect` for data fetching — use TanStack Query
- No `useState` for server data — use TanStack Query
- All API calls go through `src/lib/api.ts`
- `'use client'` only on components that need interactivity
