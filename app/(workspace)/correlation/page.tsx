'use client'

import { useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, BarChart3, Download, Microscope, SearchCheck } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { ChartWrapper } from '@/components/ChartWrapper'
import { Alert } from '@/components/Alert'
import { useToast } from '@/components/ToastProvider'
import { downloadTextFile, toCsv } from '@/lib/download'

const factors = [
  { factor: 'Water quality pressure', value: 0.65, domain: 'WASH', interpretation: 'Higher pressure appears alongside higher prevalence.' },
  { factor: 'Sanitation pressure', value: 0.72, domain: 'WASH', interpretation: 'The strongest positive association in this review set.' },
  { factor: 'Healthcare worker density', value: -0.58, domain: 'Services', interpretation: 'Higher workforce availability appears alongside lower prevalence.' },
  { factor: 'Immunization continuity', value: -0.81, domain: 'Services', interpretation: 'The strongest inverse association in this review set.' },
  { factor: 'Nutrition program continuity', value: -0.76, domain: 'Nutrition', interpretation: 'More continuous coverage appears alongside lower prevalence.' },
  { factor: 'Caregiver education proxy', value: -0.64, domain: 'Household', interpretation: 'Higher education proxy values appear alongside lower prevalence.' },
]

const trendAnalysis = [
  { month: 'Jan', sanitationPressure: 48, serviceCoverage: 68, nutritionContinuity: 52 },
  { month: 'Feb', sanitationPressure: 46, serviceCoverage: 70, nutritionContinuity: 55 },
  { month: 'Mar', sanitationPressure: 44, serviceCoverage: 72, nutritionContinuity: 58 },
  { month: 'Apr', sanitationPressure: 42, serviceCoverage: 75, nutritionContinuity: 60 },
  { month: 'May', sanitationPressure: 40, serviceCoverage: 78, nutritionContinuity: 63 },
  { month: 'Jun', sanitationPressure: 38, serviceCoverage: 80, nutritionContinuity: 65 },
]

const reviewQuestions = [
  { title: 'Validate service continuity', text: 'Compare immunization drop-out and nutrition follow-up gaps in the highest-priority districts.' },
  { title: 'Inspect WASH pressure', text: 'Review whether sanitation and water access pressure clusters overlap with persistent child-growth risk.' },
  { title: 'Check staffing context', text: 'Compare workforce density with travel time, caseload, and referral completion before deciding deployment changes.' },
  { title: 'Triangulate household factors', text: 'Use field verification and local program data before treating education proxies as intervention targets.' },
]

export default function CorrelationPage() {
  const [view, setView] = useState<'association' | 'magnitude'>('association')
  const { notify } = useToast()

  const chartData = useMemo(
    () => factors.map((item) => ({ factor: item.factor.replace(' pressure', ''), value: view === 'magnitude' ? Math.abs(item.value) : item.value })),
    [view],
  )

  const exportFactors = () => {
    downloadTextFile(
      'stuntlytics-factor-review.csv',
      toCsv(factors.map((item) => ({ ...item, coefficient: item.value }))),
      'text/csv;charset=utf-8',
    )
    notify({ tone: 'success', title: 'Factor review exported', message: 'The CSV includes coefficients, domains, and interpretation notes.' })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<BarChart3 className="size-5" />}
        eyebrow="Determinant exploration"
        title="Factor & Trend Review"
        description="Explore observed associations between child-growth outcomes and program determinants without treating correlation as proof of causation."
      >
        <button type="button" onClick={exportFactors} className="btn-secondary">
          <Download className="size-4" /> Export factors
        </button>
      </PageHeader>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="kpi-card">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><ArrowDownRight className="size-5" /></span>
          <div><p className="text-xs font-semibold text-muted-foreground">Strongest inverse signal</p><p className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">−0.81</p><p className="mt-1 text-xs text-text-secondary">Immunization continuity</p></div>
        </article>
        <article className="kpi-card">
          <span className="flex size-10 items-center justify-center rounded-xl bg-warning/10 text-warning"><ArrowUpRight className="size-5" /></span>
          <div><p className="text-xs font-semibold text-muted-foreground">Strongest positive signal</p><p className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">+0.72</p><p className="mt-1 text-xs text-text-secondary">Sanitation pressure</p></div>
        </article>
        <article className="kpi-card">
          <span className="flex size-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary"><Microscope className="size-5" /></span>
          <div><p className="text-xs font-semibold text-muted-foreground">Factors reviewed</p><p className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">6</p><p className="mt-1 text-xs text-text-secondary">Across 4 program domains</p></div>
        </article>
        <article className="kpi-card">
          <span className="flex size-10 items-center justify-center rounded-xl bg-info/10 text-info"><SearchCheck className="size-5" /></span>
          <div><p className="text-xs font-semibold text-muted-foreground">Decision rule</p><p className="mt-1 text-lg font-extrabold tracking-tight text-foreground">Verify first</p><p className="mt-1 text-xs text-text-secondary">Field review before action</p></div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_.85fr]">
        <div className="clinical-card overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-border-soft p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-base font-bold text-foreground sm:text-lg">Association profile</h2>
              <p className="mt-1 text-sm text-text-secondary">Coefficient direction and relative strength from the current analytical review set.</p>
            </div>
            <div className="inline-flex rounded-xl border border-border bg-muted/55 p-1">
              <button type="button" onClick={() => setView('association')} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${view === 'association' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Direction</button>
              <button type="button" onClick={() => setView('magnitude')} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${view === 'magnitude' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Magnitude</button>
            </div>
          </div>
          <div className="p-1 sm:p-2">
            <ChartWrapper type="bar" data={chartData} height={360} className="border-0 bg-transparent shadow-none" />
          </div>
        </div>

        <aside className="clinical-card p-5 sm:p-6">
          <div className="mb-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[.13em] text-secondary">Interpretation discipline</p>
            <h2 className="mt-1 text-lg font-bold text-foreground">What this view can support</h2>
          </div>
          <div className="space-y-3">
            {factors.slice(0, 4).map((item) => (
              <div key={item.factor} className="rounded-xl border border-border-soft bg-muted/35 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-foreground">{item.factor}</p>
                  <span className={`rounded-lg px-2 py-1 text-[11px] font-extrabold ${item.value < 0 ? 'bg-secondary/10 text-secondary' : 'bg-warning/10 text-warning'}`}>{item.value > 0 ? '+' : ''}{item.value.toFixed(2)}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-text-secondary">{item.interpretation}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <ChartWrapper
        type="line"
        title="Program context over six review periods"
        subtitle="Illustrative trend view for pressure and service-continuity indicators; values should be replaced by validated longitudinal data."
        data={trendAnalysis}
        height={340}
      />

      <section>
        <div className="mb-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[.13em] text-primary">From analysis to field review</p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-foreground">Questions worth investigating next</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {reviewQuestions.map((item, index) => (
            <article key={item.title} className="clinical-card flex gap-4 p-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-extrabold text-primary">0{index + 1}</span>
              <div><h3 className="text-sm font-bold text-foreground">{item.title}</h3><p className="mt-1.5 text-sm leading-6 text-text-secondary">{item.text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <Alert
        type="info"
        title="Association is not causation"
        message="Use this page to prioritize questions and verification. Intervention decisions should combine validated data, local context, field review, and qualified health-program expertise."
      />
    </div>
  )
}
