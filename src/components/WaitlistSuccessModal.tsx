import { GlassCard, PrimaryButton, useToast } from './ui'
import { shareOnX, copyShareLink } from '../lib/share'
import type { WaitlistResult } from '../types/waitlist'

interface WaitlistSuccessModalProps {
  result: WaitlistResult
  onClose: () => void
}

export function WaitlistSuccessModal({ result, onClose }: WaitlistSuccessModalProps) {
  const { showToast } = useToast()

  const handleShareOnX = () => {
    shareOnX({ ref: 'waitlist' })
  }

  const handleCopyLink = async () => {
    try {
      await copyShareLink({ ref: 'waitlist' })
      showToast('Link copied', 'success')
    } catch {
      showToast('Failed to copy link', 'error')
    }
  }

  const getTrackBadgeStyle = () => {
    switch (result.track) {
      case 'PILOT':
        return 'bg-cyan/20 text-cyan border-cyan/30'
      case 'DISCOVERY':
        return 'bg-blue/20 text-blue border-blue/30'
      default:
        return 'bg-snow-1/20 text-snow-1 border-snow-1/30'
    }
  }

  const getTrackLabel = () => {
    switch (result.track) {
      case 'PILOT':
        return 'Pilot Track'
      case 'DISCOVERY':
        return 'Discovery Track'
      default:
        return 'Waitlist'
    }
  }

  return (
    <div className="fixed inset-0 bg-ink-0/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <GlassCard className="max-w-md w-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-glass-2 rounded-xl transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5 text-snow-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center pt-2">
          {/* Success Icon */}
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-cyan/20 to-blue/10 border border-cyan/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Heading */}
          <h3 className="text-2xl font-bold text-snow-0 mb-2">You're all set!</h3>

          {/* Track badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium mb-4 ${getTrackBadgeStyle()}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {getTrackLabel()}
          </div>

          {/* Next step text */}
          <p className="text-snow-1 text-sm leading-relaxed mb-6 px-2">
            {result.nextStep}
          </p>

          {/* Actions */}
          <div className="space-y-2">
            {/* Primary: Share on X */}
            <PrimaryButton onClick={handleShareOnX} fullWidth>
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
              </span>
            </PrimaryButton>

            {/* Secondary: Copy link */}
            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 px-4 rounded-xl border border-stroke text-snow-2 hover:text-snow-0 hover:border-stroke-strong transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy link
            </button>

            {/* Done button */}
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 text-snow-2 hover:text-snow-0 transition-colors text-sm"
            >
              Done
            </button>
          </div>

          {/* Share microcopy */}
          <p className="text-xs text-snow-2 mt-2">
            Share with a relevant team or partner.
          </p>
        </div>
      </GlassCard>
    </div>
  )
}
