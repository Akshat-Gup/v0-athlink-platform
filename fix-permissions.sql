-- Fix permissions for Supabase service role to access tables
-- Run this in your Supabase SQL Editor

-- Disable RLS for service role access on main tables
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.campaigns DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sponsors DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sponsorship_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.perk_tiers DISABLE ROW LEVEL SECURITY;

-- Alternatively, if you want to keep RLS enabled but allow service role access,
-- uncomment these lines instead of the DISABLE commands above:

-- CREATE POLICY "Allow service role full access on users" ON public.users
--   FOR ALL USING (true);

-- CREATE POLICY "Allow service role full access on campaigns" ON public.campaigns
--   FOR ALL USING (true);

-- CREATE POLICY "Allow service role full access on sponsors" ON public.sponsors
--   FOR ALL USING (true);

-- CREATE POLICY "Allow service role full access on locations" ON public.locations
--   FOR ALL USING (true);

-- CREATE POLICY "Allow service role full access on sponsorship_requests" ON public.sponsorship_requests
--   FOR ALL USING (true);

-- CREATE POLICY "Allow service role full access on perk_tiers" ON public.perk_tiers
--   FOR ALL USING (true);

-- Grant necessary permissions to service_role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
