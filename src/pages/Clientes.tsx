import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Search, Plus, Phone, Mail, MapPin, ChevronRight,
  Building2, Users, Filter, SortAsc, Loader2,
} from "lucide-react";
import { useClientes, type ClienteComRelacoes } from "@/hooks/useClientes";
import ClienteDetalhe from "@/components/clientes/ClienteDetalhe";
import { toast } from "sonner";

// ── Mask helpers ──
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

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const Clientes = () => {
  const { clientes, isLoading, createCliente } = useClientes();
  const [search, setSearch] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState<ClienteComRelacoes | null>(null);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("nome");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [letterWarnings, setLetterWarnings] = useState<Record<string, boolean>>({});

  // New client form
  const [form, setForm] = useState({
    nome: "", tipo: "pj" as "pf" | "pj", documento: "", email: "",
    telefone: "", whatsapp: "", cidade: "", estado: "",
    cep: "", logradouro: "", bairro: "", numero: "", complemento: "",
  });

  const setField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleNumericField = (field: string, rawValue: string, maskFn: (v: string) => string) => {
    const hasLetters = /[a-zA-Z]/.test(rawValue);
    setLetterWarnings((prev) => ({ ...prev, [field]: hasLetters }));
    setField(field, maskFn(rawValue));
  };

  const handleEmailBlur = () => {
    if (form.email && !isValidEmail(form.email)) {
      setErrors((prev) => ({ ...prev, email: "E-mail inválido (ex: nome@dominio.com)" }));
    }
  };

  const ESTADOS_BR = [
    "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT",
    "PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO",
  ];

  const fetchCEP = useCallback(async (cep: string) => {
    const digits = onlyDigits(cep);
    if (digits.length !== 8) return;
    setCepLoading(true);
    setCepError("");
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepError("CEP não encontrado. Preencha o endereço manualmente.");
        return;
      }
      setForm((prev) => ({
        ...prev,
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));
    } catch {
      setCepError("Erro ao buscar CEP. Preencha o endereço manualmente.");
    } finally {
      setCepLoading(false);
    }
  }, []);

  const filtered = clientes
    .filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        c.nome.toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q) ||
        (c.cidade || "").toLowerCase().includes(q) ||
        (c.documento || "").includes(search);
      if (filtroStatus === "todos") return matchSearch;
      return matchSearch && c.status === filtroStatus;
    })
    .sort((a, b) => {
      if (ordenacao === "nome") return a.nome.localeCompare(b.nome);
      if (ordenacao === "recente") return b.created_at.localeCompare(a.created_at);
      return 0;
    });

  const getInitials = (nome: string) =>
    nome.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  // Keep selectedUser in sync with fetched data
  const currentCliente = clienteSelecionado
    ? clientes.find((c) => c.id === clienteSelecionado.id) || clienteSelecionado
    : null;

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!form.nome.trim()) errs.nome = "Nome é obrigatório";
    if (form.tipo === "pf" && onlyDigits(form.documento).length !== 11) errs.documento = "CPF deve ter 11 dígitos";
    if (form.tipo === "pj" && onlyDigits(form.documento).length !== 14) errs.documento = "CNPJ deve ter 14 dígitos";
    if (form.email && !isValidEmail(form.email)) errs.email = "E-mail inválido (ex: nome@dominio.com)";
    if (form.telefone && onlyDigits(form.telefone).length < 10) errs.telefone = "Telefone deve ter 10 dígitos";
    if (form.whatsapp && onlyDigits(form.whatsapp).length < 10) errs.whatsapp = "WhatsApp deve ter 10 ou 11 dígitos";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    await createCliente.mutateAsync({
      nome: form.nome,
      tipo: form.tipo,
      documento: form.documento || undefined,
      email: form.email || undefined,
      telefone: form.telefone || undefined,
      whatsapp: form.whatsapp || undefined,
      cidade: form.cidade || undefined,
      estado: form.estado || undefined,
    });
    setForm({ nome: "", tipo: "pj", documento: "", email: "", telefone: "", whatsapp: "", cidade: "", estado: "", cep: "", logradouro: "", bairro: "", numero: "", complemento: "" });
    setErrors({});
    setDialogOpen(false);
  };

  // Detail view
  if (currentCliente) {
    return (
      <ClienteDetalhe
        cliente={currentCliente}
        onBack={() => setClienteSelecionado(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 space-y-5">
        <Skeleton className="h-8 w-56" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48 rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes — CRM 360°</h1>
          <p className="text-sm text-muted-foreground">
            {clientes.filter((c) => c.status === "ativo").length} ativos · {clientes.length} total
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Novo Cliente</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Cadastrar Novo Cliente</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Nome / Razão Social *</Label>
                  <Input value={form.nome} onChange={(e) => setField("nome", e.target.value)} placeholder="Nome do cliente" />
                  {errors.nome && <p className="text-xs text-destructive mt-1">{errors.nome}</p>}
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Select value={form.tipo} onValueChange={(v) => { setField("tipo", v); setField("documento", ""); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pj">Pessoa Jurídica</SelectItem>
                      <SelectItem value="pf">Pessoa Física</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{form.tipo === "pj" ? "CNPJ" : "CPF"}</Label>
                  <Input
                    value={form.documento}
                    onChange={(e) => handleNumericField("documento", e.target.value, form.tipo === "pj" ? maskCNPJ : maskCPF)}
                    placeholder={form.tipo === "pj" ? "00.000.000/0001-00" : "000.000.000-00"}
                    maxLength={form.tipo === "pj" ? 18 : 14}
                  />
                  {letterWarnings.documento && <p className="text-xs text-destructive/80 mt-1">*apenas números</p>}
                  {errors.documento && <p className="text-xs text-destructive mt-1">{errors.documento}</p>}
                </div>
                <div className="col-span-2">
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    onBlur={handleEmailBlur}
                    placeholder="email@empresa.com"
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input
                    value={form.telefone}
                    onChange={(e) => handleNumericField("telefone", e.target.value, maskPhone)}
                    placeholder="(11) 3333-0000"
                    maxLength={14}
                  />
                  {letterWarnings.telefone && <p className="text-xs text-destructive/80 mt-1">*apenas números</p>}
                  {errors.telefone && <p className="text-xs text-destructive mt-1">{errors.telefone}</p>}
                </div>
                <div>
                  <Label>WhatsApp</Label>
                  <Input
                    value={form.whatsapp}
                    onChange={(e) => handleNumericField("whatsapp", e.target.value, maskCelular)}
                    placeholder="(11) 99999-0000"
                    maxLength={15}
                  />
                  {letterWarnings.whatsapp && <p className="text-xs text-destructive/80 mt-1">*apenas números</p>}
                  {errors.whatsapp && <p className="text-xs text-destructive mt-1">{errors.whatsapp}</p>}
                </div>
              </div>

              <Separator />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Endereço</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CEP</Label>
                  <div className="relative">
                    <Input
                      value={form.cep}
                      onChange={(e) => {
                        const hasLetters = /[a-zA-Z]/.test(e.target.value);
                        setLetterWarnings((prev) => ({ ...prev, cep: hasLetters }));
                        const masked = maskCEP(e.target.value);
                        setField("cep", masked);
                        setCepError("");
                        if (onlyDigits(masked).length === 8) fetchCEP(masked);
                      }}
                      placeholder="00000-000"
                      maxLength={9}
                    />
                    {cepLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
                  </div>
                  {letterWarnings.cep && <p className="text-xs text-destructive/80 mt-1">*apenas números</p>}
                  {cepError && <p className="text-xs text-destructive/80 mt-1">{cepError}</p>}
                </div>
                <div>
                  <Label>Estado</Label>
                  <Select value={form.estado} onValueChange={(v) => setField("estado", v)}>
                    <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                    <SelectContent>
                      {ESTADOS_BR.map((uf) => (
                        <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Logradouro</Label>
                  <Input value={form.logradouro} onChange={(e) => setField("logradouro", e.target.value)} placeholder="Rua, Avenida..." readOnly={cepLoading} />
                </div>
                <div>
                  <Label>Número</Label>
                  <Input value={form.numero} onChange={(e) => setField("numero", e.target.value)} placeholder="123" />
                </div>
                <div>
                  <Label>Bairro</Label>
                  <Input value={form.bairro} onChange={(e) => setField("bairro", e.target.value)} placeholder="Bairro" readOnly={cepLoading} />
                </div>
                <div>
                  <Label>Cidade</Label>
                  <Input value={form.cidade} onChange={(e) => setField("cidade", e.target.value)} placeholder="São Paulo" readOnly={cepLoading} />
                </div>
                <div>
                  <Label>Complemento</Label>
                  <Input value={form.complemento} onChange={(e) => setField("complemento", e.target.value)} placeholder="Sala 10, Bloco B..." />
                </div>
              </div>

              <Button onClick={handleCreate} className="w-full gap-2" disabled={createCliente.isPending}>
                <Plus className="h-4 w-4" />
                {createCliente.isPending ? "Cadastrando..." : "Cadastrar Cliente"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar nome, cidade, CNPJ..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-36"><Filter className="h-3.5 w-3.5 mr-1.5" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ativo">Ativos</SelectItem>
            <SelectItem value="inativo">Inativos</SelectItem>
          </SelectContent>
        </Select>
        <Select value={ordenacao} onValueChange={setOrdenacao}>
          <SelectTrigger className="w-44"><SortAsc className="h-3.5 w-3.5 mr-1.5" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="nome">Nome A–Z</SelectItem>
            <SelectItem value="recente">Mais recente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Client Cards */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <Card key={c.id} className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setClienteSelecionado(c)}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4 mb-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(c.nome)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground truncate">{c.nome}</h3>
                    <Badge variant="outline" className="text-[10px] shrink-0">{c.tipo === "pj" ? "PJ" : "PF"}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {[c.cidade, c.estado].filter(Boolean).join(", ") || "Sem localização"}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground">
                {c.email && (
                  <div className="flex items-center gap-2"><Mail className="h-3 w-3 shrink-0" /><span className="truncate">{c.email}</span></div>
                )}
                {c.telefone && (
                  <div className="flex items-center gap-2"><Phone className="h-3 w-3 shrink-0" /><span>{c.telefone}</span></div>
                )}
              </div>

              {c.tags && c.tags.length > 0 && (
                <div className="flex gap-1.5 mt-3">
                  {c.tags.slice(0, 3).map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-center pt-3 mt-3 border-t border-border">
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  <span>{c.obras.length} obras</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{c.enderecos.length} endereços</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhum cliente encontrado</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Clientes;
