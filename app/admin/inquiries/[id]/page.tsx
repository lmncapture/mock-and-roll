import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDate, formatTime, formatDateTime } from '@/lib/utils/format';
import DrinkDisplay from '@/app/admin/components/DrinkDisplay';
import StatusSelect from '@/app/admin/components/StatusSelect';
import AdminNotes from '@/app/admin/components/AdminNotes';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InquiryDetailPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;

  const supabase = await createServerSupabaseClient();

  // Fetch inquiry
  const { data: inquiry, error } = await supabase
    .from('contact_inquiries')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !inquiry) {
    notFound();
  }

  // Fetch drink choices with custom mocktails
  const { data: drinkChoices } = await supabase
    .from('inquiry_drink_choices')
    .select('*')
    .eq('inquiry_id', id)
    .order('position', { ascending: true });

  // Fetch custom mocktails for custom drinks
  const customDrinkIds = (drinkChoices ?? [])
    .filter(d => d.choice_type === 'custom')
    .map(d => d.id);

  const customMocktails: Record<string, { base: string; puree: string; syrup: string; garnishes: string[] }> = {};

  if (customDrinkIds.length > 0) {
    const { data: customs } = await supabase
      .from('inquiry_custom_mocktails')
      .select('*')
      .in('drink_choice_id', customDrinkIds);

    if (customs) {
      for (const c of customs) {
        customMocktails[c.drink_choice_id] = {
          base: c.base,
          puree: c.puree,
          syrup: c.syrup,
          garnishes: c.garnishes ?? [],
        };
      }
    }
  }

  const drinks = (drinkChoices ?? []).map(d => ({
    position: d.position,
    choice_type: d.choice_type as 'signature' | 'custom',
    signature_drink_name_snapshot: d.signature_drink_name_snapshot,
    custom_mocktail: d.choice_type === 'custom' ? customMocktails[d.id] ?? null : null,
  }));

  return (
    <div className="min-h-screen bg-cool-white">
      <header className="border-b border-slate/10 px-6 lg:px-12 py-4">
        <Link href="/admin" className="font-body text-sm text-slate/60 hover:text-slate transition-colors">
          ← Back to Inquiries
        </Link>
      </header>

      <main className="px-6 lg:px-12 py-8 max-w-4xl">
        {/* Reference + Status */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <h1 className="font-display text-2xl text-slate">{inquiry.reference}</h1>
          <StatusSelect inquiryId={inquiry.id} currentStatus={inquiry.status} />
        </div>

        {/* Contact */}
        <section className="mb-8">
          <h2 className="font-body text-xs font-semibold text-slate/50 uppercase tracking-wider mb-3">Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="font-body text-xs text-slate/50">Name</p>
              <p className="font-body text-sm text-slate">{inquiry.first_name} {inquiry.last_name}</p>
            </div>
            <div>
              <p className="font-body text-xs text-slate/50">Email</p>
              <p className="font-body text-sm text-slate">{inquiry.email}</p>
            </div>
            <div>
              <p className="font-body text-xs text-slate/50">Phone</p>
              <a href={`tel:${inquiry.phone_number}`} className="font-body text-sm text-slate hover:underline">
                {inquiry.phone_number}
              </a>
            </div>
          </div>
        </section>

        {/* Event */}
        <section className="mb-8">
          <h2 className="font-body text-xs font-semibold text-slate/50 uppercase tracking-wider mb-3">Event</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="font-body text-xs text-slate/50">Date</p>
              <p className="font-body text-sm text-slate">{formatDate(inquiry.event_date)}</p>
            </div>
            <div>
              <p className="font-body text-xs text-slate/50">Time</p>
              <p className="font-body text-sm text-slate">{formatTime(inquiry.event_time)}</p>
            </div>
            <div>
              <p className="font-body text-xs text-slate/50">Type</p>
              <p className="font-body text-sm text-slate">
                {inquiry.event_type}{inquiry.event_type_other ? ` (${inquiry.event_type_other})` : ''}
              </p>
            </div>
            <div>
              <p className="font-body text-xs text-slate/50">Guest Count</p>
              <p className="font-body text-sm text-slate">{inquiry.estimated_guest_count}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="font-body text-xs text-slate/50">Location</p>
              <p className="font-body text-sm text-slate">{inquiry.event_location}</p>
            </div>
          </div>
        </section>

        {/* Package */}
        <section className="mb-8">
          <h2 className="font-body text-xs font-semibold text-slate/50 uppercase tracking-wider mb-3">Package</h2>
          <p className="font-body text-sm text-slate">
            {inquiry.package_name_snapshot} ({inquiry.package_price_display_snapshot})
          </p>
        </section>

        {/* Drinks */}
        <section className="mb-8">
          <h2 className="font-body text-xs font-semibold text-slate/50 uppercase tracking-wider mb-3">Drink Choices</h2>
          <DrinkDisplay drinks={drinks} />
        </section>

        {/* Additional Notes */}
        {inquiry.additional_notes && (
          <section className="mb-8">
            <h2 className="font-body text-xs font-semibold text-slate/50 uppercase tracking-wider mb-3">Additional Notes</h2>
            <p className="font-body text-sm text-slate whitespace-pre-wrap">{inquiry.additional_notes}</p>
          </section>
        )}

        {/* Admin Notes */}
        <section className="mb-8">
          <h2 className="font-body text-xs font-semibold text-slate/50 uppercase tracking-wider mb-3">Admin Notes</h2>
          <AdminNotes inquiryId={inquiry.id} currentNotes={inquiry.admin_notes ?? ''} />
        </section>

        {/* Meta */}
        <section className="border-t border-slate/10 pt-4 mt-8">
          <p className="font-body text-xs text-slate/40">
            Submitted: {formatDateTime(inquiry.created_at)} • Source: {inquiry.source}
          </p>
        </section>
      </main>
    </div>
  );
}
