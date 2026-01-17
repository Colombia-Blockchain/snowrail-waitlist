const segments = [
  {
    title: 'B2B Treasury / Finance Ops',
    description: 'Automate conditional payouts to vendors, contractors, and partners with built-in compliance controls.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Agent builders / AI-native SDKs',
    description: 'Give your autonomous agents programmable spending with guardrails and audit trails.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: 'Ramp partners (on/off)',
    description: 'Connect your fiat rails to SnowRail for seamless USDC-to-USD settlement.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    title: 'RWA / yield connectors',
    description: 'Integrate real-world assets and yield strategies with programmable settlement.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
]

export function SegmentCards() {
  return (
    <section className="px-6 py-20 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-center">
          Who is this for?
        </h2>
        <p className="text-muted text-center mb-12 max-w-2xl mx-auto">
          SnowRail is built for teams that need programmable, auditable, and compliant financial execution.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {segments.map((segment) => (
            <div
              key={segment.title}
              className="p-6 bg-background rounded-xl border border-border hover:border-accent/30 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent mb-4">
                {segment.icon}
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                {segment.title}
              </h3>
              <p className="text-muted leading-relaxed">
                {segment.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
