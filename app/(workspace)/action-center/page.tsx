'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AlertTriangle, ArrowRight, CheckCircle2, ClipboardCheck, Clock3, MapPinned, Play, ShieldAlert, Sparkles, Users } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { interventionItems, InterventionItem } from '@/lib/interventions'
import { useToast } from '@/components/ToastProvider'
import { cn } from '@/lib/utils'

const priorityStyles = { critical: 'bg-danger/8 text-danger border-danger/15', high: 'bg-warning/8 text-warning border-warning/15', medium: 'bg-info/8 text-info border-info/15' }
const statusLabels = { triage: 'Needs triage', planned: 'Planned', 'in-progress': 'In progress', verification: 'Verification' }

export default function ActionCenterPage() {
  const [scenario, setScenario] = useState(68)
  const [scenarioRun, setScenarioRun] = useState<number | null>(null)
  const [selectedCase, setSelectedCase] = useState<InterventionItem | null>(null)
  const { notify } = useToast()
  return <div className="space-y-7">
    <PageHeader icon={<ClipboardCheck className="size-5" />} eyebrow="From insight to intervention" title="Early Warning & Action Center" description="Convert risk signals into accountable response workflows, ownership, deadlines, and verification—without presenting AI output as a clinical diagnosis.">
      <Link href="/risk-map" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border bg-card px-3.5 text-xs font-semibold text-foreground shadow-sm hover:text-primary"><MapPinned className="size-4" /> Open risk map</Link>
    </PageHeader>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="clinical-card p-5"><span className="flex size-9 items-center justify-center rounded-xl bg-danger/8 text-danger"><ShieldAlert className="size-4"/></span><p className="mt-4 text-xs font-semibold text-muted-foreground">Critical signals</p><p className="mt-1 text-3xl font-bold text-foreground">1</p><p className="mt-1 text-xs text-danger">Human review required</p></div>
      <div className="clinical-card p-5"><span className="flex size-9 items-center justify-center rounded-xl bg-warning/8 text-warning"><Clock3 className="size-4"/></span><p className="mt-4 text-xs font-semibold text-muted-foreground">Due this week</p><p className="mt-1 text-3xl font-bold text-foreground">3</p><p className="mt-1 text-xs text-text-secondary">Across response teams</p></div>
      <div className="clinical-card p-5"><span className="flex size-9 items-center justify-center rounded-xl bg-secondary/10 text-secondary"><Users className="size-4"/></span><p className="mt-4 text-xs font-semibold text-muted-foreground">Assigned workflows</p><p className="mt-1 text-3xl font-bold text-foreground">4</p><p className="mt-1 text-xs text-text-secondary">Ownership visible</p></div>
      <div className="clinical-card p-5"><span className="flex size-9 items-center justify-center rounded-xl bg-success/8 text-success"><CheckCircle2 className="size-4"/></span><p className="mt-4 text-xs font-semibold text-muted-foreground">Verification rate</p><p className="mt-1 text-3xl font-bold text-foreground">84%</p><p className="mt-1 text-xs text-success">+6.2% this cycle</p></div>
    </section>

    <section className="grid gap-5 xl:grid-cols-12">
      <article className="clinical-card overflow-hidden xl:col-span-8">
        <div className="flex items-center justify-between border-b border-border-soft px-5 py-4"><div><h2 className="font-semibold text-foreground">Priority response board</h2><p className="mt-0.5 text-xs text-muted-foreground">Evidence → owner → action → verification</p></div><span className="rounded-lg bg-primary/8 px-2.5 py-1 text-[11px] font-semibold text-primary">4 active</span></div>
        <div className="divide-y divide-border-soft">
          {interventionItems.map((item)=><article key={item.id} className="p-5 transition hover:bg-surface-blue/40">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-[11px] font-bold text-muted-foreground">{item.id}</span><span className={cn('rounded-md border px-2 py-0.5 text-[10px] font-semibold capitalize',priorityStyles[item.priority])}>{item.priority}</span><span className="rounded-md border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold text-text-secondary">{statusLabels[item.status]}</span></div><h3 className="mt-2 text-sm font-semibold text-foreground">{item.title}</h3><p className="mt-1 text-xs leading-5 text-text-secondary">{item.region} · {item.evidence}</p></div>
              <div className="shrink-0 text-left lg:text-right"><p className="text-xs font-semibold text-foreground">{item.owner}</p><p className="mt-1 text-[11px] text-muted-foreground">Due {item.due}</p></div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end"><div><div className="mb-1.5 flex items-center justify-between text-[11px]"><span className="font-semibold text-muted-foreground">Workflow progress</span><span className="font-bold text-foreground">{item.progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{width:`${item.progress}%`}}/></div></div><span className="rounded-lg bg-warning/8 px-2.5 py-1.5 text-[11px] font-semibold text-warning">{item.signal}</span><button type="button" onClick={()=>setSelectedCase(item)} className="btn-secondary min-h-9 px-3">Open case</button></div>
          </article>)}
        </div>
      </article>

      <aside className="space-y-5 xl:col-span-4">
        <article className="clinical-card overflow-hidden"><div className="clinical-surface border-b border-border-soft p-5"><div className="flex items-center gap-2"><span className="flex size-9 items-center justify-center rounded-xl bg-card/80 text-primary shadow-sm"><Sparkles className="size-4"/></span><div><h2 className="text-sm font-semibold text-foreground">Impact scenario studio</h2><p className="text-[11px] text-muted-foreground">Illustrative planning aid</p></div></div></div><div className="p-5"><p className="text-sm leading-6 text-text-secondary">Explore how prioritization coverage could change under a higher outreach completion scenario. This is not a causal forecast.</p><label className="mt-5 block"><span className="flex items-center justify-between text-xs font-semibold text-foreground"><span>Outreach completion</span><span>{scenario}%</span></span><input type="range" min="35" max="95" value={scenario} onChange={(e)=>setScenario(Number(e.target.value))} className="mt-3 w-full accent-primary"/></label><div className="mt-5 rounded-xl border border-secondary/15 bg-surface-mint p-4"><p className="text-[11px] font-semibold uppercase tracking-wide text-secondary">Illustrative reach</p><p className="mt-1 text-2xl font-bold text-foreground">{Math.round(scenario*1.42).toLocaleString()} families</p><p className="mt-1 text-xs text-text-secondary">Based on current demo planning assumptions</p></div><button type="button" onClick={()=>{const reach=Math.round(scenario*1.42);setScenarioRun(reach);notify({tone:'success',title:'Scenario calculated',message:`Illustrative reach updated to ${reach.toLocaleString()} families.`})}} className="btn-primary mt-4 w-full"><Play className="size-4"/> Run scenario</button>{scenarioRun!==null && <p className="mt-3 rounded-xl border border-primary/15 bg-primary/5 p-3 text-[11px] leading-5 text-text-secondary">Scenario output: approximately <strong className="text-foreground">{scenarioRun.toLocaleString()} families</strong> reached under the selected completion assumption. Planning illustration only.</p>}</div></article>
        <article className="clinical-card p-5"><div className="flex items-start gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-warning/8 text-warning"><AlertTriangle className="size-4"/></span><div><h2 className="text-sm font-semibold text-foreground">Safety guardrail</h2><p className="mt-1 text-xs leading-5 text-text-secondary">Critical recommendations remain reviewable and require accountable human confirmation before operational action.</p><Link href="/activity" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">View audit trail <ArrowRight className="size-3.5"/></Link></div></div></article>
      </aside>
    </section>
    {selectedCase && <div className="fixed inset-0 z-[80] flex items-end justify-end bg-slate-950/35 backdrop-blur-[2px]" onClick={()=>setSelectedCase(null)}><aside className="h-full w-full max-w-md overflow-y-auto bg-card p-6 shadow-2xl" onClick={(e)=>e.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-primary">{selectedCase.id}</p><h2 className="mt-2 text-xl font-extrabold text-foreground">{selectedCase.title}</h2><p className="mt-2 text-sm text-muted-foreground">{selectedCase.region}</p></div><button type="button" onClick={()=>setSelectedCase(null)} className="btn-ghost">Close</button></div><div className="mt-6 space-y-4"><div className="rounded-xl bg-muted p-4"><p className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">Evidence</p><p className="mt-2 text-sm leading-6 text-text-secondary">{selectedCase.evidence}</p></div><div className="grid grid-cols-2 gap-3"><div className="clinical-card p-4"><p className="text-[10px] font-bold text-muted-foreground">Owner</p><p className="mt-2 text-xs font-extrabold text-foreground">{selectedCase.owner}</p></div><div className="clinical-card p-4"><p className="text-[10px] font-bold text-muted-foreground">Due</p><p className="mt-2 text-xs font-extrabold text-foreground">{selectedCase.due}</p></div></div><button type="button" onClick={()=>{notify({tone:'success',title:'Case acknowledged',message:`${selectedCase.id} has been marked for accountable review in this demo.`});setSelectedCase(null)}} className="btn-primary w-full">Acknowledge for review</button></div></aside></div>}
  </div>
}
