import { useState } from 'react'
import { GlassCard, ProgressIndicator, PrimaryButton, SecondaryButton } from './ui'
import type {
  WaitlistFormData,
  Segment,
  Region,
  UseCase,
  VolumeRange,
  Frequency,
  Trigger,
  Approval,
  AuditLevel,
  FlowDirection,
  SettlementSLA,
  PaymentRails,
  WaitlistResult,
} from '../types/waitlist'
import {
  SEGMENTS,
  REGIONS,
  USE_CASES,
  VOLUME_RANGES,
  FREQUENCIES,
  TRIGGERS,
  APPROVALS,
  AUDIT_LEVELS,
  FLOW_DIRECTIONS,
  SETTLEMENT_SLAS,
  PAYMENT_RAILS,
} from '../types/waitlist'
import { submitWaitlist } from '../lib/supabase'

interface WaitlistFormProps {
  onClose: () => void
  onSuccess: (result: WaitlistResult) => void
  initialSegment?: Segment
  initialEmail?: string
  initialRegion?: Region
}

const initialFormData: WaitlistFormData = {
  email: '',
  consent: true, // Already consented in fast submit
  segment: '',
  role: '',
  isDecisionMaker: null,
  company: '',
  website: '',
  region: '',
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
}

export function WaitlistForm({ onClose, onSuccess, initialSegment, initialEmail, initialRegion }: WaitlistFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<WaitlistFormData>({
    ...initialFormData,
    segment: initialSegment || '',
    email: initialEmail || '',
    region: initialRegion || '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof WaitlistFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const isRampPartner = formData.segment === 'Ramp partner'
  const totalSteps = isRampPartner ? 2 : 3

  const updateField = <K extends keyof WaitlistFormData>(
    field: K,
    value: WaitlistFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const toggleTrigger = (trigger: Trigger) => {
    setFormData((prev) => ({
      ...prev,
      triggers: prev.triggers.includes(trigger)
        ? prev.triggers.filter((t) => t !== trigger)
        : [...prev.triggers, trigger],
    }))
  }

  const toggleRegionSupported = (region: Region) => {
    setFormData((prev) => ({
      ...prev,
      regionsSupported: prev.regionsSupported.includes(region)
        ? prev.regionsSupported.filter((r) => r !== region)
        : [...prev.regionsSupported, region],
    }))
  }

  const validateStep = (): boolean => {
    const newErrors: Partial<Record<keyof WaitlistFormData, string>> = {}

    if (step === 1) {
      // Only role is strictly required
      if (!formData.role.trim()) newErrors.role = 'Please enter your role'
      // Company required for teams only
      if (!isRampPartner && !formData.company.trim()) {
        newErrors.company = 'Please enter your company name'
      }
    }
    // Steps 2 and 3 are optional

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSkip = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const result = await submitWaitlist(formData)
      onSuccess(result)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const showFlowQuestions =
    formData.useCase === 'Milestone-based vendor payouts' ||
    formData.useCase === 'Recurring contractor payroll' ||
    formData.useCase === 'Invoice settlement / AP automation'

  return (
    <div className="fixed inset-0 bg-ink-0/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <GlassCard className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-snow-0">Add Details</h2>
            <p className="text-sm text-snow-2 mt-1">Improve your pilot priority</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-glass-2 rounded-xl transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6 text-snow-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ProgressIndicator currentStep={step} totalSteps={totalSteps} />

        {/* Step 1: Basics (Required) */}
        {step === 1 && (
          <div className="space-y-5">
            <p className="text-sm text-cyan mb-4">Required — helps us understand your needs</p>

            {/* Segment (if not pre-filled) */}
            {!initialSegment && (
              <div>
                <label className="block text-sm font-medium text-snow-0 mb-2">
                  What describes you best? *
                </label>
                <select
                  value={formData.segment}
                  onChange={(e) => updateField('segment', e.target.value as Segment)}
                  className={`input-base select-base ${errors.segment ? 'input-error' : ''}`}
                >
                  <option value="">Select a segment</option>
                  {SEGMENTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.segment && <p className="text-error text-sm mt-1.5">{errors.segment}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-snow-0 mb-2">
                Your role *
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => updateField('role', e.target.value)}
                placeholder="e.g., CFO, Engineering Lead, Founder"
                className={`input-base ${errors.role ? 'input-error' : ''}`}
              />
              {errors.role && <p className="text-error text-sm mt-1.5">{errors.role}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-snow-0 mb-2">
                Do you make purchasing decisions?
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => updateField('isDecisionMaker', true)}
                  className={`flex-1 min-h-[44px] px-4 py-3 rounded-xl transition-all ${
                    formData.isDecisionMaker === true
                      ? 'bg-gradient-to-r from-cyan/20 to-blue/15 border border-stroke-hover text-snow-0 shadow-[0_0_20px_rgba(90,240,255,0.15)]'
                      : 'glass-subtle text-snow-1 hover:border-stroke-strong'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => updateField('isDecisionMaker', false)}
                  className={`flex-1 min-h-[44px] px-4 py-3 rounded-xl transition-all ${
                    formData.isDecisionMaker === false
                      ? 'bg-gradient-to-r from-cyan/20 to-blue/15 border border-stroke-hover text-snow-0 shadow-[0_0_20px_rgba(90,240,255,0.15)]'
                      : 'glass-subtle text-snow-1 hover:border-stroke-strong'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {!isRampPartner && (
              <div>
                <label className="block text-sm font-medium text-snow-0 mb-2">
                  Company / Project *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => updateField('company', e.target.value)}
                  placeholder="Your company or project name"
                  className={`input-base ${errors.company ? 'input-error' : ''}`}
                />
                {errors.company && <p className="text-error text-sm mt-1.5">{errors.company}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-snow-0 mb-2">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder="https://example.com"
                className="input-base"
              />
            </div>

            {/* Region (if not pre-filled) */}
            {!initialRegion && (
              <div>
                <label className="block text-sm font-medium text-snow-0 mb-2">
                  Primary region
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => updateField('region', e.target.value as Region)}
                  className="input-base select-base"
                >
                  <option value="">Select a region</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Step 2 for Teams: Pilot Fit (Optional) */}
        {step === 2 && !isRampPartner && (
          <div className="space-y-5">
            <p className="text-sm text-snow-2 mb-4">Optional — improves pilot priority (~30s)</p>

            <div>
              <label className="block text-sm font-medium text-snow-0 mb-2">
                Primary use case
              </label>
              <select
                value={formData.useCase}
                onChange={(e) => updateField('useCase', e.target.value as UseCase)}
                className="input-base select-base"
              >
                <option value="">Select a use case</option>
                {USE_CASES.map((uc) => (
                  <option key={uc} value={uc}>{uc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-snow-0 mb-2">
                Estimated monthly volume (USD)
              </label>
              <select
                value={formData.monthlyVolumeBand}
                onChange={(e) => updateField('monthlyVolumeBand', e.target.value as VolumeRange)}
                className="input-base select-base"
              >
                <option value="">Select volume range</option>
                {VOLUME_RANGES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-snow-0 mb-2">
                Payment frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => updateField('frequency', e.target.value as Frequency)}
                className="input-base select-base"
              >
                <option value="">Select frequency</option>
                {FREQUENCIES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 2 for Ramp Partners: Partner Details (Optional) */}
        {step === 2 && isRampPartner && (
          <div className="space-y-5">
            <p className="text-sm text-snow-2 mb-4">Optional — helps us understand your integration needs (~30s)</p>

            <div>
              <label className="block text-sm font-medium text-snow-0 mb-2">
                Regions supported
              </label>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => toggleRegionSupported(r)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                      formData.regionsSupported.includes(r)
                        ? 'bg-gradient-to-r from-cyan/20 to-blue/15 border border-stroke-hover text-snow-0'
                        : 'glass-subtle text-snow-1 hover:border-stroke-strong'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-snow-0 mb-2">
                Typical settlement SLA
              </label>
              <select
                value={formData.settlementSla}
                onChange={(e) => updateField('settlementSla', e.target.value as SettlementSLA)}
                className="input-base select-base"
              >
                <option value="">Select SLA</option>
                {SETTLEMENT_SLAS.map((sla) => (
                  <option key={sla} value={sla}>{sla}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-snow-0 mb-2">
                Payment rails supported
              </label>
              <select
                value={formData.paymentRails}
                onChange={(e) => updateField('paymentRails', e.target.value as PaymentRails)}
                className="input-base select-base"
              >
                <option value="">Select rails</option>
                {PAYMENT_RAILS.map((rail) => (
                  <option key={rail} value={rail}>{rail}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-snow-0 mb-2">
                API available?
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => updateField('apiAvailable', true)}
                  className={`flex-1 min-h-[44px] px-4 py-3 rounded-xl transition-all ${
                    formData.apiAvailable === true
                      ? 'bg-gradient-to-r from-cyan/20 to-blue/15 border border-stroke-hover text-snow-0 shadow-[0_0_20px_rgba(90,240,255,0.15)]'
                      : 'glass-subtle text-snow-1 hover:border-stroke-strong'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => updateField('apiAvailable', false)}
                  className={`flex-1 min-h-[44px] px-4 py-3 rounded-xl transition-all ${
                    formData.apiAvailable === false
                      ? 'bg-gradient-to-r from-cyan/20 to-blue/15 border border-stroke-hover text-snow-0 shadow-[0_0_20px_rgba(90,240,255,0.15)]'
                      : 'glass-subtle text-snow-1 hover:border-stroke-strong'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-snow-0 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Tell us more about your integration needs..."
                rows={3}
                className="input-base resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 3 for Teams: Controls & Settlement (Optional) */}
        {step === 3 && !isRampPartner && (
          <div className="space-y-5">
            <p className="text-sm text-snow-2 mb-4">Optional — helps us tailor your pilot (~30s)</p>

            <div>
              <label className="block text-sm font-medium text-snow-0 mb-2">
                What triggers a payment? (select all that apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TRIGGERS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTrigger(t)}
                    className={`px-4 py-2.5 text-left text-sm rounded-xl transition-all ${
                      formData.triggers.includes(t)
                        ? 'bg-gradient-to-r from-cyan/20 to-blue/15 border border-stroke-hover text-snow-0'
                        : 'glass-subtle text-snow-1 hover:border-stroke-strong'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-snow-0 mb-2">
                Do you require human approvals?
              </label>
              <select
                value={formData.approvals}
                onChange={(e) => updateField('approvals', e.target.value as Approval)}
                className="input-base select-base"
              >
                <option value="">Select an option</option>
                {APPROVALS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-snow-0 mb-2">
                Audit / reconciliation needs
              </label>
              <select
                value={formData.auditLevel}
                onChange={(e) => updateField('auditLevel', e.target.value as AuditLevel)}
                className="input-base select-base"
              >
                <option value="">Select audit level</option>
                {AUDIT_LEVELS.map((al) => (
                  <option key={al} value={al}>{al}</option>
                ))}
              </select>
            </div>

            {showFlowQuestions && (
              <>
                <div>
                  <label className="block text-sm font-medium text-snow-0 mb-2">
                    Flow direction
                  </label>
                  <select
                    value={formData.flowDirection}
                    onChange={(e) => updateField('flowDirection', e.target.value as FlowDirection)}
                    className="input-base select-base"
                  >
                    <option value="">Select flow direction</option>
                    {FLOW_DIRECTIONS.map((fd) => (
                      <option key={fd} value={fd}>{fd}</option>
                    ))}
                  </select>
                </div>

                {(formData.flowDirection === 'USDC → USD (off-ramp)' || formData.flowDirection === 'Both') && (
                  <div>
                    <label className="block text-sm font-medium text-snow-0 mb-2">
                      Settlement SLA
                    </label>
                    <select
                      value={formData.settlementSla}
                      onChange={(e) => updateField('settlementSla', e.target.value as SettlementSLA)}
                      className="input-base select-base"
                    >
                      <option value="">Select SLA</option>
                      {SETTLEMENT_SLAS.map((sla) => (
                        <option key={sla} value={sla}>{sla}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-snow-0 mb-2">
                Describe your scenario
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Tell us more about your use case in 2-3 lines..."
                rows={3}
                className="input-base resize-none"
              />
            </div>
          </div>
        )}

        {submitError && (
          <div className="p-4 rounded-xl border border-error/30 bg-error/10 text-error text-sm mt-4">
            {submitError}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-stroke">
          <SecondaryButton onClick={step === 1 ? onClose : handleBack}>
            {step === 1 ? 'Cancel' : 'Back'}
          </SecondaryButton>

          <div className="flex gap-3">
            {step > 1 && step < totalSteps && (
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-sm text-snow-2 hover:text-snow-1 transition-colors"
              >
                Skip
              </button>
            )}

            {step < totalSteps ? (
              <PrimaryButton onClick={handleNext}>
                Continue
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Finish'}
              </PrimaryButton>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
