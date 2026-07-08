'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, Bell, BrainCircuit, Check, CheckCircle2, Database, ExternalLink, Siren, X } from 'lucide-react'
import { AppNotification, initialNotifications, notificationStorageKey } from '@/lib/notifications'
import { cn } from '@/lib/utils'

const severityStyles = {
  critical: 'bg-danger/10 text-danger border-danger/15',
  warning: 'bg-warning/10 text-warning border-warning/15',
  info: 'bg-info/10 text-info border-info/15',
  success: 'bg-success/10 text-success border-success/15',
}

const severityIcons = {
  critical: Siren,
  warning: AlertTriangle,
  info: BrainCircuit,
  success: CheckCircle2,
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const [readIds, setReadIds] = useState<Set<string>>(new Set(initialNotifications.filter((item) => item.read).map((item) => item.id)))
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(notificationStorageKey)
      if (stored) setReadIds(new Set(JSON.parse(stored)))
    } catch {
      // Local persistence is a progressive enhancement only.
    }
  }, [])

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const notifications = useMemo(
    () => initialNotifications.map((item) => ({ ...item, read: readIds.has(item.id) })),
    [readIds],
  )
  const unreadCount = notifications.filter((item) => !item.read).length

  const persist = (next: Set<string>) => {
    setReadIds(next)
    try {
      window.localStorage.setItem(notificationStorageKey, JSON.stringify([...next]))
    } catch {
      // Ignore blocked storage.
    }
  }

  const markRead = (id: string) => persist(new Set(readIds).add(id))
  const markAllRead = () => persist(new Set(notifications.map((item) => item.id)))

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex size-10 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Bell className="size-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1 flex min-w-4 items-center justify-center rounded-full border-2 border-background bg-danger px-1 text-[9px] font-bold leading-3 text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notification center"
          className="fixed inset-x-3 top-[76px] z-[70] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-[410px]"
        >
          <div className="flex items-center justify-between border-b border-border-soft px-4 py-3.5">
            <div>
              <p className="text-sm font-semibold text-foreground">Notification center</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{unreadCount} unread · priority-aware alerts</p>
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button type="button" onClick={markAllRead} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/8">
                  Mark all read
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted" aria-label="Close notifications">
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[430px] overflow-y-auto">
            {notifications.slice(0, 4).map((notification) => {
              const Icon = severityIcons[notification.severity]
              return (
                <article key={notification.id} className={cn('relative border-b border-border-soft px-4 py-3.5 transition hover:bg-surface-blue/60', !notification.read && 'bg-primary/[0.025]')}>
                  {!notification.read && <span className="absolute right-4 top-4 size-2 rounded-full bg-primary" aria-label="Unread" />}
                  <div className="flex gap-3 pr-3">
                    <span className={cn('mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border', severityStyles[notification.severity])}>
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <p className="text-sm font-semibold leading-5 text-foreground">{notification.title}</p>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-secondary">{notification.message}</p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] text-muted-foreground">{notification.relativeTime}</span>
                        {notification.region && <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-text-secondary">{notification.region}</span>}
                        {!notification.read && (
                          <button type="button" onClick={() => markRead(notification.id)} className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                            <Check className="size-3" /> Mark read
                          </button>
                        )}
                      </div>
                      {notification.href && notification.actionLabel && (
                        <Link href={notification.href} onClick={() => { markRead(notification.id); setOpen(false) }} className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark">
                          {notification.actionLabel} <ExternalLink className="size-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 bg-muted/45 p-3">
            <Link href="/notifications" onClick={() => setOpen(false)} className="inline-flex min-h-10 items-center justify-center rounded-xl border border-border bg-card px-3 text-xs font-semibold text-foreground transition hover:border-primary/25 hover:text-primary">
              View all alerts
            </Link>
            <Link href="/activity" onClick={() => setOpen(false)} className="inline-flex min-h-10 items-center justify-center rounded-xl bg-primary px-3 text-xs font-semibold text-white transition hover:bg-primary-dark">
              Open activity log
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
