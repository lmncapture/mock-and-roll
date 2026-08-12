export const publicEnv = {
  get supabaseUrl() {
    const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!value) throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL');
    return value;
  },
  get supabasePublishableKey() {
    const value = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!value) throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
    return value;
  },
  get siteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? '';
  },
};
