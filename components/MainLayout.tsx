'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f4f7fb] dark:bg-background">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="min-h-screen lg:pl-[258px]">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main id="main-content" className="workspace-content">
          {children}
        </main>
        <footer className="mx-auto flex w-full max-w-[1600px] flex-col gap-2 px-5 pb-6 pt-2 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-8">
          <p>© 2026 StuntLytics · Child growth intelligence for prevention programs.</p>
          <p>Decision support only · Clinical and policy review remain required.</p>
        </footer>
      </div>
    </div>
  )
}
