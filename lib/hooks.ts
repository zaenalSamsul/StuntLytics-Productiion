import useSWR, { SWRConfiguration } from 'swr'
import { api, FilterParams } from './api'

const fetcher = (url: string) => api.get(url).then(res => res.data)

interface UseDataOptions extends SWRConfiguration {
  enabled?: boolean
}

// Hook for main dashboard summary
export const useDashboardSummary = (filters: FilterParams, options?: UseDataOptions) => {
  const queryString = new URLSearchParams({
    ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
    ...(filters.dateTo && { dateTo: filters.dateTo }),
    ...(filters.wilayah && { wilayah: filters.wilayah.join(',') }),
    ...(filters.kecamatan && { kecamatan: filters.kecamatan.join(',') }),
    ...(filters.riskLevel && { riskLevel: filters.riskLevel.join(',') }),
  }).toString()

  const { data, error, isLoading } = useSWR(
    `/dashboard/summary?${queryString}`,
    fetcher,
    {
      revalidateOnFocus: false,
      ...options,
    }
  )

  return {
    data,
    isLoading,
    isError: !!error,
    error,
  }
}

// Hook for risk map data
export const useRiskMapData = (filters: FilterParams, options?: UseDataOptions) => {
  const queryString = new URLSearchParams({
    ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
    ...(filters.dateTo && { dateTo: filters.dateTo }),
    ...(filters.wilayah && { wilayah: filters.wilayah.join(',') }),
    ...(filters.kecamatan && { kecamatan: filters.kecamatan.join(',') }),
  }).toString()

  const { data, error, isLoading } = useSWR(
    `/dashboard/risk-map?${queryString}`,
    fetcher,
    {
      revalidateOnFocus: false,
      ...options,
    }
  )

  return {
    data,
    isLoading,
    isError: !!error,
    error,
  }
}

// Hook for chart data
export const useChartData = (
  chartType: string,
  filters: FilterParams,
  options?: UseDataOptions
) => {
  const queryString = new URLSearchParams({
    ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
    ...(filters.dateTo && { dateTo: filters.dateTo }),
    ...(filters.wilayah && { wilayah: filters.wilayah.join(',') }),
    ...(filters.kecamatan && { kecamatan: filters.kecamatan.join(',') }),
  }).toString()

  const { data, error, isLoading } = useSWR(
    `/dashboard/chart/${chartType}?${queryString}`,
    fetcher,
    {
      revalidateOnFocus: false,
      ...options,
    }
  )

  return {
    data,
    isLoading,
    isError: !!error,
    error,
  }
}

// Hook for filter options
export const useFilterOptions = (field: string, options?: UseDataOptions) => {
  const { data, error, isLoading } = useSWR(
    `/filters/options/${field}`,
    fetcher,
    {
      revalidateOnFocus: false,
      ...options,
    }
  )

  return {
    data: data || [],
    isLoading,
    isError: !!error,
    error,
  }
}
