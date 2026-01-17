import type { ReactNode } from 'react'

interface LayoutShellProps {
  children: ReactNode
}

export function LayoutShell({ children }: LayoutShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Grid overlay */}
      <div className="fixed inset-0 bg-snowrail-grid pointer-events-none" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
