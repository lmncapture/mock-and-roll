-- =============================================================
-- Migration 003: Create database functions
-- =============================================================

-- =============================================================
-- 1. is_admin() — checks if current user is in admin_users table
-- =============================================================

CREATE OR REPLACE FUNCTION public.is_admin()
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

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

-- =============================================================
-- 2. generate_inquiry_reference() — MR-{YEAR}-{RANDOM6}
-- =============================================================

CREATE OR REPLACE FUNCTION public.generate_inquiry_reference()
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

REVOKE EXECUTE ON FUNCTION public.generate_inquiry_reference() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.generate_inquiry_reference() TO service_role;

-- =============================================================
-- 3. create_inquiry() — transactional RPC with business-rule validation
-- =============================================================

CREATE OR REPLACE FUNCTION public.create_inquiry(
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
  p_additional_notes text,
  p_drinks jsonb,
  p_source text DEFAULT 'website'
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
  v_pkg_config jsonb;
  v_allowed_drink_count integer;
  v_guest_min integer;
  v_guest_max integer;
  v_drink_count integer;
  v_choice_type text;
  v_sig_id text;
  v_custom jsonb;
  v_base text;
  v_puree text;
  v_syrup text;
  v_garnishes jsonb;
  v_garnish text;
  v_pkg_name text;
  v_pkg_price numeric;
  v_pkg_pricing_mode text;
  v_pkg_price_display text;
BEGIN
  -- =============================================================
  -- VALIDATE INPUTS
  -- =============================================================

  IF p_estimated_guest_count IS NULL OR p_estimated_guest_count <= 0 THEN
    RAISE EXCEPTION 'estimated_guest_count must be a positive integer';
  END IF;

  -- Validate p_drinks structure
  IF p_drinks IS NULL THEN
    RAISE EXCEPTION 'p_drinks must not be null';
  END IF;
  IF jsonb_typeof(p_drinks) != 'array' THEN
    RAISE EXCEPTION 'p_drinks must be a JSON array';
  END IF;
  IF jsonb_array_length(p_drinks) = 0 THEN
    RAISE EXCEPTION 'p_drinks must not be empty';
  END IF;

  -- =============================================================
  -- PACKAGE LOOKUP AND VALIDATION
  -- =============================================================

  SELECT val, name, price, pricing_mode, price_display
  INTO v_pkg_config, v_pkg_name, v_pkg_price, v_pkg_pricing_mode, v_pkg_price_display
  FROM (VALUES
    ('signature-experience'::text,
      jsonb_build_object('drinks', 2, 'guestMin', NULL::integer, 'guestMax', 30),
      'Signature Experience'::text, 550::numeric, 'flat'::text, '$550'::text),
    ('celebration-experience',
      jsonb_build_object('drinks', 2, 'guestMin', 31, 'guestMax', NULL::integer),
      'Celebration Experience', 16, 'per_guest', '$16/person'),
    ('premier-experience',
      jsonb_build_object('drinks', 3, 'guestMin', NULL::integer, 'guestMax', NULL::integer),
      'Premier Experience', 18, 'per_guest', '$18/person'),
    ('reserve-experience',
      jsonb_build_object('drinks', 4, 'guestMin', NULL::integer, 'guestMax', NULL::integer),
      'Reserve Experience', 20, 'per_guest', '$20/person')
  ) AS t(id, val, name, price, pricing_mode, price_display)
  WHERE t.id = p_package_id;

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

  -- =============================================================
  -- VALIDATE EACH DRINK
  -- =============================================================

  FOR v_drink IN SELECT * FROM jsonb_array_elements(p_drinks)
  LOOP
    v_choice_type := v_drink->>'choiceType';

    IF v_choice_type IS NULL OR v_choice_type NOT IN ('signature', 'custom') THEN
      RAISE EXCEPTION 'Invalid choiceType: %', COALESCE(v_choice_type, 'NULL');
    END IF;

    IF v_choice_type = 'signature' THEN
      v_sig_id := v_drink->>'signatureDrinkId';
      IF v_sig_id IS NULL OR v_sig_id = '' THEN
        RAISE EXCEPTION 'Signature drink requires signatureDrinkId';
      END IF;
      IF v_sig_id NOT IN ('hibiscus-blossom', 'ginger-dragon', 'garden-sparkler', 'pineapple-sunrise') THEN
        RAISE EXCEPTION 'Invalid signature drink ID: %', v_sig_id;
      END IF;
    END IF;

    IF v_choice_type = 'custom' THEN
      v_custom := v_drink->'custom';
      IF v_custom IS NULL OR jsonb_typeof(v_custom) != 'object' THEN
        RAISE EXCEPTION 'Custom drink requires a custom object';
      END IF;

      -- Validate base
      v_base := v_custom->>'base';
      IF v_base IS NULL OR v_base = '' THEN
        RAISE EXCEPTION 'Custom drink requires base';
      END IF;
      IF v_base NOT IN ('Lemonade', 'Tea', 'Soda', 'Juice') THEN
        RAISE EXCEPTION 'Invalid base: %', v_base;
      END IF;

      -- Validate puree
      v_puree := v_custom->>'puree';
      IF v_puree IS NULL OR v_puree = '' THEN
        RAISE EXCEPTION 'Custom drink requires puree';
      END IF;
      IF v_puree NOT IN ('Mango', 'Strawberry', 'Raspberry', 'Banana', 'Peach', 'Passionfruit') THEN
        RAISE EXCEPTION 'Invalid puree: %', v_puree;
      END IF;

      -- Validate syrup
      v_syrup := v_custom->>'syrup';
      IF v_syrup IS NULL OR v_syrup = '' THEN
        RAISE EXCEPTION 'Custom drink requires syrup';
      END IF;
      IF v_syrup NOT IN ('Rose', 'Lavender', 'Mint', 'Vanilla', 'Dragonfruit') THEN
        RAISE EXCEPTION 'Invalid syrup: %', v_syrup;
      END IF;

      -- Validate garnishes (optional but must be valid when present)
      v_garnishes := v_custom->'garnishes';
      IF v_garnishes IS NOT NULL AND jsonb_typeof(v_garnishes) != 'array' THEN
        RAISE EXCEPTION 'Garnishes must be an array';
      END IF;
      IF v_garnishes IS NOT NULL AND jsonb_array_length(v_garnishes) > 0 THEN
        FOR v_garnish IN SELECT * FROM jsonb_array_elements_text(v_garnishes)
        LOOP
          IF v_garnish NOT IN ('Dried Fruit', 'Flowers', 'Coconut Shreds', 'Fresh Fruit', 'Candied Ginger', 'Herbs', 'Glitter') THEN
            RAISE EXCEPTION 'Invalid garnish: %', v_garnish;
          END IF;
        END LOOP;
      END IF;
    END IF;
  END LOOP;

  -- =============================================================
  -- CREATE INQUIRY
  -- =============================================================

  v_reference := public.generate_inquiry_reference();

  INSERT INTO public.contact_inquiries (
    reference, first_name, last_name, email, phone_number, phone_search_digits,
    event_date, event_type, event_type_other, estimated_guest_count,
    event_location, event_time, package_id,
    package_name_snapshot, package_price_snapshot,
    package_pricing_mode_snapshot, package_price_display_snapshot,
    additional_notes, status, source
  ) VALUES (
    v_reference, p_first_name, p_last_name, p_email, p_phone_number, p_phone_search_digits,
    p_event_date, p_event_type, p_event_type_other, p_estimated_guest_count,
    p_event_location, p_event_time, p_package_id,
    v_pkg_name, v_pkg_price, v_pkg_pricing_mode, v_pkg_price_display,
    p_additional_notes, 'new', p_source
  ) RETURNING id INTO v_inquiry_id;

  -- =============================================================
  -- CREATE DRINK CHOICES
  -- =============================================================

  v_position := 1;
  FOR v_drink IN SELECT * FROM jsonb_array_elements(p_drinks)
  LOOP
    v_choice_type := v_drink->>'choiceType';

    INSERT INTO public.inquiry_drink_choices (
      inquiry_id, position, choice_type,
      signature_drink_id, signature_drink_name_snapshot
    ) VALUES (
      v_inquiry_id,
      v_position,
      v_choice_type,
      CASE WHEN v_choice_type = 'signature' THEN v_drink->>'signatureDrinkId' ELSE NULL END,
      CASE WHEN v_choice_type = 'signature' THEN v_drink->>'signatureDrinkNameSnapshot' ELSE NULL END
    ) RETURNING id INTO v_drink_choice_id;

    IF v_choice_type = 'custom' THEN
      v_custom := v_drink->'custom';
      INSERT INTO public.inquiry_custom_mocktails (
        drink_choice_id, base, puree, syrup, garnishes
      ) VALUES (
        v_drink_choice_id,
        v_custom->>'base',
        v_custom->>'puree',
        v_custom->>'syrup',
        COALESCE(
          ARRAY(SELECT jsonb_array_elements_text(v_custom->'garnishes')),
          '{}'::text[]
        )
      );
    END IF;

    v_position := v_position + 1;
  END LOOP;

  RETURN jsonb_build_object('id', v_inquiry_id, 'reference', v_reference);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_inquiry FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_inquiry TO service_role;

-- =============================================================
-- 4. search_inquiries() — admin search with dynamic ORDER BY
-- =============================================================

CREATE OR REPLACE FUNCTION public.search_inquiries(
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
          v_search_pattern, v_search_digits, v_page_size, v_offset;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.search_inquiries FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.search_inquiries TO authenticated, service_role;
