'use client';

import { useState, useTransition } from 'react';
import { INQUIRY_STATUSES, STATUS_LABELS } from '@/lib/config/statuses';
import { updateInquiryStatus } from '@/app/admin/inquiries/[id]/actions';

interface StatusSelectProps {
  inquiryId: string;
  currentStatus: string;
}

export default function StatusSelect({ inquiryId, currentStatus }: StatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    startTransition(async () => {
      const result = await updateInquiryStatus(inquiryId, newStatus);
      if (!result.success) {
        setStatus(currentStatus); // revert on failure
      }
    });
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-lg border border-slate/20 px-3 py-1.5 font-body text-xs text-slate bg-cool-white focus:outline-none focus:ring-2 focus:ring-slate/30 disabled:opacity-50"
    >
      {INQUIRY_STATUSES.map((s) => (
        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
      ))}
    </select>
  );
}
