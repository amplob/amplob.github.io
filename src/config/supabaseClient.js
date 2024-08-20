import { createClient } from '@supabase/supabase-js';

// CRA automatically injects environment variables prefixed with REACT_APP_ into process.env
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or key is missing in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
