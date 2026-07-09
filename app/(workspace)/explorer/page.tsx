'use client'

import { useEffect, useMemo, useState } from 'react'
import { Database, Download, Filter, RefreshCw, Search, SlidersHorizontal } from 'lucide-react'
import { DataServiceUnavailable } from '@/components/DataServiceUnavailable'
import { DataSourceBadge } from '@/components/DataSourceBadge'
import { PageHeader } from '@/components/PageHeader'
import { Skeleton } from '@/components/Skeleton'
import { dashboardApi, ExplorerResponse } from '@/lib/api'
import { downloadTextFile, toCsv } from '@/lib/download'

const educationOptions = ['', 'Tidak Sekolah', 'SD', 'SMP', 'SMA', 'Diploma', 'S1', 'S2/S3']

export default function ExplorerPage() {
  const [data, setData] = useState<ExplorerResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [education, setEducation] = useState('')
  const [asi, setAsi] = useState('Semua')
  const [water, setWater] = useState('Semua')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    dashboardApi.getExplorerData({}, {
      pendidikanIbu: education || undefined,
      asiEksklusif: asi,
      aksesAir: water,
      limit: 500,
    }).then((response) => {
      if (active) setData(response)
    }).catch((reason) => {
      if (active) setError(reason instanceof Error ? reason.message : 'Unable to load explorer data')
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [education, asi, water, refreshKey])

  const records = useMemo(() => {
    const source = data?.records ?? []
    const term = search.trim().toLowerCase()
    if (!term) return source
    return source.filter((row) => Object.values(row).some((value) => String(value ?? '').toLowerCase().includes(term)))
  }, [data?.records, search])

  const headers = useMemo(() => records[0] ? Object.keys(records[0]) : [], [records])

  const exportCsv = () => {
    const csv = toCsv(records as Array<Record<string, string | number | boolean | null | undefined>>)
    downloadTextFile(`stuntlytics-explorer-${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv;charset=utf-8')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Database className="size-5" />}
        eyebrow="Data-science drill-down"
        title="Data Explorer"
        description="Inspect the record-level fields used by the original StuntLytics analytics pipeline, apply maternal and household filters, and export the visible evidence set."
      >
        <button type="button" onClick={() => setRefreshKey((value) => value + 1)} className="btn-secondary"><RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
        <button type="button" onClick={exportCsv} disabled={!records.length} className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"><Download className="size-4" /> Export CSV</button>
      </PageHeader>

      {error && <DataServiceUnavailable message={error} />}

      <section className="clinical-card p-4 sm:p-5">
        <div className="grid gap-3 xl:grid-cols-[minmax(260px,1fr)_repeat(3,minmax(150px,220px))]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="premium-input pl-9" placeholder="Search any visible record…" />
          </label>
          <label>
            <span className="sr-only">Maternal education</span>
            <select value={education} onChange={(event) => setEducation(event.target.value)} className="premium-input">
              <option value="">All education levels</option>
              {educationOptions.filter(Boolean).map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span className="sr-only">Exclusive breastfeeding</span>
            <select value={asi} onChange={(event) => setAsi(event.target.value)} className="premium-input">
              <option value="Semua">All breastfeeding records</option>
              <option value="Ya">Exclusive breastfeeding: Yes</option>
              <option value="Tidak">Exclusive breastfeeding: No</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Water access</span>
            <select value={water} onChange={(event) => setWater(event.target.value)} className="premium-input">
              <option value="Semua">All water-access records</option>
              <option value="Ada">Safe water: Available</option>
              <option value="Tidak Ada">Safe water: Not available</option>
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-col gap-3 border-t border-border-soft pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Filter className="size-3.5" /> {records.length.toLocaleString()} visible records</span>
            <span className="text-border">•</span>
            <span>{data?.count.toLocaleString() ?? '—'} records after backend filters</span>
          </div>
          <DataSourceBadge source={data?.source} />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-12">
        <article className="clinical-card overflow-hidden xl:col-span-9">
          <div className="flex items-center justify-between border-b border-border-soft px-5 py-4">
            <div><h2 className="section-title">Record evidence</h2><p className="section-description">Sorted by the source pipeline; the fallback demo uses the same analytical field concepts.</p></div>
            <SlidersHorizontal className="size-4 text-muted-foreground" />
          </div>
          <div className="max-h-[620px] overflow-auto">
            {loading ? <div className="space-y-3 p-5">{Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-10 w-full" />)}</div> : records.length ? <table className="premium-table min-w-[1080px]">
              <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
              <tbody>{records.map((row, index) => <tr key={`${String(row['Kabupaten/Kota'] ?? '')}-${String(row.Kecamatan ?? '')}-${index}`}>{headers.map((header) => <td key={header} className={header === 'Status Stunting' ? 'font-bold text-foreground' : ''}>{String(row[header] ?? '—')}</td>)}</tr>)}</tbody>
            </table> : <div className="p-12 text-center text-sm text-muted-foreground">No records match the current filters.</div>}
          </div>
        </article>

        <aside className="space-y-5 xl:col-span-3">
          <article className="clinical-card p-5">
            <h2 className="section-title">Top record concentration</h2>
            <p className="section-description">Five highest regional counts in the filtered evidence set.</p>
            <div className="mt-5 space-y-3">
              {(data?.topCounts ?? []).map((row, index) => {
                const entries = Object.entries(row)
                const label = String(entries.find(([, value]) => typeof value === 'string')?.[1] ?? `Region ${index + 1}`)
                const value = Number(entries.find(([, item]) => typeof item === 'number')?.[1] ?? 0)
                const max = Math.max(...(data?.topCounts ?? []).map((item) => Number(Object.values(item).find((candidate) => typeof candidate === 'number') ?? 0)), 1)
                return <div key={`${label}-${index}`}><div className="flex items-center justify-between gap-3 text-[11px]"><span className="truncate font-bold text-text-secondary">{label}</span><span className="font-extrabold text-foreground">{value}</span></div><div className="mt-1.5 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${Math.max(5, value / max * 100)}%` }} /></div></div>
              })}
            </div>
          </article>

          <article className="rounded-2xl border border-info/20 bg-info/5 p-5">
            <h3 className="text-xs font-extrabold text-foreground">Evidence-use guardrail</h3>
            <p className="mt-2 text-[11px] leading-5 text-text-secondary">Record-level exploration supports quality review and analysis. Do not infer individual diagnosis or causal effect from a filtered table alone.</p>
          </article>
        </aside>
      </section>
    </div>
  )
}
