'use client'

import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Database,
  HeartPulse,
  MapPinned,
  MoreHorizontal,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  UsersRound,
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
import { StatusBadge } from '@/components/StatusBadge'
import { COLORS } from '@/lib/colors'
import { useToast } from '@/components/ToastProvider'

const trendData = [
  { month: 'Jan', prevalence: 28.7, coverage: 68 },
  { month: 'Feb', prevalence: 28.2, coverage: 70 },
  { month: 'Mar', prevalence: 27.6, coverage: 72 },
  { month: 'Apr', prevalence: 26.9, coverage: 75 },
  { month: 'May', prevalence: 26.1, coverage: 77 },
  { month: 'Jun', prevalence: 25.2, coverage: 78.5 },
]

const distributionData = [
  { name: 'Stable', value: 46, color: '#1d9b67' },
  { name: 'Monitoring', value: 31, color: '#2b6cf6' },
  { name: 'Attention', value: 17, color: '#d88716' },
  { name: 'Critical', value: 6, color: '#d74646' },
]

const regionalData = [
  { region: 'Indramayu Cluster', risk: 34.8, change: 2.6, status: 'attention' as const },
  { region: 'Garut Selatan', risk: 31.2, change: 1.4, status: 'attention' as const },
  { region: 'Cianjur Timur', risk: 28.9, change: -0.8, status: 'monitoring' as const },
  { region: 'Bandung Raya', risk: 23.9, change: -1.7, status: 'stable' as const },
]

const interventionData = [
  { label: 'Nutrition follow-up', completed: 84 },
  { label: 'Growth monitoring', completed: 76 },
  { label: 'Sanitation referral', completed: 61 },
  { label: 'Immunization outreach', completed: 79 },
]

function KpiCard({ icon, label, value, delta, helper, tone = 'blue' }: { icon: React.ReactNode; label: string; value: string; delta: string; helper: string; tone?: 'blue' | 'teal' | 'amber' | 'rose' }) {
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
      <div className="mt-3 flex items-center gap-1.5 text-[11px]">
        <span className="font-extrabold text-success">{delta}</span>
        <span className="text-muted-foreground">{helper}</span>
      </div>
    </article>
  )
}

export default function DashboardHome() {
  const { notify } = useToast()
  return (
    <div className="space-y-6">
      <section className="dashboard-hero relative overflow-hidden rounded-[22px] px-5 pb-16 pt-6 text-white sm:px-7 sm:pb-20 sm:pt-7 lg:px-8">
        <div className="dashboard-hero-grid pointer-events-none absolute inset-0 opacity-80" />
        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[.1em] text-white/70">
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" /> Monitoring cycle · June 2026</span>
              <span className="hidden size-1 rounded-full bg-white/40 sm:block" />
              <span>West Java program</span>
            </div>
            <h1 className="mt-3 text-[28px] font-extrabold leading-tight tracking-[-.045em] sm:text-[34px] lg:text-[38px]">Child growth operations overview</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">Monitor prevalence, service coverage, regional priority signals, and accountable intervention progress from one operational health workspace.</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/risk-map" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-extrabold text-[#1746ad] shadow-sm transition hover:bg-blue-50"><MapPinned className="size-4" /> Explore regional risk</Link>
              <Link href="/action-center" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 text-xs font-extrabold text-white backdrop-blur transition hover:bg-white/18"><ClipboardCheck className="size-4" /> Review actions</Link>
            </div>
          </div>

          <div className="grid min-w-0 gap-2 sm:grid-cols-3 xl:w-[440px]">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-[.08em] text-white/60">Program status</p>
              <div className="mt-2"><span className="inline-flex items-center gap-1.5 text-sm font-extrabold"><span className="size-2 rounded-full bg-[#62e3c6]" /> On track</span></div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-[.08em] text-white/60">Data completeness</p>
              <p className="mt-1 text-2xl font-extrabold">96.8%</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-[.08em] text-white/60">Pending review</p>
              <p className="mt-1 text-2xl font-extrabold">7</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key indicators">
        <KpiCard icon={<UsersRound className="size-5" />} label="Children monitored" value="15,240" delta="+8.4%" helper="vs previous cycle" tone="blue" />
        <KpiCard icon={<HeartPulse className="size-5" />} label="Stunting prevalence" value="25.2%" delta="−1.7 pts" helper="since January" tone="teal" />
        <KpiCard icon={<ShieldCheck className="size-5" />} label="Service coverage" value="78.5%" delta="+3.5 pts" helper="6-month gain" tone="amber" />
        <KpiCard icon={<AlertTriangle className="size-5" />} label="Priority clusters" value="6" delta="2 new" helper="need review" tone="rose" />
      </section>

      <section className="grid gap-5 xl:grid-cols-12">
        <article className="clinical-card overflow-hidden xl:col-span-8">
          <div className="flex flex-col gap-3 border-b border-border-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="section-title">Prevalence & service coverage</h2><p className="section-description">Six-month movement across the current monitoring cycle.</p></div>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-muted-foreground"><span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> Prevalence</span><span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-secondary" /> Coverage</span></div>
          </div>
          <div className="h-[330px] px-2 pb-4 pt-5 sm:px-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}>
                <defs><linearGradient id="prevFillNew" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.2}/><stop offset="100%" stopColor={COLORS.primary} stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid vertical={false} stroke="#edf1f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#7b8799' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#7b8799' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 14px 34px rgba(18,31,53,.12)', fontSize: 12 }} />
                <Area type="monotone" dataKey="prevalence" stroke={COLORS.primary} strokeWidth={2.6} fill="url(#prevFillNew)" name="Prevalence %" />
                <Area type="monotone" dataKey="coverage" stroke={COLORS.secondary} strokeWidth={2.6} fill="transparent" name="Coverage %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="clinical-card overflow-hidden xl:col-span-4">
          <div className="border-b border-border-soft px-5 py-4"><h2 className="section-title">Regional risk mix</h2><p className="section-description">Distribution of monitored areas.</p></div>
          <div className="grid items-center gap-2 p-5 sm:grid-cols-[160px_1fr] xl:grid-cols-1 2xl:grid-cols-[155px_1fr]">
            <div className="relative mx-auto h-[155px] w-[155px]">
              <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={distributionData} dataKey="value" innerRadius={48} outerRadius={68} paddingAngle={3} stroke="none">{distributionData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie></PieChart></ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl font-extrabold text-foreground">627</span><span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">areas</span></div>
            </div>
            <div className="space-y-2.5">
              {distributionData.map((item) => <div key={item.name} className="flex items-center gap-2.5"><span className="size-2.5 rounded-full" style={{ background: item.color }} /><span className="min-w-0 flex-1 text-xs font-semibold text-text-secondary">{item.name}</span><span className="text-xs font-extrabold text-foreground">{item.value}%</span></div>)}
            </div>
          </div>
          <div className="border-t border-border-soft px-5 py-3"><Link href="/risk-map" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">Open spatial view <ArrowRight className="size-3.5" /></Link></div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-12">
        <article className="clinical-card overflow-hidden xl:col-span-7">
          <div className="flex items-center justify-between border-b border-border-soft px-5 py-4">
            <div><h2 className="section-title">Priority regions</h2><p className="section-description">Areas ranked for program review, not clinical diagnosis.</p></div>
            <Link href="/risk-map" className="btn-ghost">View map <ArrowRight className="size-3.5" /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="premium-table min-w-[620px]">
              <thead><tr><th>Region</th><th>Risk index</th><th>Change</th><th>Status</th><th className="w-10"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>{regionalData.map((row) => <tr key={row.region}><td className="font-bold text-foreground">{row.region}</td><td><div className="flex items-center gap-2"><span className="w-10 font-extrabold text-foreground">{row.risk}%</span><div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-gradient-to-r from-primary to-warning" style={{ width: `${Math.min(row.risk * 2.2, 100)}%` }} /></div></div></td><td><span className={row.change > 0 ? 'font-bold text-danger' : 'font-bold text-success'}>{row.change > 0 ? '+' : ''}{row.change} pts</span></td><td><StatusBadge status={row.status} /></td><td><button type="button" onClick={()=>notify({tone:'info',title:`${row.region} review`,message:'Regional detail actions are ready; open the risk map for spatial context or Action Center for accountable follow-up.'})} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted" aria-label={`More actions for ${row.region}`}><MoreHorizontal className="size-4" /></button></td></tr>)}</tbody>
            </table>
          </div>
        </article>

        <article className="clinical-card overflow-hidden xl:col-span-5">
          <div className="flex items-center justify-between border-b border-border-soft px-5 py-4"><div><h2 className="section-title">Intervention completion</h2><p className="section-description">Operational follow-through by workstream.</p></div><Link href="/action-center" className="btn-ghost">Manage</Link></div>
          <div className="p-5">
            <div className="h-[190px]">
              <ResponsiveContainer width="100%" height="100%"><BarChart data={interventionData} layout="vertical" margin={{ left: 6, right: 18, top: 0, bottom: 0 }}><CartesianGrid horizontal={false} stroke="#edf1f6"/><XAxis type="number" domain={[0,100]} hide/><YAxis type="category" dataKey="label" width={118} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7890' }}/><Tooltip cursor={{ fill: '#f5f8fc' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}/><Bar dataKey="completed" fill={COLORS.primary} radius={[0,6,6,0]} barSize={12} name="Completion %"/></BarChart></ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-success/15 bg-success/5 p-3.5"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success"/><div><p className="text-xs font-bold text-foreground">84% verification rate</p><p className="mt-1 text-[11px] leading-5 text-muted-foreground">Completed workflows with documented follow-up evidence.</p></div></div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <article className="clinical-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger"><AlertTriangle className="size-5" /></span><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-bold text-foreground">One priority signal needs human triage</h2><span className="rounded-md bg-danger/10 px-2 py-0.5 text-[10px] font-extrabold text-danger">Critical</span></div><p className="mt-1 text-xs leading-5 text-muted-foreground">A composite risk signal crossed the configured review threshold in the Indramayu cluster.</p></div></div>
          <Link href="/action-center" className="btn-primary shrink-0">Start review <ArrowRight className="size-4" /></Link>
        </article>
        <Link href="/explorer" className="clinical-card flex min-w-[220px] items-center gap-3 p-5 transition hover:border-primary/25 hover:shadow-sm"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Database className="size-5" /></span><span><span className="block text-sm font-bold text-foreground">Explore records</span><span className="mt-1 block text-[11px] text-muted-foreground">Search district-level data</span></span></Link>
      </section>
    </div>
  )
}
