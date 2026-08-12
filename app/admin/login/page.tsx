'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setIsLoading(false);

    if (error) {
      setMessage('Something went wrong. Please try again.');
    } else {
      // Neutral response — do NOT reveal if email is in admin_users
      setMessage('If this email is authorized, a sign-in link has been sent.');
    }
  };

  return (
    <div className="min-h-screen bg-cool-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-slate text-center">Admin Login</h1>
        <p className="font-body text-sm text-slate/60 text-center mt-2">
          Enter your email to receive a magic sign-in link.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="block font-body text-sm font-medium text-slate mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate/20 px-4 py-3 font-body text-sm text-slate bg-cool-white focus:outline-none focus:ring-2 focus:ring-slate/30"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate text-cool-white rounded-full py-3 font-body font-semibold text-sm transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          >
            {isLoading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        {message && (
          <p className="mt-4 font-body text-sm text-slate/70 text-center">{message}</p>
        )}
      </div>
    </div>
  );
}
