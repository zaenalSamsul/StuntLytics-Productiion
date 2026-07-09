'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, CircleGauge, Cpu, HeartPulse, LoaderCircle, RefreshCw, ShieldCheck, Stethoscope } from 'lucide-react'
import { DataServiceUnavailable } from '@/components/DataServiceUnavailable'
import { PageHeader } from '@/components/PageHeader'
import { dashboardApi, FamilyPredictionPayload, FamilyPredictionResponse, ModelStatus } from '@/lib/api'

const initialForm: FamilyPredictionPayload = {
  tinggi_badan_ibu_cm: 155,
  lila_saat_hamil_cm: 25,
  bmi_pra_hamil: 22,
  hb_g_dl: 11,
  kenaikan_bb_hamil_kg: 12,
  usia_ibu_saat_hamil_tahun: 28,
  jarak_kehamilan_sebelumnya_bulan: 24,
  kunjungan_anc_x: 4,
  jumlah_anak: 1,
  kepatuhan_ttd: 'Rutin',
  pendidikan_ibu: 'SMA',
  jenis_pekerjaan_orang_tua: 'Wiraswasta',
  status_pernikahan: 'Menikah',
  kepesertaan_program_bantuan: 'Tidak',
  akses_air_bersih: 'Ya',
  paparan_asap_rokok: 'Tidak',
  hipertensi_ibu: 0,
  diabetes_ibu: 0,
}

const educationOptions = ['SD', 'SMP', 'SMA', 'Diploma', 'S1', 'S2/S3', 'Tidak Sekolah']
const occupationOptions = ['Buruh', 'Lainnya', 'Nelayan', 'PNS/TNI/Polri', 'Petani/Buruh Tani', 'TKI/TKW', 'Wiraswasta']

function NumberField({ label, field, value, min, max, step = 1, onChange, helper }: { label: string; field: keyof FamilyPredictionPayload; value: number; min: number; max: number; step?: number; onChange: (field: keyof FamilyPredictionPayload, value: number) => void; helper?: string }) {
  return <label className="block"><span className="text-[11px] font-extrabold text-foreground">{label}</span><input type="number" min={min} max={max} step={step} value={value} onChange={(event) => onChange(field, Number(event.target.value))} className="premium-input mt-1.5" />{helper && <span className="mt-1 block text-[10px] leading-4 text-muted-foreground">{helper}</span>}</label>
}

function SelectField({ label, field, value, options, onChange }: { label: string; field: keyof FamilyPredictionPayload; value: string | number; options: Array<string | { label: string; value: number }>; onChange: (field: keyof FamilyPredictionPayload, value: string | number) => void }) {
  return <label className="block"><span className="text-[11px] font-extrabold text-foreground">{label}</span><select value={String(value)} onChange={(event) => { const matched = options.find((item) => typeof item === 'object' && String(item.value) === event.target.value); onChange(field, matched && typeof matched === 'object' ? matched.value : event.target.value) }} className="premium-input mt-1.5">{options.map((item) => typeof item === 'string' ? <option key={item} value={item}>{item}</option> : <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
}

export default function PredictionPage() {
  const [form, setForm] = useState<FamilyPredictionPayload>(initialForm)
  const [result, setResult] = useState<FamilyPredictionResponse | null>(null)
  const [model, setModel] = useState<ModelStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dashboardApi.getModelStatus().then(setModel).catch(() => setModel(null))
  }, [])

  const setNumber = (field: keyof FamilyPredictionPayload, value: number) => setForm((current) => ({ ...current, [field]: value }))
  const setValue = (field: keyof FamilyPredictionPayload, value: string | number) => setForm((current) => ({ ...current, [field]: value }))

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await dashboardApi.getFamilyPrediction(form)
      setResult(response)
      setModel(response.model)
    } catch (reason: unknown) {
      const detail = typeof reason === 'object' && reason && 'response' in reason
        ? (reason as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : undefined
      setError(detail ?? (reason instanceof Error ? reason.message : 'Prediction failed'))
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const band = result?.riskBand
  const gaugeTone = band === 'high' ? '#d74646' : band === 'monitoring' ? '#d88716' : '#1d9b67'
  const modelReady = model?.available !== false

  const completion = useMemo(() => Object.values(form).filter((value) => value !== '' && value !== null && value !== undefined).length, [form])

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<HeartPulse className="size-5" />}
        eyebrow="Bundled machine-learning pipeline"
        title="Maternal & Family Risk Screening"
        description="Run the original local StuntLytics scikit-learn pipeline against the 18 maternal, pregnancy, household, and access variables used by the legacy data-science feature."
      >
        <button type="button" onClick={() => { setForm(initialForm); setResult(null); setError(null) }} className="btn-secondary"><RefreshCw className="size-4" /> Reset form</button>
      </PageHeader>

      {error && (error.includes('data-science service') ? <DataServiceUnavailable message={error} /> : <div className="rounded-2xl border border-danger/20 bg-danger/5 p-5"><div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 size-5 shrink-0 text-danger"/><div><h3 className="text-sm font-extrabold text-foreground">Prediction could not run</h3><p className="mt-1 text-xs leading-5 text-text-secondary">{error}</p></div></div></div>)}

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form onSubmit={submit} className="space-y-5">
          <article className="clinical-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border-soft px-5 py-4"><div><h2 className="section-title">1. Maternal nutrition & pregnancy</h2><p className="section-description">Continuous fields passed to the serialized preprocessing and classifier pipeline.</p></div><span className="rounded-lg bg-primary/8 px-2.5 py-1 text-[10px] font-extrabold text-primary">9 variables</span></div>
            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
              <NumberField label="Maternal height (cm)" field="tinggi_badan_ibu_cm" value={form.tinggi_badan_ibu_cm} min={130} max={200} onChange={setNumber} />
              <NumberField label="MUAC during pregnancy (cm)" field="lila_saat_hamil_cm" value={form.lila_saat_hamil_cm} min={15} max={40} step={0.1} onChange={setNumber} />
              <NumberField label="Pre-pregnancy BMI" field="bmi_pra_hamil" value={form.bmi_pra_hamil} min={10} max={40} step={0.1} onChange={setNumber} />
              <NumberField label="Haemoglobin (g/dL)" field="hb_g_dl" value={form.hb_g_dl} min={5} max={20} step={0.1} onChange={setNumber} />
              <NumberField label="Pregnancy weight gain (kg)" field="kenaikan_bb_hamil_kg" value={form.kenaikan_bb_hamil_kg} min={0} max={30} step={0.1} onChange={setNumber} />
              <NumberField label="Maternal age (years)" field="usia_ibu_saat_hamil_tahun" value={form.usia_ibu_saat_hamil_tahun} min={15} max={50} onChange={setNumber} />
              <NumberField label="Previous pregnancy interval (months)" field="jarak_kehamilan_sebelumnya_bulan" value={form.jarak_kehamilan_sebelumnya_bulan} min={0} max={120} onChange={setNumber} />
              <NumberField label="ANC visits recorded" field="kunjungan_anc_x" value={form.kunjungan_anc_x} min={0} max={20} onChange={setNumber} />
              <SelectField label="Iron-tablet adherence" field="kepatuhan_ttd" value={form.kepatuhan_ttd} options={['Rutin', 'Tidak Rutin']} onChange={setValue} />
            </div>
          </article>

          <article className="clinical-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border-soft px-5 py-4"><div><h2 className="section-title">2. Household & access context</h2><p className="section-description">Categorical and binary fields preserved from the original prediction form.</p></div><span className="rounded-lg bg-secondary/8 px-2.5 py-1 text-[10px] font-extrabold text-secondary">9 variables</span></div>
            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
              <SelectField label="Maternal education" field="pendidikan_ibu" value={form.pendidikan_ibu} options={educationOptions} onChange={setValue} />
              <SelectField label="Parent occupation" field="jenis_pekerjaan_orang_tua" value={form.jenis_pekerjaan_orang_tua} options={occupationOptions} onChange={setValue} />
              <SelectField label="Marital status" field="status_pernikahan" value={form.status_pernikahan} options={['Menikah', 'Cerai']} onChange={setValue} />
              <NumberField label="Previous children" field="jumlah_anak" value={form.jumlah_anak} min={0} max={15} onChange={setNumber} />
              <SelectField label="Receives assistance program" field="kepesertaan_program_bantuan" value={form.kepesertaan_program_bantuan} options={['Ya', 'Tidak']} onChange={setValue} />
              <SelectField label="Adequate clean-water access" field="akses_air_bersih" value={form.akses_air_bersih} options={['Ya', 'Tidak']} onChange={setValue} />
              <SelectField label="Household smoke exposure" field="paparan_asap_rokok" value={form.paparan_asap_rokok} options={['Ya', 'Tidak']} onChange={setValue} />
              <SelectField label="Maternal hypertension history" field="hipertensi_ibu" value={form.hipertensi_ibu} options={[{ label: 'Tidak', value: 0 }, { label: 'Ya', value: 1 }]} onChange={setValue} />
              <SelectField label="Maternal diabetes history" field="diabetes_ibu" value={form.diabetes_ibu} options={[{ label: 'Tidak', value: 0 }, { label: 'Ya', value: 1 }]} onChange={setValue} />
            </div>
          </article>

          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-xs font-extrabold text-foreground">{completion}/18 fields ready</p><p className="mt-1 text-[11px] text-muted-foreground">Inference runs locally through the bundled serialized pipeline.</p></div>
            <button type="submit" disabled={loading || !modelReady} className="btn-primary min-w-[210px] disabled:cursor-not-allowed disabled:opacity-50">{loading ? <LoaderCircle className="size-4 animate-spin" /> : <CircleGauge className="size-4" />} {loading ? 'Running pipeline…' : 'Run ML screening'}</button>
          </div>
        </form>

        <aside className="space-y-5">
          <article className="clinical-card p-5">
            <div className="flex items-start justify-between gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Cpu className="size-5" /></span><span className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold ${model?.available ? 'bg-success/8 text-success' : 'bg-warning/8 text-warning'}`}>{model ? (model.available ? 'Model bundled' : 'Model missing') : 'Checking model…'}</span></div>
            <h2 className="mt-4 text-sm font-extrabold text-foreground">Local prediction engine</h2>
            <dl className="mt-4 space-y-3 text-[11px]"><div className="flex justify-between gap-3"><dt className="text-muted-foreground">Engine</dt><dd className="text-right font-bold text-foreground">{model?.engine ?? 'scikit-learn Pipeline'}</dd></div><div className="flex justify-between gap-3"><dt className="text-muted-foreground">Artifact</dt><dd className="text-right font-bold text-foreground">{model?.sizeMb ? `${model.sizeMb} MB` : '—'}</dd></div><div className="flex justify-between gap-3"><dt className="text-muted-foreground">Required sklearn</dt><dd className="font-bold text-foreground">{model?.requiredSklearn ?? '1.6.1'}</dd></div></dl>
            <p className="mt-4 rounded-xl bg-muted p-3 text-[10px] leading-5 text-text-secondary">Training metrics and external validation evidence are not bundled in the uploaded repository, so this UI does not invent performance claims.</p>
          </article>

          {result ? <article className="clinical-card overflow-hidden">
            <div className="border-b border-border-soft p-5"><p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-muted-foreground">Pipeline result</p><div className="mt-4 flex items-end gap-3"><span className="text-5xl font-extrabold tracking-[-.06em]" style={{ color: gaugeTone }}>{result.probability.toFixed(1)}%</span><span className="pb-1 text-xs font-bold text-muted-foreground">probability</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, result.probability)}%`, backgroundColor: gaugeTone }} /></div><div className="mt-3 flex items-center justify-between gap-3"><span className="text-sm font-extrabold text-foreground">{result.result}</span><span className="rounded-lg bg-muted px-2.5 py-1 text-[10px] font-extrabold uppercase text-text-secondary">{result.riskBand}</span></div></div>
            <div className="p-5"><h3 className="text-xs font-extrabold text-foreground">Context factors to verify</h3><div className="mt-3 space-y-2">{result.contextFactors.map((factor) => <div key={factor.label} className="rounded-xl border border-border bg-muted/40 p-3"><div className="flex items-center gap-2"><span className={`size-2 rounded-full ${factor.severity === 'high' ? 'bg-danger' : factor.severity === 'stable' ? 'bg-success' : 'bg-warning'}`} /><p className="text-[11px] font-extrabold text-foreground">{factor.label}</p></div><p className="mt-1.5 text-[10px] leading-5 text-text-secondary">{factor.reason}</p></div>)}</div></div>
          </article> : <article className="rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center"><Stethoscope className="mx-auto size-7 text-muted-foreground"/><p className="mt-3 text-xs font-extrabold text-foreground">No inference yet</p><p className="mt-1 text-[11px] leading-5 text-muted-foreground">Complete the form and run the local pipeline to view the probability and verification context.</p></article>}
        </aside>
      </section>

      {result && <section className="grid gap-5 xl:grid-cols-12">
        <article className="clinical-card p-5 sm:p-6 xl:col-span-7"><div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success"><CheckCircle2 className="size-5" /></span><div><h2 className="text-sm font-extrabold text-foreground">Follow-up considerations</h2><div className="mt-3 space-y-2">{result.followUpConsiderations.map((item, index) => <div key={item} className="flex gap-2 text-xs leading-6 text-text-secondary"><span className="font-extrabold text-primary">{index + 1}.</span><span>{item}</span></div>)}</div></div></div></article>
        <article className="rounded-2xl border border-warning/20 bg-warning/5 p-5 sm:p-6 xl:col-span-5"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-warning"/><div><h2 className="text-sm font-extrabold text-foreground">Clinical safety boundary</h2><p className="mt-2 text-xs leading-6 text-text-secondary">{result.guardrail}</p><p className="mt-3 text-[10px] font-bold text-muted-foreground">Decision threshold used by the original pipeline wrapper: {result.decisionThreshold}%.</p></div></div></article>
      </section>}
    </div>
  )
}
