'use client'

import Link from 'next/link'
import { FormEvent, useMemo, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  BellRing,
  BrainCircuit,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Database,
  FileCheck2,
  FlaskConical,
  HeartPulse,
  MapPinned,
  Network,
  Menu,
  Search,
  ShieldCheck,
  Stethoscope,
  UsersRound,
  X,
} from 'lucide-react'
import { BrandLogo } from '@/components/BrandLogo'
import { GrowthCareIllustration } from '@/components/landing/GrowthCareIllustration'

const trustedCapabilities = [
  {
    eyebrow: 'Spatial intelligence',
    title: 'See where attention is changing.',
    text: 'Review district signals, local service context, and priority movement on a spatial layer designed for program decisions.',
    href: '/risk-map',
    icon: MapPinned,
    tone: 'blue',
  },
  {
    eyebrow: 'Program operations',
    title: 'Move from signal to owned follow-up.',
    text: 'Assign responsibility, due dates, progress, and verification evidence instead of stopping at a chart or alert.',
    href: '/action-center',
    icon: ClipboardCheck,
    tone: 'mint',
  },
  {
    eyebrow: 'Evidence review',
    title: 'Keep context beside the metric.',
    text: 'Explore service coverage, contributing factors, regional records, and review history with clear decision-support guardrails.',
    href: '/explorer',
    icon: Database,
    tone: 'slate',
  },
]

const workflow = [
  ['01', 'Observe', 'Bring growth, service, and regional signals into one readable program view.'],
  ['02', 'Review', 'Check context, data quality, and whether a signal deserves escalation.'],
  ['03', 'Coordinate', 'Assign accountable follow-up to the right program or care team.'],
  ['04', 'Verify', 'Document completion, evidence, and what changed after action.'],
]

const teamRoles = [
  ['Program lead', 'Priorities, ownership, completion'],
  ['Nutrition team', 'Growth and service context'],
  ['Field coordinator', 'Due dates and verification'],
  ['Health analyst', 'Regional trends and factors'],
  ['Care team', 'Screening and follow-up context'],
]

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')

  const searchRoute = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return '/dashboard'
    if (q.includes('map') || q.includes('wilayah') || q.includes('regional') || q.includes('risk')) return '/risk-map'
    if (q.includes('action') || q.includes('intervensi') || q.includes('follow')) return '/action-center'
    if (q.includes('data') || q.includes('explore') || q.includes('record')) return '/explorer'
    if (q.includes('factor') || q.includes('korelasi') || q.includes('determinant')) return '/correlation'
    if (q.includes('screen') || q.includes('family') || q.includes('keluarga')) return '/prediction'
    if (q.includes('model') || q.includes('pipeline') || q.includes('machine learning') || q.includes('data science')) return '/data-science'
    if (q.includes('notif') || q.includes('alert')) return '/notifications'
    if (q.includes('audit') || q.includes('activity')) return '/activity'
    return '/dashboard'
  }, [query])

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    window.location.href = searchRoute
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f2f3f2] text-foreground dark:bg-background">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-black/[.06] bg-[#f7f8f6]/92 backdrop-blur-xl dark:border-white/10 dark:bg-background/90">
        <div className="mx-auto flex h-[72px] max-w-[1460px] items-center justify-between px-5 sm:px-7 lg:px-10">
          <Link href="/" aria-label="StuntLytics home" className="shrink-0"><BrandLogo /></Link>
          <div className="hidden items-center gap-8 lg:flex">
            <Link href="#platform" className="text-[11px] font-semibold text-slate-600 transition hover:text-foreground dark:text-text-secondary">Platform</Link>
            <Link href="#care" className="text-[11px] font-semibold text-slate-600 transition hover:text-foreground dark:text-text-secondary">For health teams</Link>
            <Link href="#workflow" className="text-[11px] font-semibold text-slate-600 transition hover:text-foreground dark:text-text-secondary">How it works</Link>
            <Link href="/data-science" className="text-[11px] font-semibold text-slate-600 transition hover:text-foreground dark:text-text-secondary">Data science</Link>
            <Link href="/about" className="text-[11px] font-semibold text-slate-600 transition hover:text-foreground dark:text-text-secondary">Research context</Link>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/risk-map" className="text-[11px] font-bold text-slate-600 transition hover:text-foreground dark:text-text-secondary">View regional map</Link>
            <Link href="/dashboard" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#111817] px-5 text-[11px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-black">Open workspace <ArrowUpRight className="size-3.5" /></Link>
          </div>
          <button type="button" onClick={() => setMenuOpen((v) => !v)} className="flex size-10 items-center justify-center rounded-full border border-black/10 bg-white lg:hidden dark:border-border dark:bg-card" aria-label="Toggle navigation">
            {menuOpen ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-black/[.06] bg-[#f7f8f6] px-5 py-4 dark:border-border dark:bg-card lg:hidden">
            <div className="space-y-1">
              {[['Platform','#platform'],['For health teams','#care'],['How it works','#workflow'],['Data science','/data-science'],['Research context','/about']].map(([label,href]) => (
                <Link key={label} href={href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-bold hover:bg-black/[.04] dark:hover:bg-muted">{label}</Link>
              ))}
            </div>
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="mt-3 flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#111817] px-5 text-xs font-bold text-white">Open workspace <ArrowUpRight className="size-3.5" /></Link>
          </div>
        )}
      </nav>

      <main>
        <section className="px-3 pb-3 pt-[84px] sm:px-5 sm:pb-5 sm:pt-[92px]">
          <div className="relative mx-auto min-h-[760px] max-w-[1460px] overflow-hidden rounded-[28px] bg-[#f7f8f6] dark:bg-card lg:min-h-[820px]">
            <div className="absolute inset-0 opacity-[.38]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(39,58,63,.13) 1px, transparent 0)', backgroundSize: '30px 30px', maskImage: 'linear-gradient(to bottom, black, transparent 75%)' }} />
            <div className="absolute -right-28 top-8 size-[470px] rounded-full bg-[#d9f2ef] blur-[2px] dark:bg-secondary/10" />
            <div className="absolute bottom-[-160px] left-[28%] size-[520px] rounded-full bg-[#dde6fa] blur-[4px] dark:bg-primary/10" />

            <div className="relative z-10 grid min-h-[760px] lg:min-h-[820px] lg:grid-cols-[.9fr_1.1fr]">
              <div className="flex flex-col justify-between px-6 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-14 lg:px-14 lg:pb-12 lg:pt-16 xl:px-16">
                <div>
                  <div className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[.02em] text-slate-600 dark:text-text-secondary">
                    <span className="size-1.5 rounded-full bg-secondary" /> Powered by StuntLytics
                  </div>
                  <h1 className="mt-7 max-w-[620px] text-[46px] font-medium leading-[.95] tracking-[-.065em] text-[#121a1a] dark:text-foreground sm:text-[64px] lg:text-[72px] xl:text-[82px]">
                    Child growth,
                    <br />with clearer
                    <br /><span className="text-[#0b8e8b]">intelligence.</span>
                  </h1>
                  <p className="mt-7 max-w-[520px] text-[14px] leading-7 text-slate-600 dark:text-text-secondary sm:text-[15px]">
                    Connect regional monitoring, service context, accountable intervention, and follow-up evidence in one calm workspace for child-health programs.
                  </p>

                  <form onSubmit={handleSearch} className="mt-8 flex max-w-[560px] items-center gap-3 rounded-full border border-black/10 bg-white p-2 pl-4 shadow-[0_14px_34px_rgba(26,44,50,.08)] dark:border-border dark:bg-background">
                    <Search className="size-4 shrink-0 text-slate-400" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search risk map, data, action or screening"
                      className="min-w-0 flex-1 bg-transparent text-[12px] text-foreground outline-none placeholder:text-slate-400"
                      aria-label="Search StuntLytics workspace"
                    />
                    <button type="submit" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0f8f8b] text-white transition hover:scale-105 hover:bg-[#087d79]" aria-label="Open matching workspace area">
                      <ArrowRight className="size-4" />
                    </button>
                  </form>
                  <p className="mt-3 max-w-[510px] text-[9px] leading-4 text-slate-500 dark:text-muted-foreground">
                    Try “regional risk”, “intervention”, “data explorer”, or “family screening”. Decision support only—not a clinical diagnosis.
                  </p>
                </div>

                <div className="mt-10 grid gap-3 border-t border-black/[.08] pt-5 sm:grid-cols-3 dark:border-white/10">
                  {[
                    ['342', 'health workers connected'],
                    ['627', 'regional boundaries'],
                    ['84%', 'verified follow-up'],
                  ].map(([value, label]) => (
                    <div key={label}>
                      <p className="text-[20px] font-semibold tracking-[-.04em] text-[#172033] dark:text-foreground">{value}</p>
                      <p className="mt-1 max-w-[120px] text-[9px] leading-4 text-slate-500 dark:text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[620px] lg:min-h-full">
                <div className="absolute inset-x-[-6%] bottom-[-3%] top-[1%] lg:left-[-13%] lg:right-[-2%]">
                  <GrowthCareIllustration />
                </div>
                <div className="absolute right-5 top-7 rounded-full border border-black/10 bg-white/90 px-4 py-2 text-[9px] font-bold text-slate-600 shadow-sm backdrop-blur dark:border-border dark:bg-card/90 dark:text-text-secondary sm:right-9 sm:top-10">
                  <span className="mr-2 inline-block size-1.5 rounded-full bg-success" /> Live program view
                </div>
                <Link href="/risk-map" className="absolute bottom-8 right-5 hidden w-[188px] rounded-[24px] border border-white/80 bg-white/90 p-4 shadow-[0_18px_42px_rgba(26,44,50,.14)] backdrop-blur transition hover:-translate-y-1 dark:border-border dark:bg-card/90 sm:block lg:bottom-10 lg:right-9">
                  <div className="flex items-center justify-between">
                    <span className="flex size-9 items-center justify-center rounded-full bg-[#e8f7f5] text-[#0b8f8b]"><MapPinned className="size-4" /></span>
                    <ArrowUpRight className="size-4 text-slate-400" />
                  </div>
                  <p className="mt-5 text-[10px] font-bold text-slate-500">Spatial review</p>
                  <p className="mt-1 text-[14px] font-semibold leading-5 text-foreground">Explore changing regional signals.</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-7 dark:bg-background">
          <div className="mx-auto grid max-w-[1320px] gap-5 px-6 md:grid-cols-3 lg:px-8">
            {[
              [HeartPulse, 'Growth signals stay connected to service context.'],
              [ClipboardCheck, 'Reviewed priorities can become owned actions.'],
              [FileCheck2, 'Follow-up can be verified instead of assumed.'],
            ].map(([Icon, text]) => { const I = Icon as typeof HeartPulse; return (
              <div key={String(text)} className="flex items-center gap-3 py-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-[#eef7f5] text-[#0b8f8b] dark:bg-secondary/10 dark:text-secondary"><I className="size-3.5" /></span>
                <p className="text-[10px] leading-5 text-slate-600 dark:text-text-secondary">{String(text)}</p>
              </div>
            )})}
          </div>
        </section>

        <section id="platform" className="bg-white px-5 py-24 dark:bg-background sm:px-7 lg:py-32">
          <div className="mx-auto max-w-[1320px]">
            <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
              <div>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-muted-foreground">• About StuntLytics</p>
                <h2 className="mt-5 max-w-[520px] text-[42px] font-medium leading-[.98] tracking-[-.06em] text-[#121a1a] dark:text-foreground sm:text-[58px]">
                  Healthcare with all the context that matters.
                </h2>
              </div>
              <div className="relative min-h-[360px] overflow-hidden rounded-[28px] bg-[#f3f6f5] p-6 dark:bg-card sm:p-8">
                <div className="absolute -right-16 -top-24 size-[300px] rounded-full bg-[#d8f1ee] dark:bg-secondary/10" />
                <div className="absolute -bottom-24 left-[28%] size-[300px] rounded-full bg-[#dfe7fb] dark:bg-primary/10" />
                <div className="relative grid h-full min-h-[300px] gap-4 sm:grid-cols-[1.12fr_.88fr]">
                  <div className="flex flex-col justify-between rounded-[24px] bg-white p-5 shadow-sm dark:bg-background">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[.1em] text-slate-400">Growth trajectory</p>
                        <p className="mt-2 text-xl font-semibold tracking-[-.04em]">Monitoring trend</p>
                      </div>
                      <span className="rounded-full bg-success/10 px-3 py-1 text-[9px] font-bold text-success">Improving</span>
                    </div>
                    <svg viewBox="0 0 420 150" className="mt-8 h-[150px] w-full" preserveAspectRatio="none" aria-hidden="true">
                      <defs><linearGradient id="contextFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0ea5a0" stopOpacity=".25"/><stop offset="1" stopColor="#0ea5a0" stopOpacity="0"/></linearGradient></defs>
                      <path d="M0 116 C40 104 63 111 96 91 S148 76 181 82 S238 61 274 63 S333 39 367 44 S399 31 420 23 L420 150 L0 150 Z" fill="url(#contextFill)"/>
                      <path d="M0 116 C40 104 63 111 96 91 S148 76 181 82 S238 61 274 63 S333 39 367 44 S399 31 420 23" fill="none" stroke="#0ea5a0" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                    <div className="flex items-center justify-between border-t border-black/[.06] pt-4 text-[9px] text-slate-500 dark:border-white/10 dark:text-muted-foreground"><span>Jan</span><span>Jun</span><span className="font-bold text-success">−1.7 pts</span></div>
                  </div>
                  <div className="grid gap-4">
                    <div className="rounded-[24px] bg-[#0e918d] p-5 text-white">
                      <p className="text-[9px] font-bold uppercase tracking-[.1em] text-white/60">Service coverage</p>
                      <p className="mt-5 text-[36px] font-semibold tracking-[-.05em]">78.5%</p>
                      <p className="mt-2 text-[10px] leading-5 text-white/70">Read beside regional growth and follow-up signals.</p>
                    </div>
                    <div className="rounded-[24px] bg-[#172033] p-5 text-white">
                      <p className="text-[9px] font-bold uppercase tracking-[.1em] text-white/50">Priority review</p>
                      <div className="mt-5 flex items-end justify-between"><p className="text-[36px] font-semibold tracking-[-.05em]">06</p><BellRing className="mb-1 size-5 text-[#70d8d0]" /></div>
                      <p className="mt-2 text-[10px] leading-5 text-white/60">Regional clusters awaiting coordinated review.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#111d2d] px-5 py-24 text-white sm:px-7 lg:py-28">
          <div className="mx-auto max-w-[1320px]">
            <div className="grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
              <div>
                <p className="text-[10px] font-semibold text-white/50">• Original data-science engine, integrated</p>
                <h2 className="mt-5 max-w-[560px] text-[42px] font-medium leading-[.98] tracking-[-.06em] sm:text-[58px]">Not a dashboard full of invented numbers.</h2>
                <p className="mt-6 max-w-[520px] text-[12px] leading-7 text-white/62">The modern workspace now calls the uploaded StuntLytics analytics engine for aggregation, record exploration, correlations, district risk, evidence summaries, and local model inference.</p>
                <Link href="/data-science" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#69d9cf] px-5 text-[11px] font-bold text-[#102337] transition hover:-translate-y-0.5">Inspect the engine <ArrowUpRight className="size-3.5" /></Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  [BarChart3, 'Executive aggregation', 'KPI and monthly trend'],
                  [MapPinned, 'Regional risk', 'District prevalence bands'],
                  [Database, 'Record explorer', 'Drill-down and export'],
                  [Network, 'Correlation review', 'Numeric associations'],
                  [BrainCircuit, 'Local ML pipeline', '18 original inputs'],
                  [FlaskConical, 'Evidence insight', 'Data-grounded answers'],
                ].map(([Icon, title, detail]) => {
                  const I = Icon as typeof BarChart3
                  return <div key={String(title)} className="min-h-[150px] rounded-[22px] border border-white/10 bg-white/[.055] p-5 backdrop-blur-sm"><span className="flex size-9 items-center justify-center rounded-full bg-white/10 text-[#77e4d9]"><I className="size-4" /></span><p className="mt-5 text-[12px] font-bold">{String(title)}</p><p className="mt-2 text-[9px] leading-4 text-white/50">{String(detail)}</p></div>
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="care" className="bg-[#f2f3f2] px-5 py-24 dark:bg-card/30 sm:px-7 lg:py-32">
          <div className="mx-auto max-w-[1320px]">
            <div className="max-w-[690px]">
              <p className="text-[10px] font-semibold text-slate-500 dark:text-muted-foreground">• Your trusted child-health workspace</p>
              <h2 className="mt-5 text-[42px] font-medium leading-[.98] tracking-[-.06em] text-[#121a1a] dark:text-foreground sm:text-[58px]">
                Useful intelligence,
                <br />without losing human judgment.
              </h2>
            </div>
            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {trustedCapabilities.map((item, index) => {
                const Icon = item.icon
                const tone = item.tone === 'blue' ? 'bg-[#dfe8fb]' : item.tone === 'mint' ? 'bg-[#d9efec]' : 'bg-[#e8e8e4]'
                const panel = index === 0 ? 'bg-[#ecf1fb]' : index === 1 ? 'bg-[#dcefeb]' : 'bg-[#efefeb]'
                return (
                  <Link href={item.href} key={item.title} className={`group min-h-[430px] overflow-hidden rounded-[28px] ${panel} p-6 transition hover:-translate-y-1.5 dark:bg-card sm:p-7`}>
                    <div className="flex items-center justify-between">
                      <span className={`flex size-11 items-center justify-center rounded-full ${tone} text-[#172033]`}><Icon className="size-5" /></span>
                      <ArrowUpRight className="size-4 text-slate-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    <div className="mt-20">
                      <p className="text-[9px] font-bold uppercase tracking-[.1em] text-slate-500">{item.eyebrow}</p>
                      <h3 className="mt-4 text-[27px] font-medium leading-[1.02] tracking-[-.045em] text-[#141c1c] dark:text-foreground">{item.title}</h3>
                      <p className="mt-4 text-[11px] leading-6 text-slate-600 dark:text-text-secondary">{item.text}</p>
                    </div>
                    <div className="mt-10 h-[86px] overflow-hidden rounded-[18px] border border-black/[.05] bg-white/65 p-4 dark:border-white/10 dark:bg-background/50">
                      {index === 0 && <div className="flex h-full items-end gap-2">{[38,56,44,72,62,82,68].map((h,i)=><span key={i} className="flex-1 rounded-t-md bg-primary/75" style={{height:`${h}%`}} />)}</div>}
                      {index === 1 && <div className="space-y-2">{[['Priority signal','Review'],['Owner assigned','Today'],['Verification','84%']].map(([a,b])=><div key={a} className="flex items-center justify-between text-[9px]"><span className="text-slate-500">{a}</span><span className="font-bold text-foreground">{b}</span></div>)}</div>}
                      {index === 2 && <div className="flex h-full items-center justify-center gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-card"><BarChart3 className="size-4 text-primary"/></span><span className="h-px w-9 bg-slate-300"/><span className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-card"><Stethoscope className="size-4 text-secondary"/></span><span className="h-px w-9 bg-slate-300"/><span className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-card"><BadgeCheck className="size-4 text-success"/></span></div>}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-24 dark:bg-background sm:px-7 lg:py-32">
          <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center">
            <div className="relative min-h-[520px] overflow-hidden rounded-[30px] bg-[#eff3f1] dark:bg-card">
              <div className="absolute -left-24 top-16 size-[310px] rounded-full bg-[#dce9ff] dark:bg-primary/10" />
              <div className="absolute -right-12 bottom-[-80px] size-[320px] rounded-full bg-[#d7f0eb] dark:bg-secondary/10" />
              <div className="absolute inset-0 p-6 sm:p-8">
                <div className="relative mx-auto mt-8 max-w-[430px] rounded-[26px] bg-white p-6 shadow-[0_25px_55px_rgba(27,45,50,.12)] dark:bg-background">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-full bg-[#e8f7f5] text-[#0b8f8b]"><UsersRound className="size-5" /></span>
                    <div><p className="text-[11px] font-bold">Regional coordination</p><p className="mt-1 text-[9px] text-slate-500">Public-health program view</p></div>
                  </div>
                  <div className="mt-6 space-y-4">
                    {[
                      ['Nutrition follow-up', '84%', 84, '#0ea5a0'],
                      ['Growth monitoring', '76%', 76, '#2b6cf6'],
                      ['Sanitation referral', '61%', 61, '#d88716'],
                      ['Immunization outreach', '79%', 79, '#1687c9'],
                    ].map(([label, value, width, color]) => (
                      <div key={String(label)}>
                        <div className="flex items-center justify-between text-[9px]"><span className="text-slate-500">{String(label)}</span><span className="font-bold">{String(value)}</span></div>
                        <div className="mt-2 h-1.5 rounded-full bg-slate-100 dark:bg-muted"><div className="h-full rounded-full" style={{width:`${Number(width)}%`, backgroundColor:String(color)}} /></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-8 left-6 rounded-[22px] bg-[#172033] p-5 text-white shadow-xl sm:left-8">
                  <ShieldCheck className="size-5 text-[#69d9cf]" />
                  <p className="mt-5 text-2xl font-semibold tracking-[-.04em]">Human review</p>
                  <p className="mt-1 max-w-[170px] text-[9px] leading-4 text-white/55">Signals do not become clinical conclusions automatically.</p>
                </div>
                <div className="absolute bottom-8 right-6 rounded-[22px] bg-[#0e918d] p-5 text-white shadow-xl sm:right-8">
                  <FileCheck2 className="size-5 text-white/80" />
                  <p className="mt-5 text-2xl font-semibold tracking-[-.04em]">84%</p>
                  <p className="mt-1 text-[9px] text-white/65">verified follow-up</p>
                </div>
              </div>
            </div>
            <div className="lg:pl-8">
              <p className="text-[10px] font-semibold text-slate-500 dark:text-muted-foreground">• Built for coordinated care and programs</p>
              <h2 className="mt-5 text-[42px] font-medium leading-[.98] tracking-[-.06em] text-[#121a1a] dark:text-foreground sm:text-[58px]">Program context,
                <br />wherever decisions happen.</h2>
              <p className="mt-6 max-w-[560px] text-[13px] leading-7 text-slate-600 dark:text-text-secondary">Use the same product language across program managers, analysts, nutrition teams, field coordinators, and care reviewers—without pretending every role needs the same interface.</p>
              <div className="mt-8 space-y-3">
                {teamRoles.map(([role, detail]) => (
                  <div key={role} className="flex items-center justify-between border-b border-black/[.07] py-3 dark:border-white/10">
                    <span className="text-[12px] font-semibold">{role}</span>
                    <span className="text-[9px] text-slate-500 dark:text-muted-foreground">{detail}</span>
                  </div>
                ))}
              </div>
              <Link href="/platform" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#111817] px-5 text-[11px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-black">Explore the platform <ArrowRight className="size-3.5" /></Link>
            </div>
          </div>
        </section>

        <section id="workflow" className="bg-[#f2f3f2] px-5 py-24 dark:bg-card/30 sm:px-7 lg:py-32">
          <div className="mx-auto max-w-[1320px]">
            <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className="text-[10px] font-semibold text-slate-500 dark:text-muted-foreground">• A responsible operating loop</p>
                <h2 className="mt-5 text-[42px] font-medium leading-[.98] tracking-[-.06em] text-[#121a1a] dark:text-foreground sm:text-[58px]">From signal
                  <br />to verified action.</h2>
                <p className="mt-6 max-w-[430px] text-[12px] leading-7 text-slate-600 dark:text-text-secondary">A high-performing health product should help teams move forward—not only display more information.</p>
                <Link href="/action-center" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0e918d] px-5 text-[11px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#087d79]">Open action center <ArrowUpRight className="size-3.5" /></Link>
              </div>
              <div className="border-t border-black/[.08] dark:border-white/10">
                {workflow.map(([num, title, text]) => (
                  <Link href={num === '01' ? '/dashboard' : num === '02' ? '/risk-map' : num === '03' ? '/action-center' : '/activity'} key={num} className="group grid gap-4 border-b border-black/[.08] py-7 transition hover:pl-2 dark:border-white/10 sm:grid-cols-[64px_170px_1fr_auto] sm:items-center">
                    <span className="text-[10px] font-bold text-slate-400">{num}</span>
                    <span className="text-[22px] font-medium tracking-[-.04em]">{title}</span>
                    <span className="max-w-[510px] text-[11px] leading-6 text-slate-600 dark:text-text-secondary">{text}</span>
                    <span className="flex size-9 items-center justify-center rounded-full border border-black/10 bg-white transition group-hover:bg-[#111817] group-hover:text-white dark:border-border dark:bg-card"><ChevronRight className="size-3.5" /></span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-24 dark:bg-background sm:px-7 lg:py-32">
          <div className="mx-auto max-w-[1320px]">
            <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-muted-foreground">• Governance by design</p>
                <h2 className="mt-5 text-[42px] font-medium leading-[.98] tracking-[-.06em] text-[#121a1a] dark:text-foreground sm:text-[58px]">Health intelligence
                  <br />that shows its limits.</h2>
                <p className="mt-6 max-w-[520px] text-[12px] leading-7 text-slate-600 dark:text-text-secondary">StuntLytics is positioned as decision support. It separates observed data, modelled scenarios, screening support, and human verification so teams can see what kind of evidence they are using.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {['Human review', 'Source visibility', 'Audit trail', 'Scenario labels'].map((label) => <span key={label} className="rounded-full border border-black/10 px-4 py-2 text-[10px] font-semibold dark:border-border">{label}</span>)}
                </div>
              </div>
              <div className="relative min-h-[470px] rounded-[30px] bg-[#f4f5f2] p-7 dark:bg-card sm:p-10">
                <div className="absolute left-1/2 top-1/2 size-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0e918d]/25 bg-[#dff2ef] dark:bg-secondary/10" />
                <div className="absolute left-1/2 top-1/2 flex size-[112px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#0e918d] text-white shadow-[0_22px_46px_rgba(14,145,141,.28)]"><ShieldCheck className="size-9" /></div>
                {[
                  ['Observed data', 'left-[7%] top-[16%]', BarChart3],
                  ['Regional context', 'right-[5%] top-[17%]', MapPinned],
                  ['Human review', 'left-[5%] bottom-[16%]', Stethoscope],
                  ['Verified action', 'right-[5%] bottom-[16%]', BadgeCheck],
                ].map(([label, pos, Icon]) => { const I = Icon as typeof BarChart3; return <div key={String(label)} className={`absolute ${String(pos)} flex items-center gap-3 rounded-full border border-black/[.07] bg-white px-4 py-3 shadow-sm dark:border-border dark:bg-background`}><span className="flex size-8 items-center justify-center rounded-full bg-[#eef7f5] text-[#0b8f8b]"><I className="size-3.5" /></span><span className="text-[9px] font-bold">{String(label)}</span></div> })}
                <svg viewBox="0 0 600 430" className="absolute inset-0 h-full w-full" aria-hidden="true"><path d="M160 110C240 120 260 170 300 215M440 110C360 120 340 170 300 215M150 330C230 315 260 260 300 215M450 330C370 315 340 260 300 215" fill="none" stroke="#9eb8b4" strokeWidth="1.4" strokeDasharray="5 7" /></svg>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pb-6 dark:bg-background sm:px-7">
          <div className="mx-auto max-w-[1320px] overflow-hidden rounded-[30px] bg-[#0c7f7c] text-white">
            <div className="grid lg:grid-cols-[1.05fr_.95fr]">
              <div className="p-8 sm:p-12 lg:p-14">
                <p className="text-[10px] font-semibold text-white/65">• Start with a clearer program view</p>
                <h2 className="mt-5 max-w-[650px] text-[42px] font-medium leading-[.98] tracking-[-.06em] sm:text-[60px]">Make child-health data easier to understand—and easier to act on.</h2>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link href="/dashboard" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-[11px] font-bold text-[#0b6764] transition hover:-translate-y-0.5">Open StuntLytics <ArrowUpRight className="size-3.5" /></Link>
                  <Link href="/about" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-[11px] font-bold text-white transition hover:bg-white/10">Review research context <BookOpenCheck className="size-3.5" /></Link>
                </div>
              </div>
              <div className="relative min-h-[360px] overflow-hidden bg-[#096d6a] p-8">
                <div className="absolute -right-20 -top-20 size-[300px] rounded-full border border-white/10" />
                <div className="absolute -bottom-24 left-10 size-[280px] rounded-full border border-white/10" />
                <div className="relative mx-auto mt-5 max-w-[400px] rounded-[24px] border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <div className="flex items-center justify-between"><div><p className="text-[9px] font-bold text-white/55">PROGRAM OVERVIEW</p><p className="mt-2 text-[16px] font-semibold">West Java monitoring</p></div><span className="size-2 rounded-full bg-[#82efe7]" /></div>
                  <div className="mt-7 grid grid-cols-2 gap-3">{[['25.2%','Prevalence'],['78.5%','Coverage'],['06','Priority areas'],['84%','Verified']].map(([value,label])=><div key={label} className="rounded-[18px] border border-white/10 bg-white/[.08] p-4"><p className="text-[24px] font-semibold tracking-[-.04em]">{value}</p><p className="mt-1 text-[9px] text-white/55">{label}</p></div>)}</div>
                  <div className="mt-3 flex items-center gap-3 rounded-[18px] bg-white p-4 text-[#172033]"><span className="flex size-9 items-center justify-center rounded-full bg-[#e4f5f2] text-[#0b8f8b]"><CheckCircle2 className="size-4" /></span><div><p className="text-[10px] font-bold">Follow-up connected</p><p className="mt-1 text-[9px] text-slate-500">Owner, deadline, progress and evidence</p></div></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white px-5 py-10 dark:bg-background sm:px-7">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-6 border-t border-black/[.07] pt-8 dark:border-white/10 lg:flex-row lg:items-center lg:justify-between">
          <BrandLogo />
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-[10px] font-semibold text-slate-500 dark:text-muted-foreground">
            <Link href="/about" className="hover:text-foreground">Research context</Link>
            <Link href="/platform" className="hover:text-foreground">Platform</Link>
            <Link href="/risk-map" className="hover:text-foreground">Regional map</Link>
            <Link href="/dashboard" className="hover:text-foreground">Workspace</Link>
          </div>
          <p className="text-[9px] text-slate-400">Decision support only · Not a clinical diagnosis.</p>
        </div>
      </footer>
    </div>
  )
}
