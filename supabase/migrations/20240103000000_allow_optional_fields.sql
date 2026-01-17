-- Allow nulls for optional fields (progressive disclosure)
-- Fast submit only requires: email, segment, region, consent

-- Remove NOT NULL constraints from optional fields
ALTER TABLE waitlist_signups
  ALTER COLUMN use_case DROP NOT NULL,
  ALTER COLUMN monthly_volume_band DROP NOT NULL,
  ALTER COLUMN frequency DROP NOT NULL;

-- Add new fields for Ramp partners
ALTER TABLE waitlist_signups
  ADD COLUMN IF NOT EXISTS regions_supported TEXT[] DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS payment_rails TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS api_available BOOLEAN DEFAULT NULL;

-- Update constraint to allow partial submissions
ALTER TABLE waitlist_signups DROP CONSTRAINT IF EXISTS valid_consent;
ALTER TABLE waitlist_signups ADD CONSTRAINT valid_consent CHECK (consent = true);

-- Add signup_id for client-side tracking (allows upsert after fast submit)
ALTER TABLE waitlist_signups
  ADD COLUMN IF NOT EXISTS signup_id UUID DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_signups_signup_id ON waitlist_signups(signup_id);

COMMENT ON COLUMN waitlist_signups.signup_id IS 'Client-generated ID for upsert after fast submit';
COMMENT ON COLUMN waitlist_signups.regions_supported IS 'For Ramp partners: regions they support';
COMMENT ON COLUMN waitlist_signups.payment_rails IS 'For Ramp partners: ACH/Wire/SEPA/Other';
COMMENT ON COLUMN waitlist_signups.api_available IS 'For Ramp partners: whether they have an API';
