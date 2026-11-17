/*
# Formalize Bravo Sayohat contact information

1. Modified Tables
- `site_settings`: updates the existing single public settings record with formal Uzbek business wording, formatted phone numbers, the formal address, the formal weekday schedule, and the manager's correctly written full name.

2. Business Information
- Business name remains Bravo Sayohat.
- Address is formatted as Toshkent shahri, Chilonzor tumani, 2-mavze, Arnasay ko‘chasi, 16B.
- Phone numbers are formatted for public display while remaining valid contact numbers.
- Email remains bravosayohat@gmail.com.
- Working hours are formatted as Dushanba–Juma | 10:00–18:00.
- Manager name is formatted as Ibroximov Omatillo Talatbek o‘g‘li.

3. Security and Data Safety
- No rows are deleted and no table structure is removed.
- Existing row-level security policies are unchanged.

4. Important Notes
- This migration is idempotent and safe to apply again.
- The stored formatting is for presentation; the website strips punctuation when creating telephone links.
*/

UPDATE public.site_settings
SET
  business_name = 'Bravo Sayohat',
  phone = '+998 (88) 388-77-11',
  whatsapp = '+998 (90) 546-33-30',
  email = 'bravosayohat@gmail.com',
  address = 'Toshkent shahri, Chilonzor tumani, 2-mavze, Arnasay ko‘chasi, 16B',
  working_hours = 'Dushanba–Juma | 10:00–18:00',
  manager_name = 'Ibroximov Omatillo Talatbek o‘g‘li',
  support_phone = '+998 (88) 388-77-11',
  updated_at = now();