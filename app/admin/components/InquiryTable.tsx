'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import StatusBadge from './StatusBadge';
import { formatDate, formatDateTime } from '@/lib/utils/format';

interface InquiryRow {
  id: string;
  reference: string;
  first_name: string;
  last_name: string;
  email: string;
  event_date: string;
  event_type: string;
  estimated_guest_count: number;
  package_name_snapshot: string;
  status: string;
  created_at: string;
}

interface InquiryTableProps {
  inquiries: InquiryRow[];
  sort: string;
  direction: string;
}

export default function InquiryTable({ inquiries, sort, direction }: InquiryTableProps) {
  const searchParams = useSearchParams();

  const getSortUrl = (column: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === column) {
      params.set('direction', direction === 'asc' ? 'desc' : 'asc');
    } else {
      params.set('sort', column);
      params.set('direction', 'desc');
    }
    params.set('page', '1');
    return `/admin?${params.toString()}`;
  };

  const renderSortLink = (column: string, label: string) => {
    const isActive = sort === column;
    return (
      <Link
        href={getSortUrl(column)}
        className={`inline-flex items-center gap-1 hover:text-slate transition-colors ${isActive ? 'text-slate font-semibold' : 'text-slate/70'}`}
      >
        {label}
        {isActive && (
          <span className="text-xs">{direction === 'asc' ? '↑' : '↓'}</span>
        )}
      </Link>
    );
  };

  const getAriaSortValue = (column: string): 'ascending' | 'descending' | undefined => {
    if (sort !== column) return undefined;
    return direction === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate/10" role="region" aria-label="Inquiries table" tabIndex={0}>
      <table className="w-full text-left">
        <thead className="bg-slate/5">
          <tr className="font-body text-xs text-slate/75 uppercase tracking-wider">
            <th scope="col" className="px-4 py-3">Ref</th>
            <th scope="col" className="px-4 py-3">Client</th>
            <th scope="col" className="px-4 py-3">Email</th>
            <th scope="col" className="px-4 py-3" aria-sort={getAriaSortValue('event_date')}>{renderSortLink('event_date', 'Event Date')}</th>
            <th scope="col" className="px-4 py-3">Type</th>
            <th scope="col" className="px-4 py-3">Guests</th>
            <th scope="col" className="px-4 py-3">Package</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3" aria-sort={getAriaSortValue('created_at')}>{renderSortLink('created_at', 'Submitted')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate/5">
          {inquiries.map((inquiry) => (
            <tr key={inquiry.id} className="hover:bg-frosted-mint/10 transition-colors">
              <td className="px-4 py-3">
                <Link href={`/admin/inquiries/${inquiry.id}`} className="font-body text-xs text-slate/75 hover:text-slate font-mono">
                  {inquiry.reference}
                </Link>
              </td>
              <td className="px-4 py-3">
                <Link href={`/admin/inquiries/${inquiry.id}`} className="font-body text-sm text-slate font-medium hover:underline">
                  {inquiry.first_name} {inquiry.last_name}
                </Link>
              </td>
              <td className="px-4 py-3 font-body text-sm text-slate/70">{inquiry.email}</td>
              <td className="px-4 py-3 font-body text-sm text-slate/70">{formatDate(inquiry.event_date)}</td>
              <td className="px-4 py-3 font-body text-sm text-slate/70">{inquiry.event_type}</td>
              <td className="px-4 py-3 font-body text-sm text-slate/70 text-center">{inquiry.estimated_guest_count}</td>
              <td className="px-4 py-3 font-body text-sm text-slate/70">{inquiry.package_name_snapshot}</td>
              <td className="px-4 py-3"><StatusBadge status={inquiry.status} /></td>
              <td className="px-4 py-3 font-body text-xs text-slate/75">{formatDateTime(inquiry.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
