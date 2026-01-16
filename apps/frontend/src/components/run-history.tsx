'use client';

import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getHistory, type ScenarioRun } from '@/lib/api';

function statusVariant(status: string): 'success' | 'error' | 'warning' | 'default' {
  if (status === 'completed') return 'success';
  if (status === 'error') return 'error';
  return 'warning';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleTimeString();
}

export function RunHistory() {
  const { data, isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: () => getHistory(20),
    refetchInterval: 5000,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Run History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-muted-foreground text-sm">Loading...</p>}
        {!isLoading && (!data || data.length === 0) && (
          <p className="text-muted-foreground text-sm">No runs yet. Run a scenario above.</p>
        )}
        <div className="space-y-2">
          {data?.map((run: ScenarioRun) => (
            <div
              key={run.id}
              className="flex items-center justify-between rounded-md border p-3 text-sm"
            >
              <div className="flex items-center gap-3">
                <Badge variant={statusVariant(run.status)}>{run.status}</Badge>
                <span className="font-mono text-xs text-muted-foreground">{run.type}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                {run.duration != null && <span>{run.duration}ms</span>}
                <span>{formatDate(run.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
