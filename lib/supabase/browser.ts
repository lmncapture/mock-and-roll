import { createBrowserClient } from '@supabase/ssr';
import { publicEnv } from '@/lib/env/public';

export function createBrowserSupabaseClient() {
  return createBrowserClient(publicEnv.supabaseUrl, publicEnv.supabasePublishableKey);
}
