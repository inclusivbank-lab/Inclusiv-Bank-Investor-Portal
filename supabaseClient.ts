
import { createClient } from '@supabase/supabase-js';

// Retrieve env vars from Vite (import.meta.env) or fallback to process.env
const getEnvVar = (key: string, viteKey: string) => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[viteKey]) {
    return (import.meta as any).env[viteKey];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return '';
};

// You should define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file
const SUPABASE_URL = getEnvVar('SUPABASE_URL', 'VITE_SUPABASE_URL') || 'https://placeholder-url.supabase.co';
const SUPABASE_ANON_KEY = getEnvVar('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY') || 'placeholder-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
