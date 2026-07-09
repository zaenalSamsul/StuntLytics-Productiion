'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, BarChart3, Download, FlaskConical, RefreshCw, ShieldCheck, TrendingDown, TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DataServiceUnavailable } from '@/components/DataServiceUnavailable'
import { DataSourceBadge } from '@/components/DataSourceBadge'
import { PageHeader } from '@/components/PageHeader'
import { Skeleton } from '@/components/Skeleton'
import { CorrelationResponse, dashboardApi } from '@/lib/api'
import { downloadTextFile, toCsv } from '@/lib/download'

export default function CorrelationPage() {
  const [data, setData] = useState<CorrelationResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'signed' | 'magnitude'>('signed')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    dashboardApi.getCorrelationAnalysis({}).then((response) => {
      if (active) setData(response)
    }).catch((reason) => {
      if (active) setError(reason instanceof Error ? reason.message : 'Unable to load factor analysis')
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [refreshKey])

  const factors = useMemo(() => (data?.factors ?? []).map((factor) => ({
    ...factor,
    displayValue: mode === 'magnitude' ? factor.magnitude : factor.coefficient,
  })), [data?.factors, mode])

  const exportFactors = () => {
    if (!data?.factors.length) return
    downloadTextFile('stuntlytics-factor-analysis.csv', toCsv(data.factors.map((factor) => ({ ...factor }))), 'text/csv;charset=utf-8')
  }

  const strongest = data?.factors[0]
  const inverse = data?.factors.filter((factor) => factor.coefficient < 0).sort((a, b) => Math.abs(b.coefficient) - Math.abs(a.coefficient))[0]
  const positive = data?.factors.filter((factor) => factor.coefficient > 0).sort((a, b) => Math.abs(b.coefficient) - Math.abs(a.coefficient))[0]

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<BarChart3 className="size-5" />}
        eyebrow="Data-science association review"
        title="Factor & Trend Analysis"
        description="Compute monthly stunting trends and Pearson correlations from the numeric sample exposed by the original StuntLytics analytics engine."
      >
        <button type="button" onClick={() => setRefreshKey((value) => value + 1)} className="btn-secondary"><RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
        <button type="button" onClick={exportFactors} disabled={!data?.factors.length} className="btn-primary disabled:opacity-50"><Download className="size-4" /> Export factors</button>
      </PageHeader>

      {error && <DataServiceUnavailable message={error} />}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="kpi-card"><div className="flex items-start justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-muted-foreground">Target field</p><p className="mt-2 text-lg font-extrabold tracking-[-.03em] text-foreground">{data?.target ?? '—'}</p></div><span className="kpi-icon bg-primary/10 text-primary"><FlaskConical className="size-5" /></span></div><p className="mt-3 text-[11px] leading-5 text-muted-foreground">Correlation target selected from available numeric fields.</p></article>
        <article className="kpi-card"><div className="flex items-start justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-muted-foreground">Sample size</p><p className="mt-2 text-[26px] font-extrabold tracking-[-.04em] text-foreground">{data?.sampleSize.toLocaleString() ?? '—'}</p></div><span className="kpi-icon bg-secondary/10 text-secondary"><ShieldCheck className="size-5" /></span></div><p className="mt-3 text-[11px] leading-5 text-muted-foreground">Numeric rows used after active source filtering.</p></article>
        <article className="kpi-card"><div className="flex items-start justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-muted-foreground">Strongest positive</p><p className="mt-2 text-lg font-extrabold tracking-[-.03em] text-foreground">{positive ? positive.coefficient.toFixed(2) : '—'}</p></div><span className="kpi-icon bg-danger/10 text-danger"><TrendingUp className="size-5" /></span></div><p className="mt-3 truncate text-[11px] font-semibold text-muted-foreground">{positive?.factor ?? 'No positive association'}</p></article>
        <article className="kpi-card"><div className="flex items-start justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-muted-foreground">Strongest inverse</p><p className="mt-2 text-lg font-extrabold tracking-[-.03em] text-foreground">{inverse ? inverse.coefficient.toFixed(2) : '—'}</p></div><span className="kpi-icon bg-success/10 text-success"><TrendingDown className="size-5" /></span></div><p className="mt-3 truncate text-[11px] font-semibold text-muted-foreground">{inverse?.factor ?? 'No inverse association'}</p></article>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="section-title">Computed analytical outputs</h2><p className="section-description">Association strength and monthly trend are recalculated from the active data source.</p></div>
        <DataSourceBadge source={data?.source} />
      </div>

      <section className="grid gap-5 xl:grid-cols-12">
        <article className="clinical-card overflow-hidden xl:col-span-7">
          <div className="flex flex-col gap-3 border-b border-border-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="section-title">Factor association</h2><p className="section-description">Top numeric associations with {data?.target ?? 'the selected target'}.</p></div><div className="inline-flex rounded-xl border border-border bg-muted p-1"><button type="button" onClick={() => setMode('signed')} className={`rounded-lg px-3 py-1.5 text-[10px] font-extrabold ${mode === 'signed' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}>Direction</button><button type="button" onClick={() => setMode('magnitude')} className={`rounded-lg px-3 py-1.5 text-[10px] font-extrabold ${mode === 'magnitude' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}>Magnitude</button></div></div>
          <div className="h-[390px] p-4 sm:p-5">
            {loading ? <Skeleton className="h-full w-full" /> : factors.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={factors} layout="vertical" margin={{ top: 8, right: 20, left: 30, bottom: 0 }}><CartesianGrid horizontal={false} stroke="#edf1f6"/><XAxis type="number" domain={mode === 'signed' ? [-1, 1] : [0, 1]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#7b8799' }}/><YAxis type="category" dataKey="factor" width={145} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#667085' }}/><Tooltip formatter={(value) => Number(value).toFixed(3)} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}/><Bar dataKey="displayValue" radius={[0, 6, 6, 0]}>{factors.map((entry) => <Cell key={entry.field} fill={entry.coefficient >= 0 ? '#d74646' : '#1d9b67'} />)}</Bar></BarChart></ResponsiveContainer> : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No sufficient numeric correlation sample is available.</div>}
          </div>
        </article>

        <article className="clinical-card overflow-hidden xl:col-span-5">
          <div className="border-b border-border-soft px-5 py-4"><h2 className="section-title">Monthly stunting trend</h2><p className="section-description">Proportion computed for each available month.</p></div>
          <div className="h-[390px] p-4 sm:p-5">
            {data?.trend.length ? <ResponsiveContainer width="100%" height="100%"><LineChart data={data.trend} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}><CartesianGrid vertical={false} stroke="#edf1f6"/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#7b8799' }}/><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#7b8799' }}/><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}/><Line type="monotone" dataKey="prevalence" stroke="#2b6cf6" strokeWidth={2.6} dot={{ r: 3 }} name="Stunting %" /></LineChart></ResponsiveContainer> : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No monthly trend available.</div>}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-12">
        <article className="clinical-card p-5 sm:p-6 xl:col-span-7">
          <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><ShieldCheck className="size-5" /></span><div><h2 className="text-sm font-extrabold text-foreground">Method and interpretation</h2><p className="mt-1 text-xs leading-6 text-text-secondary">{data?.method ?? 'Pearson correlation on numeric sample'}. Signed values show direction; magnitude shows strength. The target and available fields depend on the source dataset.</p></div></div>
          {strongest && <div className="mt-5 rounded-xl border border-border bg-muted/50 p-4"><p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-muted-foreground">Strongest current association</p><div className="mt-2 flex flex-wrap items-baseline gap-2"><span className="text-lg font-extrabold text-foreground">{strongest.factor}</span><span className={`text-sm font-extrabold ${strongest.coefficient >= 0 ? 'text-danger' : 'text-success'}`}>{strongest.coefficient >= 0 ? '+' : ''}{strongest.coefficient.toFixed(3)}</span></div></div>}
        </article>
        <article className="rounded-2xl border border-warning/20 bg-warning/5 p-5 sm:p-6 xl:col-span-5"><div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning"/><div><h2 className="text-sm font-extrabold text-foreground">Association is not causation</h2><p className="mt-2 text-xs leading-6 text-text-secondary">{data?.guardrail ?? 'Review data quality and domain context before action.'} Correlations may reflect confounding, measurement patterns, selection bias, or shared determinants.</p></div></div></article>
      </section>
    </div>
  )
}
