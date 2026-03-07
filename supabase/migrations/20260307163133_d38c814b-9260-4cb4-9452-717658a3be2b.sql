
-- Fix: Replace overly permissive INSERT policy with admin-only
DROP POLICY IF EXISTS "Trigger can insert profiles" ON public.profiles;

CREATE POLICY "Admins can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
