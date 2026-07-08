export interface RiskFlow {
  id: string
  source: [number, number]
  target: [number, number]
  sourceName: string
  targetName: string
  intensity: number
  direction: 'rising' | 'stable' | 'improving'
  driver: string
}

export const riskFlows: RiskFlow[] = [
  { id: 'f1', source: [107.6191, -6.9175], target: [107.1425, -6.3373], sourceName: 'Bandung', targetName: 'Purwakarta', intensity: 0.92, direction: 'rising', driver: 'Composite risk pressure' },
  { id: 'f2', source: [107.6191, -6.9175], target: [107.6098, -6.2383], sourceName: 'Bandung', targetName: 'Subang', intensity: 0.78, direction: 'rising', driver: 'Coverage continuity gap' },
  { id: 'f3', source: [108.3243, -6.3265], target: [108.1900, -7.3274], sourceName: 'Indramayu', targetName: 'Tasikmalaya', intensity: 0.67, direction: 'stable', driver: 'Shared determinant pattern' },
  { id: 'f4', source: [107.1425, -6.3373], target: [106.8456, -6.2088], sourceName: 'Purwakarta', targetName: 'Bekasi', intensity: 0.55, direction: 'improving', driver: 'Referral & follow-up flow' },
  { id: 'f5', source: [107.9087, -7.2279], target: [107.6191, -6.9175], sourceName: 'Garut', targetName: 'Bandung', intensity: 0.74, direction: 'rising', driver: 'Emerging adjacent hotspot' },
  { id: 'f6', source: [107.1307, -7.3680], target: [106.8945, -6.8230], sourceName: 'Cianjur', targetName: 'Sukabumi', intensity: 0.63, direction: 'stable', driver: 'Multi-factor pressure' },
  { id: 'f7', source: [108.5523, -6.7320], target: [108.3243, -6.3265], sourceName: 'Cirebon', targetName: 'Indramayu', intensity: 0.58, direction: 'improving', driver: 'Intervention coordination' },
]

export const riskHotspots = [
  { name: 'Bandung', coordinates: [107.6191, -6.9175] as [number, number], intensity: 0.95 },
  { name: 'Indramayu', coordinates: [108.3243, -6.3265] as [number, number], intensity: 0.82 },
  { name: 'Garut', coordinates: [107.9087, -7.2279] as [number, number], intensity: 0.78 },
  { name: 'Cianjur', coordinates: [107.1307, -7.3680] as [number, number], intensity: 0.72 },
  { name: 'Cirebon', coordinates: [108.5523, -6.7320] as [number, number], intensity: 0.61 },
]

export function curvedFlowCoordinates(source: [number, number], target: [number, number], steps = 42): [number, number][] {
  const mx = (source[0] + target[0]) / 2
  const my = (source[1] + target[1]) / 2
  const dx = target[0] - source[0]
  const dy = target[1] - source[1]
  const distance = Math.sqrt(dx * dx + dy * dy)
  const bend = Math.min(0.32, Math.max(0.08, distance * 0.18))
  const length = Math.max(distance, 0.0001)
  const control: [number, number] = [mx - (dy / length) * bend, my + (dx / length) * bend]

  return Array.from({ length: steps + 1 }, (_, index) => {
    const t = index / steps
    const inv = 1 - t
    return [
      inv * inv * source[0] + 2 * inv * t * control[0] + t * t * target[0],
      inv * inv * source[1] + 2 * inv * t * control[1] + t * t * target[1],
    ] as [number, number]
  })
}
