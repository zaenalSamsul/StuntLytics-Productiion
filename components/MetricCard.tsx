import React from 'react'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  icon?: React.ReactNode
  title: string
  value: string | number
  context?: string
  delta?: string
  deltaType?: 'positive' | 'negative' | 'neutral'
  onClick?: () => void
  className?: string
}

export function MetricCard({ icon, title, value, context, delta, deltaType = 'neutral', onClick, className }: MetricCardProps) {
  const deltaStyles = {
    positive: 'bg-success/8 text-success',
    negative: 'bg-danger/8 text-danger',
    neutral: 'bg-muted text-muted-foreground',
  }[deltaType]
  const DeltaIcon = deltaType === 'positive' ? ArrowUpRight : deltaType === 'negative' ? ArrowDownRight : Minus

  return (
    <article
      onClick={onClick}
      className={cn('clinical-card-interactive p-5 sm:p-6', onClick && 'cursor-pointer', className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-[-0.045em] text-foreground">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        {icon && <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/7 text-lg text-primary">{icon}</span>}
      </div>
      <div className="mt-4 flex min-h-6 flex-wrap items-center gap-2">
        {delta && (
          <span className={cn('inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold', deltaStyles)}>
            <DeltaIcon className="size-3.5" />
            {delta}
          </span>
        )}
        {context && <p className="text-xs text-muted-foreground">{context}</p>}
      </div>
    </article>
  )
}
