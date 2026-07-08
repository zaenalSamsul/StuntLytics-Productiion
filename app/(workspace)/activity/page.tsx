'use client'

import { Activity, AlertTriangle, BrainCircuit, Database, Download, Filter, Search, Settings2, ShieldCheck, Workflow } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { activityEvents, ActivityType } from '@/lib/activity'
import { cn } from '@/lib/utils'
import { useMemo, useState } from 'react'
import { downloadTextFile, toCsv } from '@/lib/download'
import { useToast } from '@/components/ToastProvider'

const typeMeta = {
  analysis: { icon: BrainCircuit, label: 'Analysis', className: 'bg-info/8 text-info border-info/15' },
  data: { icon: Database, label: 'Data', className: 'bg-primary/8 text-primary border-primary/15' },
  alert: { icon: AlertTriangle, label: 'Alert', className: 'bg-warning/8 text-warning border-warning/15' },
  intervention: { icon: Workflow, label: 'Intervention', className: 'bg-secondary/10 text-secondary border-secondary/15' },
  system: { icon: Settings2, label: 'System', className: 'bg-muted text-text-secondary border-border' },
}

export default function ActivityPage() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<'all' | ActivityType>('all')
  const { notify } = useToast()
  const visible = useMemo(() => activityEvents.filter((item) => (type === 'all' || item.type === type) && `${item.title} ${item.description} ${item.actor} ${item.metadata ?? ''}`.toLowerCase().includes(query.toLowerCase())), [query, type])

  const exportLog = () => {
    downloadTextFile('stuntlytics-activity-log.csv', toCsv(visible.map((item) => ({ id: item.id, type: item.type, title: item.title, description: item.description, actor: item.actor, time: item.time, metadata: item.metadata ?? '' }))), 'text/csv;charset=utf-8')
    notify({ tone: 'success', title: 'Activity log exported', message: `${visible.length} visible events were downloaded as CSV.` })
  }

  return <div className="space-y-7">
    <PageHeader icon={<Activity className="size-5" />} eyebrow="Trust & governance" title="Activity & Audit Trail" description="A transparent operational record of alerts, AI analyses, data synchronization, and intervention changes.">
      <button type="button" onClick={exportLog} className="btn-secondary"><Download className="size-4" /> Export log</button>
    </PageHeader>

    <section className="grid gap-4 sm:grid-cols-3">
      <div className="clinical-card p-5"><div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><ShieldCheck className="size-4 text-success" /> Audit status</div><p className="mt-2 text-xl font-bold text-foreground">Traceable</p><p className="mt-1 text-xs text-text-secondary">User and system events recorded</p></div>
      <div className="clinical-card p-5"><p className="text-xs font-semibold text-muted-foreground">Events today</p><p className="mt-2 text-3xl font-bold tabular-nums text-foreground">5</p><p className="mt-1 text-xs text-text-secondary">Across 4 operational channels</p></div>
      <div className="clinical-card p-5"><p className="text-xs font-semibold text-muted-foreground">Last data sync</p><p className="mt-2 text-xl font-bold text-foreground">09:10 WIB</p><p className="mt-1 text-xs text-success">Validation passed</p></div>
    </section>

    <section className="clinical-card overflow-hidden">
      <div className="grid gap-3 border-b border-border-soft p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:px-5">
        <label className="relative max-w-xl"><span className="sr-only">Search activity</span><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-soft"/><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search actor, event, case, or metadata…" className="premium-input w-full pl-10"/></label>
        <div className="flex items-center gap-1.5 overflow-x-auto"><Filter className="mr-1 size-4 shrink-0 text-muted-foreground"/>{(['all','analysis','data','alert','intervention','system'] as const).map((item)=><button key={item} type="button" onClick={()=>setType(item)} className={cn('shrink-0 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold capitalize', type===item?'border-primary/20 bg-primary/8 text-primary':'border-border text-muted-foreground hover:bg-muted')}>{item}</button>)}</div>
      </div>
      <div className="divide-y divide-border-soft">
        {visible.map((event)=>{const meta=typeMeta[event.type]; const Icon=meta.icon; return <article key={event.id} className="grid gap-3 p-4 transition hover:bg-surface-blue/50 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:px-5">
          <span className={cn('flex size-10 items-center justify-center rounded-xl border',meta.className)}><Icon className="size-[18px]"/></span>
          <div><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-semibold text-foreground">{event.title}</h2><span className={cn('rounded-md border px-2 py-0.5 text-[10px] font-semibold',meta.className)}>{meta.label}</span></div><p className="mt-1 text-sm leading-5 text-text-secondary">{event.description}</p><p className="mt-1.5 text-[11px] text-muted-foreground">{event.actor}{event.metadata ? ` · ${event.metadata}` : ''}</p></div>
          <time className="text-xs font-semibold tabular-nums text-muted-foreground">{event.time}</time>
        </article>})}
      </div>
    </section>
  </div>
}
