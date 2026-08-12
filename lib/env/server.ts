import 'server-only';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const serverEnv = {
  get supabaseSecretKey() { return requireEnv('SUPABASE_SECRET_KEY'); },
  get resendApiKey() { return requireEnv('RESEND_API_KEY'); },
  get resendFromEmail() { return requireEnv('RESEND_FROM_EMAIL'); },
  get notificationEmail() { return requireEnv('INQUIRY_NOTIFICATION_EMAIL'); },
};
