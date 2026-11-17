import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SiteSettings = {
  id: string;
  business_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  working_hours: string;
  concierge_hours: string;
  instagram_url: string;
  telegram_url: string;
  support_phone: string;
  manager_name: string;
  updated_at: string;
};

export type Destination = {
  id: string;
  title: string;
  country: string;
  description: string;
  image_url: string;
  tags: string[];
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type SpecialOffer = {
  id: string;
  title: string;
  description: string;
  badge: string;
  cta_label: string;
  image_url: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type BookingRequest = {
  id: string;
  full_name: string;
  phone: string;
  destination: string | null;
  departure_date: string | null;
  adults: number;
  children: number;
  special_requests: string | null;
  created_at: string;
};
