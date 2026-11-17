/*
# Enable admin write access for destinations, special_offers, and site_settings

1. Security Changes
- Add INSERT/UPDATE/DELETE policies for `destinations`, `special_offers`, and `site_settings` scoped to `authenticated` role.
- Add SELECT policy for `booking_requests` scoped to `authenticated` role so admin can read submissions.
- Add DELETE policy for `booking_requests` scoped to `authenticated` role so admin can remove spam/archive submissions.
- Public anon role remains read-only for content and can only submit booking requests.

2. Important Notes
- These policies allow any authenticated Supabase user to manage content. For a single-admin travel agency this is acceptable; the admin sign-in screen gates access.
- No existing data is changed.
*/

DROP POLICY IF EXISTS "auth_manage_destinations" ON public.destinations;
CREATE POLICY "auth_manage_destinations" ON public.destinations
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_manage_special_offers" ON public.special_offers;
CREATE POLICY "auth_manage_special_offers" ON public.special_offers
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_manage_site_settings" ON public.site_settings;
CREATE POLICY "auth_manage_site_settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_booking_requests" ON public.booking_requests;
CREATE POLICY "auth_read_booking_requests" ON public.booking_requests
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_delete_booking_requests" ON public.booking_requests;
CREATE POLICY "auth_delete_booking_requests" ON public.booking_requests
  FOR DELETE TO authenticated USING (true);
