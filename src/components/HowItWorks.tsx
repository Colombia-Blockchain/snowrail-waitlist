const steps = [
  {
    number: '01',
    title: 'Join the waitlist',
    description: 'Tell us about your use case and volume. We review every submission within 48-72h.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Get qualified',
    description: 'High-fit teams are invited to a 30-min call to scope integration and pilot terms.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Start your pilot',
    description: 'Access sandbox, integrate APIs, and run your first milestone-based payout.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
]

export function HowItWorks() {
  return (
    <section className="px-6 py-20 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-snow-0 mb-4">
            How the waitlist works
          </h2>
          <p className="text-snow-1 max-w-2xl mx-auto">
            From signup to your first payout in three steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-stroke-strong to-transparent" />
              )}

              <div className="text-center">
                <div className="relative inline-flex mb-5">
                  <div className="w-20 h-20 rounded-2xl glass border border-stroke flex items-center justify-center text-cyan">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-gradient-to-br from-cyan/30 to-blue/20 border border-stroke-strong flex items-center justify-center text-xs font-bold text-snow-0">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-snow-0 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-snow-1 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
