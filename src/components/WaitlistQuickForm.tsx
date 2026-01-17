import { useState, forwardRef, useImperativeHandle } from 'react'
import { GlassCard, PrimaryButton, useToast } from './ui'
import { WaitlistSuccessCard } from './WaitlistSuccessCard'
import { REGIONS, type Region, type Segment } from '../types/waitlist'
import { submitWaitlist } from '../lib/supabase'

export type UserType = 'team' | 'partner'

interface WaitlistQuickFormProps {
  onAddDetails: (data: { email: string; segment: Segment; region: Region }) => void
}

export interface WaitlistQuickFormRef {
  setUserType: (type: UserType) => void
  scrollIntoView: () => void
}

const userTypeToSegment: Record<UserType, Segment> = {
  team: 'B2B Treasury/Ops',
  partner: 'Ramp partner',
}

export const WaitlistQuickForm = forwardRef<WaitlistQuickFormRef, WaitlistQuickFormProps>(
  ({ onAddDetails }, ref) => {
    const { showToast } = useToast()
    const [email, setEmail] = useState('')
    const [userType, setUserType] = useState<UserType>('team')
    const [region, setRegion] = useState<Region | ''>('')
    const [consent, setConsent] = useState(false)
    const [errors, setErrors] = useState<{ email?: string; region?: string; consent?: string }>({})
    const [formRef, setFormRef] = useState<HTMLDivElement | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    useImperativeHandle(ref, () => ({
      setUserType: (type: UserType) => setUserType(type),
      scrollIntoView: () => {
        formRef?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      },
    }))

    const validate = () => {
      const newErrors: { email?: string; region?: string; consent?: string } = {}
      if (!email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Enter a valid work email'
      }
      if (!region) {
        newErrors.region = 'Region is required'
      }
      if (!consent) {
        newErrors.consent = 'Please accept to continue'
      }
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!validate()) return

      setIsSubmitting(true)
      setSubmitError(null)

      try {
        const segment = userTypeToSegment[userType]
        await submitWaitlist({
          email,
          consent: true,
          segment,
          region: region as Region,
          // All other fields are optional for fast submit
          role: '',
          isDecisionMaker: null,
          company: '',
          website: '',
          useCase: '',
          monthlyVolumeBand: '',
          frequency: '',
          triggers: [],
          approvals: '',
          auditLevel: '',
          flowDirection: '',
          settlementSla: '',
          notes: '',
          regionsSupported: [],
          paymentRails: '',
          apiAvailable: null,
        })
        setIsSubmitted(true)
        showToast("You're on the list!", 'success')
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setIsSubmitting(false)
      }
    }

    const handleAddDetails = () => {
      const segment = userTypeToSegment[userType]
      onAddDetails({ email, segment, region: region as Region })
    }

    // Submitted state - inline success card
    if (isSubmitted) {
      return (
        <div ref={setFormRef} id="waitlist-form">
          <WaitlistSuccessCard
            nextStepText="We'll review your submission and reach out within 48-72h."
            showAddDetailsCta
            onAddDetails={handleAddDetails}
          />
        </div>
      )
    }

    return (
      <div ref={setFormRef} id="waitlist-form">
        <GlassCard className="max-w-md w-full">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="quick-email" className="block text-sm font-medium text-snow-0 mb-1.5">
                Work email
              </label>
              <input
                id="quick-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setErrors((prev) => ({ ...prev, email: undefined }))
                }}
                placeholder="you@company.com"
                className={`input-base ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
            </div>

            {/* User Type Toggle */}
            <div>
              <label className="block text-sm font-medium text-snow-0 mb-1.5">
                I am...
              </label>
              <div className="toggle-group">
                <button
                  type="button"
                  onClick={() => setUserType('team')}
                  className={`toggle-btn ${userType === 'team' ? 'active' : ''}`}
                >
                  A team / company
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('partner')}
                  className={`toggle-btn ${userType === 'partner' ? 'active' : ''}`}
                >
                  A partner
                </button>
              </div>
            </div>

            {/* Region */}
            <div>
              <label htmlFor="quick-region" className="block text-sm font-medium text-snow-0 mb-1.5">
                Primary region
              </label>
              <select
                id="quick-region"
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value as Region)
                  setErrors((prev) => ({ ...prev, region: undefined }))
                }}
                className={`input-base select-base ${errors.region ? 'input-error' : ''}`}
              >
                <option value="">Select region</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {errors.region && <p className="text-error text-sm mt-1">{errors.region}</p>}
            </div>

            {/* Consent */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="quick-consent"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked)
                  setErrors((prev) => ({ ...prev, consent: undefined }))
                }}
                className="checkbox-base mt-0.5"
              />
              <label htmlFor="quick-consent" className="text-sm text-snow-1 cursor-pointer select-none">
                I agree to be contacted about pilots and updates.
              </label>
            </div>
            {errors.consent && <p className="text-error text-sm -mt-2">{errors.consent}</p>}

            {/* Error message */}
            {submitError && (
              <div className="p-3 rounded-xl border border-error/30 bg-error/10 text-error text-sm">
                {submitError}
              </div>
            )}

            {/* CTA */}
            <PrimaryButton type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? (
                'Joining...'
              ) : (
                <>
                  Join waitlist
                  <span className="text-snow-1 text-xs ml-1">(30s)</span>
                </>
              )}
            </PrimaryButton>

            {/* Add details link */}
            <button
              type="button"
              onClick={() => {
                if (validate()) {
                  handleAddDetails()
                }
              }}
              className="w-full text-center text-sm text-snow-2 hover:text-cyan transition-colors"
            >
              Add details (improves pilot priority) →
            </button>
          </form>
        </GlassCard>
      </div>
    )
  }
)

WaitlistQuickForm.displayName = 'WaitlistQuickForm'
