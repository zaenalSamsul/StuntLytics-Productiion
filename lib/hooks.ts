import useSWR, { SWRConfiguration } from 'swr'
import { api, DashboardSummaryResponse, FilterParams, RiskMapData } from './api'

const fetcher = (url: string) => api.get(url).then((res) => res.data)

interface UseDataOptions extends SWRConfiguration {
  enabled?: boolean
}

function queryString(filters: FilterParams) {
  return new URLSearchParams({
    ...(filters.dateFrom ? { dateFrom: filters.dateFrom } : {}),
    ...(filters.dateTo ? { dateTo: filters.dateTo } : {}),
    ...(filters.wilayah?.length ? { wilayah: filters.wilayah.join(',') } : {}),
    ...(filters.kecamatan?.length ? { kecamatan: filters.kecamatan.join(',') } : {}),
    ...(filters.riskLevel?.length ? { riskLevel: filters.riskLevel.join(',') } : {}),
  }).toString()
}

export const useDashboardSummary = (filters: FilterParams, options?: UseDataOptions) => {
  const enabled = options?.enabled ?? true
  const { data, error, isLoading, mutate } = useSWR<DashboardSummaryResponse>(
    enabled ? `/dashboard/summary?${queryString(filters)}` : null,
    fetcher,
    { revalidateOnFocus: false, ...options },
  )
  return { data, isLoading, isError: !!error, error, mutate }
}

export const useRiskMapData = (filters: FilterParams, options?: UseDataOptions) => {
  const enabled = options?.enabled ?? true
  const { data, error, isLoading, mutate } = useSWR<RiskMapData[]>(
    enabled ? `/dashboard/risk-map?${queryString(filters)}` : null,
    fetcher,
    { revalidateOnFocus: false, ...options },
  )
  return { data: data ?? [], isLoading, isError: !!error, error, mutate }
}

export const useChartData = (chartType: string, filters: FilterParams, options?: UseDataOptions) => {
  const enabled = options?.enabled ?? true
  const { data, error, isLoading } = useSWR(
    enabled ? `/dashboard/chart/${chartType}?${queryString(filters)}` : null,
    fetcher,
    { revalidateOnFocus: false, ...options },
  )
  return { data, isLoading, isError: !!error, error }
}

export const useFilterOptions = (field: string, options?: UseDataOptions) => {
  const enabled = options?.enabled ?? true
  const { data, error, isLoading } = useSWR<string[]>(
    enabled ? `/filters/options/${field}` : null,
    fetcher,
    { revalidateOnFocus: false, ...options },
  )
  return { data: data ?? [], isLoading, isError: !!error, error }
}
