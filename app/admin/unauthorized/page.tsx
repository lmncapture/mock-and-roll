import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unauthorized | Mock & Roll',
  description: 'You do not have permission to access this page.',
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-cool-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="font-display text-3xl text-slate mb-4">Access Denied</h1>
        <p className="font-body text-sm text-slate/60">
          You don&apos;t have permission to access this page.
        </p>
      </div>
    </div>
  );
}
