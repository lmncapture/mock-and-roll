'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { META_PIXEL_ID, trackPageView } from '@/lib/analytics/meta';

/**
 * MetaPixel — loads the Meta Pixel script globally and tracks PageView events.
 *
 * Place this component once in the root layout. It handles:
 * 1. Loading the fbq snippet via next/script (afterInteractive strategy).
 * 2. Initializing the Pixel with `fbq('init', ...)` exactly once.
 * 3. Firing a PageView on initial load.
 * 4. Firing a PageView on each client-side route change (App Router).
 *
 * Duplicate PageView prevention:
 * - Initial PageView fires inline in the script (standard Meta pattern).
 * - Route-change PageViews are deduplicated by tracking the previous pathname
 *   so re-renders on the same route don't fire extra events.
 * - The isInitializedRef prevents the useEffect from firing on the initial
 *   render (which was already handled by the inline script).
 */

// Shared refs across the module (stable across Suspense boundaries)
let isInitialized = false;
let previousPath: string | null = null;

function MetaPixelRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track PageView on client-side route changes.
  // Skips the very first render (handled by the inline script).
  useEffect(() => {
    if (!isInitialized) return;

    const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    if (previousPath === currentPath) return;

    previousPath = currentPath;
    trackPageView();
  }, [pathname, searchParams]);

  return null;
}

export default function MetaPixel() {
  const onLoadRef = useRef(false);

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
          `,
        }}
        onLoad={() => {
          if (onLoadRef.current) return;
          onLoadRef.current = true;
          // Record the initial path so the route tracker doesn't double-fire.
          previousPath = window.location.pathname + (window.location.search || '');
          isInitialized = true;
        }}
      />
      <Suspense fallback={null}>
        <MetaPixelRouteTracker />
      </Suspense>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
