-- Allow authenticated users (dashboard/admin) to read all waitlist signups
CREATE POLICY "Allow authenticated read access"
  ON waitlist_signups
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow service role to insert (Edge Function)
-- Note: service_role bypasses RLS by default, but this makes it explicit
CREATE POLICY "Allow service role insert"
  ON waitlist_signups
  FOR INSERT
  TO service_role
  WITH CHECK (true);
