'use client';

import { useEffect, useRef } from 'react';
import { trackLead } from '@/lib/analytics/meta';
import {
  INQUIRY_CONVERSION_STORAGE_KEY,
  isValidInquiryConversion,
} from '@/lib/analytics/inquiry-conversion';

/**
 * ThankYouConversion — fires the Meta Lead event on the dedicated thank-you
 * page, but only when it follows a genuine inquiry submission.
 *
 * The inquiry form writes a short-lived, NON-PII completion marker to
 * sessionStorage before redirecting here. On mount we:
 *   1. Read the marker.
 *   2. Immediately remove it (consume it) so a refresh or back/forward
 *      navigation cannot fire a duplicate Lead.
 *   3. Fire Lead only if the marker was present and valid, using only the
 *      non-PII params content_name, content_category, and guest_count.
 *
 * A direct visit to /inquiries/thank-you (no marker) fires nothing.
 * Renders no UI.
 */
export default function ThankYouConversion() {
  const handledRef = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode's double effect invocation in dev.
    if (handledRef.current) return;
    handledRef.current = true;

    let raw: string | null = null;
    try {
      raw = sessionStorage.getItem(INQUIRY_CONVERSION_STORAGE_KEY);
      // Consume immediately so a refresh cannot re-fire the conversion.
      sessionStorage.removeItem(INQUIRY_CONVERSION_STORAGE_KEY);
    } catch {
      // sessionStorage unavailable — nothing to fire.
      return;
    }

    // No marker: direct visit or already consumed. Do not fire Lead.
    if (!raw) return;

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return;
    }

    if (!isValidInquiryConversion(parsed)) return;

    trackLead({
      content_name: parsed.packageName ?? undefined,
      content_category: parsed.packageId,
      guest_count: parsed.guestCount ?? undefined,
    });
  }, []);

  return null;
}
