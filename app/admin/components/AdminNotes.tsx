'use client';

import { useState, useTransition } from 'react';
import { updateAdminNotes } from '@/app/admin/inquiries/[id]/actions';

interface AdminNotesProps {
  inquiryId: string;
  currentNotes: string;
}

export default function AdminNotes({ inquiryId, currentNotes }: AdminNotesProps) {
  const [notes, setNotes] = useState(currentNotes);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    setSaved(false);
    setError('');
    startTransition(async () => {
      const result = await updateAdminNotes(inquiryId, notes);
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(result.error ?? 'Failed to save');
      }
    });
  };

  return (
    <div className="space-y-2">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        maxLength={5000}
        placeholder="Private notes about this inquiry..."
        className="w-full rounded-xl border border-slate/20 px-4 py-3 font-body text-sm text-slate bg-cool-white focus:outline-none focus:ring-2 focus:ring-slate/30 resize-y min-h-[100px]"
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="bg-slate text-cool-white rounded-full px-5 py-2 font-body text-xs font-semibold transition-opacity duration-200 disabled:opacity-50 hover:opacity-90"
        >
          {isPending ? 'Saving...' : 'Save Notes'}
        </button>
        {saved && (
          <span className="font-body text-xs text-lime-sorbet font-medium">Saved ✓</span>
        )}
        {error && (
          <span className="font-body text-xs text-rose-500">{error}</span>
        )}
      </div>
    </div>
  );
}
