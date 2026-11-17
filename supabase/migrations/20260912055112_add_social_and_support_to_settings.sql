/*
# Add social links and support phone to site_settings

1. Modified Tables
- `site_settings`: added `instagram_url`, `telegram_url`, `support_phone` columns.

2. Important Notes
- All new columns are nullable with sensible defaults.
- Existing data is preserved.
*/

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS instagram_url text DEFAULT 'https://instagram.com/bravotravel',
  ADD COLUMN IF NOT EXISTS telegram_url text DEFAULT 'https://t.me/bravotravel',
  ADD COLUMN IF NOT EXISTS support_phone text DEFAULT '+998883887711';
