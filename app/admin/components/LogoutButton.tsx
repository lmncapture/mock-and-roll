'use client';

import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="font-body text-sm text-slate/60 hover:text-slate transition-colors"
    >
      Sign Out
    </button>
  );
}
