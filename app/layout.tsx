import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import 'maplibre-gl/dist/maplibre-gl.css'
import { ToastProvider } from '@/components/ToastProvider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'StuntLytics — Child Health Intelligence',
    template: '%s | StuntLytics',
  },
  description: 'Child health intelligence platform for stunting prevention, regional monitoring, accountable intervention follow-up, and evidence-informed program review.',
  applicationName: 'StuntLytics',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#08111F' },
  ],
  userScalable: true,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body><ToastProvider>{children}</ToastProvider>{process.env.NODE_ENV === 'production' && <Analytics />}</body>
    </html>
  )
}
