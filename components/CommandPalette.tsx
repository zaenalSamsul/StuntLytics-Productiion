'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Activity, Bell, BrainCircuit, Command, Database, Map, Search, ShieldAlert, TrendingUp, Users, X } from 'lucide-react'

const commands = [
  { label: 'Open dashboard', keywords: 'overview home health', href: '/dashboard', icon: Activity },
  { label: 'Open regional risk map', keywords: 'map flow spread region', href: '/risk-map', icon: Map },
  { label: 'Open action center', keywords: 'intervention response alert task', href: '/action-center', icon: ShieldAlert },
  { label: 'Open notifications', keywords: 'bell alerts warning', href: '/notifications', icon: Bell },
  { label: 'Explore data', keywords: 'records dataset table', href: '/explorer', icon: Database },
  { label: 'Analyze correlations', keywords: 'factors relationship trend', href: '/correlation', icon: TrendingUp },
  { label: 'Assess family risk', keywords: 'prediction screening', href: '/prediction', icon: Users },
  { label: 'Open health insights', keywords: 'evidence analysis recommendation support', href: '/insights', icon: BrainCircuit },
]

export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((value) => !value)
      }
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((item) => `${item.label} ${item.keywords}`.toLowerCase().includes(q))
  }, [query])

  const navigate = (href: string) => {
    setOpen(false)
    setQuery('')
    router.push(href)
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="relative hidden h-10 w-full max-w-[320px] items-center rounded-xl border border-border bg-card pl-10 pr-14 text-left text-sm text-text-soft shadow-sm transition hover:border-border-focus hover:text-text-secondary lg:flex">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2" />
        Search regions, records, insights…
        <span className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground"><Command className="size-3" />K</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/35 px-4 pt-[12vh] backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false) }}>
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_100px_rgba(15,23,42,0.3)]">
            <div className="flex items-center gap-3 border-b border-border-soft px-4">
              <Search className="size-5 text-muted-foreground" />
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search pages and actions…" className="h-14 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-text-soft" />
              <button type="button" onClick={() => setOpen(false)} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted" aria-label="Close command palette"><X className="size-4" /></button>
            </div>
            <div className="max-h-[390px] overflow-y-auto p-2">
              {results.length ? results.map((item) => {
                const Icon = item.icon
                return <button key={item.href} type="button" onClick={() => navigate(item.href)} className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left transition hover:bg-surface-blue"><span className="flex size-8 items-center justify-center rounded-lg bg-primary/8 text-primary"><Icon className="size-4" /></span><span className="text-sm font-semibold text-foreground">{item.label}</span></button>
              }) : <div className="px-4 py-10 text-center text-sm text-muted-foreground">No matching page or action.</div>}
            </div>
            <div className="flex items-center justify-between border-t border-border-soft bg-muted/45 px-4 py-2.5 text-[11px] text-muted-foreground"><span>Navigate faster across StuntLytics</span><span>Esc to close</span></div>
          </div>
        </div>
      )}
    </>
  )
}
