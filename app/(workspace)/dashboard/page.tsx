'use client'

import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Database,
  HeartPulse,
  MapPinned,
  ShieldCheck,
  Stethoscope,
  UsersRound,
  Waves,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DataServiceUnavailable } from '@/components/DataServiceUnavailable'
import { DataSourceBadge } from '@/components/DataSourceBadge'
import { Skeleton } from '@/components/Skeleton'
import { StatusBadge } from '@/components/StatusBadge'
import { COLORS } from '@/lib/colors'
import { useDashboardSummary } from '@/lib/hooks'

const riskColors: Record<string, string> = {
  Stable: '#1d9b67',
  Monitoring: '#2b6cf6',
  Attention: '#d88716',
  Critical: '#d74646',
}

function KpiCard({ icon, label, value, helper, tone = 'blue' }: { icon: React.ReactNode; label: string; value: string; helper: string; tone?: 'blue' | 'teal' | 'amber' | 'rose' }) {
  const tones = {
    blue: 'bg-primary/10 text-primary',
    teal: 'bg-secondary/10 text-secondary',
    amber: 'bg-warning/10 text-warning',
    rose: 'bg-danger/10 text-danger',
  }
  return (
    <article className="kpi-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.08em] text-muted-foreground">{label}</p>
          <p className="mt-2 text-[26px] font-extrabold tracking-[-.04em] text-foreground">{value}</p>
        </div>
        <span className={`kpi-icon ${tones[tone]}`}>{icon}</span>
      </div>
      <p className="mt-3 text-[11px] font-semibold leading-5 text-muted-foreground">{helper}</p>
    </article>
  )
}

function KpiSkeleton() {
  return <div className="kpi-card space-y-3"><Skeleton className="h-3 w-28" /><Skeleton className="h-8 w-24" /><Skeleton className="h-3 w-40" /></div>
}

function formatMonth(value: string) {
  const parsed = new Date(`${value}-01T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

export default function DashboardHome() {
  const { data, isLoading, isError, error } = useDashboardSummary({})
  const metrics = data?.metrics
  const trendData = (data?.trend ?? []).map((point) => ({ ...point, monthLabel: formatMonth(point.month) }))
  const distributionData = (data?.riskDistribution ?? []).map((item) => ({ ...item, color: riskColors[item.name] ?? COLORS.primary }))
  const topRegions = data?.topRegions ?? []
  const workforce = data?.workforce ?? []
  const criticalCount = topRegions.filter((item) => item.riskLevel === 'critical').length

  return (
    <div className="space-y-6">
      <section className="dashboard-hero relative overflow-hidden rounded-[22px] px-5 pb-16 pt-6 text-white sm:px-7 sm:pb-20 sm:pt-7 lg:px-8">
        <div className="dashboard-hero-grid pointer-events-none absolute inset-0 opacity-80" />
        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[.1em] text-white/70">
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" /> Integrated analytics cycle</span>
              <span className="hidden size-1 rounded-full bg-white/40 sm:block" />
              <span>West Java program</span>
            </div>
            <h1 className="mt-3 text-[28px] font-extrabold leading-tight tracking-[-.045em] sm:text-[34px] lg:text-[38px]">Child growth intelligence, grounded in the data pipeline</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">Monitor prevalence, service continuity, district-level risk, and workforce context using the original StuntLytics data-science engine behind the redesigned health workspace.</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/risk-map" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-extrabold text-[#1746ad] shadow-sm transition hover:bg-blue-50"><MapPinned className="size-4" /> Explore regional risk</Link>
              <Link href="/data-science" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 text-xs font-extrabold text-white backdrop-blur transition hover:bg-white/18"><Database className="size-4" /> View data-science engine</Link>
            </div>
          </div>

          <div className="grid min-w-0 gap-2 sm:grid-cols-3 xl:w-[470px]">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-[.08em] text-white/60">Data source</p>
              <p className="mt-2 text-sm font-extrabold">{data?.source.label ?? (isLoading ? 'Connecting…' : 'Unavailable')}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-[.08em] text-white/60">Records analysed</p>
              <p className="mt-1 text-2xl font-extrabold">{metrics ? metrics.totalChildren.toLocaleString() : '—'}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-[.08em] text-white/60">Priority signals</p>
              <p className="mt-1 text-2xl font-extrabold">{criticalCount || '—'}</p>
            </div>
          </div>
        </div>
      </section>

      {isError && <DataServiceUnavailable message={error instanceof Error ? error.message : undefined} />}

      <section className="relative z-10 -mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key indicators">
        {isLoading || !metrics ? <><KpiSkeleton /><KpiSkeleton /><KpiSkeleton /><KpiSkeleton /></> : <>
          <KpiCard icon={<UsersRound className="size-5" />} label="Records monitored" value={metrics.totalChildren.toLocaleString()} helper={`${metrics.totalStunting.toLocaleString()} records carry the stunting signal`} tone="blue" />
          <KpiCard icon={<HeartPulse className="size-5" />} label="Stunting prevalence" value={`${metrics.prevalence.toFixed(1)}%`} helper="Calculated from the active filtered dataset" tone="rose" />
          <KpiCard icon={<ShieldCheck className="size-5" />} label="Immunisation continuity" value={`${metrics.imunisasiCoverage.toFixed(1)}%`} helper="Coverage derived from recorded immunisation fields" tone="teal" />
          <KpiCard icon={<Waves className="size-5" />} label="Safe-water access" value={`${metrics.airLayakCoverage.toFixed(1)}%`} helper="Household environmental coverage signal" tone="amber" />
        </>}
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="section-title">Analytical overview</h2><p className="section-description">Computed by the integrated Python analytics service.</p></div>
        <DataSourceBadge source={data?.source} />
      </div>

      <section className="grid gap-5 xl:grid-cols-12">
        <article className="clinical-card overflow-hidden xl:col-span-8">
          <div className="flex flex-col gap-3 border-b border-border-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="section-title">Prevalence & immunisation trend</h2><p className="section-description">Monthly movement from the active dataset and filters.</p></div>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-muted-foreground"><span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> Prevalence</span><span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-secondary" /> Immunisation</span></div>
          </div>
          <div className="h-[330px] px-2 pb-4 pt-5 sm:px-4">
            {trendData.length ? <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}>
                <defs><linearGradient id="prevFillDS" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.2}/><stop offset="100%" stopColor={COLORS.primary} stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid vertical={false} stroke="#edf1f6" />
                <XAxis dataKey="monthLabel" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#7b8799' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#7b8799' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 14px 34px rgba(18,31,53,.12)', fontSize: 12 }} />
                <Area type="monotone" dataKey="prevalence" connectNulls stroke={COLORS.primary} strokeWidth={2.6} fill="url(#prevFillDS)" name="Prevalence %" />
                <Area type="monotone" dataKey="coverage" connectNulls stroke={COLORS.secondary} strokeWidth={2.6} fill="transparent" name="Immunisation %" />
              </AreaChart>
            </ResponsiveContainer> : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No monthly trend is available for the current filter.</div>}
          </div>
        </article>

        <article className="clinical-card overflow-hidden xl:col-span-4">
          <div className="border-b border-border-soft px-5 py-4"><h2 className="section-title">District risk mix</h2><p className="section-description">Prevalence bands calculated from district aggregation.</p></div>
          <div className="grid items-center gap-2 p-5 sm:grid-cols-[160px_1fr] xl:grid-cols-1 2xl:grid-cols-[155px_1fr]">
            <div className="relative mx-auto h-[155px] w-[155px]">
              <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={distributionData} dataKey="value" innerRadius={48} outerRadius={68} paddingAngle={3} stroke="none">{distributionData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie></PieChart></ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl font-extrabold text-foreground">{distributionData.reduce((sum, item) => sum + item.value, 0)}</span><span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">districts</span></div>
            </div>
            <div className="space-y-2.5">
              {distributionData.map((item) => <div key={item.name} className="flex items-center gap-2.5"><span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} /><span className="flex-1 text-xs font-semibold text-text-secondary">{item.name}</span><span className="text-xs font-extrabold text-foreground">{item.value}</span></div>)}
            </div>
          </div>
        </article>
      </section>

      <section className="clinical-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="section-title">Highest district signals</h2><p className="section-description">Ranked from aggregated stunting prevalence—not a diagnosis or causal ranking.</p></div><Link href="/risk-map" className="inline-flex items-center gap-1 text-xs font-extrabold text-primary">Open map <ArrowRight className="size-3.5" /></Link></div>
        <div className="overflow-x-auto">
          <table className="premium-table min-w-[720px]">
            <thead><tr><th>District</th><th>Regency</th><th>Records</th><th>Stunting signal</th><th>Prevalence</th><th>Status</th></tr></thead>
            <tbody>{topRegions.map((row) => <tr key={`${row.kabupaten}-${row.kecamatan}`}><td className="font-bold text-foreground">{row.kecamatan}</td><td>{row.kabupaten}</td><td>{row.totalAnak.toLocaleString()}</td><td>{row.jumlahStunting.toLocaleString()}</td><td className="font-extrabold text-foreground">{row.prevalensi.toFixed(1)}%</td><td><StatusBadge status={(row.riskLevel as 'stable' | 'monitoring' | 'attention' | 'critical') || 'monitoring'} /></td></tr>)}</tbody>
          </table>
          {!topRegions.length && <div className="p-8 text-center text-sm text-muted-foreground">No district aggregation is available.</div>}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-12">
        <article className="clinical-card overflow-hidden xl:col-span-7">
          <div className="border-b border-border-soft px-5 py-4"><h2 className="section-title">Healthcare workforce distribution</h2><p className="section-description">Nutrition and health-worker context from the analytics source.</p></div>
          <div className="h-[310px] p-4">
            {workforce.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={workforce.slice(0, 8)} layout="vertical" margin={{ top: 8, right: 15, left: 20, bottom: 5 }}><CartesianGrid horizontal={false} stroke="#edf1f6"/><XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#7b8799' }}/><YAxis type="category" dataKey="region" width={120} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#667085' }}/><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}/><Bar dataKey="value" fill={COLORS.primary} radius={[0, 6, 6, 0]} name="Health workers" /></BarChart></ResponsiveContainer> : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No workforce aggregation available.</div>}
          </div>
        </article>

        <article className="overflow-hidden rounded-[20px] bg-[#12233b] p-5 text-white sm:p-6 xl:col-span-5">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-white/10"><Stethoscope className="size-5 text-[#68e1cc]" /></span>
          <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[.13em] text-white/55">Original data-science feature set</p>
          <h2 className="mt-2 text-xl font-extrabold tracking-[-.03em]">One workspace, six analytical capabilities.</h2>
          <div className="mt-5 grid gap-2 text-xs text-white/75 sm:grid-cols-2">
            {['Executive aggregation', 'Monthly trend', 'Numeric correlation', 'Record explorer', 'Regional risk map', 'Local ML prediction'].map((item) => <div key={item} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">{item}</div>)}
          </div>
          <Link href="/data-science" className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold text-[#78e2cf]">Inspect engine & provenance <ArrowRight className="size-3.5" /></Link>
        </article>
      </section>

      {metrics && metrics.prevalence >= 20 && <div className="rounded-2xl border border-warning/20 bg-warning/5 p-5"><div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning"/><div><p className="text-sm font-extrabold text-foreground">Program-level review signal</p><p className="mt-1 text-xs leading-5 text-text-secondary">The current filtered prevalence is {metrics.prevalence.toFixed(1)}%. Review district composition and data quality before escalating interventions.</p></div></div></div>}
    </div>
  )
}
