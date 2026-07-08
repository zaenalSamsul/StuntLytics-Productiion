'use client'

import { Map, Route } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import dynamic from 'next/dynamic'

const RiskFlowMap = dynamic(() => import('@/components/RiskFlowMap').then((mod) => mod.RiskFlowMap), {
  ssr: false,
  loading: () => <div className="h-[620px] animate-pulse rounded-2xl border border-border bg-muted" aria-label="Loading interactive map" />,
})

export default function DashboardRiskMapPage() {
  return <div className="space-y-6"><PageHeader icon={<Map className="size-5"/>} eyebrow="Regional intelligence" title="Regional Risk Map" description="Interactive spatial view of district risk intensity, hotspots, and modelled directional risk-signal flows."/><RiskFlowMap/><div className="clinical-card p-5"><div className="flex items-start gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary"><Route className="size-4"/></span><p className="text-sm leading-6 text-text-secondary"><strong className="text-foreground">Interpretation:</strong> flow lines show analytical risk-signal direction and intervention pressure, not disease transmission. Stunting is not contagious.</p></div></div></div>
}
