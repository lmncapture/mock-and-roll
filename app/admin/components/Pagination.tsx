'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `/admin?${params.toString()}`;
  };

  return (
    <nav className="flex items-center gap-2 mt-6" aria-label="Pagination">
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-3 py-1.5 rounded-lg border border-slate/20 font-body text-sm text-slate hover:bg-frosted-mint/20 transition-colors"
        >
          Previous
        </Link>
      )}

      <span className="font-body text-sm text-slate/60 px-2">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-3 py-1.5 rounded-lg border border-slate/20 font-body text-sm text-slate hover:bg-frosted-mint/20 transition-colors"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
