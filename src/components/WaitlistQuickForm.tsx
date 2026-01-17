import { useState, forwardRef, useImperativeHandle } from 'react'
import { GlassCard, PrimaryButton } from './ui'
import { REGIONS, type Region } from '../types/waitlist'

export type UserType = 'team' | 'partner'

interface WaitlistQuickFormProps {
  onExpandForm: (data: { email: string; userType: UserType; region: Region }) => void
}

export interface WaitlistQuickFormRef {
  setUserType: (type: UserType) => void
  scrollIntoView: () => void
}

export const WaitlistQuickForm = forwardRef<WaitlistQuickFormRef, WaitlistQuickFormProps>(
  ({ onExpandForm }, ref) => {
    const [email, setEmail] = useState('')
    const [userType, setUserType] = useState<UserType>('team')
    const [region, setRegion] = useState<Region | ''>('')
    const [errors, setErrors] = useState<{ email?: string; region?: string }>({})
    const [formRef, setFormRef] = useState<HTMLDivElement | null>(null)

    useImperativeHandle(ref, () => ({
      setUserType: (type: UserType) => setUserType(type),
      scrollIntoView: () => {
        formRef?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      },
    }))

    const validate = () => {
      const newErrors: { email?: string; region?: string } = {}
      if (!email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Enter a valid email'
      }
      if (!region) {
        newErrors.region = 'Region is required'
      }
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (validate()) {
        onExpandForm({ email, userType, region: region as Region })
      }
    }

    return (
      <div ref={setFormRef} id="waitlist-form">
        <GlassCard className="max-w-md w-full">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="quick-email" className="block text-sm font-medium text-snow-0 mb-2">
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
              {errors.email && <p className="text-error text-sm mt-1.5">{errors.email}</p>}
            </div>

            {/* User Type Toggle */}
            <div>
              <label className="block text-sm font-medium text-snow-0 mb-2">
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
              <label htmlFor="quick-region" className="block text-sm font-medium text-snow-0 mb-2">
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
              {errors.region && <p className="text-error text-sm mt-1.5">{errors.region}</p>}
            </div>

            {/* CTA */}
            <PrimaryButton type="submit" fullWidth className="mt-2">
              Join the waitlist
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </PrimaryButton>

            {/* Microcopy */}
            <p className="microcopy text-center">
              Pilot spots limited. No spam. Reply in 48-72h for Pilot-fit teams.
            </p>
          </form>
        </GlassCard>
      </div>
    )
  }
)

WaitlistQuickForm.displayName = 'WaitlistQuickForm'
