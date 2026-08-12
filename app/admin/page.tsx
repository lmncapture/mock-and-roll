import { requireAdmin } from '@/lib/auth/require-admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { sanitizeAdminParams, PAGE_SIZE } from '@/lib/validation/admin-params';
import InquiryTable from '@/app/admin/components/InquiryTable';
import SearchBar from '@/app/admin/components/SearchBar';
import FilterBar from '@/app/admin/components/FilterBar';
import Pagination from '@/app/admin/components/Pagination';
import LogoutButton from '@/app/admin/components/LogoutButton';

export const metadata = {
  title: 'Admin Dashboard | Mock & Roll',
};

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  await requireAdmin();

  const rawParams = await searchParams;
  const params = sanitizeAdminParams(rawParams);

  const supabase = await createServerSupabaseClient();
  const { data: results, error } = await supabase.rpc('search_inquiries', {
    p_search: params.search ?? null,
    p_status: params.status ?? null,
    p_event_type: params.eventType ?? null,
    p_package_id: params.packageFilter ?? null,
    p_event_date: params.eventDate ?? null,
    p_sort: params.sort,
    p_direction: params.direction,
    p_page: params.page,
    p_page_size: params.pageSize,
  });

  const inquiries = results ?? [];
  const totalCount = inquiries.length > 0 ? Number(inquiries[0].total_count) : 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-cool-white">
      <header className="border-b border-slate/10 px-6 lg:px-12 py-4 flex items-center justify-between">
        <h1 className="font-display text-2xl text-slate">Inquiries</h1>
        <LogoutButton />
      </header>

      <main className="px-6 lg:px-12 py-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <SearchBar defaultValue={params.search} />
          <FilterBar
            status={params.status}
            eventType={params.eventType}
            packageFilter={params.packageFilter}
            eventDate={params.eventDate}
          />
        </div>

        {error ? (
          <p className="font-body text-sm text-rose-500">Failed to load inquiries.</p>
        ) : inquiries.length === 0 ? (
          <p className="font-body text-sm text-slate/60">No inquiries found.</p>
        ) : (
          <InquiryTable
            inquiries={inquiries}
            sort={params.sort}
            direction={params.direction}
          />
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={params.page}
            totalPages={totalPages}
          />
        )}

        <p className="font-body text-xs text-slate/40 mt-4">
          {totalCount} total {totalCount === 1 ? 'inquiry' : 'inquiries'}
        </p>
      </main>
    </div>
  );
}
