'use client'

import {
  ResponsiveContainer, LineChart, BarChart, PieChart, Line, Bar, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { COLORS } from '@/lib/colors'
import { cn } from '@/lib/utils'

interface ChartWrapperProps { title?: string; subtitle?: string; type: 'line' | 'bar' | 'pie'; data: Record<string, any>[]; className?: string; height?: number }
const chartColors = [COLORS.primary, COLORS.secondary, COLORS.tertiary, COLORS.accent, COLORS.danger]

export function ChartWrapper({ title, subtitle, type, data, className, height = 300 }: ChartWrapperProps) {
  const keys = Object.keys(data[0] || {}).filter((key) => !['name', 'date', 'month', 'factor'].includes(key))
  const xKey = data[0]?.name !== undefined ? 'name' : data[0]?.date !== undefined ? 'date' : data[0]?.month !== undefined ? 'month' : data[0]?.factor !== undefined ? 'factor' : undefined
  const tooltipStyle = { backgroundColor: COLORS.bgSurface, border: `1px solid ${COLORS.borderDefault}`, borderRadius: '12px', boxShadow: '0 12px 32px rgba(15,23,42,.08)', fontSize: '12px' }

  return (
    <section className={cn('clinical-card p-5 sm:p-6', className)}>
      {(title || subtitle) && <div className="mb-5"><h3 className="text-base font-semibold text-foreground sm:text-lg">{title}</h3>{subtitle && <p className="mt-1 text-sm leading-5 text-muted-foreground">{subtitle}</p>}</div>}
      <div className="w-full" style={{ height }} aria-label={title || `${type} chart`}>
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={COLORS.borderSubtle} />
              <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
              {keys.map((key, idx) => <Line key={key} type="monotone" dataKey={key} stroke={chartColors[idx % chartColors.length]} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />)}
            </LineChart>
          ) : type === 'bar' ? (
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={COLORS.borderSubtle} />
              <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              {keys.map((key, idx) => <Bar key={key} dataKey={key} fill={chartColors[idx % chartColors.length]} radius={[6, 6, 0, 0]} />)}
            </BarChart>
          ) : (
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius="48%" outerRadius="76%" paddingAngle={2} dataKey="value" nameKey="name" stroke="none">
                {data.map((_, idx) => <Cell key={`cell-${idx}`} fill={chartColors[idx % chartColors.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  )
}
