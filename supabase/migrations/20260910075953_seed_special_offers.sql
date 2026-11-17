/*
# Seed initial special offers

1. New Data
- Inserts three sample special offers into `special_offers` if the table is empty.

2. Important Notes
- No existing data is changed.
*/

INSERT INTO public.special_offers (title, description, badge, cta_label, image_url, sort_order)
SELECT * FROM (VALUES
  ('Maldives — 7 kecha shaxsiy vilada', 'Suv ustidagi eksklyuziv vila, private transfer va kruiz bilan to‘liq paket.', 'Cheklangan', 'Batafsil', 'https://images.pexels.com/photos/15304502/pexels-photo-15304502.jpeg?auto=compress&cs=tinysrgb&w=1200', 1),
  ('Dubai — Burj xalifa panoramasi', '5* mehmonxona, VIP konsyerj va shaxsiy mashinada shahar sayohati.', 'Yangi', 'Batafsil', 'https://images.pexels.com/photos/31696210/pexels-photo-31696210.jpeg?auto=compress&cs=tinysrgb&w=1200', 2),
  ('Swiss Alps — Chang‘i mavsumi', 'Chalet, heli transfer va shaxsiy oshpaz bilan Alp tog‘larida hashamat.', 'Mavsumiy', 'Batafsil', 'https://images.pexels.com/photos/10388824/pexels-photo-10388824.jpeg?auto=compress&cs=tinysrgb&w=1200', 3)
) AS seed(title, description, badge, cta_label, image_url, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.special_offers);
