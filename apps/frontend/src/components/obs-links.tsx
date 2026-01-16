import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const LINKS = [
  { label: 'Grafana Dashboard', url: 'http://localhost:3100', hint: 'Signal Lab dashboard' },
  { label: 'Prometheus Metrics', url: 'http://localhost:9090', hint: 'Raw metrics explorer' },
  { label: 'Loki Logs', url: 'http://localhost:3100/explore', hint: 'Query: {service="backend"}' },
  { label: 'Backend Metrics', url: 'http://localhost:3001/metrics', hint: 'Prometheus scrape endpoint' },
  { label: 'Swagger Docs', url: 'http://localhost:3001/api/docs', hint: 'API documentation' },
];

export function ObsLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Observability Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {LINKS.map((link) => (
            <div key={link.url} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {link.label}
                </a>
                <p className="text-xs text-muted-foreground">{link.hint}</p>
              </div>
              <span className="text-xs text-muted-foreground font-mono">{link.url}</span>
            </div>
          ))}
          <div className="rounded-md border p-3 bg-muted/50">
            <p className="text-xs font-medium">Sentry</p>
            <p className="text-xs text-muted-foreground">Check your Sentry project dashboard for captured exceptions from system_error runs.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
