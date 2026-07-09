'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, ChevronDown, CircleHelp, LogOut, Menu, Moon, Settings, ShieldCheck, Sun, UserRound } from 'lucide-react'
import { NotificationCenter } from './NotificationCenter'
import { CommandPalette } from './CommandPalette'
import { useToast } from './ToastProvider'

const pageNames: Record<string, string> = {
  '/dashboard/analytics': 'Data Analytics',
  '/dashboard/risk-map': 'Regional Risk Map',
  '/dashboard/insights': 'Health Insights',
  '/dashboard': 'Overview',
  '/risk-map': 'Regional Risk Map',
  '/action-center': 'Action Center',
  '/notifications': 'Notification Center',
  '/activity': 'Activity & Audit',
  '/explorer': 'Data Explorer',
  '/correlation': 'Factor Analysis',
  '/prediction': 'Family Screening',
  '/data-science': 'Data Science Engine',
  '/insights': 'Health Insights',
  '/platform': 'Platform',
  '/settings': 'Settings',
  '/about': 'About',
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname() ?? ''
  const [helpOpen, setHelpOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const helpRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const { notify } = useToast()

  const title = Object.entries(pageNames).sort(([a], [b]) => b.length - a.length).find(([route]) => pathname === route || pathname.startsWith(`${route}/`))?.[1] ?? 'Workspace'

  useEffect(() => {
    const stored = localStorage.getItem('stuntlytics-theme')
    const enabled = stored === 'dark'
    setDark(enabled)
    document.documentElement.classList.toggle('dark', enabled)
  }, [])

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) setHelpOpen(false)
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('stuntlytics-theme', next ? 'dark' : 'light')
    notify({ tone: 'info', title: `${next ? 'Dark' : 'Light'} appearance enabled`, message: 'Your preference is saved on this device.' })
  }

  return (
    <header className="sticky top-0 z-30 h-[70px] border-b border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-border dark:bg-card/95">
      <div className="flex h-full items-center gap-3 px-4 sm:px-6 lg:px-7 xl:px-8">
        <button type="button" onClick={onMenuClick} className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-text-secondary shadow-sm hover:bg-muted hover:text-foreground lg:hidden" aria-controls="app-sidebar" aria-label="Open navigation">
          <Menu className="size-5" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            <span>StuntLytics</span><span className="text-slate-300">/</span><span className="truncate text-primary">{title}</span>
          </div>
          <p className="mt-0.5 truncate text-[15px] font-bold tracking-[-0.02em] text-foreground">{title}</p>
        </div>

        <CommandPalette />

        <div className="flex items-center gap-1">
          <button type="button" onClick={toggleTheme} className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-slate-100 hover:text-foreground dark:hover:bg-muted" aria-label="Toggle appearance">
            {dark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </button>

          <div className="relative" ref={helpRef}>
            <button type="button" onClick={() => setHelpOpen((v) => !v)} className="hidden size-10 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-slate-100 hover:text-foreground sm:flex" aria-label="Open help">
              <CircleHelp className="size-[18px]" />
            </button>
            {helpOpen && (
              <div className="absolute right-0 top-12 w-72 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_50px_rgba(15,23,42,.14)]">
                <div className="border-b border-border-soft p-4">
                  <p className="text-sm font-bold text-foreground">Help & guidance</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Quick support for program monitoring workflows.</p>
                </div>
                <div className="p-2">
                  <Link href="/about" onClick={() => setHelpOpen(false)} className="flex items-start gap-3 rounded-xl p-3 hover:bg-muted"><BookOpen className="mt-0.5 size-4 text-primary" /><span><span className="block text-xs font-bold text-foreground">Product guide</span><span className="mt-0.5 block text-[11px] text-muted-foreground">Understand metrics and workflow</span></span></Link>
                  <Link href="/activity" onClick={() => setHelpOpen(false)} className="flex items-start gap-3 rounded-xl p-3 hover:bg-muted"><ShieldCheck className="mt-0.5 size-4 text-secondary" /><span><span className="block text-xs font-bold text-foreground">Audit & safety</span><span className="mt-0.5 block text-[11px] text-muted-foreground">Review traceability and guardrails</span></span></Link>
                </div>
              </div>
            )}
          </div>

          <NotificationCenter />

          <div className="relative ml-1" ref={profileRef}>
            <button type="button" onClick={() => setProfileOpen((v) => !v)} className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white pl-1.5 pr-2.5 shadow-sm transition hover:border-primary/25 dark:border-border dark:bg-muted" aria-label="Open user profile">
              <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-[10px] font-extrabold text-white">ZA</span>
              <span className="hidden text-left md:block"><span className="block text-[11px] font-bold leading-none text-foreground">Zaenal Arief</span><span className="mt-1 block text-[9px] leading-none text-muted-foreground">Program Analyst</span></span>
              <ChevronDown className="hidden size-3.5 text-muted-foreground md:block" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_50px_rgba(15,23,42,.14)]">
                <div className="border-b border-border-soft p-4"><p className="text-sm font-bold text-foreground">Zaenal Syamsyul Arief</p><p className="mt-1 text-[11px] text-muted-foreground">Program Analyst · West Java</p></div>
                <div className="p-2">
                  <button type="button" onClick={() => notify({ tone: 'info', title: 'Profile workspace', message: 'Profile editor is ready for backend account integration.' })} className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-xs font-semibold text-foreground hover:bg-muted"><UserRound className="size-4 text-muted-foreground" /> My profile</button>
                  <Link href="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 rounded-xl p-3 text-xs font-semibold text-foreground hover:bg-muted"><Settings className="size-4 text-muted-foreground" /> Settings</Link>
                  <button type="button" onClick={() => notify({ tone: 'warning', title: 'Demo session', message: 'Sign-out is disabled because authentication is not connected in this frontend demo.' })} className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-xs font-semibold text-danger hover:bg-danger/5"><LogOut className="size-4" /> Sign out</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
