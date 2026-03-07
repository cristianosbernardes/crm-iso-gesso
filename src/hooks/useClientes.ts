import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Cliente {
  id: string;
  nome: string;
  tipo: "pf" | "pj";
  documento: string | null;
  email: string | null;
  telefone: string | null;
  whatsapp: string | null;
  cidade: string | null;
  estado: string | null;
  aniversario: string | null;
  tags: string[];
  observacoes: string | null;
  status: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClienteObra {
  id: string;
  cliente_id: string;
  nome: string;
  endereco: string | null;
  status: string;
  rt60_calculado: number | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClienteEndereco {
  id: string;
  cliente_id: string;
  tipo: string;
  logradouro: string;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  principal: boolean | null;
  created_at: string;
}

export interface ClienteContato {
  id: string;
  cliente_id: string;
  nome: string;
  cargo: string | null;
  telefone: string | null;
  email: string | null;
  principal: boolean | null;
  created_at: string;
}

export type ClienteComRelacoes = Cliente & {
  obras: ClienteObra[];
  enderecos: ClienteEndereco[];
  contatos: ClienteContato[];
};

export function useClientes() {
  const qc = useQueryClient();

  const clientesQuery = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("nome");
      if (error) throw error;
      return (data || []) as Cliente[];
    },
  });

  const obrasQuery = useQuery({
    queryKey: ["cliente_obras"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cliente_obras")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as ClienteObra[];
    },
  });

  const enderecosQuery = useQuery({
    queryKey: ["cliente_enderecos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cliente_enderecos")
        .select("*")
        .order("created_at");
      if (error) throw error;
      return (data || []) as ClienteEndereco[];
    },
  });

  const contatosQuery = useQuery({
    queryKey: ["cliente_contatos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cliente_contatos")
        .select("*")
        .order("created_at");
      if (error) throw error;
      return (data || []) as ClienteContato[];
    },
  });

  // Combine data
  const clientesComRelacoes: ClienteComRelacoes[] = (clientesQuery.data || []).map((c) => ({
    ...c,
    obras: (obrasQuery.data || []).filter((o) => o.cliente_id === c.id),
    enderecos: (enderecosQuery.data || []).filter((e) => e.cliente_id === c.id),
    contatos: (contatosQuery.data || []).filter((ct) => ct.cliente_id === c.id),
  }));

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["clientes"] });
    qc.invalidateQueries({ queryKey: ["cliente_obras"] });
    qc.invalidateQueries({ queryKey: ["cliente_enderecos"] });
    qc.invalidateQueries({ queryKey: ["cliente_contatos"] });
  };

  const createCliente = useMutation({
    mutationFn: async (input: {
      nome: string;
      tipo: "pf" | "pj";
      documento?: string;
      email?: string;
      telefone?: string;
      whatsapp?: string;
      cidade?: string;
      estado?: string;
      aniversario?: string;
      tags?: string[];
      observacoes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("clientes")
        .insert({ ...input, created_by: user?.id })
        .select()
        .single();
      if (error) throw error;
      return data as Cliente;
    },
    onSuccess: () => {
      invalidateAll();
      toast.success("Cliente cadastrado com sucesso!");
    },
    onError: (e: Error) => toast.error("Erro ao cadastrar cliente: " + e.message),
  });

  const updateCliente = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Cliente> & { id: string }) => {
      const { error } = await supabase
        .from("clientes")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateAll();
      toast.success("Cliente atualizado!");
    },
    onError: (e: Error) => toast.error("Erro: " + e.message),
  });

  const createObra = useMutation({
    mutationFn: async (input: { cliente_id: string; nome: string; endereco?: string; status?: string }) => {
      const { error } = await supabase.from("cliente_obras").insert(input);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateAll();
      toast.success("Obra adicionada!");
    },
    onError: (e: Error) => toast.error("Erro: " + e.message),
  });

  const updateObra = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ClienteObra> & { id: string }) => {
      const { error } = await supabase.from("cliente_obras").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => invalidateAll(),
    onError: (e: Error) => toast.error("Erro: " + e.message),
  });

  const createEndereco = useMutation({
    mutationFn: async (input: { cliente_id: string; tipo: string; logradouro: string; numero?: string; bairro?: string; cidade?: string; estado?: string; cep?: string }) => {
      const { error } = await supabase.from("cliente_enderecos").insert(input);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateAll();
      toast.success("Endereço adicionado!");
    },
    onError: (e: Error) => toast.error("Erro: " + e.message),
  });

  return {
    clientes: clientesComRelacoes,
    isLoading: clientesQuery.isLoading,
    createCliente,
    updateCliente,
    createObra,
    updateObra,
    createEndereco,
    invalidateAll,
  };
}
