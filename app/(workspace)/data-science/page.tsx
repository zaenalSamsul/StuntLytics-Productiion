'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Activity, ArrowRight, BrainCircuit, CheckCircle2, Database, FileSearch, FlaskConical, MapPinned, Network, Server, ShieldCheck, Sparkles, TriangleAlert, UsersRound } from 'lucide-react'
import { DataServiceUnavailable } from '@/components/DataServiceUnavailable'
import { DataSourceBadge } from '@/components/DataSourceBadge'
import { PageHeader } from '@/components/PageHeader'
import { dashboardApi, DataSourceInfo, DataStatusResponse, LLMStatus, ModelStatus } from '@/lib/api'

const modules = [
  { icon: Activity, title: 'Executive aggregation', text: 'KPI totals, prevalence, immunisation coverage, safe-water coverage, and workforce context.', href: '/dashboard' },
  { icon: MapPinned, title: 'Regional risk aggregation', text: 'District-level child counts, stunting counts, prevalence, and risk bands for the map layer.', href: '/risk-map' },
  { icon: FileSearch, title: 'Record explorer', text: 'Drill down into source records with maternal education, breastfeeding, and water-access filters.', href: '/explorer' },
  { icon: Network, title: 'Trend & correlation', text: 'Monthly stunting proportions and Pearson correlations across available numeric variables.', href: '/correlation' },
  { icon: UsersRound, title: 'Local ML screening', text: 'Bundled scikit-learn pipeline receives the original 18 maternal, pregnancy, and household inputs.', href: '/prediction' },
  { icon: BrainCircuit, title: 'Grounded evidence insight', text: 'Gemini 2.5 Flash-Lite rewrites aggregated evidence when configured; deterministic evidence remains the fallback.', href: '/insights' },
]

const modelFields = [
  'Maternal height', 'Maternal MUAC', 'Pre-pregnancy BMI', 'Haemoglobin', 'Pregnancy weight gain', 'Maternal age',
  'Pregnancy interval', 'ANC contacts', 'Previous children', 'Iron-tablet adherence', 'Maternal education', 'Parent occupation',
  'Marital status', 'Assistance program', 'Clean-water access', 'Smoke exposure', 'Maternal hypertension', 'Maternal diabetes',
]

export default function DataSciencePage() {
  const [health, setHealth] = useState<{ status: string; source: DataSourceInfo; model: ModelStatus; llm: LLMStatus } | null>(null)
  const [dataStatus, setDataStatus] = useState<DataStatusResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([dashboardApi.getServiceHealth(), dashboardApi.getDataStatus()])
      .then(([healthResponse, statusResponse]) => { setHealth(healthResponse); setDataStatus(statusResponse) })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Data-science service unavailable'))
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader icon={<FlaskConical className="size-5" />} eyebrow="Original analytics, modern delivery" title="Data Science Engine" description="The uploaded StuntLytics analytics project is now the computation layer behind the redesigned clinical workspace—not a separate Streamlit demo.">
        <DataSourceBadge source={health?.source} />
      </PageHeader>

      {error && <DataServiceUnavailable message={error} />}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article className="kpi-card"><div className="flex items-start justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-muted-foreground">Service</p><p className="mt-2 text-xl font-extrabold text-foreground">{health?.status === 'ok' ? 'Operational' : 'Checking…'}</p></div><span className="kpi-icon bg-success/10 text-success"><Server className="size-5" /></span></div><p className="mt-3 text-[11px] leading-5 text-muted-foreground">FastAPI analytics layer proxied through the Next.js application.</p></article>
        <article className="kpi-card"><div className="flex items-start justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-muted-foreground">Data mode</p><p className="mt-2 text-lg font-extrabold text-foreground">{health?.source.label ?? '—'}</p></div><span className="kpi-icon bg-primary/10 text-primary"><Database className="size-5" /></span></div><p className="mt-3 text-[11px] leading-5 text-muted-foreground">Live Elasticsearch when reachable; explicitly labelled deterministic fallback otherwise.</p></article>
        <article className="kpi-card"><div className="flex items-start justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-muted-foreground">ML artifact</p><p className="mt-2 text-xl font-extrabold text-foreground">{health?.model.sizeMb ? `${health.model.sizeMb} MB` : '—'}</p></div><span className="kpi-icon bg-secondary/10 text-secondary"><BrainCircuit className="size-5" /></span></div><p className="mt-3 text-[11px] leading-5 text-muted-foreground">Bundled <code>stunting_pipeline.joblib</code> loaded lazily for inference.</p></article>
        <article className="kpi-card"><div className="flex items-start justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-muted-foreground">Narrative LLM</p><p className="mt-2 text-sm font-extrabold text-foreground">{health?.llm.model ?? 'Gemini 2.5 Flash-Lite'}</p></div><span className="kpi-icon bg-secondary/10 text-secondary"><Sparkles className="size-5" /></span></div><p className="mt-3 text-[11px] leading-5 text-muted-foreground">{health?.llm.configured ? 'API key configured; aggregated evidence only.' : 'Optional free-tier key; deterministic fallback active.'}</p></article>
        <article className="kpi-card"><div className="flex items-start justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-muted-foreground">Feature schema</p><p className="mt-2 text-[26px] font-extrabold text-foreground">18</p></div><span className="kpi-icon bg-warning/10 text-warning"><ShieldCheck className="size-5" /></span></div><p className="mt-3 text-[11px] leading-5 text-muted-foreground">Original maternal, pregnancy, household, access, and condition fields.</p></article>
      </section>

      <section className="clinical-card overflow-hidden">
        <div className="flex flex-col gap-2 border-b border-border-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="section-title">Indexed data inventory</h2><p className="section-description">Automatic Docker ingestion status from Elasticsearch. Document counts make the live source visible instead of implied.</p></div>
          <span className="inline-flex items-center gap-2 text-[11px] font-extrabold text-text-secondary"><span className={`size-2 rounded-full ${dataStatus?.source.live ? 'bg-success' : 'bg-warning'}`} />{dataStatus?.source.live ? 'Live Elasticsearch' : 'Checking source'}</span>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['stunting', 'Primary stunting records'],
            ['nutritionWorkforce', 'Nutrition workforce'],
            ['villageChildren', 'Village child counts'],
            ['modelSample', 'Model sample archive'],
          ].map(([key, label]) => { const item = dataStatus?.indices[key]; return <div key={key} className="rounded-2xl border border-border bg-muted/30 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-extrabold text-foreground">{item?.available ? item.documents.toLocaleString('id-ID') : '—'}</p></div><span className={`flex size-9 items-center justify-center rounded-xl ${item?.available ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}><Database className="size-4" /></span></div><p className="mt-3 truncate text-[10px] font-bold text-text-soft">{item?.index ?? 'Waiting for index'}</p></div> })}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => { const Icon = module.icon; return <Link key={module.title} href={module.href} className="clinical-card group p-5 transition hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><h2 className="mt-4 text-sm font-extrabold text-foreground">{module.title}</h2><p className="mt-2 text-xs leading-6 text-text-secondary">{module.text}</p><span className="mt-4 inline-flex items-center gap-1 text-[11px] font-extrabold text-primary">Open feature <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" /></span></Link> })}
      </section>

      <section className="grid gap-5 xl:grid-cols-12">
        <article className="clinical-card overflow-hidden xl:col-span-7">
          <div className="border-b border-border-soft px-5 py-4"><h2 className="section-title">Prediction feature schema</h2><p className="section-description">Fields are preserved from the uploaded family-prediction form and passed to the serialized preprocessing pipeline.</p></div>
          <div className="grid gap-2 p-5 sm:grid-cols-2 lg:grid-cols-3">{modelFields.map((field, index) => <div key={field} className="flex items-center gap-2 rounded-xl border border-border bg-muted/35 px-3 py-2.5"><span className="flex size-6 items-center justify-center rounded-lg bg-primary/8 text-[9px] font-extrabold text-primary">{String(index + 1).padStart(2, '0')}</span><span className="text-[11px] font-bold text-text-secondary">{field}</span></div>)}</div>
        </article>

        <aside className="space-y-5 xl:col-span-5">
          <article className="rounded-[20px] bg-[#12233b] p-5 text-white sm:p-6"><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#68e1cc]"/><div><h2 className="text-sm font-extrabold">What is genuinely integrated</h2><p className="mt-2 text-xs leading-6 text-white/70">The web pages call the Python service through internal Next.js API routes. Aggregations, record filtering, correlations, risk-map values, and model inference are no longer isolated behind the old Streamlit UI.</p></div></div></article>
          <article className="rounded-2xl border border-warning/20 bg-warning/5 p-5"><div className="flex items-start gap-3"><TriangleAlert className="mt-0.5 size-5 shrink-0 text-warning"/><div><h2 className="text-sm font-extrabold text-foreground">Validation evidence is not bundled</h2><p className="mt-2 text-xs leading-6 text-text-secondary">The uploaded repository contains the serialized model artifact but not the training notebook, held-out metrics, calibration report, or external validation study. This interface therefore does not invent accuracy or clinical-performance claims.</p></div></div></article>
        </aside>
      </section>
    </div>
  )
}
