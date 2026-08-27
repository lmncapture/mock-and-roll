/**
 * Meta Pixel utility module.
 *
 * Provides typed helpers for interacting with the Meta (Facebook) Pixel.
 * The Pixel script itself is loaded by the <MetaPixel /> component in the
 * root layout; this module exposes safe wrappers that no-op when the Pixel
 * hasn't loaded yet (e.g. during SSR or if an ad-blocker prevents loading).
 */

export const META_PIXEL_ID = '3932594083715349';

// ---------------------------------------------------------------------------
// TypeScript declarations for `window.fbq`
// ---------------------------------------------------------------------------

type FbqStandard =
  | 'PageView'
  | 'Lead'
  | 'ViewContent'
  | 'AddToCart'
  | 'Purchase'
  | 'CompleteRegistration'
  | 'Contact'
  | 'Search';

/** User data parameters accepted by Meta Advanced Matching. */
export interface MetaUserData {
  em?: string; // email — lowercase, trimmed
  fn?: string; // first name — lowercase, trimmed
  ln?: string; // last name — lowercase, trimmed
  ph?: string; // phone — digits only including country code
}

interface FbqFunction {
  (command: 'init', pixelId: string, userData?: MetaUserData): void;
  (command: 'track', event: FbqStandard, params?: Record<string, unknown>): void;
  (command: 'trackCustom', event: string, params?: Record<string, unknown>): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  push?: (...args: unknown[]) => void;
}

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns true if the Meta Pixel is available in the current environment. */
function isFbqReady(): boolean {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
}

/**
 * Track a standard Meta Pixel event.
 * No-ops if the Pixel script hasn't loaded (SSR, ad-blocker, etc.).
 */
export function trackEvent(event: FbqStandard, params?: Record<string, unknown>): void {
  if (!isFbqReady()) return;
  if (params) {
    window.fbq!('track', event, params);
  } else {
    window.fbq!('track', event);
  }
}

/**
 * Track a PageView event.
 * Typically called once on initial load and on each client-side navigation.
 */
export function trackPageView(): void {
  trackEvent('PageView');
}

/**
 * Track a Lead conversion event.
 * Should only be called after a confirmed successful inquiry submission.
 *
 * @param params - Optional non-PII parameters (e.g. package name, guest count)
 */
export function trackLead(params?: Record<string, unknown>): void {
  trackEvent('Lead', params);
}

// ---------------------------------------------------------------------------
// Advanced Matching — normalization & submission
// ---------------------------------------------------------------------------

/**
 * Normalize an email address for Meta Advanced Matching.
 * - Trims whitespace
 * - Converts to lowercase
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Normalize a name (first or last) for Meta Advanced Matching.
 * - Trims whitespace
 * - Converts to lowercase
 * - Removes non-alphabetic characters (digits, punctuation) per Meta docs
 */
export function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z]/g, '');
}

/**
 * Normalize a phone number for Meta Advanced Matching.
 * Meta expects digits only, including country code (e.g. "16505554444").
 * - Strips all non-digit characters
 * - If exactly 10 digits (no country code), prepends "1" (US default)
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  // US numbers without country code: prepend 1
  if (digits.length === 10) {
    return '1' + digits;
  }
  return digits;
}

/** Input for setAdvancedMatching — raw (un-normalized) customer data. */
export interface AdvancedMatchingInput {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

/**
 * Set Meta Advanced Matching data by re-calling fbq('init') with user data.
 *
 * Per Meta's documentation, calling fbq('init', pixelId, userData) after
 * the initial init updates the matching parameters for all subsequent events.
 * The Pixel library automatically hashes these values with SHA-256.
 *
 * This function normalizes the raw input according to Meta's requirements
 * before passing it to the Pixel. It should be called immediately before
 * firing the Lead event, only after a successful inquiry submission.
 *
 * No-ops if the Pixel hasn't loaded.
 */
export function setAdvancedMatching(input: AdvancedMatchingInput): void {
  if (!isFbqReady()) return;

  const userData: MetaUserData = {};

  if (input.email) {
    userData.em = normalizeEmail(input.email);
  }
  if (input.firstName) {
    userData.fn = normalizeName(input.firstName);
  }
  if (input.lastName) {
    userData.ln = normalizeName(input.lastName);
  }
  if (input.phone) {
    userData.ph = normalizePhone(input.phone);
  }

  // Only call init with user data if at least one field is populated
  if (Object.keys(userData).length > 0) {
    window.fbq!('init', META_PIXEL_ID, userData);
  }
}
