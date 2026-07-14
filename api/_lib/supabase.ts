import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const MEDIA_BUCKET = 'media';

export function getSupabaseAdmin() {
  if (!url || !serviceRoleKey) {
    throw new Error('Image storage is not configured (missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)');
  }
  return createClient(url, serviceRoleKey, { auth: { persistSession: false } });
}
