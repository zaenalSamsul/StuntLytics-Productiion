export type InterventionPriority = 'critical' | 'high' | 'medium'
export type InterventionStatus = 'triage' | 'planned' | 'in-progress' | 'verification'

export interface InterventionItem {
  id: string
  title: string
  region: string
  priority: InterventionPriority
  status: InterventionStatus
  owner: string
  due: string
  progress: number
  signal: string
  evidence: string
}

export const interventionItems: InterventionItem[] = [
  { id: 'SL-2048', title: 'Focused nutrition follow-up', region: 'Bandung Cluster', priority: 'critical', status: 'triage', owner: 'Regional Response', due: 'Today', progress: 18, signal: '+8.4% risk signal', evidence: 'Persistent high-risk pattern across recent monitoring windows' },
  { id: 'SL-2045', title: 'Coverage continuity outreach', region: 'Indramayu Cluster', priority: 'high', status: 'in-progress', owner: 'Field Coordination', due: 'Jul 10', progress: 62, signal: 'Coverage gap', evidence: 'Follow-up continuity below configured operational target' },
  { id: 'SL-2039', title: 'Water & sanitation verification', region: 'Cianjur Cluster', priority: 'high', status: 'verification', owner: 'Public Health Team', due: 'Jul 11', progress: 84, signal: 'Multi-factor pressure', evidence: 'Composite determinant signal remains elevated' },
  { id: 'SL-2032', title: 'Family screening campaign', region: 'Garut Cluster', priority: 'medium', status: 'planned', owner: 'Screening Team', due: 'Jul 15', progress: 35, signal: 'Emerging hotspot', evidence: 'Early-warning threshold crossed in two adjacent areas' },
]
