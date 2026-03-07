
-- Tipo para pessoa física/jurídica
CREATE TYPE public.tipo_pessoa AS ENUM ('pf', 'pj');

-- Tabela principal de clientes
CREATE TABLE public.clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  tipo tipo_pessoa NOT NULL DEFAULT 'pj',
  documento text, -- CPF ou CNPJ
  email text,
  telefone text,
  whatsapp text,
  cidade text,
  estado text,
  aniversario text, -- dia/mês
  tags text[] DEFAULT '{}',
  observacoes text,
  status text NOT NULL DEFAULT 'ativo',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Endereços (entrega, obra, sede)
CREATE TABLE public.cliente_enderecos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  tipo text NOT NULL DEFAULT 'entrega', -- entrega, obra, sede
  logradouro text NOT NULL,
  numero text,
  complemento text,
  bairro text,
  cidade text,
  estado text,
  cep text,
  principal boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Contatos adicionais
CREATE TABLE public.cliente_contatos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  nome text NOT NULL,
  cargo text,
  telefone text,
  email text,
  principal boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Obras vinculadas
CREATE TABLE public.cliente_obras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  nome text NOT NULL,
  endereco text,
  status text NOT NULL DEFAULT 'ativa', -- ativa, concluida, pausada
  rt60_calculado numeric,
  observacoes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS policies para clientes (autenticados podem ver, admins podem tudo)
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cliente_enderecos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cliente_contatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cliente_obras ENABLE ROW LEVEL SECURITY;

-- Clientes: todos autenticados podem ver
CREATE POLICY "Authenticated users can view clientes" ON public.clientes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and vendedores can insert clientes" ON public.clientes
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'vendedor'));

CREATE POLICY "Admins and vendedores can update clientes" ON public.clientes
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'vendedor'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'vendedor'));

CREATE POLICY "Admins can delete clientes" ON public.clientes
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Endereços: mesmas regras do cliente pai
CREATE POLICY "Authenticated can view enderecos" ON public.cliente_enderecos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins/vendedores can manage enderecos" ON public.cliente_enderecos
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'vendedor'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'vendedor'));

-- Contatos
CREATE POLICY "Authenticated can view contatos" ON public.cliente_contatos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins/vendedores can manage contatos" ON public.cliente_contatos
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'vendedor'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'vendedor'));

-- Obras
CREATE POLICY "Authenticated can view obras" ON public.cliente_obras
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins/vendedores can manage obras" ON public.cliente_obras
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'vendedor'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'vendedor'));
