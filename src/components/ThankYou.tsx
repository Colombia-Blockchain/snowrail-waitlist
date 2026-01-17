import type { WaitlistResult, Track } from '../types/waitlist'

interface ThankYouProps {
  result: WaitlistResult
  onClose: () => void
}

const trackConfig: Record<Track, { color: string; bgColor: string; label: string }> = {
  PILOT: { color: 'text-green-700', bgColor: 'bg-green-100', label: 'Pilot Track' },
  DISCOVERY: { color: 'text-blue-700', bgColor: 'bg-blue-100', label: 'Discovery Track' },
  NURTURE: { color: 'text-amber-700', bgColor: 'bg-amber-100', label: 'Nurture Track' },
}

export function ThankYou({ result, onClose }: ThankYouProps) {
  const track = trackConfig[result.track]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-primary mb-2">
            You're on the list!
          </h2>
          <p className="text-muted mb-8">
            Thanks for your interest in SnowRail. We've received your information.
          </p>

          <div className="bg-background rounded-xl p-6 mb-6 text-left">
            <div className="space-y-4">
              <div>
                <span className="text-sm text-muted">Segment</span>
                <p className="font-medium text-primary">{result.segment}</p>
              </div>

              <div>
                <span className="text-sm text-muted">Your Score</span>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex-1 h-3 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-500 rounded-full"
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                  <span className="font-bold text-primary">{result.score}/100</span>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted">Track</span>
                <p className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${track.bgColor} ${track.color}`}>
                  {track.label}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-accent/5 border border-accent/20 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Next Step
            </h3>
            <p className="text-secondary text-sm leading-relaxed">
              {result.nextStep}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full px-8 py-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
