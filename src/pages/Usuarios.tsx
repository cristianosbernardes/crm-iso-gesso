import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, UserPlus, Shield, Mail, Phone } from "lucide-react";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  role: "admin" | "tecnico" | "estoquista";
  status: "ativo" | "inativo";
}

const initialUsuarios: Usuario[] = [
  { id: 1, nome: "João Administrador", email: "joao@isogesso.com", telefone: "(11) 99999-0001", cargo: "Diretor", role: "admin", status: "ativo" },
  { id: 2, nome: "Pedro Técnico", email: "pedro@isogesso.com", telefone: "(11) 99999-0002", cargo: "Técnico de Campo", role: "tecnico", status: "ativo" },
  { id: 3, nome: "Maria Vendas", email: "maria@isogesso.com", telefone: "(11) 99999-0003", cargo: "Vendedora", role: "tecnico", status: "ativo" },
  { id: 4, nome: "Lucas Estoque", email: "lucas@isogesso.com", telefone: "(11) 99999-0004", cargo: "Estoquista", role: "estoquista", status: "ativo" },
  { id: 5, nome: "Ana Logística", email: "ana@isogesso.com", telefone: "(11) 99999-0005", cargo: "Logística", role: "estoquista", status: "inativo" },
];

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  tecnico: "Técnico/Vendedor",
  estoquista: "Estoquista",
};

const roleColors: Record<string, string> = {
  admin: "bg-primary/15 text-primary",
  tecnico: "bg-info/15 text-info",
  estoquista: "bg-success/15 text-success",
};

const statusColors: Record<string, string> = {
  ativo: "bg-success/15 text-success",
  inativo: "bg-muted text-muted-foreground",
};

const Usuarios = () => {
  const [search, setSearch] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novoTelefone, setNovoTelefone] = useState("");
  const [novoCargo, setNovoCargo] = useState("");
  const [novoRole, setNovoRole] = useState<"admin" | "tecnico" | "estoquista">("tecnico");

  const filtered = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.cargo.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!novoNome || !novoEmail) return;
    setUsuarios([
      ...usuarios,
      {
        id: Date.now(),
        nome: novoNome,
        email: novoEmail,
        telefone: novoTelefone,
        cargo: novoCargo,
        role: novoRole,
        status: "ativo",
      },
    ]);
    setNovoNome("");
    setNovoEmail("");
    setNovoTelefone("");
    setNovoCargo("");
    setNovoRole("tecnico");
    setDialogOpen(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Usuários</h1>
          <p className="text-sm text-muted-foreground">
            {usuarios.length} usuários cadastrados
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" /> Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Nome completo</Label>
                <Input value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Nome do colaborador" />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input type="email" value={novoEmail} onChange={(e) => setNovoEmail(e.target.value)} placeholder="email@isogesso.com" />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input value={novoTelefone} onChange={(e) => setNovoTelefone(e.target.value)} placeholder="(11) 99999-0000" />
              </div>
              <div>
                <Label>Cargo</Label>
                <Input value={novoCargo} onChange={(e) => setNovoCargo(e.target.value)} placeholder="Ex: Técnico de Campo" />
              </div>
              <div>
                <Label>Nível de Acesso</Label>
                <Select value={novoRole} onValueChange={(v) => setNovoRole(v as "admin" | "tecnico" | "estoquista")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="tecnico">Técnico/Vendedor</SelectItem>
                    <SelectItem value="estoquista">Estoquista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAdd} className="w-full gap-2">
                <UserPlus className="h-4 w-4" /> Cadastrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nome, e-mail ou cargo..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((u) => (
          <Card key={u.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {u.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{u.nome}</h3>
                  <p className="text-xs text-muted-foreground">{u.cargo}</p>
                </div>
                <Badge variant="secondary" className={statusColors[u.status]}>
                  {u.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{u.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{u.telefone}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Badge variant="secondary" className={`gap-1 ${roleColors[u.role]}`}>
                  <Shield className="h-3 w-3" />
                  {roleLabels[u.role]}
                </Badge>
                <Button variant="outline" size="sm">Editar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
};

export default Usuarios;
