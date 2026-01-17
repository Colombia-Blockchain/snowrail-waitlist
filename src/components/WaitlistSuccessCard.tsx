import { GlassCard, PrimaryButton, useToast } from './ui'
import { shareOnX, copyShareLink } from '../lib/share'

interface WaitlistSuccessCardProps {
  nextStepText: string
  showAddDetailsCta?: boolean
  onAddDetails?: () => void
  signupId?: string
  compact?: boolean
}

export function WaitlistSuccessCard({
  nextStepText,
  showAddDetailsCta = false,
  onAddDetails,
  signupId,
  compact = false,
}: WaitlistSuccessCardProps) {
  const { showToast } = useToast()

  const ref = signupId || 'waitlist'

  const handleShareOnX = () => {
    shareOnX({ ref })
  }

  const handleCopyLink = async () => {
    try {
      await copyShareLink({ ref })
      showToast('Link copied', 'success')
    } catch {
      showToast('Failed to copy link', 'error')
    }
  }

  return (
    <GlassCard className={`max-w-md w-full ${compact ? 'p-5' : ''}`}>
      <div className="text-center">
        {/* Success Icon */}
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan/20 to-blue/10 border border-cyan/30 flex items-center justify-center">
          <svg className="w-7 h-7 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Heading */}
        <h3 className="text-xl font-semibold text-snow-0 mb-2">You're on the list!</h3>

        {/* Next step text */}
        <p className="text-sm text-snow-1 leading-relaxed mb-5">
          {nextStepText}
        </p>

        {/* Add details CTA */}
        {showAddDetailsCta && onAddDetails && (
          <button
            onClick={onAddDetails}
            className="w-full py-3 px-4 rounded-xl glass-subtle text-snow-0 font-medium hover:border-stroke-strong transition-all group mb-3"
          >
            <span className="flex items-center justify-center gap-2">
              Add details to improve pilot priority
              <svg className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        )}

        {/* Share actions */}
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
        </div>

        {/* Share microcopy */}
        <p className="text-xs text-snow-2 mt-3">
          Share with a relevant team or partner.
        </p>
      </div>
    </GlassCard>
  )
}
