'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastTone = 'success' | 'info' | 'warning'
interface ToastItem { id: number; title: string; message?: string; tone: ToastTone }
interface ToastContextValue { notify: (toast: Omit<ToastItem, 'id'>) => void }

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => setItems((current) => current.filter((item) => item.id !== id)), [])
  const notify = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    setItems((current) => [...current.slice(-2), { ...toast, id }])
    window.setTimeout(() => dismiss(id), 4200)
  }, [dismiss])

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(92vw,380px)] flex-col gap-2" aria-live="polite">
        {items.map((item) => {
          const Icon = item.tone === 'success' ? CheckCircle2 : item.tone === 'warning' ? TriangleAlert : Info
          return (
            <div key={item.id} className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-[0_18px_46px_rgba(15,23,42,.14)]">
              <span className={cn('mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl', item.tone === 'success' ? 'bg-success/10 text-success' : item.tone === 'warning' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary')}>
                <Icon className="size-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                {item.message && <p className="mt-1 text-xs leading-5 text-text-secondary">{item.message}</p>}
              </div>
              <button type="button" onClick={() => dismiss(item.id)} className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Dismiss notification">
                <X className="size-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
