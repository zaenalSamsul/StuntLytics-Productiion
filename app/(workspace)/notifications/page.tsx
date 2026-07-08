'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, BellRing, BrainCircuit, Check, CheckCircle2, Database, ExternalLink, Filter, Siren } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { AppNotification, initialNotifications, notificationStorageKey, NotificationSeverity } from '@/lib/notifications'
import { cn } from '@/lib/utils'

const severityMeta = {
  critical: { label: 'Critical', icon: Siren, className: 'border-danger/20 bg-danger/8 text-danger' },
  warning: { label: 'Warning', icon: AlertTriangle, className: 'border-warning/20 bg-warning/8 text-warning' },
  info: { label: 'Insight', icon: BrainCircuit, className: 'border-info/20 bg-info/8 text-info' },
  success: { label: 'Resolved', icon: CheckCircle2, className: 'border-success/20 bg-success/8 text-success' },
}

type FilterValue = 'all' | 'unread' | NotificationSeverity

export default function NotificationsPage() {
  const [filter, setFilter] = useState<FilterValue>('all')
  const [readIds, setReadIds] = useState<Set<string>>(new Set(initialNotifications.filter((item) => item.read).map((item) => item.id)))

  useEffect(() => {
    try {
      const stored = localStorage.getItem(notificationStorageKey)
      if (stored) setReadIds(new Set(JSON.parse(stored)))
    } catch {}
  }, [])

  const notifications = useMemo(() => initialNotifications.map((item) => ({ ...item, read: readIds.has(item.id) })), [readIds])
  const visible = notifications.filter((item) => filter === 'all' ? true : filter === 'unread' ? !item.read : item.severity === filter)
  const unread = notifications.filter((item) => !item.read).length
  const actionRequired = notifications.filter((item) => item.requiresAction && !item.read).length

  const persist = (next: Set<string>) => {
    setReadIds(next)
    try { localStorage.setItem(notificationStorageKey, JSON.stringify([...next])) } catch {}
  }

  return (
    <div className="space-y-7">
      <PageHeader icon={<BellRing className="size-5" />} eyebrow="Priority-aware monitoring" title="Notification Center" description="Triage risk signals, AI insights, intervention follow-ups, and system events from one auditable workspace.">
        <button type="button" onClick={() => persist(new Set(notifications.map((item) => item.id)))} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border bg-card px-3.5 text-xs font-semibold text-foreground shadow-sm transition hover:border-primary/25 hover:text-primary"><Check className="size-4" /> Mark all read</button>
      </PageHeader>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="clinical-card p-5"><p className="text-xs font-semibold text-muted-foreground">Unread alerts</p><p className="mt-2 text-3xl font-bold tabular-nums text-foreground">{unread}</p><p className="mt-1 text-xs text-text-secondary">Across monitoring channels</p></div>
        <div className="clinical-card p-5"><p className="text-xs font-semibold text-muted-foreground">Action required</p><p className="mt-2 text-3xl font-bold tabular-nums text-danger">{actionRequired}</p><p className="mt-1 text-xs text-text-secondary">Needs human review</p></div>
        <div className="clinical-card p-5"><p className="text-xs font-semibold text-muted-foreground">Escalation policy</p><p className="mt-2 text-lg font-bold text-foreground">Active</p><p className="mt-1 text-xs text-text-secondary">Critical → review workflow</p></div>
      </section>

      <section className="clinical-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border-soft p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><Filter className="size-4 text-primary" /> Alert stream</div>
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'unread', 'critical', 'warning', 'info', 'success'] as FilterValue[]).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={cn('rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold capitalize transition', filter === item ? 'border-primary/20 bg-primary/8 text-primary' : 'border-border bg-card text-muted-foreground hover:bg-muted')}>{item}</button>)}
          </div>
        </div>
        <div className="divide-y divide-border-soft">
          {visible.map((notification) => {
            const meta = severityMeta[notification.severity]
            const Icon = meta.icon
            return <article key={notification.id} className={cn('grid gap-4 p-4 transition hover:bg-surface-blue/50 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:p-5', !notification.read && 'bg-primary/[0.025]')}>
              <span className={cn('flex size-10 items-center justify-center rounded-xl border', meta.className)}><Icon className="size-[18px]" /></span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-semibold text-foreground">{notification.title}</h2>{!notification.read && <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">New</span>}<span className={cn('rounded-md border px-2 py-0.5 text-[10px] font-semibold', meta.className)}>{meta.label}</span></div>
                <p className="mt-1.5 max-w-3xl text-sm leading-6 text-text-secondary">{notification.message}</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground"><span>{notification.relativeTime}</span>{notification.region && <span>• {notification.region}</span>}<span>• {notification.category}</span></div>
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:justify-center">
                {!notification.read && <button type="button" onClick={() => persist(new Set(readIds).add(notification.id))} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-[11px] font-semibold text-foreground hover:text-primary"><Check className="size-3.5" /> Read</button>}
                {notification.href && <Link href={notification.href} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-[11px] font-semibold text-white hover:bg-primary-dark">Open <ExternalLink className="size-3.5" /></Link>}
              </div>
            </article>
          })}
        </div>
      </section>
    </div>
  )
}
