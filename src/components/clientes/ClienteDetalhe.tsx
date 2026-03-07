import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft, Building2, Mail, Phone, Send, MapPin,
  User, Shield, Calendar, Plus,
} from "lucide-react";
import { type ClienteComRelacoes } from "@/hooks/useClientes";
import { useClientes } from "@/hooks/useClientes";

interface Props {
  cliente: ClienteComRelacoes;
  onBack: () => void;
}

const statusObraCor: Record<string, string> = {
  ativa: "bg-primary/15 text-primary",
  concluida: "bg-emerald-500/15 text-emerald-600",
  pausada: "bg-muted text-muted-foreground",
};

const ClienteDetalhe = ({ cliente: c, onBack }: Props) => {
  const { updateCliente, createObra, createEndereco } = useClientes();
  const [obraDialogOpen, setObraDialogOpen] = useState(false);
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [novaObra, setNovaObra] = useState({ nome: "", endereco: "", status: "ativa" });
  const [novoEnd, setNovoEnd] = useState({ tipo: "entrega", logradouro: "", numero: "", bairro: "", cidade: "", estado: "", cep: "" });

  const getInitials = (nome: string) =>
    nome.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const handleAddObra = async () => {
    if (!novaObra.nome) return;
    await createObra.mutateAsync({ cliente_id: c.id, ...novaObra });
    setNovaObra({ nome: "", endereco: "", status: "ativa" });
    setObraDialogOpen(false);
  };

  const handleAddEnd = async () => {
    if (!novoEnd.logradouro) return;
    await createEndereco.mutateAsync({ cliente_id: c.id, ...novoEnd });
    setNovoEnd({ tipo: "entrega", logradouro: "", numero: "", bairro: "", cidade: "", estado: "", cep: "" });
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
          {c.tags && c.tags.length > 0 && (
            <div className="flex gap-1.5 mt-1">
              {c.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
            </div>
          )}
        </div>
        <div className="hidden md:flex gap-2">
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

      {/* Tabs */}
      <Tabs defaultValue="dados" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="dados" className="gap-1.5 text-xs"><User className="h-3.5 w-3.5" /> Dados</TabsTrigger>
          <TabsTrigger value="enderecos" className="gap-1.5 text-xs"><MapPin className="h-3.5 w-3.5" /> Endereços</TabsTrigger>
          <TabsTrigger value="obras" className="gap-1.5 text-xs"><Building2 className="h-3.5 w-3.5" /> Obras</TabsTrigger>
        </TabsList>

        {/* Dados */}
        <TabsContent value="dados">
          <Card>
            <CardHeader><CardTitle className="text-base">Informações de Contato</CardTitle></CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Endereços */}
        <TabsContent value="enderecos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Endereços</CardTitle>
              <Dialog open={endDialogOpen} onOpenChange={setEndDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Adicionar</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Novo Endereço</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-2">
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
                    <div><Label>Logradouro</Label><Input value={novoEnd.logradouro} onChange={(e) => setNovoEnd({ ...novoEnd, logradouro: e.target.value })} placeholder="Rua, Av..." /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Número</Label><Input value={novoEnd.numero} onChange={(e) => setNovoEnd({ ...novoEnd, numero: e.target.value })} /></div>
                      <div><Label>Bairro</Label><Input value={novoEnd.bairro} onChange={(e) => setNovoEnd({ ...novoEnd, bairro: e.target.value })} /></div>
                      <div><Label>Cidade</Label><Input value={novoEnd.cidade} onChange={(e) => setNovoEnd({ ...novoEnd, cidade: e.target.value })} /></div>
                      <div><Label>Estado</Label><Input value={novoEnd.estado} onChange={(e) => setNovoEnd({ ...novoEnd, estado: e.target.value })} maxLength={2} /></div>
                    </div>
                    <div><Label>CEP</Label><Input value={novoEnd.cep} onChange={(e) => setNovoEnd({ ...novoEnd, cep: e.target.value })} placeholder="00000-000" /></div>
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

        {/* Obras */}
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
