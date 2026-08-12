'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { INQUIRY_STATUSES, STATUS_LABELS } from '@/lib/config/statuses';
import { EVENT_TYPES } from '@/lib/config/event-types';
import { PACKAGES } from '@/lib/config/packages';

interface FilterBarProps {
  status?: string;
  eventType?: string;
  packageFilter?: string;
  eventDateFrom?: string;
  eventDateTo?: string;
}

export default function FilterBar({ status, eventType, packageFilter, eventDateFrom, eventDateTo }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/admin?${params.toString()}`);
  };

  const selectClass = 'rounded-lg border border-slate/20 px-3 py-2 font-body text-xs text-slate bg-cool-white focus:outline-none focus:ring-2 focus:ring-slate/30';

  return (
    <div className="flex flex-wrap gap-2">
      <select
        value={status ?? ''}
        onChange={(e) => updateFilter('status', e.target.value)}
        className={selectClass}
        aria-label="Filter by status"
      >
        <option value="">All Statuses</option>
        {INQUIRY_STATUSES.map((s) => (
          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
        ))}
      </select>

      <select
        value={eventType ?? ''}
        onChange={(e) => updateFilter('eventType', e.target.value)}
        className={selectClass}
        aria-label="Filter by event type"
      >
        <option value="">All Event Types</option>
        {EVENT_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select
        value={packageFilter ?? ''}
        onChange={(e) => updateFilter('package', e.target.value)}
        className={selectClass}
        aria-label="Filter by package"
      >
        <option value="">All Packages</option>
        {PACKAGES.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <input
        type="date"
        value={eventDateFrom ?? ''}
        onChange={(e) => updateFilter('eventDateFrom', e.target.value)}
        className={selectClass}
        aria-label="Event date from"
      />
      <span className="font-body text-xs text-slate/50 self-center">to</span>
      <input
        type="date"
        value={eventDateTo ?? ''}
        onChange={(e) => updateFilter('eventDateTo', e.target.value)}
        className={selectClass}
        aria-label="Event date to"
      />
    </div>
  );
}
