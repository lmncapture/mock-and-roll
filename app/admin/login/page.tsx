'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const supabase = createBrowserSupabaseClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError('Invalid email or password.');
        setIsLoading(false);
      } else {
        // Short delay to ensure auth cookies are fully written before navigation
        setTimeout(() => {
          window.location.href = '/admin';
        }, 100);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cool-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-slate text-center">Admin Login</h1>
        <p className="font-body text-sm text-slate/60 text-center mt-2">
          Sign in to manage inquiries.
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

          <div>
            <label htmlFor="password" className="block font-body text-sm font-medium text-slate mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate/20 px-4 py-3 font-body text-sm text-slate bg-cool-white focus:outline-none focus:ring-2 focus:ring-slate/30"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate text-cool-white rounded-full py-3 font-body font-semibold text-sm transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {error && (
          <p className="mt-4 font-body text-sm text-red-500 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
