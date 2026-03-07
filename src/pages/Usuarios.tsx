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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search, UserPlus, Shield, Mail, Phone,
  Eye, EyeOff, Percent, Users, ChevronRight, Lock,
} from "lucide-react";
import { useUsuarios, type UsuarioProfile } from "@/hooks/useUsuarios";

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  tecnico: "Técnico",
  vendedor: "Vendedor",
  estoquista: "Estoquista",
};

const roleColors: Record<string, string> = {
  admin: "bg-primary/15 text-primary",
  tecnico: "bg-blue-500/15 text-blue-600",
  vendedor: "bg-amber-500/15 text-amber-600",
  estoquista: "bg-emerald-500/15 text-emerald-600",
};

const statusColors: Record<string, string> = {
  ativo: "bg-emerald-500/15 text-emerald-600",
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
  const { data: usuarios = [], isLoading, createUser, updateProfile, updateRole } = useUsuarios();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UsuarioProfile | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("todos");
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novoSenha, setNovoSenha] = useState("");
  const [novoTelefone, setNovoTelefone] = useState("");
  const [novoCargo, setNovoCargo] = useState("");
  const [novoRole, setNovoRole] = useState<string>("tecnico");

  const filtered = usuarios.filter((u) => {
    const matchSearch =
      (u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.cargo || "").toLowerCase().includes(search.toLowerCase());
    if (activeFilter === "todos") return matchSearch;
    if (activeFilter === "inativo") return matchSearch && u.status === "inativo";
    return matchSearch && u.role === activeFilter && u.status === "ativo";
  });

  const handleAdd = async () => {
    if (!novoNome || !novoEmail || !novoSenha) return;
    await createUser.mutateAsync({
      email: novoEmail,
      password: novoSenha,
      full_name: novoNome,
      phone: novoTelefone || undefined,
      cargo: novoCargo || undefined,
      role: novoRole,
    });
    setNovoNome(""); setNovoEmail(""); setNovoSenha(""); setNovoTelefone(""); setNovoCargo(""); setNovoRole("tecnico");
    setDialogOpen(false);
  };

  const toggleComissao = (user: UsuarioProfile) => {
    updateProfile.mutate({ id: user.id, comissao_habilitada: !user.comissao_habilitada });
    if (selectedUser?.id === user.id) {
      setSelectedUser({ ...selectedUser, comissao_habilitada: !user.comissao_habilitada });
    }
  };

  const updateComissaoPercent = (user: UsuarioProfile, val: number) => {
    updateProfile.mutate({ id: user.id, comissao_percent: val });
    if (selectedUser?.id === user.id) {
      setSelectedUser({ ...selectedUser, comissao_percent: val });
    }
  };

  const toggleStatus = (user: UsuarioProfile) => {
    const newStatus = user.status === "ativo" ? "inativo" : "ativo";
    updateProfile.mutate({ id: user.id, status: newStatus });
    if (selectedUser?.id === user.id) {
      setSelectedUser({ ...selectedUser, status: newStatus });
    }
  };

  const handleRoleChange = (user: UsuarioProfile, newRole: string) => {
    updateRole.mutate({ userId: user.id, role: newRole });
    if (selectedUser?.id === user.id) {
      setSelectedUser({ ...selectedUser, role: newRole });
    }
  };

  const countByFilter = (f: FilterType) => {
    if (f === "todos") return usuarios.length;
    if (f === "inativo") return usuarios.filter((u) => u.status === "inativo").length;
    return usuarios.filter((u) => u.role === f && u.status === "ativo").length;
  };

  const getInitials = (u: UsuarioProfile) =>
    (u.full_name || u.email).split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  // Keep selectedUser in sync with fetched data
  const currentUser = selectedUser ? usuarios.find((u) => u.id === selectedUser.id) || selectedUser : null;

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 space-y-5">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-40 rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Equipe</h1>
          <p className="text-sm text-muted-foreground">
            {usuarios.filter((u) => u.status === "ativo").length} ativos · {usuarios.length} total
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><UserPlus className="h-4 w-4" /> Novo Colaborador</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Cadastrar Novo Colaborador</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Nome completo</Label><Input value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Nome do colaborador" /></div>
              <div><Label>E-mail</Label><Input type="email" value={novoEmail} onChange={(e) => setNovoEmail(e.target.value)} placeholder="email@isogesso.com" /></div>
              <div>
                <Label>Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={novoSenha}
                    onChange={(e) => setNovoSenha(e.target.value)}
                    placeholder="Senha de acesso"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div><Label>Telefone</Label><Input value={novoTelefone} onChange={(e) => setNovoTelefone(e.target.value)} placeholder="(11) 99999-0000" /></div>
              <div><Label>Cargo</Label><Input value={novoCargo} onChange={(e) => setNovoCargo(e.target.value)} placeholder="Ex: Técnico de Campo" /></div>
              <div>
                <Label>Nível de Acesso</Label>
                <Select value={novoRole} onValueChange={setNovoRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="vendedor">Vendedor</SelectItem>
                    <SelectItem value="estoquista">Estoquista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAdd} className="w-full gap-2" disabled={createUser.isPending}>
                <UserPlus className="h-4 w-4" />
                {createUser.isPending ? "Criando..." : "Cadastrar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search + Filter Pills */}
      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nome, e-mail ou cargo..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {filterPills.map((f) => (
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

      {/* User Cards */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((u) => (
          <Card
            key={u.id}
            className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
            onClick={() => setSelectedUser(u)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {getInitials(u)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm truncate">{u.full_name || u.email}</h3>
                  <p className="text-xs text-muted-foreground">{u.cargo || "Sem cargo"}</p>
                </div>
                <Badge variant="secondary" className={`text-[10px] ${statusColors[u.status]}`}>{u.status}</Badge>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Mail className="h-3 w-3 shrink-0" /><span className="truncate">{u.email}</span></div>
                {u.phone && <div className="flex items-center gap-2"><Phone className="h-3 w-3 shrink-0" /><span>{u.phone}</span></div>}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Badge variant="secondary" className={`gap-1 text-[10px] ${roleColors[u.role] || roleColors.tecnico}`}>
                  <Shield className="h-2.5 w-2.5" />{roleLabels[u.role] || u.role}
                </Badge>
                {u.comissao_habilitada && (
                  <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-0.5">
                    <Percent className="h-2.5 w-2.5" />{u.comissao_percent}%
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
          {currentUser && (
            <>
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6">
                <SheetHeader className="mb-0">
                  <SheetTitle className="sr-only">{currentUser.full_name || currentUser.email}</SheetTitle>
                </SheetHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-18 w-18 border-2 border-background shadow-md">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold h-18 w-18">
                      {getInitials(currentUser)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{currentUser.full_name || currentUser.email}</h2>
                    <p className="text-sm text-muted-foreground">{currentUser.cargo || "Sem cargo"}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className={`text-xs ${roleColors[currentUser.role] || roleColors.tecnico}`}>
                        <Shield className="h-3 w-3 mr-1" />{roleLabels[currentUser.role] || currentUser.role}
                      </Badge>
                      <Badge variant="secondary" className={`text-xs ${statusColors[currentUser.status]}`}>
                        {currentUser.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="dados" className="w-full">
                <TabsList className="w-full rounded-none border-b bg-transparent p-0 h-auto">
                  <TabsTrigger value="dados" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex-1 py-3 text-xs">Dados</TabsTrigger>
                  <TabsTrigger value="financeiro" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex-1 py-3 text-xs">Comissões</TabsTrigger>
                  <TabsTrigger value="acesso" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex-1 py-3 text-xs">Acesso</TabsTrigger>
                </TabsList>

                {/* Dados */}
                <TabsContent value="dados" className="p-6 space-y-4 mt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm"><Mail className="h-4 w-4 text-muted-foreground shrink-0" /><span>{currentUser.email}</span></div>
                    {currentUser.phone && <div className="flex items-center gap-3 text-sm"><Phone className="h-4 w-4 text-muted-foreground shrink-0" /><span>{currentUser.phone}</span></div>}
                    {currentUser.cargo && <div className="flex items-center gap-3 text-sm"><Shield className="h-4 w-4 text-muted-foreground shrink-0" /><span>{currentUser.cargo}</span></div>}
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <p className="text-[11px] text-muted-foreground">
                        {currentUser.status === "ativo" ? "Colaborador ativo" : "Colaborador inativo"}
                      </p>
                    </div>
                    <Switch
                      checked={currentUser.status === "ativo"}
                      onCheckedChange={() => toggleStatus(currentUser)}
                    />
                  </div>
                </TabsContent>

                {/* Comissões */}
                <TabsContent value="financeiro" className="p-6 space-y-4 mt-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Habilitar Comissão</Label>
                      <p className="text-[11px] text-muted-foreground">Ativa cálculo de comissão sobre vendas</p>
                    </div>
                    <Switch
                      checked={currentUser.comissao_habilitada}
                      onCheckedChange={() => toggleComissao(currentUser)}
                    />
                  </div>

                  {currentUser.comissao_habilitada && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
                      <div>
                        <Label className="text-sm">Percentual de Comissão</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type="number" min={0} max={100} step={0.5}
                            value={currentUser.comissao_percent}
                            onChange={(e) => updateComissaoPercent(currentUser, Number(e.target.value))}
                            className="w-24 text-center font-mono"
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </TabsContent>

                {/* Acesso */}
                <TabsContent value="acesso" className="p-6 space-y-4 mt-0">
                  <div>
                    <Label className="text-sm font-medium">Nível de Acesso</Label>
                    <Select value={currentUser.role} onValueChange={(v) => handleRoleChange(currentUser, v)}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="tecnico">Técnico</SelectItem>
                        <SelectItem value="vendedor">Vendedor</SelectItem>
                        <SelectItem value="estoquista">Estoquista</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-[11px] text-muted-foreground mt-1">Define quais módulos e funcionalidades o colaborador pode acessar</p>
                  </div>
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
