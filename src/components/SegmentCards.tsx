import type { UserType } from './WaitlistQuickForm'

interface SegmentCardsProps {
  onSelectSegment: (userType: UserType) => void
}

const segments = [
  {
    title: 'B2B Treasury / Finance Ops',
    description: 'Automate conditional payouts to vendors, contractors, and partners with built-in compliance controls.',
    userType: 'team' as UserType,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Agent builders / AI SDKs',
    description: 'Give autonomous agents programmable spending with guardrails and audit trails.',
    userType: 'team' as UserType,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: 'Ramp partners (on/off)',
    description: 'Connect your fiat rails to SnowRail for seamless USDC-to-USD settlement.',
    userType: 'partner' as UserType,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    title: 'RWA / yield connectors',
    description: 'Integrate real-world assets and yield strategies with programmable settlement.',
    userType: 'partner' as UserType,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
]

export function SegmentCards({ onSelectSegment }: SegmentCardsProps) {
  return (
    <section id="use-cases" className="px-6 py-20 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-snow-0 mb-4">
            Who is this for?
          </h2>
          <p className="text-snow-1 max-w-2xl mx-auto">
            SnowRail is built for teams that need programmable, auditable, and compliant financial execution. Click to join.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {segments.map((segment) => (
            <button
              key={segment.title}
              onClick={() => onSelectSegment(segment.userType)}
              className="p-6 rounded-2xl glass-subtle glass-hover text-left group"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan/15 to-blue/10 border border-stroke flex items-center justify-center text-cyan mb-4 group-hover:border-stroke-strong transition-colors">
                {segment.icon}
              </div>
              <h3 className="text-lg font-semibold text-snow-0 mb-2 group-hover:text-cyan transition-colors">
                {segment.title}
              </h3>
              <p className="text-sm text-snow-1 leading-relaxed mb-4">
                {segment.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan opacity-0 group-hover:opacity-100 transition-opacity">
                Join waitlist
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
