'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/require-admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { INQUIRY_STATUSES } from '@/lib/config/statuses';

const MAX_ADMIN_NOTES = 5000;

export async function updateInquiryStatus(inquiryId: string, status: string) {
  await requireAdmin();

  // Validate status is canonical
  if (!(INQUIRY_STATUSES as readonly string[]).includes(status)) {
    return { success: false, error: 'Invalid status value' };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from('contact_inquiries')
    .update({ status })
    .eq('id', inquiryId);

  if (error) {
    return { success: false, error: 'Failed to update status' };
  }

  revalidatePath(`/admin/inquiries/${inquiryId}`);
  revalidatePath('/admin');
  return { success: true };
}

export async function updateAdminNotes(inquiryId: string, notes: string) {
  await requireAdmin();

  // Trim outer whitespace, preserve internal line breaks
  const trimmed = notes.trim().slice(0, MAX_ADMIN_NOTES);

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from('contact_inquiries')
    .update({ admin_notes: trimmed || null })
    .eq('id', inquiryId);

  if (error) {
    return { success: false, error: 'Failed to save notes' };
  }

  revalidatePath(`/admin/inquiries/${inquiryId}`);
  return { success: true };
}
