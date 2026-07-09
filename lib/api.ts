import axios, { AxiosInstance } from 'axios'

export const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 45_000,
  headers: { 'Content-Type': 'application/json' },
})

export interface FilterParams {
  dateFrom?: string
  dateTo?: string
  wilayah?: string[]
  kecamatan?: string[]
  riskLevel?: string[]
}

export interface DataSourceInfo {
  mode: string
  label: string
  live: boolean
  detail: string
  generatedAt: string
}

export interface DashboardMetrics {
  totalChildren: number
  totalStunting: number
  prevalence: number
  totalNakes: number
  imunisasiCoverage: number
  airLayakCoverage: number
}

export interface TrendPoint {
  month: string
  prevalence: number | null
  coverage: number | null
}

export interface RiskMapData {
  kecamatan: string
  kabupaten: string
  jumlahStunting: number
  totalAnak: number
  prevalensi: number
  riskLevel: 'stable' | 'monitoring' | 'attention' | 'critical' | string
  source?: string
}

export interface DashboardSummaryResponse {
  source: DataSourceInfo
  metrics: DashboardMetrics
  trend: TrendPoint[]
  workforce: Array<{ region: string; value: number }>
  waterDistribution: Array<{ label: string; value: number }>
  riskDistribution: Array<{ name: string; value: number }>
  topRegions: RiskMapData[]
}

export interface CorrelationFactor {
  factor: string
  field: string
  coefficient: number
  magnitude: number
  direction: 'positive' | 'negative'
}

export interface CorrelationResponse {
  source: DataSourceInfo
  target: string
  sampleSize: number
  factors: CorrelationFactor[]
  trend: Array<{ month: string; prevalence: number }>
  method: string
  guardrail: string
}

export interface ExplorerResponse {
  source: DataSourceInfo
  records: Array<Record<string, string | number | null>>
  count: number
  topCounts: Array<Record<string, string | number | null>>
}

export interface ModelStatus {
  available: boolean
  loaded: boolean
  path: string
  sizeMb: number
  engine: string
  requiredSklearn: string
  error?: string | null
}

export interface LLMStatus {
  provider: string
  model: string
  configured: boolean
  fallback: string
  inputTokenLimit: number
  outputTokenLimit: number
  configuredMaxOutputTokens: number
  dataBoundary: string
  freeTierNote: string
}


export interface IndexedDatasetStatus {
  index: string
  available: boolean
  documents: number
  status?: number
  error?: string
}

export interface DataStatusResponse {
  source: DataSourceInfo
  indices: Record<string, IndexedDatasetStatus>
}

export interface FamilyPredictionPayload {
  tinggi_badan_ibu_cm: number
  lila_saat_hamil_cm: number
  bmi_pra_hamil: number
  hb_g_dl: number
  kenaikan_bb_hamil_kg: number
  usia_ibu_saat_hamil_tahun: number
  jarak_kehamilan_sebelumnya_bulan: number
  kunjungan_anc_x: number
  jumlah_anak: number
  kepatuhan_ttd: string
  pendidikan_ibu: string
  jenis_pekerjaan_orang_tua: string
  status_pernikahan: string
  kepesertaan_program_bantuan: string
  akses_air_bersih: string
  paparan_asap_rokok: string
  hipertensi_ibu: number
  diabetes_ibu: number
}

export interface FamilyPredictionResponse {
  probability: number
  result: string
  decisionThreshold: number
  riskBand: 'low' | 'monitoring' | 'high'
  engine: string
  model: ModelStatus
  contextFactors: Array<{ label: string; reason: string; severity: string }>
  followUpConsiderations: string[]
  guardrail: string
}

function filterParams(filters: FilterParams): Record<string, string> {
  return {
    ...(filters.dateFrom ? { dateFrom: filters.dateFrom } : {}),
    ...(filters.dateTo ? { dateTo: filters.dateTo } : {}),
    ...(filters.wilayah?.length ? { wilayah: filters.wilayah.join(',') } : {}),
    ...(filters.kecamatan?.length ? { kecamatan: filters.kecamatan.join(',') } : {}),
    ...(filters.riskLevel?.length ? { riskLevel: filters.riskLevel.join(',') } : {}),
  }
}

export const dashboardApi = {
  getMainSummary: async (filters: FilterParams = {}) => {
    const response = await api.get<DashboardSummaryResponse>('/dashboard/summary', { params: filterParams(filters) })
    return response.data
  },

  getRiskMapData: async (filters: FilterParams = {}) => {
    const response = await api.get<RiskMapData[]>('/dashboard/risk-map', { params: filterParams(filters) })
    return response.data
  },

  getChartData: async (chartType: string, filters: FilterParams = {}) => {
    const response = await api.get(`/dashboard/chart/${chartType}`, { params: filterParams(filters) })
    return response.data
  },

  getFilterOptions: async (field: string, filters: FilterParams = {}) => {
    const response = await api.get<string[]>(`/filters/options/${field}`, { params: filterParams(filters) })
    return response.data
  },

  getAIInsights: async (question: string, filters: FilterParams = {}) => {
    const response = await api.post('/ai/insights', { question, filters })
    return response.data as { answer: string; mode: string; source: DataSourceInfo; question: string; guardrail: string; llm: LLMStatus; llmError?: string | null }
  },

  getCorrelationAnalysis: async (filters: FilterParams = {}) => {
    const response = await api.get<CorrelationResponse>('/analysis/correlation', { params: filterParams(filters) })
    return response.data
  },

  getExplorerData: async (
    filters: FilterParams = {},
    advanced: { pendidikanIbu?: string; asiEksklusif?: string; aksesAir?: string; limit?: number } = {},
  ) => {
    const response = await api.get<ExplorerResponse>('/explorer', {
      params: { ...filterParams(filters), ...advanced },
    })
    return response.data
  },

  getFamilyPrediction: async (familyData: FamilyPredictionPayload) => {
    const response = await api.post<FamilyPredictionResponse>('/prediction/family', familyData)
    return response.data
  },

  getModelStatus: async () => {
    const response = await api.get<ModelStatus>('/model/status')
    return response.data
  },

  getServiceHealth: async () => {
    const response = await api.get('/health')
    return response.data as { status: string; source: DataSourceInfo; model: ModelStatus; llm: LLMStatus }
  },

  getDataStatus: async () => {
    const response = await api.get<DataStatusResponse>('/data/status')
    return response.data
  },
}

export default api
