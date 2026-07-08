import { CalendarDays, Filter, X } from 'lucide-react'
import { FilterParams } from '@/lib/api'
import { format } from 'date-fns'

interface FilterSummaryProps { filters: FilterParams; onClearFilter?: (key: keyof FilterParams) => void }

export function FilterSummary({ filters, onClearFilter }: FilterSummaryProps) {
  const chips: { key: keyof FilterParams; label: string; values: string[]; date?: boolean }[] = []
  if (filters.dateFrom || filters.dateTo) chips.push({ key: 'dateFrom', label: 'Date', values: [`${filters.dateFrom ? format(new Date(filters.dateFrom), 'MMM dd, yyyy') : 'Start'} – ${filters.dateTo ? format(new Date(filters.dateTo), 'MMM dd, yyyy') : 'End'}`], date: true })
  if (filters.wilayah?.length) chips.push({ key: 'wilayah', label: 'Regency/City', values: filters.wilayah })
  if (filters.kecamatan?.length) chips.push({ key: 'kecamatan', label: 'District', values: filters.kecamatan })
  if (filters.riskLevel?.length) chips.push({ key: 'riskLevel', label: 'Risk Level', values: filters.riskLevel })
  if (!chips.length) return null

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-sm">
      <span className="mr-1 flex items-center gap-1.5 px-1 text-xs font-semibold text-muted-foreground"><Filter className="size-3.5" />Active filters</span>
      {chips.map((chip) => (
        <span key={chip.key} className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-border-soft bg-muted/70 px-2.5 text-xs text-text-secondary">
          {chip.date && <CalendarDays className="size-3.5 text-primary" />}
          <strong className="font-semibold text-foreground">{chip.label}:</strong> {chip.values.join(', ')}
          {onClearFilter && <button onClick={() => onClearFilter(chip.key)} className="ml-0.5 rounded p-0.5 hover:bg-card hover:text-foreground" aria-label={`Clear ${chip.label} filter`}><X className="size-3.5" /></button>}
        </span>
      ))}
    </div>
  )
}
