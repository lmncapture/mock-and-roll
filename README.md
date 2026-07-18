# Mock & Roll

A premium editorial-style website for Mock & Roll — a boutique mocktail bar offering elevated alcohol-free experiences.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion**

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Brand Fonts

- **Just Cosmic** — Display/headline font (editorial moments)
- **Outfit** — Body/UI font (navigation, copy, buttons)

Fonts are loaded locally via `next/font/local` from `public/fonts/`.

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Slate | #324648 | Primary text, buttons, navigation |
| Cool White | #FCF4E8 | Background, canvas |
| Lime Sorbet | #D2E8B2 | Accent |
| Lemon Zest | #F7D656 | Accent |
| Peach Nectar | #FFD4A8 | Accent |
| Pink Lychee | #FDC6C1 | Accent |
| Rose Petal | #FEE3EE | Accent |
| Berry Crush | #FCB2C7 | Accent |
| Frosted Mint | #E0EFEC | Accent |
| Arctic Mist | #A2E9E7 | Accent |
| Blueberry Dew | #D6DEFF | Accent |
| Soft Plum | #CDB9E8 | Accent |

## Project Structure

```
app/
├── layout.tsx              # Root layout, font loading
├── page.tsx                # Homepage composition
├── globals.css             # Tailwind theme, brand palette
└── components/
    ├── Header.tsx          # Floating navigation
    ├── Hero.tsx            # Editorial hero section
    ├── Experience.tsx      # Brand philosophy section
    ├── Mocktails.tsx       # Signature drinks showcase
    ├── Atmosphere.tsx      # Gallery section
    ├── Events.tsx          # Private events section
    ├── ReservationCTA.tsx  # Reservation call-to-action
    ├── Footer.tsx          # Site footer
    └── ui/
        ├── Button.tsx      # Reusable pill button
        ├── FadeIn.tsx      # Scroll-triggered animation
        ├── ParallaxImage.tsx
        └── CurvedImage.tsx
```

## Build

```bash
npm run build
```

## Deploy

Optimized for Vercel deployment. Push to main and connect the repo.

## Domain Readiness Checklist

Steps required when the production domain is finalized.

### Vercel Environment Variable

- [ ] In Vercel → Project → Settings → Environment Variables, add:
  - **Key:** `NEXT_PUBLIC_SITE_URL`
  - **Value:** `https://yourdomain.com` (e.g. `https://mocknrollbar.com`)
  - **Environment:** Production (and Preview if desired)
- This variable drives `metadataBase` in `app/layout.tsx`, which resolves all Open Graph and Twitter card URLs site-wide.

### Static Files (update manually)

These two files are served from `public/` and contain hardcoded URLs that are **not** environment-variable-driven:

- [ ] `public/sitemap.xml` — replace every `https://mocknrollbar.com` occurrence with the final production domain.
- [ ] `public/robots.txt` — update the `Sitemap:` line to point to the final domain.

### Not required

- **Contact email** (`lauren@mocknrollbar.com`) — used only as `mailto:` links; no domain configuration needed.
- **Analytics / CAPTCHA / form handlers** — none are installed; no domain allowlisting required.
- **Instagram URL in footer / JSON-LD** — absolute external URL; no domain-specific configuration needed.

---

## Launch Report

**Date:** July 17, 2026
**Status:** Ready to launch

---

### Critical Issues Fixed

The following significant fixes were made across the pre-launch audit (Tasks 12–21):

**Mobile navigation (Task 12 / commit `ef6a0d9`)**
- Rewrote Header mobile overlay to use `createPortal` to `document.body`, escaping the header's stacking context and fixing z-index conflicts.
- Added `scroll-lock` (toggling `document.body.style.overflow`) when the menu is open.
- Added staggered Framer Motion entry animation on menu items.
- Added `aria-expanded`, `aria-controls="mobile-nav"`, `aria-modal="true"`, `role="dialog"`, and explicit `aria-label` on all interactive elements.

**Mobile-first layout audit (Tasks 13–14 / commits `02a9468`, `65326ea`)**
- Tightened section padding site-wide for mobile viewports.
- Fixed `scrollbar-hide` utility in `globals.css` (added webkit/Firefox scrollbar suppression).
- Fixed all CTA `href` values — replaced placeholder `#` hrefs with `mailto:lauren@mocknrollbar.com`.
- Removed jank/bounce from horizontal scroll carousels on Mocktails section.
- Corrected logo size on mobile (smaller `h-8` on mobile, larger `h-16` on desktop).
- Fixed hero headline sizing and responsive layout stacking.
- Fixed footer grid on small screens.
- Fixed inner-page hero layouts (`MocktailsHero`, `PackagesHero`, `AboutHero`).

**Core content and branding (Task 15 / commits `652f125`, `fd337b5`)**
- Unified all CTAs to "Book Mock & Roll" messaging to align with event-service positioning.
- Introduced section color rhythm (Frosted Mint → Rose Petal → Peach Nectar → Blueberry Dew) across homepage.

**Homepage structure (Task 16 / commits `0017168`, `e7c4094`, `134edfe`, `74180e3`)**
- Added `/packages` page and `PackagesPreview` section on homepage.
- Added `/about` and `/mocktails` pages.
- Updated all navigation links to page routes with active-state highlighting (`pathname`-driven).
- Removed duplicated Packages preview and corrected nav link to `/packages`.

**Pre-launch SEO and metadata (Task 17 / commit `a86c6d5`)**
- Added full `openGraph` and `twitter` metadata blocks with `metadataBase` in `app/layout.tsx`.
- Added `robots: { index: true, follow: true }` to root metadata.
- Set per-page `metadata` exports on `/mocktails`, `/packages`, `/about`, and `not-found` pages.
- Added `title.template: "%s | Mock & Roll"` for consistent page titles.
- Added `apple-touch-icon.png` for iOS home screen.
- Added `public/robots.txt` and `public/sitemap.xml` with all four routes.

**Photography (Task 18 / commits `a86c6d5`, `909d36b`)**
- Replaced all Unsplash stock images with real Mock & Roll product photography (`mr-*` files).
- Fixed `preload` → `priority` prop on `next/image` components (Hero, MocktailsHero, CurvedImage, ParallaxImage) to align with Next.js 16 API.

**Footer cleanup (Task 19 / commit `a86c6d5`)**
- Removed placeholder Facebook and TikTok icons; Instagram only with real `@mocknrollbar` link.
- Removed placeholder address.
- Changed copyright year to `new Date().getFullYear()` (dynamic).

**Mocktails content (Task 20 / commits `bc3877b`, `ab213b6`, `d55dea8`)**
- Refined Mocktails page: uniform card layout, corrected drink order, text inside frames.
- Moved horizontal signature mocktails image above the drink grid.
- Updated all mocktail descriptions to finalized menu copy.

**Events photography (Task 21 / commits `35770db`, `53fbddd`)**
- Replaced Unsplash event imagery with real product photography throughout Events section.
- Applied curated `object-position` values per card.

---

### Remaining Blockers

None. The site is ready to go live pending Vercel environment variable configuration and domain DNS setup (see Domain Connection Checklist below).

**Minor follow-ups (not blockers):**
- `Header.tsx` does not have an `Escape` key handler for the mobile menu. The menu closes on route change and via the explicit close button. Adding `keydown` Escape handling would improve keyboard accessibility but is not required for launch.
- JSON-LD structured data (LocalBusiness schema) is not implemented. Recommended post-launch.
- `og-image.png` must exist at `public/og-image.png` before Open Graph previews resolve correctly.

---

### Pages and Components Changed

**App pages**
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `app/not-found.tsx`
- `app/about/page.tsx`
- `app/mocktails/page.tsx`
- `app/packages/page.tsx`

**Shared components**
- `app/components/Header.tsx`
- `app/components/Hero.tsx`
- `app/components/Mocktails.tsx`
- `app/components/PackagesPreview.tsx`
- `app/components/Portfolio.tsx`
- `app/components/Events.tsx`
- `app/components/ReservationCTA.tsx`
- `app/components/Footer.tsx`
- `app/components/Atmosphere.tsx`
- `app/components/Experience.tsx`
- `app/components/ui/Button.tsx`
- `app/components/ui/CurvedImage.tsx`
- `app/components/ui/ParallaxImage.tsx`
- `app/components/ui/FadeIn.tsx`

**About page components**
- `app/about/components/AboutHero.tsx`
- `app/about/components/WhoWeAre.tsx`
- `app/about/components/WhyWeStarted.tsx`
- `app/about/components/OurMission.tsx`
- `app/about/components/PerfectFor.tsx`

**Mocktails page components**
- `app/mocktails/components/MocktailsHero.tsx`
- `app/mocktails/components/SignatureMocktails.tsx`
- `app/mocktails/components/FlavorProfiles.tsx`
- `app/mocktails/components/MocktailsCTA.tsx`

**Packages page components**
- `app/packages/components/PackagesHero.tsx`
- `app/packages/components/PackageOfferings.tsx`
- `app/packages/components/CustomEvents.tsx`
- `app/packages/components/PackagesFAQ.tsx`
- `app/packages/components/PackagesCTA.tsx`

**Public assets added**
- `public/robots.txt`
- `public/sitemap.xml`
- `public/apple-touch-icon.png`
- `public/images/mr-hero.jpg`
- `public/images/mr-hero-new.jpg`
- `public/images/mr-garden-sparkler.jpg`
- `public/images/mr-ginger-dragon.jpg`
- `public/images/mr-habiscus-tea-blossom.jpg`
- `public/images/mr-pineapple-sunrise.jpg`
- `public/images/mr-moments-1.jpg` through `mr-moments-4.jpg`
- `public/images/mr-signature-mocktails-horizontal.jpg`
- `public/images/events/wedding-event.jpg`
- `public/images/events/birthday-event.jpg`
- `public/images/events/corporate-event.jpg`
- `public/images/events/baby-shower-event.jpg`
- `public/images/events/private-party-event.jpg`

---

### Vercel Environment Variables Required

| Variable | Value | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` | Drives `metadataBase` in `app/layout.tsx`, which resolves all Open Graph URLs, Twitter card images, and canonical URLs site-wide |

If `NEXT_PUBLIC_SITE_URL` is not set, the site falls back to `https://mocknrollbar.com` (hardcoded default in `app/layout.tsx`).

---

### Form / Email Configuration

All contact and booking CTAs use `mailto:lauren@mocknrollbar.com` links — no form handler, no third-party service, and no domain allowlisting required. Clicking any CTA opens the user's default mail client pre-addressed to Lauren.

No email infrastructure setup is needed before launch.

---

### SEO and Metadata Status

| Page | Title | Description | OG/Twitter | Robots |
|------|-------|-------------|------------|--------|
| `/` (Homepage) | "Mock & Roll — Premium Mobile Mocktail Bar" | ✓ | ✓ (via `metadataBase`) | index, follow |
| `/mocktails` | "Mocktails \| Mock & Roll" | ✓ | ✓ (inherits `metadataBase`) | index, follow |
| `/packages` | "Packages \| Mock & Roll" | ✓ | ✓ | index, follow |
| `/about` | "About \| Mock & Roll" | ✓ | ✓ | index, follow |
| `/_not-found` (404) | "Page Not Found \| Mock & Roll" | ✓ | ✓ | index, follow |

**Sitemap:** `public/sitemap.xml` — all four routes listed with priority values (/, /packages, /mocktails, /about). URLs currently use `https://mocknrollbar.com` — update to final domain before launch.

**robots.txt:** `public/robots.txt` — `Allow: /` for all agents; `Sitemap:` line points to `https://mocknrollbar.com/sitemap.xml`. Update to final domain.

**JSON-LD:** Not implemented. Recommended post-launch: add a `LocalBusiness` or `FoodEstablishment` schema script in `app/layout.tsx`.

---

### Accessibility Status

**Fixed during audit:**
- Mobile hamburger button: `aria-label="Open navigation menu"`, `aria-expanded={mobileMenuOpen}`, `aria-controls="mobile-nav"`
- Mobile overlay dialog: `role="dialog"`, `aria-modal="true"`, `aria-label="Navigation menu"`
- Close button: `aria-label="Close navigation menu"`
- Footer nav: `<nav aria-label="Footer navigation">`
- Footer Instagram link: `aria-label="Follow Mock & Roll on Instagram"`
- Logo links: `aria-label="Mock & Roll Home"` on all instances
- All decorative background shapes and SVG accents: `aria-hidden="true"`
- PackagesFAQ accordion buttons: `aria-expanded={open === i}` on each toggle
- PackageOfferings section: `aria-labelledby="packages-section-heading"` with visually-hidden `<h2>`

**Known remaining items (not launch blockers):**
- No `Escape` key handler on mobile menu (menu closes via route change and explicit button)
- Focus trap not implemented in mobile menu overlay (manual testing recommended)
- No skip-to-content link (recommended post-launch)
- Color contrast on pastel badge/chip text should be verified with a contrast checker against actual rendered colors

---

### Performance Results

Build output from `npm run build` (Next.js 16.2.6, Turbopack):

```
▲ Next.js 16.2.6 (Turbopack)

  Creating an optimized production build ...
✓ Compiled successfully in 1205ms
✓ Finished TypeScript in 1001ms
✓ Collecting page data using 8 workers in 205ms
✓ Generating static pages using 8 workers (7/7) in 196ms
✓ Finalizing page optimization in 6ms

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /about
├ ○ /mocktails
└ ○ /packages

○  (Static)  prerendered as static content
```

All 5 routes (homepage, 404, about, mocktails, packages) are prerendered as **static content** — no server-side rendering overhead. Zero build warnings.

---

### npm audit Results

Running `npm audit` reports **3 moderate severity vulnerabilities**:

| Package | Issue | Fix |
|---------|-------|-----|
| `js-yaml` 4.0.0–4.1.1 | Quadratic-complexity DoS via repeated aliases in merge key handling ([GHSA-h67p-54hq-rp68](https://github.com/advisories/GHSA-h67p-54hq-rp68)) | `npm audit fix` (non-breaking) |
| `postcss` <8.5.10 | XSS via unescaped `</style>` in CSS Stringify output ([GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93)) | Requires `npm audit fix --force` which would downgrade Next.js to 9.3.3 — **do not run** |
| `next` 9.3.4-canary.0–16.3.0-canary.5 | Depends on vulnerable `postcss` | Tracked upstream; no safe fix available yet |

**Assessment:** All three are moderate severity and in build-time/dev-time tooling only. The `postcss` vulnerability exists in `next`'s bundled dependency — the recommended fix (`npm audit fix --force`) would downgrade Next.js to a 2020 version, which is far worse. These are **not launch blockers**. Monitor upstream Next.js releases for a patched version.

---

### Domain Connection Checklist

Steps required when the production domain is finalized:

**Vercel**
- [ ] In Vercel → Project → Settings → Environment Variables, add `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com` (Production environment)
- [ ] Connect custom domain in Vercel → Project → Settings → Domains

**Static files (update manually)**
- [ ] `public/sitemap.xml` — replace all `https://mocknrollbar.com` occurrences with the final domain
- [ ] `public/robots.txt` — update the `Sitemap:` line to the final domain

**DNS**
- [ ] Add CNAME or A record pointing to Vercel's servers per Vercel DNS instructions
- [ ] Verify HTTPS certificate is issued (Vercel handles automatically)

**Not required**
- Contact email (`lauren@mocknrollbar.com`) — `mailto:` links only, no domain config needed
- Analytics, CAPTCHA, or form handlers — none installed
- Instagram URL in footer — absolute external URL, no config needed

---

### Build Verification

- [x] `npm run lint` — **passes** (0 errors, 0 warnings)
- [x] `npx tsc --noEmit` — **passes** (0 type errors)
- [x] `npm run build` — **passes** (5 static routes, 0 warnings)
