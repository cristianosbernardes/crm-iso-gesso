
-- Tabela de histórico/auditoria de clientes
CREATE TABLE public.cliente_historico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name text,
  tipo text NOT NULL, -- 'edicao', 'criacao', 'exclusao', 'obra_adicionada', 'endereco_adicionado', 'email_enviado', 'whatsapp_enviado', 'compra', 'contato_adicionado', 'status_alterado', 'observacao'
  descricao text NOT NULL,
  detalhes jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.cliente_historico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view historico"
  ON public.cliente_historico FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins/vendedores can insert historico"
  ON public.cliente_historico FOR INSERT
  TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'vendedor'::app_role)
  );

-- Index for fast lookups
CREATE INDEX idx_cliente_historico_cliente_id ON public.cliente_historico(cliente_id);
CREATE INDEX idx_cliente_historico_created_at ON public.cliente_historico(created_at DESC);
