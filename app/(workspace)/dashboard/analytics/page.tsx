'use client'

import { useMemo, useState } from 'react'
import { BarChart3, Download, Filter, X } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DataServiceUnavailable } from '@/components/DataServiceUnavailable'
import { DataSourceBadge } from '@/components/DataSourceBadge'
import { PageHeader } from '@/components/PageHeader'
import { useDashboardSummary } from '@/lib/hooks'
import { downloadTextFile, toCsv } from '@/lib/download'
import { useToast } from '@/components/ToastProvider'

export default function AnalyticsPage() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [metric, setMetric] = useState<'prevalensi' | 'jumlahStunting' | 'totalAnak'>('prevalensi')
  const [threshold, setThreshold] = useState(0)
  const { notify } = useToast()
  const { data, isLoading, isError, error } = useDashboardSummary({})

  const rows = data?.topRegions ?? []
  const visible = useMemo(() => rows.filter((row) => Number(row[metric]) >= threshold), [rows, metric, threshold])
  const exportData = () => {
    downloadTextFile('stuntlytics-analytics.csv', toCsv(visible.map((row) => ({ ...row }))), 'text/csv;charset=utf-8')
    notify({ tone: 'success', title: 'Analytics exported', message: `${visible.length} district rows were downloaded.` })
  }
  const mean = visible.reduce((sum, row) => sum + Number(row[metric]), 0) / Math.max(visible.length, 1)
  const metricLabel = metric === 'prevalensi' ? 'Prevalence %' : metric === 'jumlahStunting' ? 'Stunting records' : 'Total records'

  return <div className="space-y-6">
    <PageHeader icon={<BarChart3 className="size-5"/>} eyebrow="Computed regional comparison" title="Data Analytics" description="Compare district-level aggregations returned by the integrated StuntLytics data-science service.">
      <button type="button" onClick={()=>setFilterOpen((v)=>!v)} className="btn-secondary"><Filter className="size-4"/> Filters</button>
      <button type="button" onClick={exportData} disabled={!visible.length} className="btn-primary disabled:opacity-50"><Download className="size-4"/> Export</button>
    </PageHeader>

    {isError && <DataServiceUnavailable message={error instanceof Error ? error.message : undefined} />}

    {filterOpen && <section className="clinical-card p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-extrabold text-foreground">Analysis filters</h2><p className="mt-1 text-xs text-muted-foreground">Adjust the metric and minimum threshold applied to computed district rows.</p></div><button type="button" onClick={()=>setFilterOpen(false)} className="btn-ghost" aria-label="Close filters"><X className="size-4"/></button></div><div className="mt-4 grid gap-4 sm:grid-cols-2"><label><span className="text-[11px] font-bold text-muted-foreground">Metric</span><select value={metric} onChange={(e)=>setMetric(e.target.value as typeof metric)} className="premium-input mt-1.5 w-full"><option value="prevalensi">Stunting prevalence</option><option value="jumlahStunting">Stunting records</option><option value="totalAnak">Total records</option></select></label><label><span className="flex items-center justify-between text-[11px] font-bold text-muted-foreground"><span>Minimum value</span><strong className="text-foreground">{threshold}</strong></span><input type="range" min="0" max={metric === 'prevalensi' ? 60 : 500} value={threshold} onChange={(e)=>setThreshold(Number(e.target.value))} className="mt-4 w-full accent-primary"/></label></div></section>}

    <div className="flex justify-end"><DataSourceBadge source={data?.source} /></div>

    <section className="grid gap-4 sm:grid-cols-3">
      <div className="kpi-card"><p className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">Visible districts</p><p className="mt-2 text-2xl font-extrabold text-foreground">{isLoading ? '…' : visible.length}</p></div>
      <div className="kpi-card"><p className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">Mean {metricLabel}</p><p className="mt-2 text-2xl font-extrabold text-foreground">{isLoading ? '…' : `${mean.toFixed(1)}${metric === 'prevalensi' ? '%' : ''}`}</p></div>
      <div className="kpi-card"><p className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">Threshold</p><p className="mt-2 text-2xl font-extrabold text-primary">≥ {threshold}{metric === 'prevalensi' ? '%' : ''}</p></div>
    </section>

    <section className="clinical-card overflow-hidden">
      <div className="border-b border-border-soft px-5 py-4"><h2 className="section-title">District comparison</h2><p className="section-description">Highest aggregated districts returned by the current analytics source.</p></div>
      <div className="h-[390px] p-4 sm:p-6">{visible.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={visible} margin={{top:8,right:8,left:-12,bottom:36}}><CartesianGrid vertical={false} stroke="#edf1f6"/><XAxis dataKey="kecamatan" axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" tick={{fontSize:10,fill:'#6b7890'}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#6b7890'}}/><Tooltip contentStyle={{borderRadius:12,border:'1px solid #e2e8f0',fontSize:12}}/><Bar dataKey={metric} fill={metric==='prevalensi'?'#2b6cf6':'#0ea5a0'} radius={[7,7,0,0]} barSize={34} name={metricLabel}/></BarChart></ResponsiveContainer> : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No district rows match the current threshold.</div>}</div>
    </section>
  </div>
}
