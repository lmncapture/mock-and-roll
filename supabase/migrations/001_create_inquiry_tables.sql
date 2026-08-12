-- =============================================================
-- Migration 001: Create inquiry tables
-- =============================================================

-- 1. contact_inquiries table
CREATE TABLE public.contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone_number text NOT NULL,
  phone_search_digits text NOT NULL,
  event_date date NOT NULL,
  event_type text NOT NULL,
  event_type_other text,
  estimated_guest_count integer NOT NULL CHECK (estimated_guest_count > 0),
  event_location text NOT NULL,
  event_time time NOT NULL,
  package_id text NOT NULL,
  package_name_snapshot text NOT NULL,
  package_price_snapshot numeric NOT NULL,
  package_pricing_mode_snapshot text NOT NULL CHECK (package_pricing_mode_snapshot IN ('flat', 'per_guest')),
  package_price_display_snapshot text NOT NULL,
  additional_notes text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_discussion', 'booked', 'closed')),
  admin_notes text,
  admin_notes_updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_notes_updated_at timestamptz,
  source text NOT NULL DEFAULT 'website'
);

-- 2. Indexes
CREATE INDEX idx_inquiries_status ON public.contact_inquiries (status);
CREATE INDEX idx_inquiries_event_date ON public.contact_inquiries (event_date);
CREATE INDEX idx_inquiries_created_at ON public.contact_inquiries (created_at DESC);
CREATE INDEX idx_inquiries_phone_search ON public.contact_inquiries (phone_search_digits);
CREATE INDEX idx_inquiries_reference ON public.contact_inquiries (reference);

-- 3. inquiry_drink_choices table
CREATE TABLE public.inquiry_drink_choices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id uuid NOT NULL REFERENCES public.contact_inquiries(id) ON DELETE CASCADE,
  position integer NOT NULL,
  choice_type text NOT NULL CHECK (choice_type IN ('signature', 'custom')),
  signature_drink_id text,
  signature_drink_name_snapshot text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (inquiry_id, position),
  CONSTRAINT chk_signature_complete CHECK (
    choice_type != 'signature' OR (signature_drink_id IS NOT NULL AND signature_drink_name_snapshot IS NOT NULL)
  ),
  CONSTRAINT chk_custom_no_signature CHECK (
    choice_type != 'custom' OR (signature_drink_id IS NULL AND signature_drink_name_snapshot IS NULL)
  )
);

-- 4. inquiry_custom_mocktails table
CREATE TABLE public.inquiry_custom_mocktails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drink_choice_id uuid NOT NULL UNIQUE REFERENCES public.inquiry_drink_choices(id) ON DELETE CASCADE,
  base text NOT NULL,
  puree text NOT NULL,
  syrup text NOT NULL,
  garnishes text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
