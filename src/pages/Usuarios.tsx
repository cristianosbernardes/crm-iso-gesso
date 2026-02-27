import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search, UserPlus, Shield, Mail, Phone, TrendingUp,
  DollarSign, Target, BarChart3, Eye, EyeOff, Percent,
  Calendar, Calculator, Package, FileText, Truck, Settings, Users,
  ChevronRight
} from "lucide-react";

interface Permissao {
  modulo: string;
  icone: React.ReactNode;
  ativo: boolean;
}

interface ComissaoLog {
  mes: string;
  valor: number;
  vendas: number;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  role: "admin" | "tecnico" | "vendedor" | "estoquista";
  status: "ativo" | "inativo";
  comissaoHabilitada: boolean;
  comissaoPercent: number;
  historicoComissoes: ComissaoLog[];
  permissoes: Permissao[];
  totalVendido: number;
  visitasTecnicas: number;
  orcamentosFechados: number;
}

const defaultPermissoes = (role: string): Permissao[] => [
  { modulo: "Dashboard", icone: <BarChart3 className="h-3.5 w-3.5" />, ativo: true },
  { modulo: "Produtos", icone: <Package className="h-3.5 w-3.5" />, ativo: true },
  { modulo: "Clientes", icone: <Users className="h-3.5 w-3.5" />, ativo: role !== "estoquista" },
  { modulo: "Agenda", icone: <Calendar className="h-3.5 w-3.5" />, ativo: role !== "estoquista" },
  { modulo: "Calculadora", icone: <Calculator className="h-3.5 w-3.5" />, ativo: role !== "estoquista" },
  { modulo: "Financeiro", icone: <DollarSign className="h-3.5 w-3.5" />, ativo: role === "admin" },
  { modulo: "Logística", icone: <Truck className="h-3.5 w-3.5" />, ativo: role === "admin" || role === "estoquista" },
  { modulo: "Documentos", icone: <FileText className="h-3.5 w-3.5" />, ativo: role === "admin" },
  { modulo: "Configurações", icone: <Settings className="h-3.5 w-3.5" />, ativo: role === "admin" },
];

const initialUsuarios: Usuario[] = [
  {
    id: 1, nome: "João Administrador", email: "joao@isogesso.com", telefone: "(11) 99999-0001",
    cargo: "Diretor", role: "admin", status: "ativo", comissaoHabilitada: true, comissaoPercent: 3,
    historicoComissoes: [
      { mes: "Jan/2026", valor: 4500, vendas: 12 },
      { mes: "Fev/2026", valor: 6200, vendas: 18 },
    ],
    permissoes: defaultPermissoes("admin"), totalVendido: 210000, visitasTecnicas: 45, orcamentosFechados: 30,
  },
  {
    id: 2, nome: "Pedro Técnico", email: "pedro@isogesso.com", telefone: "(11) 99999-0002",
    cargo: "Técnico de Campo", role: "tecnico", status: "ativo", comissaoHabilitada: true, comissaoPercent: 5,
    historicoComissoes: [
      { mes: "Jan/2026", valor: 3200, vendas: 8 },
      { mes: "Fev/2026", valor: 4100, vendas: 11 },
    ],
    permissoes: defaultPermissoes("tecnico"), totalVendido: 146000, visitasTecnicas: 62, orcamentosFechados: 22,
  },
  {
    id: 3, nome: "Maria Vendas", email: "maria@isogesso.com", telefone: "(11) 99999-0003",
    cargo: "Vendedora Sênior", role: "vendedor", status: "ativo", comissaoHabilitada: true, comissaoPercent: 7,
    historicoComissoes: [
      { mes: "Jan/2026", valor: 8900, vendas: 22 },
      { mes: "Fev/2026", valor: 11200, vendas: 28 },
    ],
    permissoes: defaultPermissoes("tecnico"), totalVendido: 320000, visitasTecnicas: 35, orcamentosFechados: 50,
  },
  {
    id: 4, nome: "Lucas Estoque", email: "lucas@isogesso.com", telefone: "(11) 99999-0004",
    cargo: "Estoquista", role: "estoquista", status: "ativo", comissaoHabilitada: false, comissaoPercent: 0,
    historicoComissoes: [],
    permissoes: defaultPermissoes("estoquista"), totalVendido: 0, visitasTecnicas: 0, orcamentosFechados: 0,
  },
  {
    id: 5, nome: "Ana Logística", email: "ana@isogesso.com", telefone: "(11) 99999-0005",
    cargo: "Coordenadora Logística", role: "estoquista", status: "inativo", comissaoHabilitada: false, comissaoPercent: 0,
    historicoComissoes: [],
    permissoes: defaultPermissoes("estoquista"), totalVendido: 0, visitasTecnicas: 0, orcamentosFechados: 0,
  },
  {
    id: 6, nome: "Carlos Silva", email: "carlos@isogesso.com", telefone: "(11) 99999-0006",
    cargo: "Vendedor Júnior", role: "vendedor", status: "ativo", comissaoHabilitada: true, comissaoPercent: 4,
    historicoComissoes: [
      { mes: "Jan/2026", valor: 1800, vendas: 5 },
      { mes: "Fev/2026", valor: 2400, vendas: 7 },
    ],
    permissoes: defaultPermissoes("tecnico"), totalVendido: 84000, visitasTecnicas: 20, orcamentosFechados: 12,
  },
];

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  tecnico: "Técnico",
  vendedor: "Vendedor",
  estoquista: "Estoquista",
};

const roleColors: Record<string, string> = {
  admin: "bg-primary/15 text-primary",
  tecnico: "bg-info/15 text-info",
  vendedor: "bg-warning/15 text-warning",
  estoquista: "bg-success/15 text-success",
};

const statusColors: Record<string, string> = {
  ativo: "bg-success/15 text-success",
  inativo: "bg-muted text-muted-foreground",
};

type FilterType = "todos" | "admin" | "tecnico" | "vendedor" | "estoquista" | "inativo";

const filterPills: { label: string; value: FilterType }[] = [
  { label: "Todos", value: "todos" },
  { label: "Administradores", value: "admin" },
  { label: "Técnicos", value: "tecnico" },
  { label: "Vendedores", value: "vendedor" },
  { label: "Estoquistas", value: "estoquista" },
  { label: "Inativos", value: "inativo" },
];

const Usuarios = () => {
  const [search, setSearch] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("todos");

  // Form states
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novoTelefone, setNovoTelefone] = useState("");
  const [novoCargo, setNovoCargo] = useState("");
  const [novoRole, setNovoRole] = useState<"admin" | "tecnico" | "vendedor" | "estoquista">("tecnico");

  const filtered = usuarios.filter((u) => {
    const matchSearch =
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.cargo.toLowerCase().includes(search.toLowerCase());
    if (activeFilter === "todos") return matchSearch;
    if (activeFilter === "inativo") return matchSearch && u.status === "inativo";
    return matchSearch && u.role === activeFilter && u.status === "ativo";
  });

  const handleAdd = () => {
    if (!novoNome || !novoEmail) return;
    setUsuarios([
      ...usuarios,
      {
        id: Date.now(), nome: novoNome, email: novoEmail, telefone: novoTelefone,
        cargo: novoCargo, role: novoRole, status: "ativo",
        comissaoHabilitada: false, comissaoPercent: 0, historicoComissoes: [],
        permissoes: defaultPermissoes(novoRole), totalVendido: 0, visitasTecnicas: 0, orcamentosFechados: 0,
      },
    ]);
    setNovoNome(""); setNovoEmail(""); setNovoTelefone(""); setNovoCargo(""); setNovoRole("tecnico");
    setDialogOpen(false);
  };

  const toggleComissao = (userId: number) => {
    setUsuarios(prev => prev.map(u => u.id === userId ? { ...u, comissaoHabilitada: !u.comissaoHabilitada } : u));
    if (selectedUser?.id === userId) setSelectedUser(prev => prev ? { ...prev, comissaoHabilitada: !prev.comissaoHabilitada } : null);
  };

  const updateComissaoPercent = (userId: number, val: number) => {
    setUsuarios(prev => prev.map(u => u.id === userId ? { ...u, comissaoPercent: val } : u));
    if (selectedUser?.id === userId) setSelectedUser(prev => prev ? { ...prev, comissaoPercent: val } : null);
  };

  const togglePermissao = (userId: number, modulo: string) => {
    const update = (u: Usuario) => ({
      ...u,
      permissoes: u.permissoes.map(p => p.modulo === modulo ? { ...p, ativo: !p.ativo } : p),
    });
    setUsuarios(prev => prev.map(u => u.id === userId ? update(u) : u));
    if (selectedUser?.id === userId) setSelectedUser(prev => prev ? update(prev) : null);
  };

  const conversaoRate = (u: Usuario) =>
    u.visitasTecnicas > 0 ? Math.round((u.orcamentosFechados / u.visitasTecnicas) * 100) : 0;

  const comissaoMesAtual = (u: Usuario) =>
    u.historicoComissoes.length > 0 ? u.historicoComissoes[u.historicoComissoes.length - 1].valor : 0;

  const countByFilter = (f: FilterType) => {
    if (f === "todos") return usuarios.length;
    if (f === "inativo") return usuarios.filter(u => u.status === "inativo").length;
    return usuarios.filter(u => u.role === f && u.status === "ativo").length;
  };

  return (
    <div className="p-6 lg:p-8 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Equipe</h1>
          <p className="text-sm text-muted-foreground">
            {usuarios.filter(u => u.status === "ativo").length} ativos · {usuarios.length} total
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><UserPlus className="h-4 w-4" /> Novo Colaborador</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Cadastrar Novo Colaborador</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Nome completo</Label><Input value={novoNome} onChange={e => setNovoNome(e.target.value)} placeholder="Nome do colaborador" /></div>
              <div><Label>E-mail</Label><Input type="email" value={novoEmail} onChange={e => setNovoEmail(e.target.value)} placeholder="email@isogesso.com" /></div>
              <div><Label>Telefone</Label><Input value={novoTelefone} onChange={e => setNovoTelefone(e.target.value)} placeholder="(11) 99999-0000" /></div>
              <div><Label>Cargo</Label><Input value={novoCargo} onChange={e => setNovoCargo(e.target.value)} placeholder="Ex: Técnico de Campo" /></div>
              <div>
                <Label>Nível de Acesso</Label>
                <Select value={novoRole} onValueChange={v => setNovoRole(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="vendedor">Vendedor</SelectItem>
                    <SelectItem value="estoquista">Estoquista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAdd} className="w-full gap-2"><UserPlus className="h-4 w-4" /> Cadastrar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search + Filter Pills */}
      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nome, e-mail ou cargo..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {filterPills.map(f => (
            <Button
              key={f.value}
              variant={activeFilter === f.value ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(f.value)}
              className="gap-1.5 text-xs"
            >
              {f.label}
              <Badge variant="secondary" className="ml-0.5 h-5 min-w-[20px] px-1.5 text-[10px] bg-background/50">
                {countByFilter(f.value)}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* User Cards - Full Width */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map(u => (
          <Card
            key={u.id}
            className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
            onClick={() => setSelectedUser(u)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {u.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm truncate">{u.nome}</h3>
                  <p className="text-xs text-muted-foreground">{u.cargo}</p>
                </div>
                <Badge variant="secondary" className={`text-[10px] ${statusColors[u.status]}`}>{u.status}</Badge>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Mail className="h-3 w-3 shrink-0" /><span className="truncate">{u.email}</span></div>
                <div className="flex items-center gap-2"><Phone className="h-3 w-3 shrink-0" /><span>{u.telefone}</span></div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Badge variant="secondary" className={`gap-1 text-[10px] ${roleColors[u.role]}`}>
                  <Shield className="h-2.5 w-2.5" />{roleLabels[u.role]}
                </Badge>
                {u.comissaoHabilitada && (
                  <span className="text-[10px] font-mono text-success flex items-center gap-0.5">
                    <Percent className="h-2.5 w-2.5" />{u.comissaoPercent}%
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhum colaborador encontrado</p>
          </div>
        )}
      </motion.div>

      {/* Sheet Detail Panel */}
      <Sheet open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <SheetContent className="w-full sm:max-w-lg p-0 overflow-y-auto">
          {selectedUser && (
            <>
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6">
                <SheetHeader className="mb-0">
                  <SheetTitle className="sr-only">{selectedUser.nome}</SheetTitle>
                </SheetHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-18 w-18 border-2 border-background shadow-md">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold h-18 w-18">
                      {selectedUser.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{selectedUser.nome}</h2>
                    <p className="text-sm text-muted-foreground">{selectedUser.cargo}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className={`text-xs ${roleColors[selectedUser.role]}`}>
                        <Shield className="h-3 w-3 mr-1" />{roleLabels[selectedUser.role]}
                      </Badge>
                      <Badge variant="secondary" className={`text-xs ${statusColors[selectedUser.status]}`}>
                        {selectedUser.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="dados" className="w-full">
                <TabsList className="w-full rounded-none border-b bg-transparent p-0 h-auto">
                  <TabsTrigger value="dados" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex-1 py-3 text-xs">Dados</TabsTrigger>
                  <TabsTrigger value="financeiro" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex-1 py-3 text-xs">Comissões</TabsTrigger>
                  <TabsTrigger value="permissoes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex-1 py-3 text-xs">Permissões</TabsTrigger>
                  <TabsTrigger value="performance" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex-1 py-3 text-xs">Performance</TabsTrigger>
                </TabsList>

                {/* Dados */}
                <TabsContent value="dados" className="p-6 space-y-4 mt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm"><Mail className="h-4 w-4 text-muted-foreground shrink-0" /><span>{selectedUser.email}</span></div>
                    <div className="flex items-center gap-3 text-sm"><Phone className="h-4 w-4 text-muted-foreground shrink-0" /><span>{selectedUser.telefone}</span></div>
                    <div className="flex items-center gap-3 text-sm"><Shield className="h-4 w-4 text-muted-foreground shrink-0" /><span>{selectedUser.cargo}</span></div>
                  </div>
                  <Separator />
                  <Button variant="outline" size="sm" className="w-full">Editar Dados</Button>
                </TabsContent>

                {/* Comissões */}
                <TabsContent value="financeiro" className="p-6 space-y-4 mt-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Habilitar Comissão</Label>
                      <p className="text-[11px] text-muted-foreground">Ativa cálculo de comissão sobre vendas</p>
                    </div>
                    <Switch
                      checked={selectedUser.comissaoHabilitada}
                      onCheckedChange={() => toggleComissao(selectedUser.id)}
                    />
                  </div>

                  {selectedUser.comissaoHabilitada && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
                      <div>
                        <Label className="text-sm">Percentual de Comissão</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type="number" min={0} max={100} step={0.5}
                            value={selectedUser.comissaoPercent}
                            onChange={e => updateComissaoPercent(selectedUser.id, Number(e.target.value))}
                            className="w-24 text-center font-mono"
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-sm font-medium mb-1">Comissão Mês Atual</p>
                        <p className="text-2xl font-bold text-success">
                          R$ {comissaoMesAtual(selectedUser).toLocaleString("pt-BR")}
                        </p>
                      </div>

                      {selectedUser.historicoComissoes.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">Histórico Recente</p>
                          <div className="space-y-2">
                            {selectedUser.historicoComissoes.map((h, i) => (
                              <div key={i} className="flex items-center justify-between text-sm bg-muted/30 rounded-lg px-3 py-2">
                                <span className="text-muted-foreground">{h.mes}</span>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-muted-foreground">{h.vendas} vendas</span>
                                  <span className="font-mono font-semibold text-foreground">R$ {h.valor.toLocaleString("pt-BR")}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </TabsContent>

                {/* Permissões */}
                <TabsContent value="permissoes" className="p-6 space-y-3 mt-0">
                  <p className="text-xs text-muted-foreground mb-1">Defina quais módulos este colaborador pode acessar:</p>
                  {selectedUser.permissoes.map(p => (
                    <div key={p.modulo} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">{p.icone}</span>
                        <span>{p.modulo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {p.ativo ? <Eye className="h-3.5 w-3.5 text-success" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
                        <Switch
                          checked={p.ativo}
                          onCheckedChange={() => togglePermissao(selectedUser.id, p.modulo)}
                        />
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {/* Performance */}
                <TabsContent value="performance" className="p-6 space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="bg-muted/30 border-0">
                      <CardContent className="p-4 text-center">
                        <DollarSign className="h-6 w-6 mx-auto text-success mb-1" />
                        <p className="text-xl font-bold text-foreground">R$ {(selectedUser.totalVendido / 1000).toFixed(0)}k</p>
                        <p className="text-[11px] text-muted-foreground">Total Vendido</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/30 border-0">
                      <CardContent className="p-4 text-center">
                        <Target className="h-6 w-6 mx-auto text-primary mb-1" />
                        <p className="text-xl font-bold text-foreground">{conversaoRate(selectedUser)}%</p>
                        <p className="text-[11px] text-muted-foreground">Taxa Conversão</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Visitas Técnicas</span>
                      <span className="font-mono font-semibold">{selectedUser.visitasTecnicas}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Orçamentos Fechados</span>
                      <span className="font-mono font-semibold">{selectedUser.orcamentosFechados}</span>
                    </div>
                    <Separator />
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Conversão</span>
                        <span className="font-mono">{conversaoRate(selectedUser)}%</span>
                      </div>
                      <Progress value={conversaoRate(selectedUser)} className="h-2" />
                    </div>
                  </div>

                  {selectedUser.totalVendido === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">Sem dados de vendas para este colaborador</p>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Usuarios;
