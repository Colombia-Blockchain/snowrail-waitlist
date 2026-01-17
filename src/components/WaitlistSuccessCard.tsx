import { useState } from 'react'
import { GlassCard, useToast } from './ui'
import { shareWaitlist } from '../lib/share'

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
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    setIsSharing(true)
    try {
      const result = await shareWaitlist({ signupId })
      if (result === 'copied') {
        showToast('Link copied to clipboard', 'success')
      }
    } catch (err) {
      // User cancelled share - do nothing
      if ((err as Error).name !== 'AbortError') {
        showToast('Failed to share', 'error')
      }
    } finally {
      setIsSharing(false)
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

        {/* Share button */}
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="w-full py-2.5 px-4 rounded-xl border border-stroke text-snow-2 hover:text-snow-0 hover:border-stroke-strong transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {isSharing ? 'Sharing...' : 'Share'}
        </button>

        {/* Share microcopy */}
        <p className="text-xs text-snow-2 mt-2">
          Invite a relevant team or partner.
        </p>
      </div>
    </GlassCard>
  )
}
