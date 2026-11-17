/*
# Add secure Telegram integration settings

1. New Tables
- `integration_secrets`: stores server-only integration values by key, including the Telegram bot token and destination chat identifier. Values are never selected by the public website.
- `key`: stable secret name.
- `value`: secret value used only by the server-side Telegram notification function.
- `created_at`: creation timestamp.
- `updated_at`: last update timestamp.

2. Security Changes
- Row-level security is enabled on `integration_secrets`.
- Public and signed-in browser roles receive no privileges and no policies on the table.
- Only `service_role` receives SELECT access so the edge function can read the integration values.

3. Important Notes
- No existing tables or booking rows are changed.
- The actual token is inserted separately after this schema change so it is not stored in source code or a migration file.
- This migration is idempotent and safe to apply again.
*/

CREATE TABLE IF NOT EXISTS public.integration_secrets (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.integration_secrets ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.integration_secrets FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.integration_secrets TO service_role;