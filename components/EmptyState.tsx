import { DatabaseZap } from 'lucide-react'
export function EmptyState({ title = 'No data available', description = 'Adjust your filters or connect a data source to continue.', action }: { title?: string; description?: string; action?: React.ReactNode }) {
  return <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center"><span className="flex size-12 items-center justify-center rounded-2xl bg-primary/8 text-primary"><DatabaseZap className="size-6" /></span><h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3><p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>{action && <div className="mt-5">{action}</div>}</div>
}
