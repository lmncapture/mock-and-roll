/**
 * Inquiry conversion handoff.
 *
 * When an inquiry is submitted successfully, the inquiry page redirects the
 * visitor to /inquiries/thank-you. To fire the Meta Lead conversion on that
 * dedicated page we need a small amount of context (which package, guest
 * count) carried across the navigation.
 *
 * IMPORTANT: This payload must never contain PII. Customer identifiers
 * (email, name, phone) are handled separately via Meta Advanced Matching,
 * which is invoked on the inquiry page with in-memory form values before the
 * redirect. Only the non-PII fields below are persisted to sessionStorage.
 */

/** sessionStorage key holding the pending inquiry conversion (non-PII only). */
export const INQUIRY_CONVERSION_STORAGE_KEY = 'mr_inquiry_conversion';

/**
 * Non-PII conversion context handed from the inquiry page to the thank-you
 * page. Maps directly to the non-PII params accepted by the Meta Lead event.
 */
export interface InquiryConversion {
  /** Completed-submission marker. Guards against firing Lead on direct visits. */
  completed: true;
  /** Package identifier (Lead content_category). */
  packageId: string;
  /** Human-readable package name (Lead content_name). May be undefined. */
  packageName?: string;
  /** Estimated guest count (Lead guest_count). May be undefined. */
  guestCount?: number;
}

/** Type guard for a valid, completed conversion payload read from storage. */
export function isValidInquiryConversion(value: unknown): value is InquiryConversion {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return v.completed === true && typeof v.packageId === 'string';
}
