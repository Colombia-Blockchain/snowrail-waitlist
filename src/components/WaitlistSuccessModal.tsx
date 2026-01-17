import { useState } from 'react'
import { GlassCard, PrimaryButton, useToast } from './ui'
import { shareWaitlist } from '../lib/share'
import type { WaitlistResult } from '../types/waitlist'

interface WaitlistSuccessModalProps {
  result: WaitlistResult
  onClose: () => void
}

export function WaitlistSuccessModal({ result, onClose }: WaitlistSuccessModalProps) {
  const { showToast } = useToast()
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    setIsSharing(true)
    try {
      const shareResult = await shareWaitlist()
      if (shareResult === 'copied') {
        showToast('Link copied to clipboard', 'success')
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        showToast('Failed to share', 'error')
      }
    } finally {
      setIsSharing(false)
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
          <div className="space-y-3">
            <PrimaryButton onClick={onClose} fullWidth>
              Done
            </PrimaryButton>

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

            <p className="text-xs text-snow-2">
              Invite a relevant team or partner.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
