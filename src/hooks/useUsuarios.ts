import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface UsuarioProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  cargo: string | null;
  status: string;
  comissao_habilitada: boolean;
  comissao_percent: number;
  avatar_url: string | null;
  created_at: string;
  role: string;
}

export function useUsuarios() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["usuarios"],
    queryFn: async (): Promise<UsuarioProfile[]> => {
      // Fetch profiles
      const { data: profiles, error: pError } = await supabase
        .from("profiles")
        .select("*");
      if (pError) throw pError;

      // Fetch all roles
      const { data: roles, error: rError } = await supabase
        .from("user_roles")
        .select("*");
      if (rError) throw rError;

      const roleMap = new Map<string, string>();
      roles?.forEach((r) => roleMap.set(r.user_id, r.role));

      return (profiles || []).map((p) => ({
        id: p.id,
        email: p.email,
        full_name: p.full_name,
        phone: (p as any).phone || null,
        cargo: (p as any).cargo || null,
        status: (p as any).status || "ativo",
        comissao_habilitada: (p as any).comissao_habilitada || false,
        comissao_percent: (p as any).comissao_percent || 0,
        avatar_url: p.avatar_url,
        created_at: p.created_at,
        role: roleMap.get(p.id) || "tecnico",
      }));
    },
  });

  const createUser = useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      full_name: string;
      phone?: string;
      cargo?: string;
      role: string;
    }) => {
      const { data: result, error } = await supabase.functions.invoke("create-user", {
        body: data,
      });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast({ title: "Colaborador criado com sucesso" });
    },
    onError: (err: any) => {
      toast({ title: "Erro ao criar colaborador", description: err.message, variant: "destructive" });
    },
  });

  const updateProfile = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Record<string, unknown>) => {
      const { error } = await supabase
        .from("profiles")
        .update(data as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
    onError: (err: any) => {
      toast({ title: "Erro ao atualizar", description: err.message, variant: "destructive" });
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      // Delete existing role then insert new one
      const { error: delError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);
      if (delError) throw delError;

      const { error: insError } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: role as any });
      if (insError) throw insError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast({ title: "Cargo atualizado" });
    },
    onError: (err: any) => {
      toast({ title: "Erro ao atualizar cargo", description: err.message, variant: "destructive" });
    },
  });

  return { ...query, createUser, updateProfile, updateRole };
}
