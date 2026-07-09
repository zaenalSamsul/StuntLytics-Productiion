import { ServerCrash, TerminalSquare } from 'lucide-react'

export function DataServiceUnavailable({ message }: { message?: string }) {
  return (
    <div className="rounded-2xl border border-danger/20 bg-danger/5 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger"><ServerCrash className="size-5" /></span>
        <div className="min-w-0">
          <h3 className="text-sm font-extrabold text-foreground">Data-science service is not running</h3>
          <p className="mt-1 text-xs leading-5 text-text-secondary">{message ?? 'Start the integrated Python analytics service to load dashboard metrics, model inference, correlations, explorer records, and risk-map data.'}</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 font-mono text-[11px] text-foreground"><TerminalSquare className="size-3.5 text-primary" /> npm run dev:full</div>
        </div>
      </div>
    </div>
  )
}
