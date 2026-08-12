# Technical Design: Mock & Roll Client Inquiry System

## Overview

A full-stack event inquiry system comprising: a public form at `/inquiries`, server-side validation and normalization, atomic Supabase persistence via a PostgreSQL RPC, Resend email notification, and a private admin dashboard with search/filter/sort/pagination driven by URL state.

## Implementation Decisions Resolved

### 1. Premier / Reserve Guest-Count Eligibility

**Finding:** The current project (PackageOfferings.tsx) defines guest-count rules ONLY for Signature Experience ("Up to 30 guests") and Celebration Experience ("31+ guests"). Premier Experience and Reserve Experience list no guest-count constraints — they are per-guest packages available to any group size.

**Decision:** Premier and Reserve have NO guest-count eligibility restrictions. Only Signature (≤30) and Celebration (>30) enforce guest-count rules.

### 2. Phone Number Normalization

**Strategy:** Store phone numbers in two columns for clean separation of display and search concerns.

- `phone_number` — E.164 format (`+14255551234`) when parsing succeeds; otherwise the trimmed human input
- `phone_search_digits` — digits-only representation for efficient admin search

**Parsing:** Use `libphonenumber-js` (tree-shakeable, ~80KB) with default country `US` since Mock & Roll operates with US business information. International numbers beginning with `+` preserve their supplied country code.

**Validation tiers:**
1. **Parseable valid number:** Store E.164 in `phone_number`, extracted digits in `phone_search_digits`
2. **Ambiguous but plausible (≥10 digits after stripping, or parseable but not definitively valid):** Store trimmed input in `phone_number`, all extracted digits in `phone_search_digits`
3. **Clearly invalid (<7 digits after stripping non-digit chars):** Reject with validation error

**Admin search:** Queries strip non-digits from the search term and match against `phone_search_digits` using `ILIKE` — no punctuation sensitivity.

### 3. Business Time Zone

**Decision:** Define a canonical business timezone constant:

```typescript
// lib/config/timezone.ts
export const BUSINESS_TIMEZONE = 'America/Los_Angeles';
```

Mock & Roll operates in the Pacific Time zone. The server-side event-date validator determines "today" using this timezone via `Intl.DateTimeFormat` or a date library. This prevents UTC-boundary issues from incorrectly rejecting valid same-day or next-day events.

This value must be confirmed before production deployment. If the business relocates, only this constant needs updating.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PUBLIC VISITOR                             │
│                                                                   │
│  /inquiries (React form — interactive)                           │
│       │                                                           │
│       ▼                                                           │
│  POST /api/inquiries                                             │
│       │                                                           │
│       ├─ 1. Anti-spam check (honeypot + strict validation)       │
│       ├─ 2. Zod validation + normalization (incl. phone)         │
│       ├─ 3. Business-date validation (event_date >= today PT)    │
│       ├─ 4. Package eligibility check                            │
│       ├─ 5. Drink-count + drink-config validation                │
│       ├─ 6. RPC: create_inquiry() — transactional                │
│       ├─ 7. await Resend notification (catch/log failure)        │
│       └─ 8. Return { success, reference }                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN USER                                 │
│                                                                   │
│  /admin/login → magic link → /auth/callback → /admin             │
│       │                                                           │
│       ├─ requireAdmin() on every request                         │
│       ├─ Server-side data fetching (SSR session client + RLS)    │
│       ├─ /admin — list with URL-driven state                     │
│       └─ /admin/inquiries/[id] — detail + mutations              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Static /mocktails vs Interactive /inquiries

**IMPORTANT DISTINCTION:**

| Route | Behavior | State | Purpose |
|-------|----------|-------|---------|
| `/mocktails` | Static informational visualization | No `useState`, no interactivity | Showcase ingredient categories |
| `/inquiries` | Interactive builder per drink slot | Independent state per slot | Collect validated drink preferences |

The `/mocktails` Create Your Own Mocktail section is **already static** — a Server Component displaying ingredient categories (Base, Purée, Syrup, Garnishes) as informational content. It has no `useState`, no `IngredientChip` interactive component, no `aria-pressed` controls, no Live Preview, and no selectable ingredients.

**Implementation task:** Refactor the existing static MocktailBuilder on `/mocktails` to read its ingredient labels from `lib/config/drinks.ts` — a data-source refactor only. Do not change its current static layout, visual design, or behavior. Do not add interactivity.

The inquiry form's `CustomMocktailBuilder` is a **new component** in `app/inquiries/components/` that provides the interactive experience. It shares:
- Canonical ingredient data from `lib/config/drinks.ts`
- Brand color palette and typography
- Visual language (pill shapes, pastel steps)

It is built from scratch for the inquiry form context. There are no existing reusable interactive components on `/mocktails` — the builder is new.

**Do not add interactive functionality to `/mocktails`.**

## File Structure

```
app/
  inquiries/
    page.tsx                    ← Public inquiry form page (server component)
    components/
      InquiryForm.tsx           ← Client component: full form with state
      DrinkSlot.tsx             ← Single drink slot (signature OR custom)
      SignatureSelector.tsx     ← Signature drink radio selection
      CustomMocktailBuilder.tsx ← Interactive 4-step builder per slot
      IngredientChip.tsx        ← Pill button for ingredient selection
      LivePreview.tsx           ← Per-slot recipe preview
      PackageCard.tsx           ← Concise package option display
      FormSection.tsx           ← Section wrapper (number + heading)
  api/
    inquiries/
      route.ts                  ← POST handler for public submissions
  auth/
    callback/
      route.ts                  ← Supabase Auth callback handler
  admin/
    page.tsx                    ← Dashboard list (server component)
    login/
      page.tsx                  ← Magic-link login form
    unauthorized/
      page.tsx                  ← Safe 403 page for non-admin authenticated users
    inquiries/
      [id]/
        page.tsx                ← Inquiry detail (server component)
        actions.ts              ← Server Actions for status/notes mutations
    components/
      InquiryTable.tsx          ← List table with sort indicators
      SearchBar.tsx             ← Search input
      FilterBar.tsx             ← Status/type/package/date filters
      Pagination.tsx            ← Page controls
      StatusBadge.tsx           ← Colored status pill
      StatusSelect.tsx          ← Status update control
      AdminNotes.tsx            ← Notes editor with save
      DrinkDisplay.tsx          ← Read-only drink detail rendering
      LogoutButton.tsx          ← Session logout
  mocktails/
    components/
      MocktailBuilder.tsx       ← EXISTING STATIC: refactor to read from
                                   lib/config/drinks.ts (data-source only)

lib/
  supabase/
    browser.ts                  ← Browser-safe Auth client
    server.ts                   ← SSR session client (@supabase/ssr)
    admin.ts                    ← Privileged server-only client (service key)
    proxy.ts                    ← Session refresh helper (used by root proxy.ts)
  config/
    packages.ts                 ← Canonical package configuration
    drinks.ts                   ← Signature drinks + custom ingredients
    statuses.ts                 ← Inquiry status values
    event-types.ts              ← Canonical event type values
    timezone.ts                 ← Business timezone constant
  validation/
    inquiry-schema.ts           ← Zod schema for inquiry payload
    phone.ts                    ← Phone parsing/normalization utilities
    admin-params.ts             ← URL parameter sanitization for admin queries
  auth/
    require-admin.ts            ← requireAdmin() helper
  email/
    send-inquiry-notification.ts ← Resend notification builder
  env/
    server.ts                   ← Server-only env validation (import 'server-only')
    public.ts                   ← Public env access

supabase/
  migrations/
    001_create_inquiry_tables.sql
    002_create_admin_users.sql
    003_create_functions.sql     ← reference generator + create_inquiry RPC
    004_enable_rls_policies.sql
    005_updated_at_trigger.sql
```

## Shared Canonical Configuration

### `lib/config/packages.ts`

The single source of truth for package data. The existing `PackageOfferings.tsx` component should be refactored to read from this configuration rather than maintaining local hardcoded data. This is a data-source refactor only — no visual redesign of the Packages page.

**Dead code:** `PackagesPreview.tsx` exists but is not imported or rendered anywhere. Flag for cleanup; do not spend implementation effort refactoring it.

```typescript
export interface PackageConfig {
  readonly id: string;
  readonly name: string;
  readonly pricingMode: 'flat' | 'per_guest';
  readonly price: number;
  readonly priceDisplay: string;
  readonly guestMin: number | null; // null = no minimum
  readonly guestMax: number | null; // null = no maximum
  readonly allowedDrinkCount: number;
  readonly badge: string | null;
  readonly shortDescription: string; // for inquiry form guidance
}

export const PACKAGES: readonly PackageConfig[] = [
  {
    id: 'signature-experience',
    name: 'Signature Experience',
    pricingMode: 'flat',
    price: 550,
    priceDisplay: '$550',
    guestMin: null,
    guestMax: 30,
    allowedDrinkCount: 2,
    badge: 'Most Popular',
    shortDescription: 'Up to 30 guests • 2 drinks • $550',
  },
  {
    id: 'celebration-experience',
    name: 'Celebration Experience',
    pricingMode: 'per_guest',
    price: 16,
    priceDisplay: '$16/person',
    guestMin: 31,
    guestMax: null,
    allowedDrinkCount: 2,
    badge: null,
    shortDescription: '31+ guests • 2 drinks • $16/person',
  },
  {
    id: 'premier-experience',
    name: 'Premier Experience',
    pricingMode: 'per_guest',
    price: 18,
    priceDisplay: '$18/person',
    guestMin: null,
    guestMax: null,
    allowedDrinkCount: 3,
    badge: null,
    shortDescription: '3 drinks • $18/person',
  },
  {
    id: 'reserve-experience',
    name: 'Reserve Experience',
    pricingMode: 'per_guest',
    price: 20,
    priceDisplay: '$20/person',
    guestMin: null,
    guestMax: null,
    allowedDrinkCount: 4,
    badge: 'Most Elevated',
    shortDescription: '4 drinks • $20/person',
  },
] as const;

export const PACKAGE_IDS = PACKAGES.map(p => p.id);

export function getPackageById(id: string): PackageConfig | undefined {
  return PACKAGES.find(p => p.id === id);
}

export function isPackageEligible(packageId: string, guestCount: number): boolean {
  const pkg = getPackageById(packageId);
  if (!pkg) return false;
  if (pkg.guestMin !== null && guestCount < pkg.guestMin) return false;
  if (pkg.guestMax !== null && guestCount > pkg.guestMax) return false;
  return true;
}
```

### `lib/config/drinks.ts`

The single source of truth for drink/ingredient data. Both the static `/mocktails` visualization and the interactive `/inquiries` builder read from this module.

```typescript
export interface SignatureDrink {
  readonly id: string;
  readonly name: string;
}

export const SIGNATURE_DRINKS: readonly SignatureDrink[] = [
  { id: 'hibiscus-blossom', name: 'Hibiscus Blossom' },
  { id: 'ginger-dragon', name: 'Ginger Dragon' },
  { id: 'garden-sparkler', name: 'Garden Sparkler' },
  { id: 'pineapple-sunrise', name: 'Pineapple Sunrise' },
] as const;

export const SIGNATURE_DRINK_IDS = SIGNATURE_DRINKS.map(d => d.id);

export const BASES = ['Lemonade', 'Tea', 'Soda', 'Juice'] as const;
export const PUREES = ['Mango', 'Strawberry', 'Raspberry', 'Banana', 'Peach', 'Passionfruit'] as const;
export const SYRUPS = ['Rose', 'Lavender', 'Mint', 'Vanilla', 'Dragonfruit'] as const;
export const GARNISHES = ['Dried Fruit', 'Flowers', 'Coconut Shreds', 'Fresh Fruit', 'Candied Ginger', 'Herbs', 'Glitter'] as const;

export type Base = typeof BASES[number];
export type Puree = typeof PUREES[number];
export type Syrup = typeof SYRUPS[number];
export type Garnish = typeof GARNISHES[number];
```

### `lib/config/statuses.ts`

```typescript
export const INQUIRY_STATUSES = ['new', 'contacted', 'in_discussion', 'booked', 'closed'] as const;
export type InquiryStatus = typeof INQUIRY_STATUSES[number];

export const STATUS_LABELS: Record<InquiryStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  in_discussion: 'In Discussion',
  booked: 'Booked',
  closed: 'Closed',
};
```

### `lib/config/event-types.ts`

```typescript
export const EVENT_TYPES = [
  'Wedding',
  'Bridal Shower',
  'Baby Shower',
  'Birthday',
  'Corporate Event',
  'Networking Event',
  'Community Event',
  'Private Party',
  'Family Event',
  'Other',
] as const;

export type EventType = typeof EVENT_TYPES[number];
```

Single source of truth for event types — used by the public form, Zod schema, admin filters, and admin detail labels.

## Form State Model

### `InquiryForm.tsx` State Shape

```typescript
interface DrinkSlotState {
  choiceType: 'signature' | 'custom' | null;
  signatureDrinkId: string | null;
  custom: {
    base: string | null;
    puree: string | null;
    syrup: string | null;
    garnishes: string[];
  };
}

interface InquiryFormState {
  // Section 01
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;

  // Section 02
  eventDate: string;
  eventType: string;
  eventTypeOther: string;
  estimatedGuestCount: string; // string for input binding, parsed to int on submit
  eventLocation: string;
  eventTime: string;

  // Section 03
  packageId: string;

  // Section 04
  drinks: DrinkSlotState[];

  // Section 05
  additionalNotes: string;

  // Anti-spam
  honeypot: string; // hidden field, must remain empty

  // UI state
  isSubmitting: boolean;
  isSuccess: boolean;
  errors: Record<string, string>;
}
```

Each `DrinkSlotState` is fully independent. The `drinks` array length is controlled by the selected package's `allowedDrinkCount`. When package changes:
- If new count > current array length: append empty slots
- If new count < current array length: **do NOT silently delete excess slots**

**Deterministic package-change UX:**

1. Drinks within the new allowed count remain active and editable
2. Excess drinks (beyond the new limit) are clearly marked as "Not included in this package" with a visual distinction (dimmed, bordered, or labeled)
3. The form displays a message: "Your new package includes [N] drinks. Please remove [X] extra selection(s) to continue."
4. A clear action is provided: "Remove Extra Selections" button or individual remove controls on excess slots
5. Submission remains disabled until the visitor confirms removal or switches back to a higher package
6. If the visitor switches back to the higher package BEFORE confirming removal, the existing selections remain available unchanged

This ensures no data loss without explicit user confirmation.

### Package Eligibility UX Flow

1. User enters guest count
2. User selects package
3. Frontend checks `isPackageEligible(packageId, guestCount)`
4. If ineligible: display inline error explaining why (e.g., "Signature Experience is for events with 30 or fewer guests")
5. Changing guest count re-evaluates eligibility: if current package becomes ineligible, show warning but preserve drink selections until user resolves
6. Submit button disabled while any eligibility error exists

## Phone Normalization

### `lib/validation/phone.ts`

```typescript
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export interface NormalizedPhone {
  phoneNumber: string;       // E.164 or trimmed raw
  phoneSearchDigits: string; // digits only for search
}

export function normalizePhone(raw: string): NormalizedPhone {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error('Phone number is required');

  const digits = trimmed.replace(/\D/g, '');

  // Attempt E.164 parsing (default country US unless + prefix supplied)
  const parsed = parsePhoneNumberFromString(trimmed, 'US');

  // TIER A: libphonenumber-js parses AND confirms valid
  if (parsed && parsed.isValid()) {
    const e164 = parsed.format('E.164');
    return {
      phoneNumber: e164,
      phoneSearchDigits: e164.replace(/\D/g, ''),
    };
  }

  // TIER B: Cannot confirm valid, but ≥10 digits present
  if (digits.length >= 10) {
    return {
      phoneNumber: trimmed,
      phoneSearchDigits: digits,
    };
  }

  // TIER C: <10 digits AND not parseable/valid → reject
  throw new Error('Phone number does not appear to be valid');
}

export function normalizePhoneForSearch(input: string): string {
  return input.replace(/\D/g, '');
}
```

**Validation tiers (unambiguous):**

| Tier | Condition | Result | phone_number | phone_search_digits |
|------|-----------|--------|--------------|---------------------|
| A | libphonenumber-js parses AND confirms valid | **Accept** | E.164 (e.g., `+14255551234`) | Digits from E.164 |
| B | Cannot confirm valid, but ≥10 digits present | **Accept** (ambiguous but plausible) | Trimmed raw input | All extracted digits |
| C | <10 digits AND libphonenumber-js does not validate | **Reject** | — | — |

A 7–9 digit value is NOT automatically accepted — it must pass libphonenumber-js validation (Tier A) to be stored. Without E.164 confirmation, the minimum threshold is 10 digits.

International numbers beginning with `+` are parsed without replacing their supplied country code. US is the default country only when no explicit `+` prefix is provided.

## Validation Schema

### `lib/validation/inquiry-schema.ts`

Uses Zod for structured validation. Added as a new dependency (~13KB gzipped).

```typescript
import { z } from 'zod';
import { PACKAGE_IDS } from '@/lib/config/packages';
import { SIGNATURE_DRINK_IDS, BASES, PUREES, SYRUPS, GARNISHES } from '@/lib/config/drinks';
import { EVENT_TYPES } from '@/lib/config/event-types';

const MAX_TEXT = 200;
const MAX_NOTES = 2000;

const customMocktailSchema = z.object({
  base: z.enum(BASES),
  puree: z.enum(PUREES),
  syrup: z.enum(SYRUPS),
  garnishes: z.array(z.enum(GARNISHES)).default([]),
});

const drinkChoiceSchema = z.discriminatedUnion('choiceType', [
  z.object({
    choiceType: z.literal('signature'),
    signatureDrinkId: z.enum(SIGNATURE_DRINK_IDS as [string, ...string[]]),
  }),
  z.object({
    choiceType: z.literal('custom'),
    custom: customMocktailSchema,
  }),
]);

export const inquirySchema = z.object({
  firstName: z.string().min(1).max(MAX_TEXT),
  lastName: z.string().min(1).max(MAX_TEXT),
  email: z.string().email().max(MAX_TEXT),
  phoneNumber: z.string().min(1).max(30),
  eventDate: z.string().date(), // ISO date, further validated for future date
  eventType: z.enum(EVENT_TYPES),
  eventTypeOther: z.string().max(MAX_TEXT).optional(),
  estimatedGuestCount: z.number().int().positive(),
  eventLocation: z.string().min(1).max(MAX_TEXT),
  eventTime: z.string().regex(/^\d{2}:\d{2}$/),
  packageId: z.enum(PACKAGE_IDS as [string, ...string[]]),
  drinks: z.array(drinkChoiceSchema).min(1).max(4),
  additionalNotes: z.string().max(MAX_NOTES).optional(),
  honeypot: z.string().max(0).optional(),
});

export type InquiryPayload = z.infer<typeof inquirySchema>;
```

**Business-rule validation** (post-Zod, in the API route):
1. If `honeypot` is non-empty → reject (spam)
2. If `eventType === 'Other'` → require `eventTypeOther` is non-empty
3. Validate `eventDate >= today` using `BUSINESS_TIMEZONE`
4. `isPackageEligible(packageId, estimatedGuestCount)` must be true
5. `drinks.length === getPackageById(packageId).allowedDrinkCount`
6. Normalize all inputs (trim, lowercase email, phone normalization)

## Anti-Spam

1. **Honeypot field:** Hidden via CSS (`aria-hidden="true"`, `tabindex="-1"`, positioned off-screen). Server rejects non-empty values.
2. **Strict validation:** Zod schema rejects unexpected fields and enforces bounded lengths.
3. **Rate limiting (v1):** For initial launch, the system relies on honeypot, strict validation, bounded input lengths, and server-only submission as the primary protection layers. Infrastructure-level rate limiting (Vercel WAF/IP-based rules) is documented as a recommended follow-up configuration step. A naive in-memory Map is NOT used because serverless instances are ephemeral and distributed — it would provide inconsistent per-instance throttling only.

**Documented follow-up:** Configure Vercel's built-in rate limiting or a shared durable store (e.g., Upstash Redis) when traffic justifies the added dependency.

## Environment Variable Architecture

### `lib/env/server.ts` — Server-Only

```typescript
import 'server-only';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const serverEnv = {
  supabaseSecretKey: requireEnv('SUPABASE_SECRET_KEY'),
  resendApiKey: requireEnv('RESEND_API_KEY'),
  resendFromEmail: requireEnv('RESEND_FROM_EMAIL'),
  notificationEmail: requireEnv('INQUIRY_NOTIFICATION_EMAIL'),
};
```

The `import 'server-only'` directive ensures a build error if any client component imports this module.

### `lib/env/public.ts` — Safe for Client

```typescript
function requirePublicEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const publicEnv = {
  supabaseUrl: requirePublicEnv('NEXT_PUBLIC_SUPABASE_URL'),
  supabasePublishableKey: requirePublicEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'),
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? '',
};
```

Required public variables fail clearly with a named error rather than silently instantiating clients with empty strings. `NEXT_PUBLIC_SITE_URL` is optional (notification link is only included when present).

## Supabase Client Separation

### `lib/supabase/browser.ts` — Browser Auth Client

```typescript
import { createBrowserClient } from '@supabase/ssr';
import { publicEnv } from '@/lib/env/public';

export function createBrowserSupabaseClient() {
  return createBrowserClient(publicEnv.supabaseUrl, publicEnv.supabasePublishableKey);
}
```

### `lib/supabase/server.ts` — SSR Session Client

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { publicEnv } from '@/lib/env/public';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(publicEnv.supabaseUrl, publicEnv.supabasePublishableKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}
```

### `lib/supabase/admin.ts` — Privileged Server-Only Client

```typescript
import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { publicEnv } from '@/lib/env/public';
import { serverEnv } from '@/lib/env/server';

export function createAdminSupabaseClient() {
  return createClient(publicEnv.supabaseUrl, serverEnv.supabaseSecretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
```

### `lib/supabase/proxy.ts` — Session Refresh (Next.js 16 Proxy)

Next.js 16 uses `proxy.ts` (not `middleware.ts`). Cookie mutation (`set`/`delete`) is NOT allowed in Server Components — only in Server Functions, Route Handlers, or the Proxy. Session refresh must therefore happen in the Proxy.

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );
  await supabase.auth.getUser(); // refreshes session token if needed
  return response;
}
```

**Server client cookie handling:** The SSR server client in Server Components uses a read-only cookie adapter — `getAll()` reads auth cookies but `setAll()` is a no-op (session refresh already happened in the Proxy). This prevents crashes from illegal cookie mutation.

```typescript
// lib/supabase/server.ts — safe in Server Components (read-only cookies)
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(publicEnv.supabaseUrl, publicEnv.supabasePublishableKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() { /* no-op: session refresh handled by proxy.ts */ },
    },
  });
}
```

**Proxy file** at project root:

```typescript
// proxy.ts
import { updateSession } from '@/lib/supabase/proxy';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*'],
};
```

Used in `proxy.ts` at the project root to refresh auth cookies on every admin request.

## Database Schema

### `contact_inquiries`

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| reference | text | UNIQUE, NOT NULL |
| created_at | timestamptz | NOT NULL, default now() |
| updated_at | timestamptz | NOT NULL, default now() |
| first_name | text | NOT NULL |
| last_name | text | NOT NULL |
| email | text | NOT NULL |
| phone_number | text | NOT NULL |
| phone_search_digits | text | NOT NULL |
| event_date | date | NOT NULL |
| event_type | text | NOT NULL |
| event_type_other | text | nullable |
| estimated_guest_count | integer | NOT NULL, CHECK > 0 |
| event_location | text | NOT NULL |
| event_time | time | NOT NULL |
| package_id | text | NOT NULL |
| package_name_snapshot | text | NOT NULL |
| additional_notes | text | nullable |
| status | text | NOT NULL, default 'new', CHECK IN ('new','contacted','in_discussion','booked','closed') |
| admin_notes | text | nullable |

**Indexes:**
- `idx_inquiries_status` on `status`
- `idx_inquiries_event_date` on `event_date`
- `idx_inquiries_created_at` on `created_at DESC`
- `idx_inquiries_phone_search` on `phone_search_digits`

### `inquiry_drink_choices`

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| inquiry_id | uuid | FK → contact_inquiries(id) ON DELETE CASCADE, NOT NULL |
| position | integer | NOT NULL |
| choice_type | text | NOT NULL, CHECK IN ('signature','custom') |
| signature_drink_id | text | nullable |
| signature_drink_name_snapshot | text | nullable |
| created_at | timestamptz | NOT NULL, default now() |

UNIQUE constraint on (inquiry_id, position).

**Check constraints for relational integrity:**
- `chk_signature_complete`: `choice_type != 'signature' OR (signature_drink_id IS NOT NULL AND signature_drink_name_snapshot IS NOT NULL)` — signature choices must have drink data
- `chk_custom_no_signature`: `choice_type != 'custom' OR (signature_drink_id IS NULL AND signature_drink_name_snapshot IS NULL)` — custom choices must NOT have signature data

### `inquiry_custom_mocktails`

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| drink_choice_id | uuid | FK → inquiry_drink_choices(id) ON DELETE CASCADE, NOT NULL, UNIQUE |
| base | text | NOT NULL |
| puree | text | NOT NULL |
| syrup | text | NOT NULL |
| garnishes | text[] | NOT NULL, default '{}' |
| created_at | timestamptz | NOT NULL, default now() |

`garnishes` defaults to empty array `'{}'` rather than null — simplifies application logic (always iterable).

### `admin_users`

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| user_id | uuid | UNIQUE, NOT NULL, FK → auth.users(id) ON DELETE CASCADE |
| created_at | timestamptz | NOT NULL, default now() |
| display_name | text | nullable |

## Inquiry Reference Generation

Format: `MR-{YEAR}-{RANDOM6}` where RANDOM6 is 6 uppercase alphanumeric characters (A-Z, 0-9).

```sql
CREATE OR REPLACE FUNCTION generate_inquiry_reference()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  ref text;
  exists_check boolean;
BEGIN
  LOOP
    ref := 'MR-' || EXTRACT(YEAR FROM now())::text || '-' ||
           upper(substring(md5(gen_random_uuid()::text) from 1 for 6));
    SELECT EXISTS(SELECT 1 FROM public.contact_inquiries WHERE reference = ref) INTO exists_check;
    EXIT WHEN NOT exists_check;
  END LOOP;
  RETURN ref;
END;
$$;

REVOKE EXECUTE ON FUNCTION generate_inquiry_reference() FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION generate_inquiry_reference() TO service_role;
```

**Uniqueness guarantee:**
- Random generation provides extremely low collision probability (36^6 ≈ 2.2 billion combinations per year)
- `UNIQUE(reference)` constraint on the table is the final authority
- Retry loop handles rare uniqueness collision
- Race conditions cannot bypass uniqueness because the UNIQUE constraint is enforced at the database level regardless of concurrent transactions

## Transactional RPC

```sql
CREATE OR REPLACE FUNCTION create_inquiry(
  p_first_name text,
  p_last_name text,
  p_email text,
  p_phone_number text,
  p_phone_search_digits text,
  p_event_date date,
  p_event_type text,
  p_event_type_other text,
  p_estimated_guest_count integer,
  p_event_location text,
  p_event_time time,
  p_package_id text,
  p_package_name_snapshot text,
  p_additional_notes text,
  p_drinks jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_inquiry_id uuid;
  v_reference text;
  v_drink jsonb;
  v_drink_choice_id uuid;
  v_position integer;
BEGIN
  -- Generate unique reference
  v_reference := generate_inquiry_reference();

  -- Insert inquiry
  INSERT INTO public.contact_inquiries (
    reference, first_name, last_name, email, phone_number, phone_search_digits,
    event_date, event_type, event_type_other, estimated_guest_count,
    event_location, event_time, package_id, package_name_snapshot,
    additional_notes, status
  ) VALUES (
    v_reference, p_first_name, p_last_name, p_email, p_phone_number, p_phone_search_digits,
    p_event_date, p_event_type, p_event_type_other, p_estimated_guest_count,
    p_event_location, p_event_time, p_package_id, p_package_name_snapshot,
    p_additional_notes, 'new'
  ) RETURNING id INTO v_inquiry_id;

  -- Insert drink choices
  v_position := 1;
  FOR v_drink IN SELECT * FROM jsonb_array_elements(p_drinks)
  LOOP
    INSERT INTO public.inquiry_drink_choices (
      inquiry_id, position, choice_type,
      signature_drink_id, signature_drink_name_snapshot
    ) VALUES (
      v_inquiry_id,
      v_position,
      v_drink->>'choiceType',
      CASE WHEN v_drink->>'choiceType' = 'signature'
        THEN v_drink->>'signatureDrinkId' ELSE NULL END,
      CASE WHEN v_drink->>'choiceType' = 'signature'
        THEN v_drink->>'signatureDrinkNameSnapshot' ELSE NULL END
    ) RETURNING id INTO v_drink_choice_id;

    -- Insert custom mocktail if applicable
    IF v_drink->>'choiceType' = 'custom' THEN
      INSERT INTO public.inquiry_custom_mocktails (
        drink_choice_id, base, puree, syrup, garnishes
      ) VALUES (
        v_drink_choice_id,
        v_drink->'custom'->>'base',
        v_drink->'custom'->>'puree',
        v_drink->'custom'->>'syrup',
        COALESCE(
          ARRAY(SELECT jsonb_array_elements_text(v_drink->'custom'->'garnishes')),
          '{}'::text[]
        )
      );
    END IF;

    v_position := v_position + 1;
  END LOOP;

  RETURN jsonb_build_object('id', v_inquiry_id, 'reference', v_reference);
END;
$$;

REVOKE EXECUTE ON FUNCTION create_inquiry FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION create_inquiry TO service_role;
```

**Atomicity:** The entire function runs in one transaction. Any failure (constraint violation, etc.) rolls back all inserts — no partial records.

**Security:** `SECURITY DEFINER` with explicit `SET search_path` prevents search-path injection. EXECUTE revoked from all except `service_role`.

**Defense-in-depth:** The database CHECK constraints on `inquiry_drink_choices` ensure:
- Signature rows always have `signature_drink_id` and `signature_drink_name_snapshot`
- Custom rows never have signature data
- The RPC logic and the API validation both enforce this, providing layered protection

**RPC input validation (lightweight):** The RPC does NOT duplicate every Zod/TypeScript business rule, but it performs inexpensive structural validation:
- `p_drinks` must be a non-empty JSON array
- Each element must have a `choiceType` of either 'signature' or 'custom'
- Custom elements must contain a non-null `custom` object with non-null `base`, `puree`, `syrup`
- Signature elements must contain a non-null `signatureDrinkId`

This prevents corrupt relational state even if the API layer has a bug.

**Server-derived snapshots (CRITICAL):** The client NEVER provides authoritative `package_name_snapshot` or `signature_drink_name_snapshot` values. The API route resolves these from canonical configuration after validating submitted IDs:

```typescript
// In API route, after validation:
const pkg = getPackageById(validated.packageId)!;
const packageNameSnapshot = pkg.name;

const drinksPayload = validated.drinks.map(drink => {
  if (drink.choiceType === 'signature') {
    const sig = SIGNATURE_DRINKS.find(d => d.id === drink.signatureDrinkId)!;
    return { choiceType: 'signature', signatureDrinkId: sig.id, signatureDrinkNameSnapshot: sig.name };
  }
  return { choiceType: 'custom', custom: drink.custom };
});
```

Display names sent from the browser are ignored — only IDs are trusted.

## Updated_at Trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER contact_inquiries_updated_at
  BEFORE UPDATE ON public.contact_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

Automatically updates `updated_at` on any UPDATE to the row (status changes, admin notes, etc.).

## RLS Policies

All tables have RLS enabled. No anonymous/public access to inquiry data.

### Admin Authorization Helper

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
$$;

-- Harden permissions
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;

-- authenticated role MUST retain EXECUTE because RLS policies are evaluated
-- in the context of the authenticated user's role. When an authenticated user
-- makes a request, PostgreSQL evaluates the RLS policy which calls is_admin().
-- Without EXECUTE on authenticated, the policy evaluation would fail.
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;
```

**Security rationale for `authenticated` GRANT:**
- RLS policies run in the security context of the requesting user's role
- When an admin (who is `authenticated`) queries `contact_inquiries`, PostgreSQL evaluates the SELECT policy which calls `is_admin()`
- If `authenticated` cannot execute `is_admin()`, the policy check fails and ALL authenticated users (including admins) are denied access
- The function only returns a boolean — it does not expose admin user data, email addresses, or membership lists
- `anon` is explicitly revoked because anonymous users should never reach admin-protected tables

This helper avoids repeating the `EXISTS(SELECT ... FROM admin_users ...)` pattern in every policy and ensures consistent authorization logic across all inquiry/drink/custom tables.

### `contact_inquiries`

```sql
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Admin can read all inquiries
CREATE POLICY admin_select_inquiries ON contact_inquiries
  FOR SELECT USING (is_admin());

-- Admin can update status and admin_notes only
CREATE POLICY admin_update_inquiries ON contact_inquiries
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- No INSERT via client — only through SECURITY DEFINER RPC
-- No DELETE policy — inquiries are never deleted through the app
```

**Important:** RLS authorizes rows, not columns. The server actions that perform updates are tightly scoped to only modify `status` and `admin_notes` columns. The original client inquiry data (name, email, event details, etc.) remains read-only at the application layer.

### `inquiry_drink_choices` and `inquiry_custom_mocktails`

```sql
ALTER TABLE inquiry_drink_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiry_custom_mocktails ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_select_drinks ON inquiry_drink_choices
  FOR SELECT USING (is_admin());

CREATE POLICY admin_select_custom ON inquiry_custom_mocktails
  FOR SELECT USING (is_admin());

-- No INSERT/UPDATE/DELETE via client for these tables
```

### `admin_users`

```sql
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_read_self ON admin_users
  FOR SELECT USING (user_id = auth.uid());
```

Only the authenticated user can read their own admin_users record (needed by `requireAdmin()` via the session client).

### RPC Access

The `create_inquiry` and `generate_inquiry_reference` functions use `SECURITY DEFINER` and are callable ONLY via the `service_role`:
```sql
REVOKE EXECUTE ON FUNCTION create_inquiry FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION create_inquiry TO service_role;
```

No anonymous or authenticated browser client can invoke these functions directly.

## Authentication Flow

### Complete Session Lifecycle

1. **Login:** Admin visits `/admin` → server checks session via `requireAdmin()` → no session → redirect to `/admin/login`
2. **Magic link request:** Admin enters email → client calls `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: '/auth/callback' } })` → **neutral response** displayed: "If this email is authorized, a sign-in link has been sent." (Does not reveal whether the email is in admin_users)
3. **Callback:** Supabase sends magic link → user clicks → redirected to `/auth/callback` → route handler exchanges code for session using `@supabase/ssr`, sets auth cookies → redirect to `/admin`
4. **Session refresh:** Proxy (`proxy.ts`) intercepts requests to `/admin/*` and `/auth/*`, calling `supabase.auth.getUser()` which refreshes the session cookie if needed. Cookie mutation happens in the Proxy layer — Server Components only read cookies. This prevents expired sessions during extended admin use.
5. **Authorization:** `requireAdmin()` checks: (a) valid session from cookies via `getUser()`, (b) `user_id` exists in `admin_users`
6. **Logout:** Client calls `supabase.auth.signOut()` → cookies cleared → redirect to `/admin/login`
7. **Expired/invalid link:** `/auth/callback` handles errors gracefully → redirect to `/admin/login` with an error message

### `requireAdmin()` Non-Admin Behavior

```typescript
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/admin/login');
  }

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!adminUser) {
    // Authenticated but NOT an admin — show 403, do NOT redirect to login
    redirect('/admin/unauthorized');
  }

  return { user, adminUser };
}
```

The `/admin/unauthorized` page displays a safe message like "You don't have permission to access this page." without revealing inquiry data. This avoids confusing login loops for authenticated non-admin users.

## Admin Dashboard Architecture

### URL-Driven State

The admin list page (`/admin/page.tsx`) is a Server Component that reads `searchParams`:

```typescript
interface AdminSearchParams {
  search?: string;
  status?: string;
  eventType?: string;
  package?: string;
  eventDate?: string;
  sort?: 'created_at' | 'event_date';
  direction?: 'asc' | 'desc';
  page?: string;
}
```

All filtering, sorting, and pagination happens server-side. Client components (SearchBar, FilterBar, Pagination) update the URL via `useRouter().push()`. On search/filter/sort change, page resets to 1.

### Parameter Sanitization (`lib/validation/admin-params.ts`)

All admin URL parameters are validated and sanitized before being used in database queries. No raw user input is interpolated into PostgREST filter expressions.

```typescript
import { z } from 'zod';
import { INQUIRY_STATUSES } from '@/lib/config/statuses';
import { PACKAGE_IDS } from '@/lib/config/packages';
import { EVENT_TYPES } from '@/lib/config/event-types';

const ALLOWED_SORTS = ['created_at', 'event_date'] as const;
const ALLOWED_DIRECTIONS = ['asc', 'desc'] as const;
export const PAGE_SIZE = 20;

const adminParamsSchema = z.object({
  search: z.string().max(100).optional().transform(s => s?.trim() || undefined),
  status: z.enum(INQUIRY_STATUSES).optional().catch(undefined),
  eventType: z.enum(EVENT_TYPES).optional().catch(undefined),
  package: z.enum(PACKAGE_IDS as [string, ...string[]]).optional().catch(undefined),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().catch(undefined),
  sort: z.enum(ALLOWED_SORTS).optional().catch('created_at'),
  direction: z.enum(ALLOWED_DIRECTIONS).optional().catch('desc'),
  page: z.coerce.number().int().min(1).optional().catch(1),
});

export type ValidatedAdminParams = z.infer<typeof adminParamsSchema>;

export function sanitizeAdminParams(raw: Record<string, string | undefined>): ValidatedAdminParams & { pageSize: number } {
  const parsed = adminParamsSchema.parse(raw);
  return { ...parsed, sort: parsed.sort ?? 'created_at', direction: parsed.direction ?? 'desc', page: parsed.page ?? 1, pageSize: PAGE_SIZE };
}
```

No `as any` casts. All parameters are parsed into strongly-typed validated values via Zod schemas.

### Safe Admin Search Strategy

The admin search does NOT interpolate user-controlled text into raw PostgREST `.or()` syntax. Instead, the search is performed via a **dedicated PostgreSQL RPC** that accepts normal typed parameters:

```sql
CREATE OR REPLACE FUNCTION search_inquiries(
  p_search text DEFAULT NULL,
  p_status text DEFAULT NULL,
  p_event_type text DEFAULT NULL,
  p_package_id text DEFAULT NULL,
  p_event_date date DEFAULT NULL,
  p_sort text DEFAULT 'created_at',
  p_direction text DEFAULT 'desc',
  p_page integer DEFAULT 1,
  p_page_size integer DEFAULT 20
)
RETURNS TABLE (
  -- returns all contact_inquiries columns plus total_count
  id uuid, reference text, created_at timestamptz, updated_at timestamptz,
  first_name text, last_name text, email text, phone_number text,
  phone_search_digits text, event_date date, event_type text,
  event_type_other text, estimated_guest_count integer,
  event_location text, event_time time, package_id text,
  package_name_snapshot text, additional_notes text,
  status text, admin_notes text, total_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
DECLARE
  v_offset integer;
  v_search_pattern text;
  v_search_digits text;
BEGIN
  v_offset := (p_page - 1) * p_page_size;
  v_search_pattern := CASE WHEN p_search IS NOT NULL THEN '%' || p_search || '%' ELSE NULL END;
  v_search_digits := CASE WHEN p_search IS NOT NULL THEN regexp_replace(p_search, '\D', '', 'g') ELSE NULL END;

  RETURN QUERY
  SELECT
    ci.id, ci.reference, ci.created_at, ci.updated_at,
    ci.first_name, ci.last_name, ci.email, ci.phone_number,
    ci.phone_search_digits, ci.event_date, ci.event_type,
    ci.event_type_other, ci.estimated_guest_count,
    ci.event_location, ci.event_time, ci.package_id,
    ci.package_name_snapshot, ci.additional_notes,
    ci.status, ci.admin_notes,
    COUNT(*) OVER() AS total_count
  FROM public.contact_inquiries ci
  WHERE
    (p_status IS NULL OR ci.status = p_status)
    AND (p_event_type IS NULL OR ci.event_type = p_event_type)
    AND (p_package_id IS NULL OR ci.package_id = p_package_id)
    AND (p_event_date IS NULL OR ci.event_date = p_event_date)
    AND (
      p_search IS NULL
      OR ci.first_name ILIKE v_search_pattern
      OR ci.last_name ILIKE v_search_pattern
      OR ci.email ILIKE v_search_pattern
      OR ci.event_location ILIKE v_search_pattern
      OR (length(v_search_digits) >= 3 AND ci.phone_search_digits ILIKE '%' || v_search_digits || '%')
    )
  ORDER BY
    CASE WHEN p_sort = 'event_date' AND p_direction = 'asc' THEN ci.event_date END ASC,
    CASE WHEN p_sort = 'event_date' AND p_direction = 'desc' THEN ci.event_date END DESC,
    CASE WHEN p_sort = 'created_at' AND p_direction = 'asc' THEN ci.created_at END ASC,
    CASE WHEN p_sort = 'created_at' AND p_direction = 'desc' THEN ci.created_at END DESC
  LIMIT p_page_size
  OFFSET v_offset;
END;
$$;

REVOKE EXECUTE ON FUNCTION search_inquiries FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION search_inquiries TO authenticated, service_role;
```

Phone search uses the `phone_search_digits` column (digits-only) — no punctuation sensitivity. The RPC is callable by `authenticated` (via the SSR session client with RLS) because admin access is additionally enforced by `requireAdmin()` at the application layer.

### Pagination

`PAGE_SIZE = 20` defined as a single constant in `lib/validation/admin-params.ts`. Server enforces `page >= 1`. When search/filter/sort changes, page resets to 1. Filters/search/sort persist while navigating between pages.

## Inquiry Detail Page

`/admin/inquiries/[id]/page.tsx` — Server Component.

1. `requireAdmin()`
2. Fetch inquiry by ID with drink choices and custom mocktails (joined/separate queries)
3. Render read-only display sections (contact, event, package, drinks, notes)
4. Phone number rendered as actionable `tel:` link
5. Render status select (client component) → server action
6. Render admin notes editor (client component) → server action

### Admin Mutations (`/admin/inquiries/[id]/actions.ts`)

```typescript
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
```

Both mutations:
- Call `requireAdmin()` independently
- Validate inputs against canonical values
- Update only intended columns (never expose generic update)
- Handle Supabase errors and return structured results
- Trigger `updated_at` automatically via database trigger
- Revalidate affected paths for Next.js cache

## Public Submission API Route

### `app/api/inquiries/route.ts`

```typescript
export async function POST(request: Request) {
  // 1. Parse JSON body
  // 2. Zod validate (returns early with 400 + field errors)
  // 3. Check honeypot (reject if non-empty → 400)
  // 4. Normalize inputs:
  //    - trim first_name, last_name, event_location, event_type_other
  //    - trim + lowercase email
  //    - normalizePhone() → phone_number + phone_search_digits
  //    - trim additional_notes, preserve line breaks
  // 5. Validate event_date >= today (using BUSINESS_TIMEZONE)
  // 6. If eventType === 'Other', ensure eventTypeOther present
  // 7. isPackageEligible(packageId, estimatedGuestCount)
  // 8. drinks.length === getPackageById(packageId).allowedDrinkCount
  // 9. Build RPC payload with name snapshots for package + signature drinks
  // 10. Call create_inquiry RPC via admin client
  // 11. await Resend notification inside try/catch
  // 12. Return { success: true, reference }
}
```

**Resend is awaited** — not fire-and-forget — to ensure the email attempt completes before the serverless runtime terminates. Failure is caught and logged; it does not affect the response.

**Response shapes:**
- Success: `{ success: true, reference: "MR-2026-XXXXXX" }` (200)
- Validation error: `{ success: false, errors: { field: message } }` (400)
- Server error: `{ success: false, error: "Something went wrong" }` (500)

## Resend Notification

### `lib/email/send-inquiry-notification.ts`

```typescript
import 'server-only';
import { Resend } from 'resend';
import { serverEnv } from '@/lib/env/server';
import { publicEnv } from '@/lib/env/public';

// ... notification builder
```

**Subject:** `New Mock & Roll Inquiry ${reference} — ${firstName} ${lastName}`

**Body:** Structured plain-text email with sections: Contact (name, email, phone), Event (date, time, type, guest count, location), Package, Drink Choices (with full custom details including "Sparkling with club soda"), Additional Notes, and admin link if `siteUrl` is configured.

**Recipients:** From `INQUIRY_NOTIFICATION_EMAIL`.
**replyTo:** Visitor's email.
**from:** `RESEND_FROM_EMAIL`

### Safe Error Logging

```typescript
try {
  await resend.emails.send({ ... });
} catch (error) {
  // Log reference and error type only — no PII
  console.error(
    `[Resend] Notification failed for inquiry ${reference}:`,
    error instanceof Error ? error.message : 'Unknown error'
  );
}
```

**Never log:** phone numbers, email addresses, additional notes, full form payloads, secret configuration. Only inquiry reference + sanitized error type.

## Duplicate Submission Prevention

**Frontend strategy:**
- Disable "Send Inquiry" button while the request is pending (`isSubmitting` state)
- Ignore repeated clicks while submitting
- Do NOT automatically retry POST after an ambiguous network failure without user awareness
- On success, transition to the success state which hides the form entirely

**Scope of guarantee (v1):** The UI prevents normal duplicate-click submissions. True network-level exactly-once delivery is NOT guaranteed without an idempotency key. For v1 this is acceptable — the combination of disabled-button UI, single-response state transition, and database-level unique reference provides practical protection against typical user-error duplicates.

**Documented follow-up:** If duplicate inquiries become a real-world issue, add a client-generated submission token (UUID) included in the payload and backed by a UNIQUE constraint on the database. This would provide true idempotency.

## Create Your Own Builder — Component Design

### Independence Per Slot

Each `DrinkSlot` component receives its own index and manages state via callbacks to the parent `InquiryForm`:

```typescript
interface DrinkSlotProps {
  index: number;
  state: DrinkSlotState;
  onChange: (index: number, state: DrinkSlotState) => void;
}
```

The parent's `drinks` array state is updated immutably:
```typescript
const handleDrinkChange = (index: number, newState: DrinkSlotState) => {
  setDrinks(prev => prev.map((d, i) => i === index ? newState : d));
};
```

This guarantees slot independence — changing Drink 2 creates a new array where only index 1 differs.

### CustomMocktailBuilder Props

```typescript
interface CustomMocktailBuilderProps {
  state: { base: string | null; puree: string | null; syrup: string | null; garnishes: string[] };
  onChange: (state: CustomMocktailBuilderProps['state']) => void;
}
```

Renders four steps using `IngredientChip` components with step-specific pastel color schemes. Each step's selection handler calls `onChange` with the updated state for that slot only.

## Navigation Updates

Current `navLinks` in `Header.tsx`:
```typescript
{ label: "Inquiries", href: "mailto:lauren@mocknrollbar.com" }
```

Updated to:
```typescript
{ label: "Inquiries", href: "/inquiries" }
```

**CTA routing (resolved — deterministic):**

| Location | Current | Updated | Reason |
|----------|---------|---------|--------|
| Header "Inquiries" nav link | `mailto:lauren@mocknrollbar.com` | `/inquiries` | Primary inquiry entry point |
| Header "Book Mock & Roll" button | `mailto:lauren@mocknrollbar.com` | `/inquiries` | Primary booking CTA |
| PackageOfferings package CTAs | `mailto:lauren@mocknrollbar.com` | `/inquiries` | Starts inquiry from package context |
| PackagesCTA | `mailto:lauren@mocknrollbar.com` | `/inquiries` | Clear booking intent |
| MocktailBuilder "Book Mock & Roll" CTA | `mailto:lauren@mocknrollbar.com` | `/inquiries` | Clear event inquiry intent |
| CustomEvents CTA | `mailto:lauren@mocknrollbar.com` | `mailto:lauren@mocknrollbar.com` | Keep — copy says "custom package" which implies direct consultation beyond the standard form |
| MocktailsCTA "Book Mock & Roll" | `mailto:lauren@mocknrollbar.com` | `/inquiries` | Clear booking intent from mocktails page |

**Rule:** Any CTA whose clear intent is beginning an event inquiry routes to `/inquiries`. Only CTAs where the copy explicitly communicates custom/direct consultation (not the standard inquiry workflow) retain `mailto:`. This applies to the CustomEvents section only.

All in `supabase/migrations/` directory, ordered for execution:

1. **001_create_inquiry_tables.sql** — `contact_inquiries` (with `phone_search_digits`), `inquiry_drink_choices` (with check constraints), `inquiry_custom_mocktails` (garnishes defaults to '{}'), all foreign keys, indexes
2. **002_create_admin_users.sql** — `admin_users` table with unique user_id constraint and FK to auth.users
3. **003_create_functions.sql** — `is_admin()`, `generate_inquiry_reference()`, `create_inquiry()`, `search_inquiries()` with SECURITY DEFINER, safe search_path, REVOKE/GRANT
4. **004_enable_rls_policies.sql** — Enable RLS on all tables, create all SELECT/UPDATE policies using `is_admin()`
5. **005_updated_at_trigger.sql** — `update_updated_at()` function and trigger on contact_inquiries

## Dependencies Added

| Package | Purpose | Size |
|---------|---------|------|
| `zod` | Validation schemas | ~13KB gzip |
| `libphonenumber-js` | Phone parsing/E.164 normalization | ~80KB gzip (tree-shakeable) |
| `@supabase/supabase-js` | Privileged admin client | Already peer of @supabase/ssr |
| `@supabase/ssr` | Server session client + middleware | New |
| `resend` | Email notification | ~5KB |
| `server-only` | Build-time guard for server modules | ~0KB (marker package) |

## Testing Strategy

### Unit Tests

- **Phone normalization:** Valid US formats → E.164, international +44 format preserved, various punctuation styles, ambiguous-but-plausible (≥10 digits without E.164 parse) accepted as trimmed, 7–9 digit values without E.164 validation rejected, <7 digit values rejected
- **Package eligibility:** All combinations — Signature ≤30 valid / >30 rejected, Celebration >30 valid / ≤30 rejected, Premier/Reserve accept any count
- **Validation schema:** Valid payloads pass, missing required fields fail, boundary values, canonical-only ingredient values
- **Admin params sanitization:** Invalid sort/status/page values defaulted safely, no raw injection possible

### Integration Tests

- **API route — valid submission:** POST with complete valid payload → 200 + reference
- **API route — missing fields:** → 400 with field-level errors
- **API route — package eligibility violation:** → 400
- **API route — drink count mismatch:** → 400
- **API route — past event date:** → 400
- **API route — invalid phone:** → 400
- **API route — honeypot filled:** → 400
- **Transactional integrity:** All child records created on success; simulated child-insert failure rolls back entire inquiry; no orphaned rows
- **Resend failure:** Inquiry persists, 200 returned, error logged without PII

### Security Tests

- Direct Supabase SELECT on contact_inquiries with anon key → denied
- Direct Supabase INSERT with anon key → denied
- Direct RPC call with anon/authenticated key → denied
- Authenticated non-admin user → `/admin/unauthorized` page, no data exposed
- `SUPABASE_SECRET_KEY` not present in client bundle (search build output)
- `lib/env/server.ts` import from client component → build error

### E2E Verification (Manual or Playwright)

- Form renders all 5 sections with correct fields
- Phone input accepts flexible formats without forced formatting
- Package selection shows guidance info
- Package change adjusts drink slots with appropriate warnings
- Guest count / package eligibility validation
- Signature drink selection per slot
- Custom drink builder per slot (all 4 steps independently)
- Multiple independent slots (modifying one doesn't affect another)
- Type switching clears stale data
- Submission success message appears only after persistence
- Admin login via magic link (neutral response regardless of email)
- Non-admin authenticated user sees unauthorized page
- Admin list with search/filter/sort/pagination via URL
- Phone searchable in admin
- Admin detail shows phone as tel: link
- Status update persists and shows in list
- Notes save with confirmation

## Cross-Client Safety Audit

Target project-owned content ONLY:
- `app/` source files
- `lib/` source files
- `supabase/migrations/`
- tests
- `.env.example`
- documentation files
- project configuration

Do NOT flag:
- `node_modules/` or lockfile references
- Framework/library code
- License files
- Package metadata from dependencies

Search for:
- Email addresses other than `lauren@mocknrollbar.com`
- Domains other than `mocknrolbar.com`
- Package names not in {Signature Experience, Celebration Experience, Premier Experience, Reserve Experience}
- Drink names not in canonical set
- Status values from other projects
- Test data referencing other businesses

## Correctness Properties

1. **Transactional atomicity:** An inquiry either exists completely (with all drink choices and custom mocktails) or not at all.
2. **Package eligibility invariant:** No persisted inquiry violates the package's guest-count rules.
3. **Drink count invariant:** Every persisted inquiry has exactly `allowedDrinkCount` drink choice records for its package.
4. **Choice type integrity:** Signature choices always have `signature_drink_id` + snapshot (enforced by CHECK constraint on `inquiry_drink_choices`); custom choices always have `signature_drink_id` and `signature_drink_name_snapshot` as NULL (enforced by CHECK). The existence of exactly one custom mocktail child per custom drink is guaranteed by: (a) the `create_inquiry()` RPC always creating one, (b) UNIQUE on `drink_choice_id` preventing more than one, (c) the RPC being the sole creation path, (d) transaction atomicity preventing partial states. A CHECK constraint cannot enforce cross-table existence — this is an application+RPC guarantee, not a database constraint.
5. **Reference uniqueness:** Guaranteed by UNIQUE constraint regardless of concurrency.
6. **Slot independence:** Modifying any drink slot produces a new state where only that slot differs.
7. **RLS enforcement:** No public/anonymous query can read from or write to inquiry tables directly.
8. **Phone column consistency:** `phone_search_digits` contains digits only, is derived during trusted server-side phone normalization, is persisted together with `phone_number`, and is never accepted independently from the browser. The public payload contains only `phoneNumber` — the server derives `phoneSearchDigits`.
9. **Secret isolation:** `SUPABASE_SECRET_KEY` and other server secrets never appear in browser-bundled code.
10. **Static /mocktails:** The public mocktails page remains a static informational visualization with no interactive state, no `aria-pressed` controls, and no form submission behavior. It reads ingredient labels from the shared canonical config but provides no selection functionality.
