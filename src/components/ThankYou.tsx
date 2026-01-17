import type { WaitlistResult, Track } from '../types/waitlist'
import { GlassCard, PrimaryButton } from './ui'

interface ThankYouProps {
  result: WaitlistResult
  onClose: () => void
}

const trackConfig: Record<Track, { color: string; bgColor: string; borderColor: string; label: string }> = {
  PILOT: {
    color: 'text-success',
    bgColor: 'bg-success/15',
    borderColor: 'border-success/30',
    label: 'Pilot Track',
  },
  DISCOVERY: {
    color: 'text-cyan',
    bgColor: 'bg-cyan/15',
    borderColor: 'border-cyan/30',
    label: 'Discovery Track',
  },
  NURTURE: {
    color: 'text-blue',
    bgColor: 'bg-blue/15',
    borderColor: 'border-blue/30',
    label: 'Nurture Track',
  },
}

export function ThankYou({ result, onClose }: ThankYouProps) {
  const track = trackConfig[result.track]

  return (
    <div className="fixed inset-0 bg-ink-0/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <GlassCard glow className="max-w-lg w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-success/15 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-success/30">
            <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-snow-0 mb-2">
            You're on the list!
          </h2>
          <p className="text-snow-1 mb-8">
            Thanks for your interest in SnowRail. We've received your information.
          </p>

          <div className="glass-subtle rounded-2xl p-6 mb-6 text-left">
            <div className="space-y-5">
              <div>
                <span className="text-sm text-snow-2">Segment</span>
                <p className="font-medium text-snow-0 mt-1">{result.segment}</p>
              </div>

              <div>
                <span className="text-sm text-snow-2">Your Score</span>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                  <span className="font-bold text-snow-0 text-lg">{result.score}/100</span>
                </div>
              </div>

              <div>
                <span className="text-sm text-snow-2">Track</span>
                <p className={`inline-block mt-2 px-4 py-1.5 rounded-full text-sm font-medium ${track.bgColor} ${track.color} border ${track.borderColor}`}>
                  {track.label}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan/10 to-blue/10 border border-stroke rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-snow-0 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Next Step
            </h3>
            <p className="text-snow-1 text-sm leading-relaxed">
              {result.nextStep}
            </p>
          </div>

          <PrimaryButton onClick={onClose} fullWidth className="py-4 text-base">
            Done
          </PrimaryButton>
        </div>
      </GlassCard>
    </div>
  )
}
