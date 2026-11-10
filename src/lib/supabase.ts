import { createClient } from '@supabase/supabase-js'

// Known active Supabase project credentials for Transworld Logistics
const ACTIVE_SUPABASE_URL = 'https://ktpmsqliiokkthqlemmm.supabase.co';
const ACTIVE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0cG1zcWxpaW9ra3RocWxlbW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MTEyMzYsImV4cCI6MjEwMTA4NzIzNn0.ZQosm0kydwU2q-ms-FhhUA6Au38fSTJBFj6PkhGgO3g';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Reject dead / obsolete / non-resolving URLs (e.g. ihzdpujpvwugwremwkwr or placeholder)
const isValidCustomUrl = Boolean(
    rawUrl &&
    !rawUrl.includes('ihzdpujpvwugwremwkwr') &&
    !rawUrl.includes('placeholder') &&
    rawUrl.startsWith('https://')
);

export const supabaseUrl = isValidCustomUrl ? rawUrl : ACTIVE_SUPABASE_URL;
export const supabaseAnonKey = (isValidCustomUrl && rawKey) ? rawKey : ACTIVE_SUPABASE_ANON_KEY;

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

