import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  // eslint-disable-next-line no-console
  console.warn('Supabase URL or Service Key not set. Some features may not work.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
