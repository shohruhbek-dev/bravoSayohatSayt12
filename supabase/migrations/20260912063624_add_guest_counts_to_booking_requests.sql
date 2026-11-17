/*
# Add guest counts to booking requests

1. Modified Tables
- `booking_requests`: added `adults` and `children` integer columns for the guest selector.

2. Important Notes
- Adults default to 2 and children default to 0 for existing and new requests.
- Both values are constrained from 0 to 10 at the database boundary.
- No existing booking data is removed.
*/

ALTER TABLE public.booking_requests
  ADD COLUMN IF NOT EXISTS adults integer NOT NULL DEFAULT 2,
  ADD COLUMN IF NOT EXISTS children integer NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'booking_requests_adults_range') THEN
    ALTER TABLE public.booking_requests ADD CONSTRAINT booking_requests_adults_range CHECK (adults BETWEEN 0 AND 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'booking_requests_children_range') THEN
    ALTER TABLE public.booking_requests ADD CONSTRAINT booking_requests_children_range CHECK (children BETWEEN 0 AND 10);
  END IF;
END $$;
