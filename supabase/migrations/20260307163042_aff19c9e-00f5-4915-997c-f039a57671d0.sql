
-- Add new columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS cargo text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'ativo',
  ADD COLUMN IF NOT EXISTS comissao_habilitada boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS comissao_percent numeric(5,2) NOT NULL DEFAULT 0;

-- Allow profiles insert for the trigger
CREATE POLICY "Trigger can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

-- Allow admins to update any profile
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
