import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  glow?: boolean
  hover?: boolean
}

export function GlassCard({ children, className = '', glow = false, hover = false }: GlassCardProps) {
  return (
    <div
      className={`
        glass rounded-3xl p-6 md:p-8
        ${glow ? 'glow-ring' : ''}
        ${hover ? 'glass-hover' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
