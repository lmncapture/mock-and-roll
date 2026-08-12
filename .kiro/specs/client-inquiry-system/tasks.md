# Implementation Plan: Mock & Roll Client Inquiry System

## Overview

A full-stack event inquiry system comprising: a public form at `/inquiries`, server-side validation and normalization, atomic Supabase persistence via a PostgreSQL RPC, Resend email notification, and a private admin dashboard with search/filter/sort/pagination driven by URL state. Implementation proceeds from shared configuration and infrastructure outward through public-facing features and admin tooling.

## Tasks

- [x] 1. Install dependencies and set up shared configuration
  - [x] 1.1 Install new npm dependencies
    - Install `zod`, `libphonenumber-js`, `@supabase/supabase-js`, `@supabase/ssr`, `resend`, and `server-only`
    - Pin exact versions in package.json
    - _Requirements: 18.1, 18.2, 18.3, 33.1, 33.2_

  - [x] 1.2 Create canonical package configuration (`lib/config/packages.ts`)
    - Define `PackageConfig` interface with id, name, pricingMode, price, priceDisplay, guestMin, guestMax, allowedDrinkCount, badge, shortDescription
    - Export `PACKAGES` array, `PACKAGE_IDS`, `getPackageById()`, `isPackageEligible()`
    - _Requirements: 31.1, 31.6, 4.7_

  - [x] 1.3 Create canonical drinks configuration (`lib/config/drinks.ts`)
    - Define `SignatureDrink` interface, export `SIGNATURE_DRINKS`, `SIGNATURE_DRINK_IDS`
    - Export `BASES`, `PUREES`, `SYRUPS`, `GARNISHES` with associated types
    - _Requirements: 31.2, 31.3_

  - [x] 1.4 Create statuses, event-types, and timezone configuration
    - Create `lib/config/statuses.ts` with `INQUIRY_STATUSES` and `STATUS_LABELS`
    - Create `lib/config/event-types.ts` with `EVENT_TYPES`
    - Create `lib/config/timezone.ts` with `BUSINESS_TIMEZONE = 'America/Los_Angeles'`
    - _Requirements: 27.1, 3.4, 31.4_

  - [x] 1.5 Create environment variable modules
    - Create `lib/env/server.ts` with `import 'server-only'` and `requireEnv()` for SUPABASE_SECRET_KEY, RESEND_API_KEY, RESEND_FROM_EMAIL, INQUIRY_NOTIFICATION_EMAIL
    - Create `lib/env/public.ts` with `requirePublicEnv()` for NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, optional NEXT_PUBLIC_SITE_URL
    - Update `.env.example` with all variable names and safe placeholder descriptions
    - _Requirements: 33.1, 33.2, 33.3, 33.4, 33.5_

  - [x] 1.6 Create format utilities (`lib/utils/format.ts`)
    - Implement `formatDate()`, `formatTime()`, and `formatDateTime()` using `BUSINESS_TIMEZONE` with `Intl.DateTimeFormat`
    - _Requirements: Design Addendum §6_

- [x] 2. Set up Supabase client architecture
  - [x] 2.1 Create browser Supabase client (`lib/supabase/browser.ts`)
    - Use `createBrowserClient` from `@supabase/ssr` with public env vars
    - _Requirements: 18.1_

  - [x] 2.2 Create server Supabase client (`lib/supabase/server.ts`)
    - Use `createServerClient` from `@supabase/ssr` with read-only cookie adapter (no-op `setAll()` for Server Components)
    - _Requirements: 18.2_

  - [x] 2.3 Create admin (privileged) Supabase client (`lib/supabase/admin.ts`)
    - Use `createClient` from `@supabase/supabase-js` with `import 'server-only'`, SUPABASE_SECRET_KEY, autoRefreshToken: false, persistSession: false
    - _Requirements: 18.3, 18.4, 18.5, 35.1_

  - [x] 2.4 Create Supabase proxy session helper (`lib/supabase/proxy.ts`) and root `proxy.ts`
    - Implement `updateSession()` that refreshes auth via `getUser()` and mutates cookies on response
    - Create root `proxy.ts` exporting `proxy` function with matcher for `/admin/:path*` and `/auth/:path*`
    - _Requirements: 18.2, 21.6_

- [x] 3. Create database migrations
  - [x] 3.1 Create `supabase/migrations/001_create_inquiry_tables.sql`
    - Create `contact_inquiries` table with all columns (including phone_search_digits, package_price_snapshot, package_pricing_mode_snapshot, package_price_display_snapshot, source, admin_notes_updated_by, admin_notes_updated_at)
    - Create `inquiry_drink_choices` table with check constraints (chk_signature_complete, chk_custom_no_signature), UNIQUE on (inquiry_id, position)
    - Create `inquiry_custom_mocktails` table with garnishes defaulting to '{}'
    - Create all indexes (status, event_date, created_at DESC, phone_search, reference)
    - _Requirements: 16.1, 16.2, 16.3, 16.5, 16.6, Design Addendum §4, §5, §8_

  - [x] 3.2 Create `supabase/migrations/002_create_admin_users.sql`
    - Create `admin_users` table with user_id FK to auth.users, UNIQUE constraint, display_name nullable
    - _Requirements: 16.4_

  - [x] 3.3 Create `supabase/migrations/003_create_functions.sql`
    - Implement `is_admin()` function with SECURITY DEFINER, REVOKE/GRANT
    - Implement `generate_inquiry_reference()` with retry loop and year-based format
    - Implement `create_inquiry()` RPC with business-rule validation block from addendum (package eligibility, drink count, signature ID validation, custom completeness), plus INSERT logic with snapshot columns and source parameter
    - Implement `search_inquiries()` with dynamic SQL ORDER BY via `format()`, reference ILIKE search, new snapshot columns, and total_count
    - All functions use `SET search_path = public, pg_temp`
    - _Requirements: 19.3, 19.4, 19.6, 22.1, 32.1, 32.2, 32.3, 34.1, Design Addendum §1, §2, §3_

  - [x] 3.4 Create `supabase/migrations/004_enable_rls_policies.sql`
    - Enable RLS on all four tables
    - Create admin SELECT/UPDATE policies on contact_inquiries using `is_admin()`
    - Create admin SELECT policies on inquiry_drink_choices and inquiry_custom_mocktails
    - Create self-read policy on admin_users (`user_id = auth.uid()`)
    - No INSERT/DELETE policies for client access
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

  - [x] 3.5 Create `supabase/migrations/005_updated_at_trigger.sql`
    - Create `update_updated_at()` trigger function
    - Attach BEFORE UPDATE trigger to contact_inquiries
    - _Requirements: 16.7_

- [x] 4. Implement phone normalization and validation schemas
  - [x] 4.1 Create phone normalization utility (`lib/validation/phone.ts`)
    - Implement 3-tier normalization: Tier A (E.164 via libphonenumber-js), Tier B (≥10 digits stored as trimmed), Tier C (<10 digits rejected)
    - Implement `normalizePhoneForSearch()` for admin search digit extraction
    - Default country US, international `+` prefix preserves supplied country
    - _Requirements: 2.5, 14.1, 24.3_

  - [x] 4.2 Create inquiry validation schema (`lib/validation/inquiry-schema.ts`)
    - Define Zod schema with MAX_TEXT=200, MAX_NOTES=2000
    - Implement discriminated union for drink choices (signature vs custom)
    - Validate all canonical enums from shared config (EVENT_TYPES, PACKAGE_IDS, SIGNATURE_DRINK_IDS, BASES, PUREES, SYRUPS, GARNISHES)
    - Export `InquiryPayload` type
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8_

  - [x] 4.3 Create admin parameter sanitization (`lib/validation/admin-params.ts`)
    - Define Zod schema for admin URL params with whitelist validation for sort, direction, status, eventType, package, eventDate, page
    - Export `sanitizeAdminParams()`, `PAGE_SIZE`, and `ValidatedAdminParams` type
    - _Requirements: 23.6, 23.7_

- [x] 5. Checkpoint
  - Ensure all configuration, environment, client, migration, and validation modules compile cleanly. Run `npx tsc --noEmit` and `npm run lint`. Ask the user if questions arise.

- [x] 6. Implement public inquiry form page and components
  - [x] 6.1 Create inquiry form page (`app/inquiries/page.tsx`)
    - Server Component with metadata (unique title/description)
    - Render Header, Footer, headline "Tell Us About Your Event" in Just Cosmic font
    - Import and render InquiryForm client component
    - Match Mock & Roll visual system: premium, bright, airy, generous spacing, pastel palette
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.7, 1.8_

  - [x] 6.2 Create InquiryForm client component (`app/inquiries/components/InquiryForm.tsx`)
    - Implement full form state (InquiryFormState) with all sections
    - Implement honeypot hidden field (aria-hidden, tabindex -1, off-screen CSS)
    - Implement isSubmitting/isSuccess/errors UI state
    - Implement deterministic package-change UX (excess drinks marked, removal required, no silent deletion)
    - Implement client-side package eligibility checking with inline errors
    - Submit handler: POST to /api/inquiries, handle success/error responses
    - Disable submit button while submitting; show success state on completion
    - _Requirements: 2.1, 3.1, 4.1, 6.1, 12.1, 13.1, 13.2, 13.3, 15.1, 29.1, 30.5, 30.6_

  - [x] 6.3 Create FormSection wrapper component (`app/inquiries/components/FormSection.tsx`)
    - Accept section number and heading, render with editorial styling
    - _Requirements: 1.7_

  - [x] 6.4 Create PackageCard component (`app/inquiries/components/PackageCard.tsx`)
    - Display package options sourced from canonical config: name, guest rule, drink count, price
    - Show helper text "Your package can be changed later."
    - Display eligibility error inline when package/guest-count mismatch
    - _Requirements: 4.2, 4.3, 4.4, 4.9_

  - [x] 6.5 Create DrinkSlot component (`app/inquiries/components/DrinkSlot.tsx`)
    - Render toggle between "Signature Mocktail" and "Create Your Own" — mutually exclusive per slot
    - Maintain independent state; clear stale data on type switch
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.6, 11.1, 11.2_

  - [x] 6.6 Create SignatureSelector component (`app/inquiries/components/SignatureSelector.tsx`)
    - Display signature drinks from canonical config as radio-style selection
    - Single select per slot
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 6.7 Create CustomMocktailBuilder component (`app/inquiries/components/CustomMocktailBuilder.tsx`)
    - Four-step builder: Base (single-select), Purée (single-select), Syrup (single-select), Garnishes (multi-select)
    - Use canonical ingredient data from lib/config/drinks.ts
    - Step-specific pastel color schemes per design
    - Display "All drinks come sparkling with club soda unless otherwise requested."
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 9.1, 9.2_

  - [x] 6.8 Create IngredientChip component (`app/inquiries/components/IngredientChip.tsx`)
    - Pill-shaped `<button type="button">` with `aria-pressed`, minimum 44px touch target
    - Hover feedback, visible focus state, responds to Enter/Space/click/touch
    - No visible browser-default radio/checkbox appearance
    - _Requirements: 9.3, 9.4, 9.5, 9.6_

  - [x] 6.9 Create LivePreview component (`app/inquiries/components/LivePreview.tsx`)
    - Render only categories with values (no undefined/null/empty separators)
    - Natural language garnish formatting (one as-is, two with "&", three+ with commas and "&")
    - Include "Sparkling with club soda" when any selection made
    - Hidden or neutral text when no selections
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 7. Implement public submission API route
  - [x] 7.1 Create POST route handler (`app/api/inquiries/route.ts`)
    - Sequence: parse JSON → Zod validate → honeypot check → normalize inputs (trim, lowercase email, normalizePhone) → validate eventDate >= today in BUSINESS_TIMEZONE → validate eventType/Other → isPackageEligible → drink count matches → build RPC payload with server-derived snapshots (package name/price/pricingMode/priceDisplay, signature drink name) → call create_inquiry via admin client → await Resend notification (catch/log) → return { success, reference }
    - Response shapes: 200 success, 400 validation error with field errors, 500 server error
    - Never trust client-provided snapshots — derive from canonical config
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 14.1–14.9, 5.5, 5.6, 13.3, 13.4, 13.5, 13.6, 13.7, 15.2, 15.3_

- [x] 8. Implement Resend notification
  - [x] 8.1 Create notification builder (`lib/email/send-inquiry-notification.ts`)
    - `import 'server-only'`
    - Build plain-text email with sections: Contact (name, email, phone), Event (date, time, type, guest count, location), Package (name + price info from snapshots), Drink Choices (full details including custom ingredients and "Sparkling with club soda"), Additional Notes, Admin link if NEXT_PUBLIC_SITE_URL configured
    - Subject: "New Mock & Roll Inquiry {reference} — {firstName} {lastName}"
    - Recipients from INQUIRY_NOTIFICATION_EMAIL, replyTo visitor email, from RESEND_FROM_EMAIL
    - Resend must be awaited (not fire-and-forget)
    - Safe error logging: reference + error type only, no PII
    - Use formatDate/formatTime from lib/utils/format.ts for consistent timezone
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7_

- [x] 9. Checkpoint
  - Ensure public form page, API route, and notification compile cleanly. Run `npx tsc --noEmit` and `npm run lint`. Ask the user if questions arise.

- [x] 10. Implement auth callback and admin login
  - [x] 10.1 Create auth callback route (`app/auth/callback/route.ts`)
    - Exchange code for session using `@supabase/ssr`
    - Handle expired/invalid magic links gracefully → redirect to /admin/login with error
    - On success redirect to /admin
    - _Requirements: 21.3, 21.5, 21.6_

  - [x] 10.2 Create admin login page (`app/admin/login/page.tsx`)
    - Magic-link form: email input, submit button
    - Call `supabase.auth.signInWithOtp()` with emailRedirectTo pointing to /auth/callback
    - Neutral response: "If this email is authorized, a sign-in link has been sent."
    - _Requirements: 21.1, 21.2_

  - [x] 10.3 Create requireAdmin() helper (`lib/auth/require-admin.ts`)
    - Verify valid session via `getUser()`; redirect to /admin/login if no session
    - Check admin_users membership; redirect to /admin/unauthorized for authenticated non-admin (NOT login loop)
    - Return user and adminUser on success
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_

  - [x] 10.4 Create unauthorized page (`app/admin/unauthorized/page.tsx`)
    - Display safe 403 message: "You don't have permission to access this page."
    - No inquiry data exposed
    - _Requirements: 22.3_

- [x] 11. Implement admin dashboard
  - [x] 11.1 Create admin dashboard list page (`app/admin/page.tsx`)
    - Server Component; call `requireAdmin()`
    - Read searchParams, sanitize via `sanitizeAdminParams()`
    - Call `search_inquiries` RPC via server Supabase client
    - Compute pagination object (totalCount, totalPages, currentPage, pageSize)
    - Render InquiryTable, SearchBar, FilterBar, Pagination components
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5, 23.6, 23.7_

  - [x] 11.2 Create InquiryTable component (`app/admin/components/InquiryTable.tsx`)
    - Display columns: client name, email, event date, event type, guest count, package, status (badge), reference, submitted date
    - Sort indicators for created_at and event_date
    - Link each row to /admin/inquiries/[id]
    - All dates formatted using formatDate from lib/utils/format.ts
    - _Requirements: 23.1, 23.2, 23.5_

  - [x] 11.3 Create SearchBar component (`app/admin/components/SearchBar.tsx`)
    - Client component; update URL search param via useRouter().push()
    - Reset page to 1 on search change
    - _Requirements: 24.1, 24.2_

  - [x] 11.4 Create FilterBar component (`app/admin/components/FilterBar.tsx`)
    - Client component; filters for status, event type, package, event date
    - Update URL params; reset page to 1 on filter change
    - Options sourced from canonical config
    - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5_

  - [x] 11.5 Create Pagination component (`app/admin/components/Pagination.tsx`)
    - Client component; receives totalPages and currentPage directly (no computation needed)
    - Update page URL param; preserve existing filters/sort
    - _Requirements: 23.4, Design Addendum §7_

  - [x] 11.6 Create StatusBadge component (`app/admin/components/StatusBadge.tsx`)
    - Colored pill displaying status label from canonical config
    - _Requirements: 23.1_

  - [x] 11.7 Create LogoutButton component (`app/admin/components/LogoutButton.tsx`)
    - Client component; call supabase.auth.signOut() → redirect to /admin/login
    - _Requirements: 21.7_

- [x] 12. Implement admin inquiry detail page
  - [x] 12.1 Create inquiry detail page (`app/admin/inquiries/[id]/page.tsx`)
    - Server Component; call `requireAdmin()`
    - Fetch inquiry by ID with drink choices and custom mocktails
    - Display: reference (prominent), contact info (phone as `tel:` link), event info, package (with price context from snapshots), source, all drinks with full configuration, additional notes, status, admin notes, submitted date/time
    - All dates/times formatted using lib/utils/format.ts
    - Render StatusSelect and AdminNotes client components
    - _Requirements: 26.1, 26.2, 26.3, 26.4, 26.5, 26.6, 26.7, 26.8_

  - [x] 12.2 Create DrinkDisplay component (`app/admin/components/DrinkDisplay.tsx`)
    - Read-only rendering of drink choices: position, type, signature name OR full custom details (base, purée, syrup, garnishes, "Sparkling with club soda")
    - _Requirements: 26.6_

  - [x] 12.3 Create StatusSelect component (`app/admin/components/StatusSelect.tsx`)
    - Client component; select control with canonical status options
    - Call `updateInquiryStatus` server action on change
    - _Requirements: 27.2, 27.3_

  - [x] 12.4 Create AdminNotes component (`app/admin/components/AdminNotes.tsx`)
    - Client component; textarea with save button and clear confirmation feedback
    - Call `updateAdminNotes` server action on save
    - _Requirements: 28.1, 28.2, 28.3, 28.4_

  - [x] 12.5 Create server actions (`app/admin/inquiries/[id]/actions.ts`)
    - Implement `updateInquiryStatus`: requireAdmin, validate status against canonical set, update via server client, revalidatePath
    - Implement `updateAdminNotes`: requireAdmin, trim/slice, update via server client, revalidatePath
    - Both trigger updated_at via database trigger
    - _Requirements: 27.2, 27.3, 27.4, 27.5, 28.3, 28.4, 28.5_

- [x] 13. Checkpoint
  - Ensure all admin pages, components, and server actions compile cleanly. Run `npx tsc --noEmit` and `npm run lint`. Ask the user if questions arise.

- [x] 14. Navigation updates and static /mocktails refactor
  - [x] 14.1 Update navigation links and CTAs
    - Header "Inquiries" nav link → `/inquiries`
    - Header "Book Mock & Roll" button → `/inquiries`
    - PackageOfferings package CTAs → `/inquiries`
    - PackagesCTA → `/inquiries`
    - MocktailBuilder "Book Mock & Roll" CTA → `/inquiries`
    - MocktailsCTA "Book Mock & Roll" → `/inquiries`
    - CustomEvents CTA → keep `mailto:lauren@mocknrollbar.com` (custom consultation intent)
    - _Requirements: 1.5, 1.6_

  - [x] 14.2 Refactor static MocktailBuilder on /mocktails
    - Modify existing MocktailBuilder component to read ingredient labels from `lib/config/drinks.ts`
    - Data-source refactor only — do NOT change static layout, visual design, or behavior
    - Do NOT add interactivity to /mocktails
    - _Requirements: 36.1, 36.2, 36.3, 31.5_

- [x] 15. Build validation and cross-client safety audit
  - [x] 15.1 Run full build validation
    - Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`
    - Fix any type errors, lint errors, or build failures
    - Verify `lib/env/server.ts` import from a client component produces a build error
    - _Requirements: 35.1, 33.5_

  - [x] 15.2 Cross-client safety audit
    - Search repository for any foreign client/project names, emails, domains, package values, sender addresses, test data, or environment values from another project
    - Verify only Mock & Roll-specific data is used: packages (Signature/Celebration/Premier/Reserve Experience), signature drinks (Hibiscus Blossom, Ginger Dragon, Garden Sparkler, Pineapple Sunrise), domain mocknrolbar.com, contact lauren@mocknrollbar.com
    - Remove any foreign data found
    - _Requirements: 38.1, 38.2, 38.3_

- [x] 16. Final checkpoint
  - Ensure all tests pass, the build succeeds, and no foreign client data exists. Run `npm run build` for final verification. Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP — none are marked optional in this plan as all tasks are core implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at natural break points
- The design does not include Correctness Properties, so property-based tests are not applicable — standard unit/integration tests should be added during implementation as needed
- All date/time displays must use `formatDate()`/`formatTime()` from `lib/utils/format.ts` with BUSINESS_TIMEZONE
- The design addendum is authoritative and supersedes corresponding sections in design.md (search RPC uses dynamic SQL with format(), package snapshots include price/mode/display, source column added, admin_notes_updated_by/at columns are schema-only for v1)
- No rate limiting dependency in v1 — honeypot + strict validation only
- proxy.ts at root (Next.js 16 pattern) replaces middleware.ts
- Server client in Server Components uses no-op setAll() — session refresh happens in proxy

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4", "1.5", "1.6"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.3", "2.4", "3.1", "3.2"] },
    { "id": 3, "tasks": ["3.3", "3.4", "3.5", "4.1"] },
    { "id": 4, "tasks": ["4.2", "4.3"] },
    { "id": 5, "tasks": ["6.1", "6.3", "6.8"] },
    { "id": 6, "tasks": ["6.2", "6.4", "6.5", "6.6", "6.7", "6.9"] },
    { "id": 7, "tasks": ["7.1", "8.1"] },
    { "id": 8, "tasks": ["10.1", "10.2", "10.3", "10.4"] },
    { "id": 9, "tasks": ["11.1", "11.6", "11.7"] },
    { "id": 10, "tasks": ["11.2", "11.3", "11.4", "11.5"] },
    { "id": 11, "tasks": ["12.1", "12.2", "12.5"] },
    { "id": 12, "tasks": ["12.3", "12.4"] },
    { "id": 13, "tasks": ["14.1", "14.2"] },
    { "id": 14, "tasks": ["15.1", "15.2"] }
  ]
}
```
