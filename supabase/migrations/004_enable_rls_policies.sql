-- =============================================================
-- Migration 004: Enable RLS and create policies
-- =============================================================

-- Enable RLS on all tables
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiry_drink_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiry_custom_mocktails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admin can read all inquiries
CREATE POLICY admin_select_inquiries ON public.contact_inquiries
  FOR SELECT USING (public.is_admin());

-- Admin can update status and admin_notes (RLS authorizes rows, app controls columns)
CREATE POLICY admin_update_inquiries ON public.contact_inquiries
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admin can read all drink choices
CREATE POLICY admin_select_drinks ON public.inquiry_drink_choices
  FOR SELECT USING (public.is_admin());

-- Admin can read all custom mocktails
CREATE POLICY admin_select_custom ON public.inquiry_custom_mocktails
  FOR SELECT USING (public.is_admin());

-- Admin users can read their own record (needed by requireAdmin())
CREATE POLICY admin_read_self ON public.admin_users
  FOR SELECT USING (user_id = auth.uid());

-- No INSERT/UPDATE/DELETE policies for public access
-- Inserts happen through SECURITY DEFINER RPC (service_role only)
-- Deletes are not supported through the app
