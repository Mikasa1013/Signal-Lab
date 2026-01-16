---
name: frontend-form
description: Add a shadcn/ui form with React Hook Form, Zod validation, and TanStack Query mutation
---

# Frontend Form Skill

## When to Use
- Adding a new form to the frontend
- Connecting a form to a backend mutation
- Adding validation to an existing form

## Template

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { myApiCall } from '@/lib/api';

// 1. Define schema
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['a', 'b', 'c']),
});

type FormValues = z.infer<typeof schema>;

export function MyForm() {
  const queryClient = useQueryClient();

  // 2. Setup form
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'a' },
  });

  // 3. Setup mutation
  const mutation = useMutation({
    mutationFn: myApiCall,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-data'] });
      toast.success('Done!');
      reset();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <Card>
      <CardHeader><CardTitle>My Form</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input {...register('name')} placeholder="Enter name" />
            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
          </div>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

## Checklist
- [ ] Zod schema defined
- [ ] `zodResolver` used in `useForm`
- [ ] `useMutation` with `onSuccess` and `onError`
- [ ] `onSuccess` invalidates relevant query keys
- [ ] Button disabled during `isPending`
- [ ] Error messages shown under fields
- [ ] Toast feedback on success and error
- [ ] All UI uses shadcn/ui components
