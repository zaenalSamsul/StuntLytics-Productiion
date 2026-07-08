'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import maplibregl, { GeoJSONSource, Map as MapLibreMap, Popup } from 'maplibre-gl'
import { AlertTriangle, Layers3, LocateFixed, Pause, Play, RotateCcw, Route, Sparkles } from 'lucide-react'
import type { RiskMapData } from '@/lib/api'
import { curvedFlowCoordinates, riskFlows, riskHotspots } from '@/lib/riskFlows'
import { cn } from '@/lib/utils'

interface RiskFlowMapProps {
  riskData?: RiskMapData[]
  className?: string
}

type LayerMode = 'risk' | 'heat' | 'flow'
type Scenario = 'observed' | 'projected'

const baseStyle: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    { id: 'osm', type: 'raster', source: 'osm', paint: { 'raster-opacity': 0.9, 'raster-saturation': -0.45, 'raster-contrast': 0.08, 'raster-brightness-max': 0.97 } },
  ],
}

function flowFeatureCollection(multiplier = 1) {
  return {
    type: 'FeatureCollection' as const,
    features: riskFlows.map((flow) => ({
      type: 'Feature' as const,
      properties: { ...flow, intensity: Math.min(1, flow.intensity * multiplier) },
      geometry: { type: 'LineString' as const, coordinates: curvedFlowCoordinates(flow.source, flow.target) },
    })),
  }
}

function hotspotFeatureCollection(multiplier = 1) {
  return {
    type: 'FeatureCollection' as const,
    features: riskHotspots.map((hotspot) => ({
      type: 'Feature' as const,
      properties: { name: hotspot.name, intensity: Math.min(1, hotspot.intensity * multiplier) },
      geometry: { type: 'Point' as const, coordinates: hotspot.coordinates },
    })),
  }
}

export function RiskFlowMap({ riskData = [], className }: RiskFlowMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const animationRef = useRef<number | null>(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(true)
  const [layerMode, setLayerMode] = useState<LayerMode>('flow')
  const [scenario, setScenario] = useState<Scenario>('observed')
  const [timeIndex, setTimeIndex] = useState(72)
  const [mapError, setMapError] = useState<string | null>(null)

  const dataLookup = useMemo(() => {
    const lookup = new Map<string, RiskMapData>()
    riskData.forEach((item) => lookup.set(item.kecamatan.trim().toUpperCase(), item))
    return lookup
  }, [riskData])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: baseStyle,
      center: [107.65, -6.85],
      zoom: 7.15,
      pitch: 34,
      bearing: -4,
      minZoom: 6.2,
      maxZoom: 14,
      attributionControl: false,
    })
    mapRef.current = map
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right')
    map.addControl(new maplibregl.FullscreenControl(), 'bottom-right')
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric', maxWidth: 110 }), 'bottom-left')
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left')

    const onLoad = async () => {
      try {
        const response = await fetch('/data/jawa-barat-simplified.geojson')
        if (!response.ok) throw new Error(`Boundary data returned ${response.status}`)
        const geojson = await response.json()
        for (const feature of geojson.features ?? []) {
          const district = String(feature.properties?.KECAMATAN ?? '').trim().toUpperCase()
          const apiValue = dataLookup.get(district)
          if (apiValue) {
            feature.properties.risk_index = apiValue.prevalensi
            feature.properties.case_count = apiValue.jumlahStunting
            feature.properties.total_children = apiValue.totalAnak
            feature.properties.data_source = 'API'
          } else {
            feature.properties.risk_index = feature.properties.risk_index_demo
            feature.properties.data_source = 'Illustrative fallback'
          }
        }

        map.addSource('district-risk', { type: 'geojson', data: geojson })
        map.addLayer({
          id: 'district-fill',
          type: 'fill',
          source: 'district-risk',
          paint: {
            'fill-color': ['interpolate', ['linear'], ['coalesce', ['get', 'risk_index'], 0], 8, '#dbeafe', 15, '#93c5fd', 22, '#2dd4bf', 28, '#fbbf24', 35, '#f97316', 43, '#dc2626'],
            'fill-opacity': 0.58,
          },
        })
        map.addLayer({ id: 'district-outline', type: 'line', source: 'district-risk', paint: { 'line-color': '#ffffff', 'line-width': ['interpolate', ['linear'], ['zoom'], 6, 0.3, 10, 1.1], 'line-opacity': 0.75 } })

        map.addSource('risk-flows', { type: 'geojson', data: flowFeatureCollection() })
        map.addLayer({ id: 'flow-glow', type: 'line', source: 'risk-flows', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': ['match', ['get', 'direction'], 'rising', '#ef4444', 'improving', '#14b8a6', '#3b82f6'], 'line-width': ['interpolate', ['linear'], ['get', 'intensity'], 0.5, 4, 1, 9], 'line-opacity': 0.18, 'line-blur': 4 } })
        map.addLayer({ id: 'flow-lines', type: 'line', source: 'risk-flows', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': ['match', ['get', 'direction'], 'rising', '#dc2626', 'improving', '#0d9488', '#2563eb'], 'line-width': ['interpolate', ['linear'], ['get', 'intensity'], 0.5, 1.6, 1, 4.5], 'line-opacity': 0.9, 'line-dasharray': [1.1, 1.4] } })

        map.addSource('hotspots', { type: 'geojson', data: hotspotFeatureCollection() })
        map.addLayer({ id: 'risk-heat', type: 'heatmap', source: 'hotspots', maxzoom: 11, paint: { 'heatmap-weight': ['interpolate', ['linear'], ['get', 'intensity'], 0, 0, 1, 1], 'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 6, 0.9, 10, 2.4], 'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'], 0, 'rgba(37,99,235,0)', 0.25, 'rgba(59,130,246,.42)', 0.48, 'rgba(20,184,166,.55)', 0.7, 'rgba(245,158,11,.64)', 0.88, 'rgba(249,115,22,.75)', 1, 'rgba(220,38,38,.85)'], 'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 6, 24, 10, 48], 'heatmap-opacity': 0.72 } })
        map.addLayer({ id: 'hotspot-pulse', type: 'circle', source: 'hotspots', paint: { 'circle-radius': ['interpolate', ['linear'], ['get', 'intensity'], 0.5, 7, 1, 14], 'circle-color': '#ffffff', 'circle-stroke-color': '#dc2626', 'circle-stroke-width': 3, 'circle-opacity': 0.92, 'circle-stroke-opacity': 0.75 } })

        map.on('mouseenter', 'district-fill', () => { map.getCanvas().style.cursor = 'pointer' })
        map.on('mouseleave', 'district-fill', () => { map.getCanvas().style.cursor = '' })
        map.on('click', 'district-fill', (event) => {
          const feature = event.features?.[0]
          if (!feature?.properties) return
          const p = feature.properties
          new Popup({ closeButton: true, maxWidth: '290px', offset: 12 })
            .setLngLat(event.lngLat)
            .setHTML(`<div style="font-family:Inter,sans-serif;padding:3px"><div style="font-size:11px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:.08em">${p.KABKOT ?? 'West Java'}</div><div style="font-size:15px;font-weight:800;color:#0f172a;margin-top:3px">${p.KECAMATAN ?? 'District'}</div><div style="margin-top:9px;font-size:12px;color:#475569">Risk signal index</div><div style="font-size:22px;font-weight:800;color:#0f172a">${Number(p.risk_index ?? 0).toFixed(1)}%</div><div style="margin-top:7px;font-size:10px;color:#64748b">Source: ${p.data_source ?? 'Monitoring layer'}</div></div>`)
            .addTo(map)
        })
        map.on('click', 'flow-lines', (event) => {
          const p = event.features?.[0]?.properties
          if (!p) return
          new Popup({ maxWidth: '310px', offset: 10 }).setLngLat(event.lngLat).setHTML(`<div style="font-family:Inter,sans-serif;padding:3px"><div style="font-size:11px;color:#2563eb;font-weight:800;text-transform:uppercase;letter-spacing:.08em">Modelled risk-signal flow</div><div style="font-size:14px;font-weight:800;color:#0f172a;margin-top:4px">${p.sourceName} → ${p.targetName}</div><div style="font-size:12px;color:#475569;margin-top:6px;line-height:1.5">${p.driver}</div><div style="font-size:10px;color:#64748b;margin-top:8px">Directional analytic overlay, not disease transmission.</div></div>`).addTo(map)
        })

        setReady(true)
      } catch (error) {
        setMapError(error instanceof Error ? error.message : 'Unable to load geographic layer')
      }
    }

    map.on('load', onLoad)
    map.on('error', (event) => {
      const message = event.error?.message ?? ''
      if (message && !message.includes('tile')) setMapError(message)
    })

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      map.remove()
      mapRef.current = null
    }
  }, [dataLookup])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    const visibility = (visible: boolean) => visible ? 'visible' : 'none'
    map.setLayoutProperty('district-fill', 'visibility', visibility(layerMode === 'risk' || layerMode === 'flow'))
    map.setLayoutProperty('risk-heat', 'visibility', visibility(layerMode === 'heat' || layerMode === 'flow'))
    map.setLayoutProperty('flow-glow', 'visibility', visibility(layerMode === 'flow'))
    map.setLayoutProperty('flow-lines', 'visibility', visibility(layerMode === 'flow'))
    map.setLayoutProperty('hotspot-pulse', 'visibility', visibility(layerMode !== 'risk'))
  }, [layerMode, ready])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    const multiplier = scenario === 'projected' ? 1.12 : 1
    ;(map.getSource('risk-flows') as GeoJSONSource | undefined)?.setData(flowFeatureCollection(multiplier))
    ;(map.getSource('hotspots') as GeoJSONSource | undefined)?.setData(hotspotFeatureCollection(multiplier))
  }, [scenario, ready])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready || !playing) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return
    let last = 0
    const frame = (time: number) => {
      if (time - last > 110) {
        const phase = Math.floor(time / 110) % 8
        const patterns = [[0.5, 2.1], [0.8, 1.8], [1.1, 1.5], [1.4, 1.2], [1.7, 0.9], [2, 0.6], [1.7, 0.9], [1.1, 1.5]]
        if (map.getLayer('flow-lines')) map.setPaintProperty('flow-lines', 'line-dasharray', patterns[phase])
        if (map.getLayer('hotspot-pulse')) map.setPaintProperty('hotspot-pulse', 'circle-stroke-opacity', 0.35 + 0.5 * Math.abs(Math.sin(time / 650)))
        last = time
      }
      animationRef.current = requestAnimationFrame(frame)
    }
    animationRef.current = requestAnimationFrame(frame)
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current) }
  }, [playing, ready])

  const resetView = () => mapRef.current?.easeTo({ center: [107.65, -6.85], zoom: 7.15, pitch: 34, bearing: -4, duration: 900 })

  return (
    <div className={cn('relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm', className)}>
      <div ref={containerRef} className="h-[620px] w-full bg-slate-100" aria-label="Interactive West Java risk intelligence map" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col gap-3 p-3 sm:p-4">
        <div className="pointer-events-auto flex flex-wrap items-center gap-2 self-start rounded-2xl border border-white/50 bg-white/92 p-2 shadow-lg backdrop-blur-xl">
          <span className="hidden items-center gap-1.5 px-2 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 sm:flex"><Layers3 className="size-3.5"/> Layers</span>
          {(['risk','heat','flow'] as LayerMode[]).map((mode)=><button key={mode} type="button" onClick={()=>setLayerMode(mode)} className={cn('min-h-9 rounded-xl px-3 text-[11px] font-bold capitalize transition',layerMode===mode?'bg-blue-600 text-white shadow-sm':'text-slate-600 hover:bg-slate-100')}>{mode === 'flow' ? 'Flow intelligence' : mode}</button>)}
        </div>

        <div className="pointer-events-auto flex flex-wrap items-center gap-2 self-start rounded-2xl border border-white/50 bg-white/92 p-2 shadow-lg backdrop-blur-xl">
          <button type="button" onClick={()=>setPlaying((value)=>!value)} className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white" aria-label={playing?'Pause flow animation':'Play flow animation'}>{playing?<Pause className="size-4"/>:<Play className="size-4"/>}</button>
          <div className="hidden h-6 w-px bg-slate-200 sm:block"/>
          {(['observed','projected'] as Scenario[]).map((item)=><button key={item} type="button" onClick={()=>setScenario(item)} className={cn('min-h-9 rounded-xl px-3 text-[11px] font-bold capitalize transition',scenario===item?'bg-teal-600 text-white':'text-slate-600 hover:bg-slate-100')}>{item}</button>)}
          <button type="button" onClick={resetView} className="flex size-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100" aria-label="Reset map view"><RotateCcw className="size-4"/></button>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-7 left-3 right-3 z-10 sm:left-4 sm:right-auto sm:w-[390px]">
        <div className="pointer-events-auto rounded-2xl border border-white/50 bg-slate-950/88 p-4 text-white shadow-2xl backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2 text-xs font-bold"><Sparkles className="size-4 text-teal-300"/> Risk Signal Flow</div><p className="mt-1 text-[11px] leading-5 text-slate-300">Directional analytic overlay for risk escalation and intervention pressure—not disease transmission.</p></div><span className="rounded-lg bg-white/10 px-2 py-1 text-[10px] font-bold text-teal-200">{scenario}</span></div>
          <div className="mt-3 flex items-center gap-3"><Route className="size-4 shrink-0 text-blue-300"/><input type="range" min="0" max="100" value={timeIndex} onChange={(event)=>setTimeIndex(Number(event.target.value))} className="w-full accent-teal-400" aria-label="Risk flow timeline"/><span className="w-9 text-right text-[10px] font-bold tabular-nums text-slate-300">T+{timeIndex}</span></div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]"><span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-red-500"/> Rising</span><span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-blue-500"/> Stable</span><span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-teal-500"/> Improving</span></div>
        </div>
      </div>

      {!ready && !mapError && <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/10 backdrop-blur-sm"><div className="rounded-2xl border border-white/60 bg-white/95 px-5 py-4 text-sm font-semibold text-slate-800 shadow-xl"><LocateFixed className="mr-2 inline size-4 animate-pulse text-blue-600"/> Loading spatial intelligence…</div></div>}
      {mapError && <div className="absolute inset-x-4 top-4 z-30 rounded-xl border border-red-200 bg-white/95 p-4 text-sm text-red-700 shadow-xl"><AlertTriangle className="mr-2 inline size-4"/> Geographic overlay error: {mapError}</div>}
    </div>
  )
}
