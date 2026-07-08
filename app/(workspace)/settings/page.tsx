'use client'

import { useEffect, useState } from 'react'
import { Bell, Database, Save, Settings, ShieldCheck } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { useToast } from '@/components/ToastProvider'

export default function SettingsPage() {
  const { notify } = useToast()
  const [settings, setSettings] = useState({ criticalAlerts: true, weeklyDigest: true, mapAnimation: true, dataValidation: true })

  useEffect(() => {
    try {
      const stored = localStorage.getItem('stuntlytics-settings')
      if (stored) setSettings(JSON.parse(stored))
    } catch {}
  }, [])

  const toggle = (key: keyof typeof settings) => setSettings((current) => ({ ...current, [key]: !current[key] }))
  const save = () => {
    localStorage.setItem('stuntlytics-settings', JSON.stringify(settings))
    notify({ tone: 'success', title: 'Settings saved', message: 'Workspace preferences have been stored on this device.' })
  }

  const rows = [
    { key: 'criticalAlerts' as const, icon: Bell, title: 'Critical alert notifications', text: 'Keep high-priority program signals visible in the notification center.' },
    { key: 'weeklyDigest' as const, icon: Database, title: 'Weekly program digest', text: 'Prepare a summary of monitoring changes and open follow-up items.' },
    { key: 'mapAnimation' as const, icon: Settings, title: 'Spatial flow animation', text: 'Animate directional risk-signal overlays when motion is allowed.' },
    { key: 'dataValidation' as const, icon: ShieldCheck, title: 'Strict data validation cues', text: 'Show stronger warnings when completeness or validation checks are weak.' },
  ]

  return <div className="space-y-6">
    <PageHeader icon={<Settings className="size-5"/>} eyebrow="Workspace preferences" title="Settings" description="Configure local display and monitoring preferences for the StuntLytics workspace.">
      <button type="button" onClick={save} className="btn-primary"><Save className="size-4"/> Save changes</button>
    </PageHeader>
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <article className="clinical-card overflow-hidden">
        <div className="border-b border-border-soft px-5 py-4"><h2 className="section-title">Monitoring preferences</h2><p className="section-description">These settings are persisted locally until backend user preferences are connected.</p></div>
        <div className="divide-y divide-border-soft">{rows.map((row) => { const Icon=row.icon; return <div key={row.key} className="flex items-center gap-4 p-5"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-4.5"/></span><div className="min-w-0 flex-1"><p className="text-sm font-bold text-foreground">{row.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{row.text}</p></div><button type="button" onClick={() => toggle(row.key)} className={`relative h-6 w-11 rounded-full transition ${settings[row.key] ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`} aria-pressed={settings[row.key]} aria-label={`Toggle ${row.title}`}><span className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition ${settings[row.key] ? 'left-6' : 'left-1'}`}/></button></div>})}</div>
      </article>
      <aside className="space-y-4">
        <article className="clinical-card p-5"><p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-primary">Data connection</p><h2 className="mt-2 text-base font-extrabold text-foreground">Operational</h2><p className="mt-2 text-xs leading-5 text-muted-foreground">Frontend services are ready. Backend connectivity still depends on your configured API endpoint.</p><div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-success"><span className="size-2 rounded-full bg-success"/> Interface ready</div></article>
        <article className="rounded-2xl border border-warning/20 bg-warning/5 p-5"><p className="text-sm font-bold text-foreground">Privacy reminder</p><p className="mt-2 text-xs leading-5 text-text-secondary">Avoid exposing identifiable child health records in analytics views unless access controls and consent requirements are satisfied.</p></article>
      </aside>
    </section>
  </div>
}
