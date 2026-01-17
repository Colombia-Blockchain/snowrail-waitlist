-- Create waitlist_signups table
CREATE TABLE IF NOT EXISTS waitlist_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Contact
  email TEXT NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT false,

  -- Segmentation
  segment TEXT NOT NULL,
  role TEXT,
  is_decision_maker BOOLEAN,
  company TEXT,
  website TEXT,
  region TEXT NOT NULL,

  -- Use case
  use_case TEXT NOT NULL,
  monthly_volume_band TEXT NOT NULL,
  frequency TEXT NOT NULL,

  -- Triggers & Controls
  triggers TEXT[] DEFAULT '{}',
  approvals TEXT,
  audit_level TEXT,

  -- Off-ramp (optional)
  flow_direction TEXT,
  settlement_sla TEXT,

  -- Notes
  notes TEXT,

  -- Scoring
  score INT NOT NULL,
  track TEXT NOT NULL,

  -- Metadata
  user_agent TEXT,
  referrer TEXT,

  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  CONSTRAINT valid_consent CHECK (consent = true),
  CONSTRAINT valid_score CHECK (score >= 0 AND score <= 100),
  CONSTRAINT valid_track CHECK (track IN ('PILOT', 'DISCOVERY', 'NURTURE'))
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_signups_email ON waitlist_signups(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_created_at ON waitlist_signups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_segment ON waitlist_signups(segment);
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_track ON waitlist_signups(track);
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_score ON waitlist_signups(score DESC);

-- Enable RLS
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

-- RLS Policy: No direct inserts from anon users
-- All inserts must go through the Edge Function with service role
-- This prevents direct spam attacks on the table

-- If you need to allow updates/deletes from authenticated admin users:
-- CREATE POLICY "Allow admin full access" ON waitlist_signups
--   FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- Grant Edge Functions (service role) full access
-- This is handled automatically by Supabase service role

COMMENT ON TABLE waitlist_signups IS 'Waitlist submissions for SnowRail beta access';
COMMENT ON COLUMN waitlist_signups.score IS 'Computed score 0-100 based on qualification signals';
COMMENT ON COLUMN waitlist_signups.track IS 'Assigned track: PILOT (>=70), DISCOVERY (40-69), NURTURE (<40)';
