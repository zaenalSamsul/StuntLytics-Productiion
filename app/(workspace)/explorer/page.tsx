'use client'

import { useMemo, useState } from 'react'
import { ArrowDownAZ, Database, Download, Search, SlidersHorizontal } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { downloadTextFile, toCsv } from '@/lib/download'
import { useToast } from '@/components/ToastProvider'

const explorerData = [
  { id: 1, regency: 'Kota Bandung', district: 'Andir', children: 1024, stunting: 245, prevalence: 23.9, coverage: 81.2 },
  { id: 2, regency: 'Kab. Bandung', district: 'Cileunyi', children: 856, stunting: 187, prevalence: 21.8, coverage: 84.5 },
  { id: 3, regency: 'Kab. Indramayu', district: 'Kandanghaur', children: 712, stunting: 248, prevalence: 34.8, coverage: 66.2 },
  { id: 4, regency: 'Kab. Garut', district: 'Cisompet', children: 648, stunting: 202, prevalence: 31.2, coverage: 69.4 },
  { id: 5, regency: 'Kab. Cianjur', district: 'Cibeber', children: 704, stunting: 203, prevalence: 28.9, coverage: 72.1 },
  { id: 6, regency: 'Kab. Subang', district: 'Pusakanagara', children: 936, stunting: 252, prevalence: 26.9, coverage: 75.6 },
  { id: 7, regency: 'Kab. Bogor', district: 'Leuwiliang', children: 1186, stunting: 298, prevalence: 25.1, coverage: 79.3 },
  { id: 8, regency: 'Kota Cirebon', district: 'Harjamukti', children: 598, stunting: 137, prevalence: 22.9, coverage: 82.4 },
]

type SortMode = 'default' | 'risk-desc' | 'name'

export default function ExplorerPage() {
  const [query, setQuery] = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('default')
  const [view, setView] = useState<'district' | 'regency'>('district')
  const { notify } = useToast()

  const rows = useMemo(() => {
    const filtered = explorerData.filter((row) => `${row.regency} ${row.district}`.toLowerCase().includes(query.toLowerCase()))
    if (sortMode === 'risk-desc') return [...filtered].sort((a, b) => b.prevalence - a.prevalence)
    if (sortMode === 'name') return [...filtered].sort((a, b) => a.district.localeCompare(b.district))
    return filtered
  }, [query, sortMode])

  const exportCsv = () => {
    downloadTextFile('stuntlytics-regional-data.csv', toCsv(rows.map(({ id: _id, ...row }) => row)), 'text/csv;charset=utf-8')
    notify({ tone: 'success', title: 'CSV exported', message: `${rows.length} visible records were prepared for download.` })
  }

  return <div className="space-y-6">
    <PageHeader icon={<Database className="size-5" />} eyebrow="Regional records" title="Data Explorer" description="Search, rank, and export district-level child growth program indicators for operational review.">
      <button type="button" onClick={exportCsv} className="btn-primary"><Download className="size-4"/> Export CSV</button>
    </PageHeader>

    <section className="grid gap-4 sm:grid-cols-3">
      <div className="kpi-card"><p className="text-[10px] font-extrabold uppercase tracking-[.09em] text-muted-foreground">Visible children</p><p className="mt-2 text-2xl font-extrabold text-foreground">{rows.reduce((sum,row)=>sum+row.children,0).toLocaleString()}</p><p className="mt-1 text-[11px] text-muted-foreground">Across current search results</p></div>
      <div className="kpi-card"><p className="text-[10px] font-extrabold uppercase tracking-[.09em] text-muted-foreground">Mean prevalence</p><p className="mt-2 text-2xl font-extrabold text-foreground">{(rows.reduce((sum,row)=>sum+row.prevalence,0)/Math.max(rows.length,1)).toFixed(1)}%</p><p className="mt-1 text-[11px] text-muted-foreground">Descriptive, not diagnostic</p></div>
      <div className="kpi-card"><p className="text-[10px] font-extrabold uppercase tracking-[.09em] text-muted-foreground">High-priority areas</p><p className="mt-2 text-2xl font-extrabold text-danger">{rows.filter((row)=>row.prevalence>=30).length}</p><p className="mt-1 text-[11px] text-muted-foreground">At or above 30% in demo data</p></div>
    </section>

    <section className="clinical-card overflow-hidden">
      <div className="grid gap-3 border-b border-border-soft p-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center lg:px-5">
        <label className="relative max-w-2xl"><span className="sr-only">Search regional data</span><Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-soft"/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search regency or district…" className="premium-input w-full pl-10"/></label>
        <div className="flex rounded-xl border border-border bg-muted/60 p-1">
          {(['district','regency'] as const).map((item)=><button key={item} type="button" onClick={()=>setView(item)} className={`min-h-8 rounded-lg px-3 text-[11px] font-bold capitalize transition ${view===item?'bg-white text-primary shadow-sm dark:bg-card':'text-muted-foreground'}`}>{item}</button>)}
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-muted-foreground"/>
          <select value={sortMode} onChange={(e)=>setSortMode(e.target.value as SortMode)} className="premium-input min-h-9 py-0 text-xs">
            <option value="default">Default order</option><option value="risk-desc">High risk first</option><option value="name">District A–Z</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="premium-table min-w-[820px]">
          <thead><tr><th>Regency</th><th>District</th><th className="text-right">Children</th><th className="text-right">Stunting cases</th><th>Prevalence</th><th>Service coverage</th><th>Status</th></tr></thead>
          <tbody>{rows.map((row) => {
            const status = row.prevalence >= 33 ? 'critical' : row.prevalence >= 28 ? 'attention' : row.prevalence >= 24 ? 'monitoring' : 'stable'
            return <tr key={row.id}><td className="font-bold text-foreground">{row.regency}</td><td className="text-text-secondary">{view==='regency'?'Aggregated view':row.district}</td><td className="text-right font-semibold tabular-nums text-foreground">{row.children.toLocaleString()}</td><td className="text-right font-semibold tabular-nums text-foreground">{row.stunting.toLocaleString()}</td><td><div className="flex items-center gap-2"><span className="w-11 font-extrabold tabular-nums text-foreground">{row.prevalence}%</span><div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${row.prevalence>=33?'bg-danger':row.prevalence>=28?'bg-warning':'bg-primary'}`} style={{width:`${Math.min(row.prevalence*2.4,100)}%`}}/></div></div></td><td><span className="font-bold text-secondary">{row.coverage}%</span></td><td><StatusBadge status={status}/></td></tr>
          })}</tbody>
        </table>
      </div>
      {rows.length===0 && <div className="p-10 text-center"><ArrowDownAZ className="mx-auto size-8 text-text-soft"/><p className="mt-3 text-sm font-bold text-foreground">No matching records</p><p className="mt-1 text-xs text-muted-foreground">Try another regency or district name.</p></div>}
      <div className="flex flex-col gap-2 border-t border-border-soft px-5 py-3 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>Showing {rows.length} of {explorerData.length} demo records</span><span>Updated · June 2026 monitoring cycle</span></div>
    </section>
  </div>
}
