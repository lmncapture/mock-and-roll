-- =============================================================
-- Migration 006: Update search_inquiries to support date range
-- =============================================================

-- Drop the old function signature first
DROP FUNCTION IF EXISTS public.search_inquiries(text, text, text, text, date, text, text, integer, integer);

CREATE OR REPLACE FUNCTION public.search_inquiries(
  p_search text DEFAULT NULL,
  p_status text DEFAULT NULL,
  p_event_type text DEFAULT NULL,
  p_package_id text DEFAULT NULL,
  p_event_date_from date DEFAULT NULL,
  p_event_date_to date DEFAULT NULL,
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
  v_page_size integer;
  v_search_pattern text;
  v_search_digits text;
  v_sort_column text;
  v_sort_direction text;
  v_query text;
BEGIN
  -- Bound page size
  v_page_size := LEAST(GREATEST(p_page_size, 1), 100);
  v_offset := (GREATEST(p_page, 1) - 1) * v_page_size;

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
      AND ($4 IS NULL OR ci.event_date >= $4)
      AND ($5 IS NULL OR ci.event_date <= $5)
      AND (
        $6 IS NULL
        OR ci.first_name ILIKE $6
        OR ci.last_name ILIKE $6
        OR ci.email ILIKE $6
        OR ci.event_location ILIKE $6
        OR ci.reference ILIKE $6
        OR (length($7) >= 3 AND ci.phone_search_digits ILIKE ''%%'' || $7 || ''%%'')
      )
    ORDER BY %s %s
    LIMIT $8 OFFSET $9',
    v_sort_column, v_sort_direction
  );

  RETURN QUERY EXECUTE v_query
    USING p_status, p_event_type, p_package_id, p_event_date_from,
          p_event_date_to, v_search_pattern, v_search_digits,
          v_page_size, v_offset;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.search_inquiries(text, text, text, text, date, date, text, text, integer, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.search_inquiries(text, text, text, text, date, date, text, text, integer, integer) TO authenticated, service_role;
