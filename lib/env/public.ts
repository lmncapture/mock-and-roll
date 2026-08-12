function requirePublicEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const publicEnv = {
  get supabaseUrl() { return requirePublicEnv('NEXT_PUBLIC_SUPABASE_URL'); },
  get supabasePublishableKey() { return requirePublicEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'); },
  get siteUrl() { return process.env.NEXT_PUBLIC_SITE_URL ?? ''; },
};
