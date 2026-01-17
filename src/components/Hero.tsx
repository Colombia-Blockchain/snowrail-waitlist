import { forwardRef } from 'react'
import { WaitlistQuickForm, type WaitlistQuickFormRef } from './WaitlistQuickForm'
import type { Region, Segment } from '../types/waitlist'

interface HeroProps {
  onAddDetails: (data: { email: string; segment: Segment; region: Region }) => void
}

export const Hero = forwardRef<WaitlistQuickFormRef, HeroProps>(({ onAddDetails }, ref) => {
  return (
    <section className="min-h-[90vh] flex items-center px-6 py-16 md:py-20">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="max-w-xl">
            <div className="badge mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
              Pilot Waitlist Open
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-snow-0 leading-[1.15] tracking-tight mb-5">
              Join the <span className="text-gradient">SnowRail</span> Pilot Waitlist
            </h1>

            <p className="text-lg text-snow-1 mb-8 leading-relaxed">
              Automate milestone-based B2B payouts: evidence → controls → verifiable settlement (USDC on-chain → USD via nsegundos).
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-cyan/15 border border-cyan/30 flex items-center justify-center mt-0.5 shrink-0">
                  <svg className="w-3 h-3 text-cyan" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-snow-1">
                  <span className="font-medium text-snow-0">Pay on proof</span> — release funds only when conditions are verified
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-cyan/15 border border-cyan/30 flex items-center justify-center mt-0.5 shrink-0">
                  <svg className="w-3 h-3 text-cyan" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-snow-1">
                  <span className="font-medium text-snow-0">Built-in controls</span> — limits, approvals, and audit trails
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-cyan/15 border border-cyan/30 flex items-center justify-center mt-0.5 shrink-0">
                  <svg className="w-3 h-3 text-cyan" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-snow-1">
                  <span className="font-medium text-snow-0">Verifiable settlement</span> — auditable receipts for reconciliation
                </p>
              </div>
            </div>

            {/* Social proof / trust */}
            <div className="flex items-center gap-4 text-sm text-snow-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan/30 to-blue/20 border-2 border-ink-0 flex items-center justify-center text-xs font-medium text-snow-1"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span>50+ teams on the waitlist</span>
            </div>
          </div>

          {/* Right: Form */}
          <div className="flex justify-center lg:justify-end">
            <WaitlistQuickForm ref={ref} onAddDetails={onAddDetails} />
          </div>
        </div>
      </div>
    </section>
  )
})

Hero.displayName = 'Hero'
