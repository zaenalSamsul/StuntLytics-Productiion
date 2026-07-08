import { AlertTriangle, CheckCircle2, CircleDot, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

type Status = 'stable' | 'monitoring' | 'attention' | 'critical'
const config = {
  stable: { label: 'Stable', icon: CheckCircle2, className: 'bg-success/8 text-success border-success/15' },
  monitoring: { label: 'Monitoring', icon: Eye, className: 'bg-info/8 text-info border-info/15' },
  attention: { label: 'Needs Attention', icon: AlertTriangle, className: 'bg-warning/8 text-warning border-warning/15' },
  critical: { label: 'Critical', icon: CircleDot, className: 'bg-danger/8 text-danger border-danger/15' },
}
export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const item = config[status]; const Icon = item.icon
  return <span className={cn('inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold', item.className, className)}><Icon className="size-3.5" />{item.label}</span>
}
