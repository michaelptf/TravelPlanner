import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

let supabase: SupabaseClient | null = null;

if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
} else {
  // eslint-disable-next-line no-console
  console.warn('Supabase URL or Service Key not set. Some features may not work. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in backend/.env');
}

export { supabase };
