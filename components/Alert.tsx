import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type AlertType = 'info' | 'success' | 'warning' | 'error'
interface AlertProps { type?: AlertType; title?: string; message: string; onClose?: () => void; className?: string }

const alertConfig = {
  info: { icon: Info, shell: 'border-info/20 bg-info/6', iconStyle: 'bg-info/10 text-info' },
  success: { icon: CheckCircle2, shell: 'border-success/20 bg-success/6', iconStyle: 'bg-success/10 text-success' },
  warning: { icon: AlertTriangle, shell: 'border-warning/20 bg-warning/6', iconStyle: 'bg-warning/10 text-warning' },
  error: { icon: AlertCircle, shell: 'border-danger/20 bg-danger/6', iconStyle: 'bg-danger/10 text-danger' },
}

export function Alert({ type = 'info', title, message, onClose, className }: AlertProps) {
  const config = alertConfig[type]
  const Icon = config.icon
  return (
    <div role={type === 'error' ? 'alert' : 'status'} className={cn('flex gap-3 rounded-2xl border p-4', config.shell, className)}>
      <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-xl', config.iconStyle)}><Icon className="size-[18px]" /></span>
      <div className="min-w-0 flex-1 pt-0.5">
        {title && <h4 className="text-sm font-semibold text-foreground">{title}</h4>}
        <p className={cn('text-sm leading-6 text-text-secondary', title && 'mt-0.5')}>{message}</p>
      </div>
      {onClose && <button onClick={onClose} className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground" aria-label="Dismiss alert"><X className="size-4" /></button>}
    </div>
  )
}
