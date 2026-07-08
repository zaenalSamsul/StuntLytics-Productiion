export type ActivityType = 'analysis' | 'data' | 'alert' | 'intervention' | 'system'

export interface ActivityEvent {
  id: string
  type: ActivityType
  title: string
  description: string
  actor: string
  time: string
  metadata?: string
}

export const activityEvents: ActivityEvent[] = [
  { id: 'a1', type: 'alert', title: 'Priority alert acknowledged', description: 'Bandung cluster risk signal assigned for review.', actor: 'Zaenal A.', time: '15:31', metadata: 'Case SL-2048' },
  { id: 'a2', type: 'analysis', title: 'AI insight generated', description: 'Cross-factor analysis completed for 27 monitored regions.', actor: 'InsightNow AI', time: '14:58', metadata: 'Confidence 92%' },
  { id: 'a3', type: 'intervention', title: 'Nutrition outreach updated', description: 'Field verification moved from planned to in progress.', actor: 'Regional Team', time: '13:42', metadata: '3 target areas' },
  { id: 'a4', type: 'data', title: 'Monitoring batch synchronized', description: 'New regional observations validated and indexed.', actor: 'Data Pipeline', time: '09:10', metadata: '1,284 records' },
  { id: 'a5', type: 'system', title: 'Model monitoring completed', description: 'Scheduled drift and quality checks completed successfully.', actor: 'ML Monitor', time: '07:30', metadata: 'No material drift' },
  { id: 'a6', type: 'analysis', title: 'Correlation workspace exported', description: 'A factor comparison report was prepared for review.', actor: 'Zaenal A.', time: 'Yesterday', metadata: 'PDF report' },
]
