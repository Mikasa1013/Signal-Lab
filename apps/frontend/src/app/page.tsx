import { ScenarioRunner } from '@/components/scenario-runner';
import { RunHistory } from '@/components/run-history';
import { ObsLinks } from '@/components/obs-links';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-2xl">🔬</span>
          <div>
            <h1 className="text-xl font-bold">Signal Lab</h1>
            <p className="text-xs text-muted-foreground">Observability playground</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <ScenarioRunner />
          <ObsLinks />
        </div>
        <div className="lg:col-span-2">
          <RunHistory />
        </div>
      </div>
    </main>
  );
}
