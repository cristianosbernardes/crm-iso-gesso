import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Briefcase, Plus, Pencil, Trash2, ArrowLeft, Loader2, Target } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Cargo {
  id: string;
  nome: string;
  padrao: boolean;
  comissao_percent: number;
  meta_bonus: number | null;
  bonus_percent: number | null;
  created_at: string;
  updated_at: string;
}

const GestorCargos = () => {
  const qc = useQueryClient();
  const [editingCargo, setEditingCargo] = useState<Cargo | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ nome: "", comissao_percent: "", meta_bonus: "", bonus_percent: "" });

  const { data: cargos = [], isLoading } = useQuery({
    queryKey: ["cargos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cargos" as any)
        .select("*")
        .order("nome");
      if (error) throw error;
      return (data || []) as unknown as Cargo[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (input: { id?: string; nome: string; comissao_percent: number; meta_bonus: number | null; bonus_percent: number | null }) => {
      if (input.id) {
        const { error } = await supabase.from("cargos" as any).update({
          nome: input.nome,
          comissao_percent: input.comissao_percent,
          meta_bonus: input.meta_bonus,
          bonus_percent: input.bonus_percent,
          updated_at: new Date().toISOString(),
        } as any).eq("id", input.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cargos" as any).insert({
          nome: input.nome,
          comissao_percent: input.comissao_percent,
          meta_bonus: input.meta_bonus,
          bonus_percent: input.bonus_percent,
        } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cargos"] });
      toast.success(editingCargo ? "Cargo atualizado!" : "Cargo criado!");
      resetForm();
    },
    onError: (e: Error) => toast.error("Erro: " + e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cargos" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cargos"] });
      toast.success("Cargo excluído!");
    },
    onError: (e: Error) => toast.error("Erro: " + e.message),
  });

  const resetForm = () => {
    setForm({ nome: "", comissao_percent: "", meta_bonus: "", bonus_percent: "" });
    setEditingCargo(null);
    setCreating(false);
  };

  const handleEdit = (c: Cargo) => {
    setEditingCargo(c);
    setCreating(true);
    setForm({
      nome: c.nome,
      comissao_percent: String(c.comissao_percent),
      meta_bonus: c.meta_bonus != null ? String(c.meta_bonus) : "",
      bonus_percent: c.bonus_percent != null ? String(c.bonus_percent) : "",
    });
  };

  const handleSave = () => {
    if (!form.nome.trim()) {
      toast.error("Nome do cargo é obrigatório");
      return;
    }
    saveMutation.mutate({
      id: editingCargo?.id,
      nome: form.nome.trim(),
      comissao_percent: parseFloat(form.comissao_percent) || 0,
      meta_bonus: form.meta_bonus ? parseFloat(form.meta_bonus) : null,
      bonus_percent: form.bonus_percent ? parseFloat(form.bonus_percent) : null,
    });
  };

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Form view
  if (creating) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Gestão de Cargos
            </CardTitle>
            <p className="text-sm text-muted-foreground">Crie e gerencie os cargos disponíveis para sua equipe.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Nome do Cargo</Label>
              <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Vendedor Jr." />
            </div>

            <div className="max-w-sm">
              <Label>% Comissão (%)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={form.comissao_percent}
                onChange={(e) => setForm({ ...form, comissao_percent: e.target.value })}
                placeholder="0"
              />
            </div>

            <Card className="border-dashed">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium text-foreground">Regra de Bônus (Opcional)</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Meta para Bônus (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.meta_bonus}
                      onChange={(e) => setForm({ ...form, meta_bonus: e.target.value })}
                      placeholder="100000"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">Valor em vendas para ativar o bônus</p>
                  </div>
                  <div>
                    <Label>Bônus Adicional (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.bonus_percent}
                      onChange={(e) => setForm({ ...form, bonus_percent: e.target.value })}
                      placeholder="0,2"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">Percentual extra sobre a comissão</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" className="gap-1.5" onClick={resetForm}>
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
              <div className="flex gap-2">
                {editingCargo && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="gap-1.5 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" /> Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir cargo?</AlertDialogTitle>
                        <AlertDialogDescription>
                          O cargo <strong>{editingCargo.nome}</strong> será removido permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => { deleteMutation.mutate(editingCargo.id); resetForm(); }}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <Button className="gap-1.5" onClick={handleSave} disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingCargo ? "Salvar Cargo" : "Criar Cargo"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Gestão de Cargos
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Crie e gerencie os cargos disponíveis para sua equipe.</p>
            </div>
            <Button className="gap-2" onClick={() => { resetForm(); setCreating(true); }}>
              <Plus className="h-4 w-4" /> Novo Cargo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando...
            </div>
          ) : cargos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Briefcase className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-sm">Nenhum cargo cadastrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cargo</TableHead>
                  <TableHead className="text-center">Comissão</TableHead>
                  <TableHead className="text-right">Meta / Bônus</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cargos.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{c.nome}</span>
                        {c.padrao && <Badge variant="outline" className="text-[10px]">Padrão</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm">{c.comissao_percent}%</TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {c.meta_bonus != null && c.bonus_percent != null
                        ? `+${c.bonus_percent}% acima de ${formatCurrency(c.meta_bonus)}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(c)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir cargo?</AlertDialogTitle>
                              <AlertDialogDescription>
                                O cargo <strong>{c.nome}</strong> será removido permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(c.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GestorCargos;
