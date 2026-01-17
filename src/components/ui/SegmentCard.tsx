import type { ReactNode } from 'react'

interface SegmentCardProps {
  title: string
  description: string
  icon: ReactNode
  onClick?: () => void
  selected?: boolean
}

export function SegmentCard({ title, description, icon, onClick, selected }: SegmentCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full text-left p-6 rounded-2xl transition-all duration-200
        glass-subtle
        ${selected
          ? 'border-stroke-hover shadow-[0_0_30px_rgba(90,240,255,0.15)]'
          : 'hover:border-stroke-strong hover:-translate-y-0.5'
        }
      `}
    >
      <div className={`
        w-12 h-12 rounded-xl flex items-center justify-center mb-4
        ${selected
          ? 'bg-gradient-to-br from-cyan/20 to-blue/15 text-cyan'
          : 'bg-glass-2 text-snow-1'
        }
      `}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-snow-0 mb-2">
        {title}
      </h3>
      <p className="text-sm text-snow-1 leading-relaxed">
        {description}
      </p>
    </button>
  )
}
