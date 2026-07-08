import { cn } from '@/lib/utils'
export function Skeleton({ className }: { className?: string }) { return <div aria-hidden="true" className={cn('animate-pulse rounded-xl bg-muted', className)} /> }
export function MetricCardSkeleton() { return <div className="clinical-card p-5"><div className="flex justify-between"><Skeleton className="h-4 w-28"/><Skeleton className="size-10"/></div><Skeleton className="mt-4 h-9 w-24"/><Skeleton className="mt-4 h-5 w-36"/></div> }
