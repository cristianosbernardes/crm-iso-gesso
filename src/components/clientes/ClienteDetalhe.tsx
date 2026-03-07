import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, Building2, Mail, Phone, Send, MapPin,
  User, Shield, Calendar, Plus, Pencil, X, Check, Loader2, Trash2, History,
} from "lucide-react";
import { type ClienteComRelacoes } from "@/hooks/useClientes";
import { useClientes } from "@/hooks/useClientes";
import { format } from "date-fns";
import { toast } from "sonner";

interface Props {
  cliente: ClienteComRelacoes;
  onBack: () => void;
}

const statusObraCor: Record<string, string> = {
  ativa: "bg-primary/15 text-primary",
  concluida: "bg-emerald-500/15 text-emerald-600",
  pausada: "bg-muted text-muted-foreground",
};

const ESTADOS_BR = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT",
  "PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO",
];

const onlyDigits = (v: string) => v.replace(/\D/g, "");

const maskCPF = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  return d.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};
const maskCNPJ = (v: string) => {
  const d = onlyDigits(v).slice(0, 14);
  return d.replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2");
};
const maskPhone = (v: string) => {
  const d = onlyDigits(v).slice(0, 10);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
};
const maskCelular = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};
const maskCEP = (v: string) => {
  const d = onlyDigits(v).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
};

const ClienteDetalhe = ({ cliente: c, onBack }: Props) => {
  const { updateCliente, createObra, createEndereco, deleteCliente, logHistorico } = useClientes();
  const [editing, setEditing] = useState(false);
  const [obraDialogOpen, setObraDialogOpen] = useState(false);
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");

  const [editForm, setEditForm] = useState({
    nome: c.nome,
    tipo: c.tipo,
    documento: c.documento || "",
    email: c.email || "",
    telefone: c.telefone || "",
    whatsapp: c.whatsapp || "",
    observacoes: c.observacoes || "",
    aniversario: c.aniversario || "",
  });

  const [novaObra, setNovaObra] = useState({ nome: "", endereco: "", status: "ativa" });
  const [novoEnd, setNovoEnd] = useState({ tipo: "entrega", logradouro: "", numero: "", bairro: "", cidade: "", estado: "", cep: "", complemento: "" });

  const getInitials = (nome: string) =>
    nome.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const fetchCEP = useCallback(async (cep: string) => {
    const digits = onlyDigits(cep);
    if (digits.length !== 8) return;
    setCepLoading(true);
    setCepError("");
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepError("CEP não encontrado. Preencha manualmente.");
        return;
      }
      setNovoEnd((prev) => ({
        ...prev,
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));
    } catch {
      setCepError("Erro ao buscar CEP. Preencha manualmente.");
    } finally {
      setCepLoading(false);
    }
  }, []);

  const handleStartEdit = () => {
    setEditForm({
      nome: c.nome,
      tipo: c.tipo,
      documento: c.documento || "",
      email: c.email || "",
      telefone: c.telefone || "",
      whatsapp: c.whatsapp || "",
      observacoes: c.observacoes || "",
      aniversario: c.aniversario || "",
    });
    setEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editForm.nome.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }
    await updateCliente.mutateAsync({
      id: c.id,
      nome: editForm.nome,
      tipo: editForm.tipo,
      documento: editForm.documento || null,
      email: editForm.email || null,
      telefone: editForm.telefone || null,
      whatsapp: editForm.whatsapp || null,
      observacoes: editForm.observacoes || null,
      aniversario: editForm.aniversario || null,
    });
    setEditing(false);
  };

  const handleDelete = async () => {
    await deleteCliente.mutateAsync(c.id);
    onBack();
  };

  const handleAddObra = async () => {
    if (!novaObra.nome) return;
    await createObra.mutateAsync({ cliente_id: c.id, ...novaObra });
    setNovaObra({ nome: "", endereco: "", status: "ativa" });
    setObraDialogOpen(false);
  };

  const handleAddEnd = async () => {
    if (!novoEnd.logradouro) return;
    await createEndereco.mutateAsync({
      cliente_id: c.id,
      tipo: novoEnd.tipo,
      logradouro: novoEnd.logradouro,
      numero: novoEnd.numero || undefined,
      bairro: novoEnd.bairro || undefined,
      cidade: novoEnd.cidade || undefined,
      estado: novoEnd.estado || undefined,
      cep: novoEnd.cep || undefined,
    });
    setNovoEnd({ tipo: "entrega", logradouro: "", numero: "", bairro: "", cidade: "", estado: "", cep: "", complemento: "" });
    setCepError("");
    setEndDialogOpen(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-14 w-14">
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
            {getInitials(c.nome)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{c.nome}</h1>
            <Badge variant="outline" className="text-xs">{c.tipo === "pj" ? "PJ" : "PF"}</Badge>
            <Badge variant="secondary" className={`text-xs ${c.status === "ativo" ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
              {c.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {c.documento && `${c.documento} · `}
            {[c.cidade, c.estado].filter(Boolean).join(", ")}
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          {!editing && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleStartEdit}>
              <Pencil className="h-3.5 w-3.5" /> Editar
            </Button>
          )}
          {c.whatsapp && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.open(`https://wa.me/55${c.whatsapp!.replace(/\D/g, "")}`, "_blank")}>
              <Send className="h-3.5 w-3.5" /> WhatsApp
            </Button>
          )}
          {c.email && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.open(`mailto:${c.email}`)}>
              <Mail className="h-3.5 w-3.5" /> E-mail
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" /> Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação é irreversível. O cliente <strong>{c.nome}</strong> e todos os seus dados (endereços, obras, contatos) serão removidos permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Obras", value: `${c.obras.length}`, icon: <Building2 className="h-5 w-5" />, cor: "text-primary" },
          { label: "Endereços", value: `${c.enderecos.length}`, icon: <MapPin className="h-5 w-5" />, cor: "text-chart-4" },
          { label: "Contatos", value: `${c.contatos.length}`, icon: <User className="h-5 w-5" />, cor: "text-chart-5" },
          { label: "Cliente desde", value: new Date(c.created_at).toLocaleDateString("pt-BR"), icon: <Calendar className="h-5 w-5" />, cor: "text-muted-foreground" },
        ].map((kpi, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${kpi.cor}`}>{kpi.icon}</div>
              <div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="font-semibold text-foreground text-sm">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs: Dados (info + endereços) | Obras */}
      <Tabs defaultValue="dados" className="space-y-4">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="dados" className="gap-1.5 text-xs"><User className="h-3.5 w-3.5" /> Dados</TabsTrigger>
          <TabsTrigger value="obras" className="gap-1.5 text-xs"><Building2 className="h-3.5 w-3.5" /> Obras</TabsTrigger>
        </TabsList>

        {/* Dados Tab */}
        <TabsContent value="dados" className="space-y-4">
          {/* Contact Info */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Informações de Contato</CardTitle>
              {editing ? (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setEditing(false)}>
                    <X className="h-3.5 w-3.5" /> Cancelar
                  </Button>
                  <Button size="sm" className="gap-1.5" onClick={handleSaveEdit} disabled={updateCliente.isPending}>
                    <Check className="h-3.5 w-3.5" /> {updateCliente.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="gap-1.5 md:hidden" onClick={handleStartEdit}>
                  <Pencil className="h-3.5 w-3.5" /> Editar
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Nome / Razão Social *</Label>
                    <Input value={editForm.nome} onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })} />
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <Select value={editForm.tipo} onValueChange={(v: "pf" | "pj") => setEditForm({ ...editForm, tipo: v, documento: "" })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pj">Pessoa Jurídica</SelectItem>
                        <SelectItem value="pf">Pessoa Física</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{editForm.tipo === "pj" ? "CNPJ" : "CPF"}</Label>
                    <Input
                      value={editForm.documento}
                      onChange={(e) => setEditForm({ ...editForm, documento: editForm.tipo === "pj" ? maskCNPJ(e.target.value) : maskCPF(e.target.value) })}
                      placeholder={editForm.tipo === "pj" ? "00.000.000/0001-00" : "000.000.000-00"}
                      maxLength={editForm.tipo === "pj" ? 18 : 14}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>E-mail</Label>
                    <Input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} placeholder="email@empresa.com" />
                  </div>
                  <div>
                    <Label>Telefone</Label>
                    <Input value={editForm.telefone} onChange={(e) => setEditForm({ ...editForm, telefone: maskPhone(e.target.value) })} placeholder="(11) 3333-0000" maxLength={14} />
                  </div>
                  <div>
                    <Label>WhatsApp</Label>
                    <Input value={editForm.whatsapp} onChange={(e) => setEditForm({ ...editForm, whatsapp: maskCelular(e.target.value) })} placeholder="(11) 99999-0000" maxLength={15} />
                  </div>
                  <div>
                    <Label>Aniversário</Label>
                    <Input type="date" value={editForm.aniversario} onChange={(e) => setEditForm({ ...editForm, aniversario: e.target.value })} />
                  </div>
                  <div className="col-span-2">
                    <Label>Observações</Label>
                    <Textarea value={editForm.observacoes} onChange={(e) => setEditForm({ ...editForm, observacoes: e.target.value })} placeholder="Anotações sobre o cliente..." rows={3} />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { icon: <User className="h-4 w-4" />, label: c.tipo === "pj" ? "Razão Social" : "Nome", value: c.nome },
                    { icon: <Shield className="h-4 w-4" />, label: c.tipo === "pj" ? "CNPJ" : "CPF", value: c.documento || "—" },
                    { icon: <Mail className="h-4 w-4" />, label: "E-mail", value: c.email || "—" },
                    { icon: <Phone className="h-4 w-4" />, label: "Telefone", value: c.telefone || "—" },
                    { icon: <Send className="h-4 w-4" />, label: "WhatsApp", value: c.whatsapp || "—" },
                    { icon: <Calendar className="h-4 w-4" />, label: "Aniversário", value: c.aniversario || "—" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground">{item.icon}</span>
                      <span className="text-muted-foreground w-28">{item.label}</span>
                      <span className="text-foreground font-medium">{item.value}</span>
                    </div>
                  ))}
                  {c.observacoes && (
                    <div className="p-3 rounded-lg bg-muted/50 mt-4">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Observações</p>
                      <p className="text-sm text-foreground">{c.observacoes}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Endereços */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Endereços</CardTitle>
              <Dialog open={endDialogOpen} onOpenChange={setEndDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Adicionar</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Novo Endereço</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-2 max-h-[70vh] overflow-y-auto pr-1">
                    <div>
                      <Label>Tipo</Label>
                      <Select value={novoEnd.tipo} onValueChange={(v) => setNovoEnd({ ...novoEnd, tipo: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entrega">Entrega</SelectItem>
                          <SelectItem value="obra">Obra</SelectItem>
                          <SelectItem value="sede">Sede</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>CEP</Label>
                        <div className="relative">
                          <Input
                            value={novoEnd.cep}
                            onChange={(e) => {
                              const masked = maskCEP(e.target.value);
                              setNovoEnd((prev) => ({ ...prev, cep: masked }));
                              setCepError("");
                              if (onlyDigits(masked).length === 8) fetchCEP(masked);
                            }}
                            placeholder="00000-000"
                            maxLength={9}
                          />
                          {cepLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
                        </div>
                        {cepError && <p className="text-xs text-destructive/80 mt-1">{cepError}</p>}
                      </div>
                      <div>
                        <Label>Estado</Label>
                        <Select value={novoEnd.estado} onValueChange={(v) => setNovoEnd({ ...novoEnd, estado: v })}>
                          <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                          <SelectContent>
                            {ESTADOS_BR.map((uf) => (
                              <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Logradouro</Label>
                      <Input value={novoEnd.logradouro} onChange={(e) => setNovoEnd({ ...novoEnd, logradouro: e.target.value })} placeholder="Rua, Av..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Número</Label><Input value={novoEnd.numero} onChange={(e) => setNovoEnd({ ...novoEnd, numero: e.target.value })} placeholder="123" /></div>
                      <div><Label>Bairro</Label><Input value={novoEnd.bairro} onChange={(e) => setNovoEnd({ ...novoEnd, bairro: e.target.value })} /></div>
                      <div><Label>Cidade</Label><Input value={novoEnd.cidade} onChange={(e) => setNovoEnd({ ...novoEnd, cidade: e.target.value })} /></div>
                      <div><Label>Complemento</Label><Input value={novoEnd.complemento} onChange={(e) => setNovoEnd({ ...novoEnd, complemento: e.target.value })} placeholder="Sala 10..." /></div>
                    </div>
                    <Button onClick={handleAddEnd} className="w-full" disabled={createEndereco.isPending}>
                      {createEndereco.isPending ? "Salvando..." : "Salvar Endereço"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {c.enderecos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Nenhum endereço cadastrado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {c.enderecos.map((end) => (
                    <div key={end.id} className="p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px]">
                          {end.tipo === "entrega" ? "📦 Entrega" : end.tipo === "obra" ? "🏗️ Obra" : "🏢 Sede"}
                        </Badge>
                        {end.principal && <Badge variant="secondary" className="text-[10px]">Principal</Badge>}
                      </div>
                      <p className="text-sm text-foreground">
                        {end.logradouro}{end.numero ? `, ${end.numero}` : ""}
                        {end.complemento ? ` - ${end.complemento}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {[end.bairro, end.cidade, end.estado].filter(Boolean).join(", ")}
                        {end.cep ? ` · CEP ${end.cep}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Obras Tab */}
        <TabsContent value="obras">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Projetos / Obras Vinculadas</CardTitle>
              <Dialog open={obraDialogOpen} onOpenChange={setObraDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Nova Obra</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Nova Obra</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div><Label>Nome da Obra</Label><Input value={novaObra.nome} onChange={(e) => setNovaObra({ ...novaObra, nome: e.target.value })} placeholder="Ex: Edifício Harmonia" /></div>
                    <div><Label>Endereço</Label><Input value={novaObra.endereco} onChange={(e) => setNovaObra({ ...novaObra, endereco: e.target.value })} placeholder="Endereço da obra" /></div>
                    <div>
                      <Label>Status</Label>
                      <Select value={novaObra.status} onValueChange={(v) => setNovaObra({ ...novaObra, status: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ativa">Ativa</SelectItem>
                          <SelectItem value="concluida">Concluída</SelectItem>
                          <SelectItem value="pausada">Pausada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddObra} className="w-full" disabled={createObra.isPending}>
                      {createObra.isPending ? "Salvando..." : "Salvar Obra"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {c.obras.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Nenhuma obra vinculada</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {c.obras.map((obra) => (
                    <div key={obra.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{obra.nome}</p>
                          <Badge className={`text-[10px] ${statusObraCor[obra.status] || statusObraCor.ativa}`}>
                            {obra.status === "ativa" ? "Ativa" : obra.status === "concluida" ? "Concluída" : "Pausada"}
                          </Badge>
                        </div>
                        {obra.endereco && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" /> {obra.endereco}
                          </p>
                        )}
                      </div>
                      {obra.rt60_calculado && (
                        <div className="text-center">
                          <p className="text-lg font-mono font-bold text-primary">{obra.rt60_calculado}s</p>
                          <p className="text-[10px] text-muted-foreground">RT₆₀</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClienteDetalhe;
