import axios, { AxiosInstance } from 'axios'

// Create axios instance for API calls
export const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request/Response types for common operations
export interface FilterParams {
  dateFrom?: string
  dateTo?: string
  wilayah?: string[]
  kecamatan?: string[]
  riskLevel?: string[]
}

export interface MetricResponse {
  totalBayi: number
  totalStunting: number
  prevalence: number
  totalNakes: number
  imunisasiCoverage: number
  airLayakCoverage: number
}

export interface RiskMapData {
  kecamatan: string
  kabupaten: string
  jumlahStunting: number
  totalAnak: number
  prevalensi: number
  riskLevel: string
}

export interface TrendData {
  date: string
  value: number
  [key: string]: any
}

export interface ChartData {
  label: string
  value: number
  [key: string]: any
}

// API Methods
export const dashboardApi = {
  // Get main dashboard summary
  getMainSummary: async (filters: FilterParams) => {
    const response = await api.get('/dashboard/summary', { params: filters })
    return response.data
  },

  // Get risk map data
  getRiskMapData: async (filters: FilterParams) => {
    const response = await api.get('/dashboard/risk-map', { params: filters })
    return response.data as RiskMapData[]
  },

  // Get chart data
  getChartData: async (chartType: string, filters: FilterParams) => {
    const response = await api.get(`/dashboard/chart/${chartType}`, { params: filters })
    return response.data
  },

  // Get filter options
  getFilterOptions: async (field: string) => {
    const response = await api.get(`/filters/options/${field}`)
    return response.data as string[]
  },

  // Get AI insights
  getAIInsights: async (question: string, filters: FilterParams) => {
    const response = await api.post('/ai/insights', { question, filters })
    return response.data
  },

  // Get correlation analysis
  getCorrelationAnalysis: async (filters: FilterParams) => {
    const response = await api.get('/analysis/correlation', { params: filters })
    return response.data
  },

  // Get family prediction
  getFamilyPrediction: async (familyData: Record<string, any>) => {
    const response = await api.post('/prediction/family', familyData)
    return response.data
  },
}

export default api
