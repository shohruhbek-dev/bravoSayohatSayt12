/*
# Update Bravo Sayohat business details and booking date support

1. Modified Tables
- `site_settings`: adds `manager_name` for the responsible manager's full name and updates the existing single settings row with the new Bravo Sayohat identity, contact details, working hours, and Telegram link.
- `booking_requests`: adds nullable `departure_date` so a date chosen on the homepage is saved with the request.

2. Business Data
- Business name is set to Bravo Sayohat.
- Address is set to Tashkent city, Chilonzor 2, Arnasay 16b.
- The two phone fields are set to the two provided phone numbers.
- Email is set to bravosayohat@gmail.com.
- Working hours are set to Monday through Friday, 10:00–18:00.
- Manager is set to Ibroximov Omatillo Talatbek o'g'li.
- Telegram is set to https://t.me/Clark_3621.
- The old Instagram fallback is cleared because no new Instagram address was provided.

3. Security and Data Safety
- No tables are removed and no existing booking rows are deleted.
- The existing row-level security policies remain in place.
- New columns are nullable or have safe defaults so existing records continue to work.

4. Important Notes
- The migration is idempotent and safe to apply again.
- The booking form can continue saving requests without a departure date when the user opens it from a general contact button.
*/

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS manager_name text NOT NULL DEFAULT '';

ALTER TABLE public.booking_requests
  ADD COLUMN IF NOT EXISTS departure_date date;

UPDATE public.site_settings
SET
  business_name = 'Bravo Sayohat',
  phone = '+998883887711',
  whatsapp = '+998905463330',
  email = 'bravosayohat@gmail.com',
  address = 'Tashkent sh. Chilonzor 2, Arnasay 16b',
  working_hours = 'Dushanbadan Jumagacha 10:00 dan 18:00 gacha.',
  manager_name = 'Ibroximov Omatillo Talatbek o''g''li',
  telegram_url = 'https://t.me/Clark_3621',
  support_phone = '+998883887711',
  instagram_url = '',
  updated_at = now();