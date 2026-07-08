'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  Bell,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  ClipboardCheck,
  Database,
  FileClock,
  HeartPulse,
  Info,
  LayoutDashboard,
  MapPinned,
  Settings,
  Lightbulb,
  UsersRound,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BrandLogo } from './BrandLogo'

const navigationGroups = [
  {
    label: 'Workspace',
    items: [
      { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Action Center', href: '/action-center', icon: ClipboardCheck },
      { name: 'Notifications', href: '/notifications', icon: Bell, badge: '3' },
    ],
  },
  {
    label: 'Population Health',
    items: [
      { name: 'Regional Risk Map', href: '/risk-map', icon: MapPinned },
      { name: 'Data Explorer', href: '/explorer', icon: Database },
      { name: 'Factor Analysis', href: '/correlation', icon: ChartNoAxesCombined },
      { name: 'Family Screening', href: '/prediction', icon: UsersRound },
    ],
  },
  {
    label: 'Decision Support',
    items: [
      { name: 'Health Insights', href: '/insights', icon: Lightbulb },
      { name: 'Activity & Audit', href: '/activity', icon: FileClock },
      { name: 'Platform', href: '/platform', icon: HeartPulse },
    ],
  },
]

interface SidebarProps {
  open?: boolean
  setOpen?: (open: boolean) => void
}

export function Sidebar({ open = false, setOpen }: SidebarProps) {
  const pathname = usePathname() ?? ''
  const [workspaceOpen, setWorkspaceOpen] = useState(false)
  const [workspace, setWorkspace] = useState('West Java Program')
  const close = () => setOpen?.(false)
  const isActive = (href: string) => pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`))

  return (
    <>
      <aside
        id="app-sidebar"
        aria-label="Primary navigation"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[258px] flex-col border-r border-slate-200/80 bg-white transition-transform duration-200 dark:border-border dark:bg-card lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-[74px] items-center justify-between px-5">
          <Link href="/dashboard" onClick={close} aria-label="StuntLytics dashboard">
            <BrandLogo />
          </Link>
          <button type="button" onClick={close} className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden" aria-label="Close navigation">
            <X className="size-5" />
          </button>
        </div>

        <div className="px-4 pb-3">
          <div className="relative"><button type="button" onClick={()=>setWorkspaceOpen((v)=>!v)} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left transition hover:border-primary/25 hover:bg-white dark:border-border dark:bg-muted">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-[10px] font-extrabold text-white">{workspace === 'West Java Program' ? 'JBR' : 'IDN'}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-bold text-foreground">{workspace}</span>
              <span className="block truncate text-[10px] text-muted-foreground">Provincial monitoring</span>
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>{workspaceOpen && <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 rounded-xl border border-border bg-card p-1.5 shadow-lg">{['West Java Program','National Demo'].map((item)=><button key={item} type="button" onClick={()=>{setWorkspace(item);setWorkspaceOpen(false)}} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[11px] font-bold text-foreground hover:bg-muted"><span>{item}</span>{workspace===item && <Check className="size-3.5 text-primary" />}</button>)}</div>}</div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-5 pt-2">
          <nav className="space-y-5">
            {navigationGroups.map((group) => (
              <section key={group.label}>
                <p className="mb-1.5 px-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400 dark:text-text-soft">{group.label}</p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = isActive(item.href)
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={close}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'group flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-semibold transition',
                          active
                            ? 'bg-gradient-to-r from-primary to-[#2f80ed] text-white shadow-[0_7px_18px_rgba(37,99,235,.2)]'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-text-secondary dark:hover:bg-muted dark:hover:text-foreground',
                        )}
                      >
                        <Icon className={cn('size-[18px] shrink-0', active ? 'text-white' : 'text-slate-400 group-hover:text-primary dark:text-muted-foreground')} strokeWidth={1.9} />
                        <span className="min-w-0 flex-1 truncate">{item.name}</span>
                        {item.badge && <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-extrabold', active ? 'bg-white/18 text-white' : 'bg-danger/10 text-danger')}>{item.badge}</span>}
                      </Link>
                    )
                  })}
                </div>
              </section>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-200/80 p-3 dark:border-border">
          <div className="mb-2 rounded-xl bg-slate-50 p-3 dark:bg-muted">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-bold text-foreground">Data readiness</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success"><span className="size-1.5 rounded-full bg-success" /> Live</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-border"><div className="h-full w-[92%] rounded-full bg-gradient-to-r from-primary to-secondary" /></div>
            <p className="mt-2 text-[10px] text-muted-foreground">Last validated sync · 09:10 WIB</p>
          </div>
          <Link href="/settings" onClick={close} className={cn('flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-semibold transition', isActive('/settings') ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-text-secondary dark:hover:bg-muted')}>
            <Settings className="size-[18px] text-slate-400" /> Settings
          </Link>
          <Link href="/about" onClick={close} className="flex min-h-10 items-center gap-3 rounded-xl px-3 text-[12px] font-medium text-muted-foreground transition hover:bg-slate-100 hover:text-foreground dark:hover:bg-muted">
            <Info className="size-4" /> About StuntLytics
          </Link>
        </div>
      </aside>

      {open && <button type="button" aria-label="Close navigation overlay" className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[2px] lg:hidden" onClick={close} />}
    </>
  )
}
