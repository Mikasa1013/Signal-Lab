const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export type ScenarioType = 'success' | 'validation_error' | 'system_error' | 'slow_request' | 'teapot';

export interface RunScenarioRequest {
  type: ScenarioType;
  name?: string;
}

export interface ScenarioRun {
  id: string;
  type: string;
  status: string;
  duration: number | null;
  error: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export async function runScenario(data: RunScenarioRequest): Promise<ScenarioRun> {
  const res = await fetch(`${API_URL}/api/scenarios/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok && res.status !== 418) {
    throw new Error(json.message ?? 'Request failed');
  }

  return json;
}

export async function getHistory(limit = 20): Promise<ScenarioRun[]> {
  const res = await fetch(`${API_URL}/api/scenarios/history?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}
