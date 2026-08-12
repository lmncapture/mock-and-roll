'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchBarProps {
  defaultValue?: string;
}

export default function SearchBar({ defaultValue }: SearchBarProps) {
  const [value, setValue] = useState(defaultValue ?? '');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set('search', value.trim());
    } else {
      params.delete('search');
    }
    params.set('page', '1'); // Reset to page 1 on new search
    router.push(`/admin?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-sm">
      <input
        type="search"
        placeholder="Search name, email, phone, location, reference..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border border-slate/20 px-4 py-2.5 font-body text-sm text-slate bg-cool-white focus:outline-none focus:ring-2 focus:ring-slate/30 placeholder:text-slate/40"
      />
    </form>
  );
}
