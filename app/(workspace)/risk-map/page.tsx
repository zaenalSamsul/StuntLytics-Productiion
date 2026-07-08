'use client'

import { AlertTriangle, BarChart3, Layers3, Map as MapIcon, MapPinned, RadioTower, Route } from 'lucide-react'
import { Alert } from '@/components/Alert'
import { FilterSummary } from '@/components/FilterSummary'
import { MetricCard } from '@/components/MetricCard'
import { PageHeader } from '@/components/PageHeader'
import dynamic from 'next/dynamic'
import { StatusBadge } from '@/components/StatusBadge'
import { dashboardApi, FilterParams, RiskMapData } from '@/lib/api'
import { useEffect, useState } from 'react'

const RiskFlowMap = dynamic(() => import('@/components/RiskFlowMap').then((mod) => mod.RiskFlowMap), {
  ssr: false,
  loading: () => <div className="h-[620px] animate-pulse rounded-2xl border border-border bg-muted" aria-label="Loading interactive map" />,
})

export default function RiskMapPage() {
  const [filters] = useState<FilterParams>({})
  const [riskData, setRiskData] = useState<RiskMapData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    let active = true
    dashboardApi.getRiskMapData(filters)
      .then((items) => { if (active && Array.isArray(items)) setRiskData(items) })
      .catch(() => { if (active) setIsError(true) })
      .finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [filters])

  const mapMetrics = [
    { icon: <MapPinned className="size-5" />, title: 'District Boundaries', value: '627', context: 'West Java subdistricts' },
    { icon: <Route className="size-5" />, title: 'Risk Signal Flows', value: '7', context: 'Directional pathways' },
    { icon: <RadioTower className="size-5" />, title: 'Priority Hotspots', value: '5', context: 'Active monitoring nodes' },
    { icon: <BarChart3 className="size-5" />, title: 'Spatial Layers', value: '3', context: 'Risk, heat, flow' },
  ]

  return (
    <div className="space-y-8">
      <PageHeader icon={<MapIcon className="size-5" />} eyebrow="Geospatial early warning" title="Regional Risk Intelligence Map" description="Explore district-level risk intensity, hotspot pressure, and directional risk-signal flows with an interactive West Java spatial layer.">
        <span className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-secondary/15 bg-surface-mint px-3.5 text-xs font-semibold text-secondary"><Layers3 className="size-4" /> Live layer controls</span>
      </PageHeader>

      <FilterSummary filters={filters} />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {mapMetrics.map((metric) => <MetricCard key={metric.title} {...metric} />)}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="section-title">Spatial flow intelligence</h2><p className="section-description">Switch between choropleth risk, hotspot heat, and directional flow intelligence. Click districts and flow paths for details.</p></div><div className="flex items-center gap-2"><StatusBadge status="monitoring"/><span className="text-xs text-muted-foreground">{isLoading ? 'Syncing API…' : riskData.length ? `${riskData.length} API records` : 'Illustrative fallback layer'}</span></div></div>
        <RiskFlowMap riskData={riskData} />
      </section>

      <section className="grid gap-5 xl:grid-cols-12">
        <article className="clinical-card p-5 sm:p-6 xl:col-span-7">
          <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary"><Route className="size-5"/></span><div><h2 className="font-semibold text-foreground">How to read the flow layer</h2><p className="mt-1 text-sm leading-6 text-text-secondary">Curved paths represent directional analytic relationships between regional risk signals and intervention pressure. Line width reflects relative intensity; color indicates rising, stable, or improving direction.</p></div></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-danger/15 bg-danger/5 p-3"><p className="text-xs font-bold text-danger">Rising</p><p className="mt-1 text-xs leading-5 text-text-secondary">Escalating signal requiring review</p></div><div className="rounded-xl border border-info/15 bg-info/5 p-3"><p className="text-xs font-bold text-info">Stable</p><p className="mt-1 text-xs leading-5 text-text-secondary">Persistent monitoring pattern</p></div><div className="rounded-xl border border-secondary/15 bg-secondary/5 p-3"><p className="text-xs font-bold text-secondary">Improving</p><p className="mt-1 text-xs leading-5 text-text-secondary">Signal moving toward lower pressure</p></div></div>
        </article>
        <article className="clinical-card p-5 sm:p-6 xl:col-span-5"><div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-warning/8 text-warning"><AlertTriangle className="size-5"/></span><div><h2 className="font-semibold text-foreground">Scientific interpretation guardrail</h2><p className="mt-1 text-sm leading-6 text-text-secondary">Stunting is not contagious. The animated flow layer must be interpreted as modelled movement of risk signals, shared determinant pressure, referrals, or intervention coordination—not person-to-person transmission.</p></div></div></article>
      </section>

      {isError && <Alert type="warning" message="The live risk-map API could not be reached. The map is displaying its deterministic illustrative fallback layer while preserving full interaction." />}
      <Alert type="info" message="For production deployment, connect the flow layer to longitudinal regional observations and validated spatial modelling outputs. Illustrative fallback values are explicitly identified in district popups." />
    </div>
  )
}
