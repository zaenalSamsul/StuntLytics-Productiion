import React from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  icon?: React.ReactNode
  title: string
  description?: string
  eyebrow?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ icon, title, description, eyebrow, children, className }: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-4 border-b border-border-soft pb-5 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="flex min-w-0 items-start gap-3">
        {icon && <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span>}
        <div className="min-w-0">
          {eyebrow && <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.13em] text-primary">{eyebrow}</p>}
          <h1 className="text-[24px] font-extrabold tracking-[-0.04em] text-foreground sm:text-[28px]">{title}</h1>
          {description && <p className="mt-1.5 max-w-3xl text-[13px] leading-5 text-text-secondary sm:text-sm sm:leading-6">{description}</p>}
        </div>
      </div>
      {children && <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>}
    </header>
  )
}
