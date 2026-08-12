# Design Addendum: Pre-Implementation Improvements

This addendum is authoritative and supersedes the corresponding sections in `design.md`. All other sections of the design remain unchanged.

## 1. Strengthened Database Defense-in-Depth (RPC Business Rules)

The `create_inquiry()` RPC now validates critical business invariants IN ADDITION to API-layer validation. This ensures no future API, script, or data import can bypass core rules.

### Updated `create_inquiry()` RPC

Add the following validation block at the start of the function body (before any INSERT):

```sql
-- =============================================================
-- DATABASE-LEVEL BUSINESS RULE VALIDATION
-- =============================================================
DECLARE
  v_pkg_config jsonb;
  v_allowed_drink_count integer;
  v_guest_min integer;
  v_guest_max integer;
  v_drink_count integer;
  v_choice_type text;
  v_sig_id text;
  -- ... existing declares ...
BEGIN
  -- Package lookup table (embedded canonical config)
  -- This mirrors lib/config/packages.ts — kept minimal for DB validation
  v_pkg_config := (
    SELECT val FROM (VALUES
      ('signature-experience'::text, jsonb_build_object('drinks', 2, 'guestMin', NULL, 'guestMax', 30)),
      ('celebration-experience', jsonb_build_object('drinks', 2, 'guestMin', 31, 'guestMax', NULL)),
      ('premier-experience', jsonb_build_object('drinks', 3, 'guestMin', NULL, 'guestMax', NULL)),
      ('reserve-experience', jsonb_build_object('drinks', 4, 'guestMin', NULL, 'guestMax', NULL))
    ) AS t(id, val)
    WHERE t.id = p_package_id
  );

  IF v_pkg_config IS NULL THEN
    RAISE EXCEPTION 'Invalid package_id: %', p_package_id;
  END IF;

  -- Package eligibility vs guest count
  v_guest_min := (v_pkg_config->>'guestMin')::integer;
  v_guest_max := (v_pkg_config->>'guestMax')::integer;

  IF v_guest_min IS NOT NULL AND p_estimated_guest_count < v_guest_min THEN
    RAISE EXCEPTION 'Guest count % is below minimum % for package %',
      p_estimated_guest_count, v_guest_min, p_package_id;
  END IF;
  IF v_guest_max IS NOT NULL AND p_estimated_guest_count > v_guest_max THEN
    RAISE EXCEPTION 'Guest count % exceeds maximum % for package %',
      p_estimated_guest_count, v_guest_max, p_package_id;
  END IF;

  -- Drink count must match package
  v_allowed_drink_count := (v_pkg_config->>'drinks')::integer;
  v_drink_count := jsonb_array_length(p_drinks);

  IF v_drink_count != v_allowed_drink_count THEN
    RAISE EXCEPTION 'Expected % drinks for package %, got %',
      v_allowed_drink_count, p_package_id, v_drink_count;
  END IF;

  -- Validate each drink structure
  FOR v_drink IN SELECT * FROM jsonb_array_elements(p_drinks)
  LOOP
    v_choice_type := v_drink->>'choiceType';

    IF v_choice_type NOT IN ('signature', 'custom') THEN
      RAISE EXCEPTION 'Invalid choiceType: %', v_choice_type;
    END IF;

    IF v_choice_type = 'signature' THEN
      v_sig_id := v_drink->>'signatureDrinkId';
      IF v_sig_id IS NULL OR v_sig_id = '' THEN
        RAISE EXCEPTION 'Signature drink requires signatureDrinkId';
      END IF;
      -- Validate against canonical signature drinks
      IF v_sig_id NOT IN ('hibiscus-blossom', 'ginger-dragon', 'garden-sparkler', 'pineapple-sunrise') THEN
        RAISE EXCEPTION 'Invalid signature drink ID: %', v_sig_id;
      END IF;
    END IF;

    IF v_choice_type = 'custom' THEN
      IF v_drink->'custom' IS NULL THEN
        RAISE EXCEPTION 'Custom drink requires custom object';
      END IF;
      IF (v_drink->'custom'->>'base') IS NULL OR (v_drink->'custom'->>'base') = '' THEN
        RAISE EXCEPTION 'Custom drink requires base';
      END IF;
      IF (v_drink->'custom'->>'puree') IS NULL OR (v_drink->'custom'->>'puree') = '' THEN
        RAISE EXCEPTION 'Custom drink requires puree';
      END IF;
      IF (v_drink->'custom'->>'syrup') IS NULL OR (v_drink->'custom'->>'syrup') = '' THEN
        RAISE EXCEPTION 'Custom drink requires syrup';
      END IF;
    END IF;
  END LOOP;

  -- ... existing INSERT logic follows ...
```

**Design principle:** The API validates everything for UX feedback. The database validates independently for integrity — so no future caller can bypass core invariants.

## 2. Improved Search RPC (Dynamic SQL ORDER BY)

Replace the CASE-based ORDER BY with safe dynamic SQL using `format()` and validated identifiers:

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
  id uuid, reference text, created_at timestamptz, updated_at timestamptz,
  first_name text, last_name text, email text, phone_number text,
  phone_search_digits text, event_date date, event_type text,
  event_type_other text, estimated_guest_count integer,
  event_location text, event_time time, package_id text,
  package_name_snapshot text, package_price_snapshot numeric,
  package_pricing_mode_snapshot text, package_price_display_snapshot text,
  additional_notes text, status text, admin_notes text,
  source text, total_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_offset integer;
  v_search_pattern text;
  v_search_digits text;
  v_sort_column text;
  v_sort_direction text;
  v_query text;
BEGIN
  -- Whitelist sort column
  IF p_sort = 'event_date' THEN
    v_sort_column := 'ci.event_date';
  ELSE
    v_sort_column := 'ci.created_at';
  END IF;

  -- Whitelist sort direction
  IF p_direction = 'asc' THEN
    v_sort_direction := 'ASC';
  ELSE
    v_sort_direction := 'DESC';
  END IF;

  v_offset := (GREATEST(p_page, 1) - 1) * p_page_size;
  v_search_pattern := CASE WHEN p_search IS NOT NULL AND p_search != ''
    THEN '%' || p_search || '%' ELSE NULL END;
  v_search_digits := CASE WHEN p_search IS NOT NULL AND p_search != ''
    THEN regexp_replace(p_search, '\D', '', 'g') ELSE NULL END;

  v_query := format(
    'SELECT
      ci.id, ci.reference, ci.created_at, ci.updated_at,
      ci.first_name, ci.last_name, ci.email, ci.phone_number,
      ci.phone_search_digits, ci.event_date, ci.event_type,
      ci.event_type_other, ci.estimated_guest_count,
      ci.event_location, ci.event_time, ci.package_id,
      ci.package_name_snapshot, ci.package_price_snapshot,
      ci.package_pricing_mode_snapshot, ci.package_price_display_snapshot,
      ci.additional_notes, ci.status, ci.admin_notes,
      ci.source,
      COUNT(*) OVER() AS total_count
    FROM public.contact_inquiries ci
    WHERE
      ($1 IS NULL OR ci.status = $1)
      AND ($2 IS NULL OR ci.event_type = $2)
      AND ($3 IS NULL OR ci.package_id = $3)
      AND ($4 IS NULL OR ci.event_date = $4)
      AND (
        $5 IS NULL
        OR ci.first_name ILIKE $5
        OR ci.last_name ILIKE $5
        OR ci.email ILIKE $5
        OR ci.event_location ILIKE $5
        OR ci.reference ILIKE $5
        OR (length($6) >= 3 AND ci.phone_search_digits ILIKE ''%%'' || $6 || ''%%'')
      )
    ORDER BY %s %s
    LIMIT $7 OFFSET $8',
    v_sort_column, v_sort_direction
  );

  RETURN QUERY EXECUTE v_query
    USING p_status, p_event_type, p_package_id, p_event_date,
          v_search_pattern, v_search_digits, p_page_size, v_offset;
END;
$$;

REVOKE EXECUTE ON FUNCTION search_inquiries FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION search_inquiries TO authenticated, service_role;
```

**Key improvements:**
- ORDER BY uses `format()` with whitelisted identifiers — PostgreSQL can use indexes
- No CASE expressions in ORDER BY (which prevent index usage)
- Search now includes `ci.reference ILIKE` for inquiry reference matching (case insensitive)
- Returns new snapshot columns and `source`

## 3. Expanded Admin Search

The search RPC now matches against:
- first_name
- last_name
- email
- event_location
- phone_search_digits (digits ≥3)
- **reference** (case-insensitive ILIKE)

Reference searches like "MR-2026" or "mr-2026-abc" will find matching inquiries.

## 4. Additional Package Snapshot Fields

### Schema Change: `contact_inquiries`

Add three new columns:

| Column | Type | Constraints |
|--------|------|-------------|
| package_price_snapshot | numeric | NOT NULL |
| package_pricing_mode_snapshot | text | NOT NULL, CHECK IN ('flat', 'per_guest') |
| package_price_display_snapshot | text | NOT NULL |

These are populated server-side from canonical configuration at submission time. Never trust client values.

### API Route Change

```typescript
const pkg = getPackageById(validated.packageId)!;
const packageNameSnapshot = pkg.name;
const packagePriceSnapshot = pkg.price;
const packagePricingModeSnapshot = pkg.pricingMode;
const packagePriceDisplaySnapshot = pkg.priceDisplay;
```

### RPC Change

Add parameters:
```sql
p_package_price_snapshot numeric,
p_package_pricing_mode_snapshot text,
p_package_price_display_snapshot text,
```

### Admin Detail Display

Show package pricing context alongside the package name in the inquiry detail view.

### Notification Email

Include package pricing in the Package section of the notification.

## 5. Inquiry Source Column

### Schema Change: `contact_inquiries`

| Column | Type | Constraints |
|--------|------|-------------|
| source | text | NOT NULL, default 'website' |

### Design Intent

For v1, all inquiries from the public form use `source = 'website'`. The column is designed to later support:
- `utm_source` values
- `google_ads`
- `qr_code`
- `referral`
- `instagram`
- Custom campaign identifiers

No schema migration needed for future source values — the column accepts any text. The default ensures existing code doesn't need to supply a value unless tracking a specific source.

### API Route

The API route sets `source: 'website'` when building the RPC payload. Future iterations can extract UTM parameters from the request or form state.

### RPC Change

Add parameter: `p_source text DEFAULT 'website'`

## 6. Consistent Timezone Formatting

All date/time rendering must use `BUSINESS_TIMEZONE` from `lib/config/timezone.ts`:

```typescript
import { BUSINESS_TIMEZONE } from '@/lib/config/timezone';

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: BUSINESS_TIMEZONE,
    year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date(date));
}

export function formatTime(time: string): string {
  // Format HH:MM in business timezone context
  const [h, m] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(h), parseInt(m));
  return new Intl.DateTimeFormat('en-US', {
    timeZone: BUSINESS_TIMEZONE,
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(date);
}
```

Used in:
- Admin inquiry list (event date, submitted date)
- Admin inquiry detail (all dates/times)
- Notification email (event date, event time, submitted timestamp)
- Success confirmation (if date/time is referenced)
- Event date validation (determining "today")

### New File: `lib/utils/format.ts`

Centralizes all date/time formatting using the business timezone constant.

## 7. Improved Pagination Response

The server returns a structured pagination object instead of requiring clients to compute total pages:

```typescript
interface PaginationResult {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// Server-side computation:
const totalCount = results[0]?.total_count ?? 0;
const totalPages = Math.ceil(totalCount / PAGE_SIZE);
const currentPage = params.page;

return {
  inquiries: results.map(/* ... */),
  pagination: { totalCount, totalPages, currentPage, pageSize: PAGE_SIZE },
};
```

The `Pagination` component receives `totalPages` and `currentPage` directly — no computation needed.

## 8. Future-Proof Admin Notes Schema

### Schema Change: `contact_inquiries`

Add two nullable columns for future edit tracking:

| Column | Type | Constraints |
|--------|------|-------------|
| admin_notes_updated_by | uuid | nullable, FK → auth.users(id) ON DELETE SET NULL |
| admin_notes_updated_at | timestamptz | nullable |

These are NOT populated in v1 — they remain NULL. The schema is forward-compatible so that a future implementation can track who last edited notes without a migration that rewrites existing data.

### Admin Notes Mutation (v1 behavior)

The current `updateAdminNotes` server action updates `admin_notes` only. It does NOT yet populate `admin_notes_updated_by` or `admin_notes_updated_at`. These columns exist only to prevent a future schema migration from being needed.

**Future implementation (not v1):** Populate `admin_notes_updated_by = auth.uid()` and `admin_notes_updated_at = now()` when notes are saved. Display "Last edited by [name] at [time]" in the admin UI.

---

## Complete Impact Analysis

### Migration Changes

| Migration | Change |
|-----------|--------|
| 001_create_inquiry_tables.sql | Add `package_price_snapshot`, `package_pricing_mode_snapshot`, `package_price_display_snapshot`, `source`, `admin_notes_updated_by`, `admin_notes_updated_at` columns. Add `idx_inquiries_reference` index. |
| 003_create_functions.sql | Rewrite `create_inquiry()` with business-rule validation block. Rewrite `search_inquiries()` with dynamic SQL ORDER BY, reference search, and new columns. |

### Schema Changes

| Table | New Columns |
|-------|-------------|
| contact_inquiries | `package_price_snapshot numeric NOT NULL`, `package_pricing_mode_snapshot text NOT NULL`, `package_price_display_snapshot text NOT NULL`, `source text NOT NULL DEFAULT 'website'`, `admin_notes_updated_by uuid NULLABLE FK → auth.users`, `admin_notes_updated_at timestamptz NULLABLE` |

### TypeScript Type Changes

| Type/Interface | Change |
|----------------|--------|
| Inquiry payload (API request) | No change (snapshots are server-derived) |
| RPC parameters | Add `p_package_price_snapshot`, `p_package_pricing_mode_snapshot`, `p_package_price_display_snapshot`, `p_source` |
| Admin list response | Add `packagePriceSnapshot`, `packagePricingModeSnapshot`, `packagePriceDisplaySnapshot`, `source` |
| Admin detail type | Same additions + `adminNotesUpdatedBy`, `adminNotesUpdatedAt` (nullable) |
| Pagination response | Add `PaginationResult` type with `totalCount`, `totalPages`, `currentPage`, `pageSize` |
| `lib/utils/format.ts` | New module: `formatDate()`, `formatTime()`, `formatDateTime()` |

### API Changes

| Endpoint | Change |
|----------|--------|
| POST /api/inquiries | Derive and pass 3 new package snapshot fields + `source` to RPC |

### RPC Changes

| Function | Change |
|----------|--------|
| `create_inquiry()` | Add business-rule validation block. Accept 4 new parameters. |
| `search_inquiries()` | Rewrite with dynamic SQL ORDER BY. Add reference to search. Return new columns. |

### UI Changes

| Component | Change |
|-----------|--------|
| Admin inquiry detail | Display package price info. Show `source` field. |
| Admin inquiry list | Pagination component receives `totalPages`/`currentPage` directly. |
| All date displays | Use `formatDate()`/`formatTime()` from `lib/utils/format.ts` |
| Notification email | Include package pricing. Use consistent timezone formatting. |

### Tests to Add/Update

| Test Area | Change |
|-----------|--------|
| RPC business rules | Test: invalid package_id rejected, guest-count eligibility enforced, drink-count mismatch rejected, invalid signature drink ID rejected, custom drink missing base/puree/syrup rejected |
| Search RPC | Test: reference search finds by prefix, case-insensitive reference match |
| Package snapshots | Test: price/mode/display persisted correctly from canonical config |
| Source column | Test: defaults to 'website', persists correctly |
| Pagination | Test: server returns totalPages/totalCount/currentPage correctly |
| Timezone formatting | Test: dates formatted consistently using BUSINESS_TIMEZONE |

### Backward Compatibility Concerns

| Concern | Mitigation |
|---------|------------|
| New NOT NULL columns require values at creation | `source` has DEFAULT 'website'. Package snapshot fields are always derived server-side — no existing rows need backfilling (this is a fresh schema). |
| `admin_notes_updated_by` / `admin_notes_updated_at` are nullable | No impact on existing writes — they default to NULL. |
| Dynamic SQL in search RPC | Only whitelisted column names are injected via `format()` — no user input in identifiers. |
| RPC now rejects invalid data that previously would have been caught by API only | If the API is working correctly, this is transparent. Only catches bugs/bypasses. |

---

## Items NOT Changed (per instruction 9)

- RLS architecture
- Supabase client separation
- Server-only environment strategy
- Package eligibility rules (Signature ≤30, Celebration >30, Premier/Reserve unrestricted)
- Phone normalization strategy (3-tier, E.164 preferred)
- Transactional RPC architecture (atomic, SECURITY DEFINER)
- Static /mocktails behavior
- URL-driven admin dashboard
- Drink builder UX (independent slots, signature/custom toggle)
- Package-change UX (deterministic, no silent deletion)
- Canonical configuration modules
- proxy.ts session refresh pattern
- requireAdmin() with unauthorized page
- Anti-spam approach
- CTA routing decisions
- Duplicate submission prevention
- Cross-client safety audit
