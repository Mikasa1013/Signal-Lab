'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { runScenario, type ScenarioType } from '@/lib/api';

const schema = z.object({
  type: z.enum(['success', 'validation_error', 'system_error', 'slow_request', 'teapot']),
  name: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const SCENARIO_OPTIONS: { value: ScenarioType; label: string }[] = [
  { value: 'success', label: '✅ Success' },
  { value: 'validation_error', label: '⚠️ Validation Error' },
  { value: 'system_error', label: '🔴 System Error' },
  { value: 'slow_request', label: '🐢 Slow Request (2-5s)' },
  { value: 'teapot', label: '🫖 Teapot (Easter Egg)' },
];

export function ScenarioRunner() {
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'success' },
  });

  const mutation = useMutation({
    mutationFn: runScenario,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
      if ('signal' in data) {
        toast.success(`🫖 I'm a teapot! Signal: ${(data as any).signal}`);
      } else {
        toast.success(`Scenario completed in ${data.duration}ms`);
      }
    },
    onError: (err: Error) => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
      toast.error(err.message);
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Run Scenario</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Scenario Type</label>
            <Select {...register('type')}>
              {SCENARIO_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
            {errors.type && <p className="text-destructive text-xs mt-1">{errors.type.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Name (optional)</label>
            <Input {...register('name')} placeholder="e.g. my-test-run" />
          </div>

          <Button type="submit" disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? 'Running...' : 'Run Scenario'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
