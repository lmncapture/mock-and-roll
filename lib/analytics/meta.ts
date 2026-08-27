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

interface FbqFunction {
  (command: 'init', pixelId: string): void;
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
