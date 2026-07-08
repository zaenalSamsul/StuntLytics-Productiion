'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, ClipboardCheck, RotateCcw, ShieldCheck, UserRoundCheck, Users } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Alert } from '@/components/Alert'
import { StatusBadge } from '@/components/StatusBadge'
import { useToast } from '@/components/ToastProvider'

interface FormData {
  childAge: string
  waterQuality: string
  sanitationAccess: string
  immunizationStatus: string
  nutritionProgram: string
  educationLevel: string
}

interface ScreeningResult {
  riskScore: number
  riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED'
  riskFactors: string[]
  recommendations: string[]
}

const initialForm: FormData = {
  childAge: '',
  waterQuality: '',
  sanitationAccess: '',
  immunizationStatus: '',
  nutritionProgram: '',
  educationLevel: '',
}

const selectClass = 'premium-input w-full'

export default function PredictionPage() {
  const [formData, setFormData] = useState<FormData>(initialForm)
  const [result, setResult] = useState<ScreeningResult | null>(null)
  const { notify } = useToast()

  const completed = useMemo(() => Object.values(formData).filter(Boolean).length, [formData])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const runScreening = () => {
    if (completed < 6) {
      notify({ tone: 'warning', title: 'Complete all screening factors', message: `${6 - completed} field${6 - completed === 1 ? '' : 's'} still require input.` })
      return
    }

    const factors: string[] = []
    const actions: string[] = []
    let score = 0.08

    const age = Number(formData.childAge)
    if (!Number.isFinite(age) || age < 0 || age > 60) {
      notify({ tone: 'warning', title: 'Check child age', message: 'Enter an age between 0 and 60 months.' })
      return
    }
    if (age < 24) score += 0.06

    if (formData.waterQuality === 'fair') score += 0.06
    if (formData.waterQuality === 'poor') { score += 0.16; factors.push('Poor-quality household water access') }
    if (formData.waterQuality === 'none') { score += 0.24; factors.push('No reported safe water access') }

    if (formData.sanitationAccess === 'basic') score += 0.05
    if (formData.sanitationAccess === 'limited') { score += 0.12; factors.push('Limited sanitation access') }
    if (formData.sanitationAccess === 'unimproved') { score += 0.20; factors.push('Unimproved sanitation conditions') }

    if (formData.immunizationStatus === 'partial') score += 0.08
    if (formData.immunizationStatus === 'incomplete') { score += 0.15; factors.push('Incomplete immunization continuity') }
    if (formData.immunizationStatus === 'none') { score += 0.20; factors.push('No reported immunization continuity') }

    if (formData.nutritionProgram === 'partial') score += 0.07
    if (formData.nutritionProgram === 'unenrolled') { score += 0.17; factors.push('Not enrolled in available nutrition follow-up') }

    if (formData.educationLevel === 'primary') score += 0.05
    if (formData.educationLevel === 'none') { score += 0.10; factors.push('Caregiver support may require more accessible counselling') }

    const riskScore = Math.min(0.92, Number(score.toFixed(2)))
    const riskLevel: ScreeningResult['riskLevel'] = riskScore >= 0.62 ? 'ELEVATED' : riskScore >= 0.34 ? 'MODERATE' : 'LOW'

    if (factors.some((item) => item.toLowerCase().includes('water') || item.toLowerCase().includes('sanitation'))) actions.push('Verify WASH conditions and connect the household to locally available services where appropriate.')
    if (factors.some((item) => item.toLowerCase().includes('immunization'))) actions.push('Review the child health record and arrange follow-up with qualified local health services.')
    if (formData.nutritionProgram !== 'enrolled') actions.push('Check eligibility and continuity for nutrition counselling or growth-monitoring follow-up.')
    actions.push('Confirm anthropometric measurements and clinical context with trained health personnel before escalation.')

    setResult({
      riskScore,
      riskLevel,
      riskFactors: factors.length ? factors : ['No major pressure signal identified from the selected screening factors'],
      recommendations: actions,
    })
    notify({ tone: 'success', title: 'Screening summary generated', message: 'The result is ready for human review and field verification.' })
  }

  const reset = () => {
    setFormData(initialForm)
    setResult(null)
    notify({ tone: 'info', title: 'Screening reset', message: 'All household inputs have been cleared.' })
  }

  const badgeStatus = result?.riskLevel === 'ELEVATED' ? 'attention' : result?.riskLevel === 'MODERATE' ? 'monitoring' : 'stable'

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Users className="size-5" />}
        eyebrow="Household review support"
        title="Family Screening Support"
        description="Structure household risk-factor review for follow-up prioritization. This demonstration uses transparent weighted rules, not a clinical diagnosis."
      >
        <button type="button" onClick={reset} className="btn-secondary"><RotateCcw className="size-4" /> Reset</button>
      </PageHeader>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="kpi-card">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><ClipboardCheck className="size-5" /></span>
          <div><p className="text-xs font-semibold text-muted-foreground">Completion</p><p className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">{completed}/6</p><p className="mt-1 text-xs text-text-secondary">Required review factors</p></div>
        </article>
        <article className="kpi-card">
          <span className="flex size-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary"><UserRoundCheck className="size-5" /></span>
          <div><p className="text-xs font-semibold text-muted-foreground">Review mode</p><p className="mt-1 text-lg font-extrabold tracking-tight text-foreground">Human-in-loop</p><p className="mt-1 text-xs text-text-secondary">Verification before escalation</p></div>
        </article>
        <article className="kpi-card">
          <span className="flex size-10 items-center justify-center rounded-xl bg-info/10 text-info"><ShieldCheck className="size-5" /></span>
          <div><p className="text-xs font-semibold text-muted-foreground">Data handling</p><p className="mt-1 text-lg font-extrabold tracking-tight text-foreground">Local demo</p><p className="mt-1 text-xs text-text-secondary">No form submission to backend</p></div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[400px_1fr]">
        <div className="clinical-card p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div><h2 className="text-lg font-bold text-foreground">Screening factors</h2><p className="mt-1 text-xs leading-5 text-text-secondary">Use observed or verified household information where available.</p></div>
            <span className="rounded-xl bg-primary/10 px-2.5 py-1 text-xs font-extrabold text-primary">{Math.round((completed / 6) * 100)}%</span>
          </div>

          <div className="space-y-4">
            <Field label="Child age (months)">
              <input type="number" min="0" max="60" name="childAge" value={formData.childAge} onChange={handleInputChange} placeholder="0–60" className={selectClass} />
            </Field>
            <Field label="Water quality access">
              <select name="waterQuality" value={formData.waterQuality} onChange={handleInputChange} className={selectClass}><option value="">Select access level</option><option value="good">Good quality</option><option value="fair">Fair quality</option><option value="poor">Poor quality</option><option value="none">No access</option></select>
            </Field>
            <Field label="Sanitation access">
              <select name="sanitationAccess" value={formData.sanitationAccess} onChange={handleInputChange} className={selectClass}><option value="">Select access level</option><option value="improved">Improved</option><option value="basic">Basic</option><option value="limited">Limited</option><option value="unimproved">Unimproved</option></select>
            </Field>
            <Field label="Immunization continuity">
              <select name="immunizationStatus" value={formData.immunizationStatus} onChange={handleInputChange} className={selectClass}><option value="">Select status</option><option value="complete">Complete</option><option value="partial">Partial</option><option value="incomplete">Incomplete</option><option value="none">None reported</option></select>
            </Field>
            <Field label="Nutrition program continuity">
              <select name="nutritionProgram" value={formData.nutritionProgram} onChange={handleInputChange} className={selectClass}><option value="">Select status</option><option value="enrolled">Enrolled</option><option value="partial">Partial continuity</option><option value="unenrolled">Not enrolled</option></select>
            </Field>
            <Field label="Caregiver education proxy">
              <select name="educationLevel" value={formData.educationLevel} onChange={handleInputChange} className={selectClass}><option value="">Select level</option><option value="higher">Higher education</option><option value="secondary">Secondary</option><option value="primary">Primary</option><option value="none">No formal education</option></select>
            </Field>

            <button type="button" onClick={runScreening} className="btn-primary w-full justify-center"><ClipboardCheck className="size-4" /> Generate review summary</button>
          </div>
        </div>

        {!result ? (
          <div className="clinical-card min-h-[520px] overflow-hidden">
            <div className="grid h-full min-h-[520px] place-items-center bg-[radial-gradient(circle_at_80%_10%,rgba(43,108,246,.12),transparent_34%),radial-gradient(circle_at_10%_90%,rgba(14,165,160,.10),transparent_32%)] p-8 text-center">
              <div className="max-w-md">
                <span className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary"><ClipboardCheck className="size-6" /></span>
                <h2 className="mt-5 text-xl font-extrabold tracking-tight text-foreground">Ready for structured review</h2>
                <p className="mt-2 text-sm leading-6 text-text-secondary">Complete all six factors to generate a transparent prioritization summary. No result is produced from hidden or constant demo values.</p>
                <div className="mt-6 rounded-2xl border border-border bg-card/75 p-4 text-left backdrop-blur">
                  <p className="text-xs font-extrabold uppercase tracking-[.12em] text-secondary">What happens next</p>
                  <ol className="mt-3 space-y-2 text-sm text-text-secondary"><li>1. Review input completeness.</li><li>2. Calculate weighted pressure signals.</li><li>3. Surface contributing factors.</li><li>4. Recommend verification steps.</li></ol>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="clinical-card p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[.13em] text-primary">Screening result</p>
                  <div className="mt-2 flex items-end gap-3"><p className="text-5xl font-extrabold tracking-[-.06em] text-foreground">{Math.round(result.riskScore * 100)}</p><span className="pb-1 text-sm font-bold text-muted-foreground">/ 100</span></div>
                  <p className="mt-2 text-sm text-text-secondary">Prioritization signal from the selected household factors.</p>
                </div>
                <StatusBadge status={badgeStatus} className="self-start" />
              </div>
              <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full transition-all ${result.riskLevel === 'ELEVATED' ? 'bg-warning' : result.riskLevel === 'MODERATE' ? 'bg-info' : 'bg-success'}`} style={{ width: `${result.riskScore * 100}%` }} /></div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <article className="clinical-card p-5 sm:p-6">
                <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-warning/10 text-warning"><AlertTriangle className="size-4" /></span><h3 className="text-base font-bold text-foreground">Contributing signals</h3></div>
                <ul className="mt-4 space-y-3">{result.riskFactors.map((factor) => <li key={factor} className="flex gap-3 rounded-xl border border-border-soft bg-muted/35 p-3 text-sm leading-5 text-text-secondary"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-warning" />{factor}</li>)}</ul>
              </article>

              <article className="clinical-card p-5 sm:p-6">
                <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-secondary/10 text-secondary"><CheckCircle2 className="size-4" /></span><h3 className="text-base font-bold text-foreground">Recommended verification</h3></div>
                <ul className="mt-4 space-y-3">{result.recommendations.map((action) => <li key={action} className="flex gap-3 rounded-xl border border-border-soft bg-muted/35 p-3 text-sm leading-5 text-text-secondary"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-secondary" />{action}</li>)}</ul>
              </article>
            </div>

            <button type="button" onClick={reset} className="btn-secondary w-full justify-center"><RotateCcw className="size-4" /> Start a new screening</button>
          </div>
        )}
      </section>

      <Alert
        type="warning"
        title="Screening support, not diagnosis"
        message="This frontend demonstration uses transparent weighted rules to illustrate prioritization workflow. Confirm measurements, clinical context, and intervention decisions with qualified health personnel and validated program protocols."
      />
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs font-bold text-foreground">{label}</span>{children}</label>
}
