import { DatabaseZap, FlaskConical, RadioTower } from 'lucide-react'
import { DataSourceInfo } from '@/lib/api'

export function DataSourceBadge({ source }: { source?: DataSourceInfo | null }) {
  if (!source) {
    return <span className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-border bg-card px-3 text-[11px] font-bold text-muted-foreground"><RadioTower className="size-3.5" /> Waiting for data service</span>
  }
  const live = source.live
  const Icon = live ? DatabaseZap : FlaskConical
  return (
    <span
      title={source.detail}
      className={`inline-flex min-h-9 items-center gap-2 rounded-xl border px-3 text-[11px] font-extrabold ${live ? 'border-success/20 bg-success/8 text-success' : 'border-warning/20 bg-warning/8 text-warning'}`}
    >
      <Icon className="size-3.5" />
      {source.label}
    </span>
  )
}
