export type NotificationSeverity = 'critical' | 'warning' | 'info' | 'success'
export type NotificationCategory = 'risk' | 'data' | 'ai' | 'intervention' | 'system'

export interface AppNotification {
  id: string
  title: string
  message: string
  severity: NotificationSeverity
  category: NotificationCategory
  timestamp: string
  relativeTime: string
  region?: string
  href?: string
  actionLabel?: string
  read?: boolean
  requiresAction?: boolean
}

export const initialNotifications: AppNotification[] = [
  {
    id: 'risk-bandung-01',
    title: 'Priority risk signal increased',
    message: 'The composite risk signal for the Bandung monitoring cluster moved above the configured early-warning threshold.',
    severity: 'critical',
    category: 'risk',
    timestamp: '2026-07-08T15:22:00+07:00',
    relativeTime: '8 min ago',
    region: 'Bandung Cluster',
    href: '/risk-map?focus=bandung',
    actionLabel: 'Review map',
    requiresAction: true,
  },
  {
    id: 'intervention-02',
    title: 'Intervention follow-up due',
    message: 'Nutrition outreach verification for three priority areas is due today.',
    severity: 'warning',
    category: 'intervention',
    timestamp: '2026-07-08T13:05:00+07:00',
    relativeTime: '2 h ago',
    href: '/action-center',
    actionLabel: 'Open action center',
    requiresAction: true,
  },
  {
    id: 'ai-insight-03',
    title: 'New AI insight available',
    message: 'A cross-factor pattern was detected between coverage continuity and regional risk persistence.',
    severity: 'info',
    category: 'ai',
    timestamp: '2026-07-08T11:40:00+07:00',
    relativeTime: '4 h ago',
    href: '/insights',
    actionLabel: 'View insight',
  },
  {
    id: 'data-sync-04',
    title: 'Regional data sync completed',
    message: 'The latest monitoring batch passed schema and completeness checks.',
    severity: 'success',
    category: 'data',
    timestamp: '2026-07-08T09:10:00+07:00',
    relativeTime: '6 h ago',
    href: '/activity',
    actionLabel: 'View activity',
    read: true,
  },
  {
    id: 'system-05',
    title: 'Model monitoring check passed',
    message: 'No material drift signal was detected in the latest scheduled monitoring window.',
    severity: 'success',
    category: 'system',
    timestamp: '2026-07-07T22:30:00+07:00',
    relativeTime: 'Yesterday',
    href: '/activity',
    read: true,
  },
]

export const notificationStorageKey = 'stuntlytics-notification-read-state-v1'
