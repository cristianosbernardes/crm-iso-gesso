import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2, Plug, Shield, Mail, CreditCard, ScrollText, Webhook, Bell,
  Search, Filter, User, Clock, Package, Calendar, DollarSign, Trash2,
  Edit, Eye, AlertTriangle, CheckCircle2, XCircle, Send, Play, Pause,
  Plus, ExternalLink, RefreshCw, Zap, MessageSquare, BellRing, BellOff,
  Settings, Activity, Globe, Key, Copy, ArrowUpDown, Info
} from "lucide-react";
import { toast } from "sonner";
import GestorCargos from "@/components/configuracoes/GestorCargos";

// ══════════════════════════════════════════════════════════════
// MOCK DATA
// ══════════════════════════════════════════════════════════════

interface AuditLog {
  id: number;
  data: string;
  hora: string;
  usuario: string;
  cargo: string;
  acao: string;
  modulo: string;
  detalhe: string;
  ip: string;
  severidade: "info" | "warning" | "critical";
}

const mockAuditLogs: AuditLog[] = [
  { id: 1, data: "27/02/2026", hora: "14:32", usuario: "Carlos Silva", cargo: "Admin", acao: "Alterou preço", modulo: "Produtos", detalhe: "Lã de Vidro 50mm: R$ 27,00 → R$ 28,50", ip: "189.45.12.88", severidade: "warning" },
  { id: 2, data: "27/02/2026", hora: "13:15", usuario: "Ana Oliveira", cargo: "Estoquista", acao: "Ajuste estoque", modulo: "Estoque", detalhe: "Parafuso TA 3.5x25: +200 un (Compra NF 4521)", ip: "189.45.12.90", severidade: "info" },
  { id: 3, data: "27/02/2026", hora: "11:40", usuario: "Pedro Santos", cargo: "Admin", acao: "Excluiu agendamento", modulo: "Agenda", detalhe: "Visita técnica - Cliente Marcos (01/03)", ip: "200.12.45.67", severidade: "critical" },
  { id: 4, data: "26/02/2026", hora: "16:22", usuario: "Maria Souza", cargo: "Técnico", acao: "Checklist preenchido", modulo: "Agenda", detalhe: "Visita #3 - Home Theater (8/8 itens)", ip: "177.88.23.45", severidade: "info" },
  { id: 5, data: "26/02/2026", hora: "15:10", usuario: "Carlos Silva", cargo: "Admin", acao: "Criou usuário", modulo: "Usuários", detalhe: "Novo técnico: João Mendes (joao@isogesso.com)", ip: "189.45.12.88", severidade: "info" },
  { id: 6, data: "26/02/2026", hora: "10:05", usuario: "Ana Oliveira", cargo: "Estoquista", acao: "Saída estoque", modulo: "Estoque", detalhe: "Placa ST 12.5mm: -15 un (OS 1283)", ip: "189.45.12.90", severidade: "info" },
  { id: 7, data: "25/02/2026", hora: "09:30", usuario: "Pedro Santos", cargo: "Admin", acao: "Alterou permissão", modulo: "Segurança", detalhe: "Cargo Estoquista: removeu acesso a Financeiro", ip: "200.12.45.67", severidade: "warning" },
  { id: 8, data: "25/02/2026", hora: "08:15", usuario: "Sistema", cargo: "Sistema", acao: "Backup automático", modulo: "Sistema", detalhe: "Backup completo do banco de dados (32 MB)", ip: "10.0.0.1", severidade: "info" },
  { id: 9, data: "24/02/2026", hora: "17:45", usuario: "Carlos Silva", cargo: "Admin", acao: "Webhook criado", modulo: "Integrações", detalhe: "n8n: Alerta estoque baixo → Telegram", ip: "189.45.12.88", severidade: "info" },
  { id: 10, data: "24/02/2026", hora: "14:20", usuario: "Ana Oliveira", cargo: "Estoquista", acao: "Tentativa bloqueada", modulo: "Financeiro", detalhe: "Acesso negado: sem permissão para módulo Financeiro", ip: "189.45.12.90", severidade: "critical" },
];

interface WebhookConfig {
  id: number;
  nome: string;
  tipo: "n8n" | "resend" | "telegram" | "evolution" | "custom";
  url: string;
  evento: string;
  ativo: boolean;
  ultimoEnvio: string;
  statusUltimo: "sucesso" | "falha" | "pendente";
  headers?: string;
}

const mockWebhooks: WebhookConfig[] = [
  { id: 1, nome: "Alerta Estoque Baixo", tipo: "n8n", url: "https://n8n.isogesso.com/webhook/estoque-baixo", evento: "estoque.baixo", ativo: true, ultimoEnvio: "27/02 14:00", statusUltimo: "sucesso" },
  { id: 2, nome: "Novo Orçamento → E-mail", tipo: "resend", url: "https://n8n.isogesso.com/webhook/orcamento-email", evento: "orcamento.criado", ativo: true, ultimoEnvio: "26/02 16:30", statusUltimo: "sucesso" },
  { id: 3, nome: "Visita Confirmada → WhatsApp", tipo: "evolution", url: "https://n8n.isogesso.com/webhook/visita-whatsapp", evento: "agenda.confirmada", ativo: true, ultimoEnvio: "27/02 08:00", statusUltimo: "sucesso" },
  { id: 4, nome: "Relatório Diário → Telegram", tipo: "telegram", url: "https://n8n.isogesso.com/webhook/relatorio-diario", evento: "sistema.relatorio_diario", ativo: false, ultimoEnvio: "25/02 18:00", statusUltimo: "falha" },
  { id: 5, nome: "Preço Alterado → Log", tipo: "custom", url: "https://n8n.isogesso.com/webhook/preco-log", evento: "produto.preco_alterado", ativo: true, ultimoEnvio: "27/02 14:32", statusUltimo: "sucesso" },
];

interface NotificacaoConfig {
  id: number;
  evento: string;
  descricao: string;
  canais: { email: boolean; telegram: boolean; whatsapp: boolean; push: boolean };
  destinatarios: string[];
  ativo: boolean;
  prioridade: "alta" | "media" | "baixa";
}

const mockNotificacoes: NotificacaoConfig[] = [
  { id: 1, evento: "Estoque Baixo", descricao: "Produto abaixo de 100 unidades", canais: { email: true, telegram: true, whatsapp: false, push: true }, destinatarios: ["Carlos Silva", "Ana Oliveira"], ativo: true, prioridade: "alta" },
  { id: 2, evento: "Estoque Crítico", descricao: "Produto abaixo de 30 unidades", canais: { email: true, telegram: true, whatsapp: true, push: true }, destinatarios: ["Carlos Silva", "Ana Oliveira", "Pedro Santos"], ativo: true, prioridade: "alta" },
  { id: 3, evento: "Nova Venda Registrada", descricao: "Quando uma OS é finalizada", canais: { email: true, telegram: false, whatsapp: false, push: false }, destinatarios: ["Carlos Silva"], ativo: true, prioridade: "media" },
  { id: 4, evento: "Visita Agendada", descricao: "Novo compromisso na agenda", canais: { email: true, telegram: true, whatsapp: false, push: true }, destinatarios: ["João Mendes", "Maria Souza"], ativo: true, prioridade: "media" },
  { id: 5, evento: "Orçamento Aprovado", descricao: "Cliente aprovou o orçamento", canais: { email: true, telegram: true, whatsapp: true, push: true }, destinatarios: ["Carlos Silva", "Pedro Santos"], ativo: true, prioridade: "alta" },
  { id: 6, evento: "Backup Concluído", descricao: "Backup diário do banco de dados", canais: { email: true, telegram: false, whatsapp: false, push: false }, destinatarios: ["Carlos Silva"], ativo: false, prioridade: "baixa" },
  { id: 7, evento: "Login Suspeito", descricao: "Tentativa de login de IP desconhecido", canais: { email: true, telegram: true, whatsapp: true, push: true }, destinatarios: ["Carlos Silva", "Pedro Santos"], ativo: true, prioridade: "alta" },
];

// ══════════════════════════════════════════════════════════════
// COMPONENTES
// ══════════════════════════════════════════════════════════════

const severidadeConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  info: { label: "Info", color: "bg-blue-500/15 text-blue-600", icon: <Info className="h-3.5 w-3.5" /> },
  warning: { label: "Alerta", color: "bg-amber-500/15 text-amber-600", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  critical: { label: "Crítico", color: "bg-destructive/15 text-destructive", icon: <XCircle className="h-3.5 w-3.5" /> },
};

const webhookTipoConfig: Record<string, { label: string; color: string }> = {
  n8n: { label: "n8n", color: "bg-orange-500/15 text-orange-600" },
  resend: { label: "Resend", color: "bg-purple-500/15 text-purple-600" },
  telegram: { label: "Telegram", color: "bg-blue-500/15 text-blue-600" },
  evolution: { label: "WhatsApp", color: "bg-green-500/15 text-green-600" },
  custom: { label: "Custom", color: "bg-muted text-muted-foreground" },
};

// ── Aba: Logs de Auditoria ──
const LogsAuditoria = () => {
  const [search, setSearch] = useState("");
  const [filtroSeveridade, setFiltroSeveridade] = useState("todos");
  const [filtroModulo, setFiltroModulo] = useState("todos");

  const filtered = mockAuditLogs.filter(log => {
    const matchSearch = log.usuario.toLowerCase().includes(search.toLowerCase()) ||
      log.acao.toLowerCase().includes(search.toLowerCase()) ||
      log.detalhe.toLowerCase().includes(search.toLowerCase());
    const matchSev = filtroSeveridade === "todos" || log.severidade === filtroSeveridade;
    const matchMod = filtroModulo === "todos" || log.modulo === filtroModulo;
    return matchSearch && matchSev && matchMod;
  });

  const modulos = [...new Set(mockAuditLogs.map(l => l.modulo))];

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Total de Registros</p>
          <p className="text-2xl font-bold text-foreground">{mockAuditLogs.length}</p>
          <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Alertas</p>
          <p className="text-2xl font-bold text-amber-600">{mockAuditLogs.filter(l => l.severidade === "warning").length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Críticos</p>
          <p className="text-2xl font-bold text-destructive">{mockAuditLogs.filter(l => l.severidade === "critical").length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Usuários Ativos</p>
          <p className="text-2xl font-bold text-foreground">{new Set(mockAuditLogs.map(l => l.usuario)).size}</p>
        </CardContent></Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por usuário, ação ou detalhe..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filtroSeveridade} onValueChange={setFiltroSeveridade}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Alerta</SelectItem>
            <SelectItem value="critical">Crítico</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroModulo} onValueChange={setFiltroModulo}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos Módulos</SelectItem>
            {modulos.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[130px]">Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Módulo</TableHead>
                <TableHead className="hidden lg:table-cell">Detalhe</TableHead>
                <TableHead className="w-[80px]">Sev.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log) => {
                const sev = severidadeConfig[log.severidade];
                return (
                  <TableRow key={log.id} className={log.severidade === "critical" ? "bg-destructive/5" : ""}>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {log.data}<br />{log.hora}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-foreground">{log.usuario}</p>
                        <p className="text-xs text-muted-foreground">{log.cargo}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-foreground">{log.acao}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{log.modulo}</Badge></TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-[300px] truncate">{log.detalhe}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`gap-1 text-[10px] ${sev.color}`}>{sev.icon}{sev.label}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ScrollText className="h-10 w-10 mb-2 opacity-40" />
              <p className="text-sm">Nenhum log encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ── Aba: Gestor de Webhooks ──
const GestorWebhooks = () => {
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testWebhook, setTestWebhook] = useState<WebhookConfig | null>(null);
  const [testPayload, setTestPayload] = useState('{\n  "evento": "teste",\n  "produto": "Lã de Vidro 50mm",\n  "estoque": 45\n}');
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTest = (wh: WebhookConfig) => {
    setTestWebhook(wh);
    setTestResult(null);
    setTestDialogOpen(true);
  };

  const handleSendTest = () => {
    setTestResult("loading");
    setTimeout(() => {
      setTestResult("sucesso");
      toast.success(`Teste enviado com sucesso para "${testWebhook?.nome}"`);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{mockWebhooks.length} webhooks configurados · {mockWebhooks.filter(w => w.ativo).length} ativos</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Novo Webhook</Button>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {mockWebhooks.map((wh) => {
          const tipoConf = webhookTipoConfig[wh.tipo];
          return (
            <Card key={wh.id} className={!wh.ativo ? "opacity-60" : ""}>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <Webhook className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm text-foreground">{wh.nome}</h3>
                      <Badge variant="secondary" className={`text-[10px] ${tipoConf.color}`}>{tipoConf.label}</Badge>
                      <Badge variant="outline" className="text-[10px] font-mono">{wh.evento}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono truncate">{wh.url}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Último: {wh.ultimoEnvio}</span>
                      <Badge variant="secondary" className={`text-[10px] gap-1 ${
                        wh.statusUltimo === "sucesso" ? "bg-green-500/15 text-green-600" :
                        wh.statusUltimo === "falha" ? "bg-destructive/15 text-destructive" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {wh.statusUltimo === "sucesso" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {wh.statusUltimo}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={wh.ativo} onCheckedChange={() => toast.info(`Webhook ${wh.ativo ? "desativado" : "ativado"}`)} />
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleTest(wh)}>
                      <Play className="h-3.5 w-3.5" /> Testar
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                      navigator.clipboard.writeText(wh.url);
                      toast.success("URL copiada!");
                    }}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal de Teste */}
      <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Testar Webhook — {testWebhook?.nome}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs">URL de Destino</Label>
              <Input value={testWebhook?.url || ""} readOnly className="font-mono text-xs mt-1" />
            </div>
            <div>
              <Label className="text-xs">Payload JSON</Label>
              <Textarea value={testPayload} onChange={(e) => setTestPayload(e.target.value)} rows={6} className="font-mono text-xs mt-1" />
            </div>
            {testResult === "loading" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" /> Enviando...
              </div>
            )}
            {testResult === "sucesso" && (
              <div className="rounded-lg bg-green-500/10 border border-green-300/30 p-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-700">Enviado com sucesso!</p>
                  <p className="text-xs text-green-600">HTTP 200 OK — Resposta recebida em 234ms</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Fechar</Button></DialogClose>
            <Button className="gap-2" onClick={handleSendTest} disabled={testResult === "loading"}>
              <Send className="h-4 w-4" /> Enviar Teste
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ── Aba: Central de Notificações ──
const CentralNotificacoes = () => {
  const [notifs, setNotifs] = useState(mockNotificacoes);

  const toggleCanal = (id: number, canal: keyof NotificacaoConfig["canais"]) => {
    setNotifs(prev => prev.map(n =>
      n.id === id ? { ...n, canais: { ...n.canais, [canal]: !n.canais[canal] } } : n
    ));
    toast.success("Canal atualizado!");
  };

  const toggleAtivo = (id: number) => {
    setNotifs(prev => prev.map(n =>
      n.id === id ? { ...n, ativo: !n.ativo } : n
    ));
  };

  const prioridadeConfig: Record<string, { label: string; color: string }> = {
    alta: { label: "Alta", color: "bg-destructive/15 text-destructive" },
    media: { label: "Média", color: "bg-amber-500/15 text-amber-600" },
    baixa: { label: "Baixa", color: "bg-muted text-muted-foreground" },
  };

  const canalIcons = {
    email: <Mail className="h-4 w-4" />,
    telegram: <Send className="h-4 w-4" />,
    whatsapp: <MessageSquare className="h-4 w-4" />,
    push: <BellRing className="h-4 w-4" />,
  };

  const canalLabels = {
    email: "E-mail",
    telegram: "Telegram",
    whatsapp: "WhatsApp",
    push: "Push",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{notifs.length} regras de notificação · {notifs.filter(n => n.ativo).length} ativas</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Nova Regra</Button>
      </div>

      {/* Legenda de canais */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-6 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground">Canais disponíveis:</span>
            {(Object.keys(canalIcons) as Array<keyof typeof canalIcons>).map(canal => (
              <div key={canal} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {canalIcons[canal]}
                <span>{canalLabels[canal]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regras */}
      <div className="space-y-3">
        {notifs.map((notif) => {
          const prio = prioridadeConfig[notif.prioridade];
          return (
            <Card key={notif.id} className={!notif.ativo ? "opacity-50" : ""}>
              <CardContent className="p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                        <Bell className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm text-foreground">{notif.evento}</h3>
                          <Badge variant="secondary" className={`text-[10px] ${prio.color}`}>{prio.label}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{notif.descricao}</p>
                      </div>
                    </div>
                    <Switch checked={notif.ativo} onCheckedChange={() => toggleAtivo(notif.id)} />
                  </div>

                  <Separator />

                  {/* Canais */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <span className="text-xs font-medium text-muted-foreground shrink-0">Canais:</span>
                    <div className="flex gap-2 flex-wrap">
                      {(Object.keys(notif.canais) as Array<keyof typeof notif.canais>).map(canal => (
                        <Button
                          key={canal}
                          variant={notif.canais[canal] ? "default" : "outline"}
                          size="sm"
                          className={`gap-1.5 h-8 text-xs ${notif.canais[canal] ? "" : "text-muted-foreground"}`}
                          onClick={() => toggleCanal(notif.id, canal)}
                        >
                          {canalIcons[canal]}
                          {canalLabels[canal]}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Destinatários */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-muted-foreground shrink-0">Destinatários:</span>
                    {notif.destinatarios.map(d => (
                      <Badge key={d} variant="outline" className="text-xs gap-1">
                        <User className="h-3 w-3" />{d}
                      </Badge>
                    ))}
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-primary">
                      <Plus className="h-3 w-3 mr-1" />Adicionar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ══════════════════════════════════════════════════════════════

const Configuracoes = () => (
  <div className="p-6 lg:p-8 space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Configurações & Segurança</h1>
      <p className="text-sm text-muted-foreground">Gerencie empresa, integrações, auditoria e notificações</p>
    </div>

    <Tabs defaultValue="empresa" className="space-y-6">
      <TabsList className="h-auto flex-wrap">
        <TabsTrigger value="empresa" className="gap-1.5 text-xs"><Building2 className="h-3.5 w-3.5" />Empresa</TabsTrigger>
        <TabsTrigger value="cargos" className="gap-1.5 text-xs"><User className="h-3.5 w-3.5" />Cargos</TabsTrigger>
        <TabsTrigger value="integracoes" className="gap-1.5 text-xs"><Plug className="h-3.5 w-3.5" />Integrações</TabsTrigger>
        <TabsTrigger value="auditoria" className="gap-1.5 text-xs"><ScrollText className="h-3.5 w-3.5" />Auditoria</TabsTrigger>
        <TabsTrigger value="webhooks" className="gap-1.5 text-xs"><Webhook className="h-3.5 w-3.5" />Webhooks</TabsTrigger>
        <TabsTrigger value="notificacoes" className="gap-1.5 text-xs"><Bell className="h-3.5 w-3.5" />Notificações</TabsTrigger>
        <TabsTrigger value="permissoes" className="gap-1.5 text-xs"><Shield className="h-3.5 w-3.5" />Permissões</TabsTrigger>
        <TabsTrigger value="assinatura" className="gap-1.5 text-xs"><CreditCard className="h-3.5 w-3.5" />Assinatura</TabsTrigger>
      </TabsList>

      {/* ── Empresa ── */}
      <TabsContent value="empresa">
        <Card>
          <CardHeader><CardTitle className="text-base">Dados da Empresa</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Razão Social</Label><Input defaultValue="ISO-GESSO Soluções Acústicas LTDA" /></div>
            <div><Label>CNPJ</Label><Input defaultValue="12.345.678/0001-90" /></div>
            <div><Label>Endereço</Label><Input defaultValue="Av. Paulista, 1000" /></div>
            <div><Label>Cidade/UF</Label><Input defaultValue="São Paulo, SP" /></div>
            <div><Label>Telefone</Label><Input defaultValue="(11) 3456-7890" /></div>
            <div><Label>E-mail</Label><Input defaultValue="contato@isogesso.com.br" /></div>
            <div className="md:col-span-2"><Button onClick={() => toast.success("Dados salvos!")}>Salvar Alterações</Button></div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ── Cargos ── */}
      <TabsContent value="cargos">
        <GestorCargos />
      </TabsContent>

      {/* ── Integrações ── */}
      <TabsContent value="integracoes">
        <Card>
          <CardHeader><CardTitle className="text-base">APIs e Integrações</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {[
              { label: "WhatsApp (Evolution API)", icon: <MessageSquare className="h-5 w-5 text-green-600" />, fields: ["URL da API", "API Key"], status: "conectado" },
              { label: "Telegram Bot", icon: <Send className="h-5 w-5 text-blue-500" />, fields: ["Token do Bot"], status: "conectado" },
              { label: "E-mail (Resend)", icon: <Mail className="h-5 w-5 text-purple-600" />, fields: ["API Key", "Domínio"], status: "conectado" },
              { label: "n8n (Automações)", icon: <Zap className="h-5 w-5 text-orange-600" />, fields: ["URL do n8n", "API Key"], status: "conectado" },
              { label: "Google Calendar", icon: <Calendar className="h-5 w-5 text-blue-600" />, fields: ["Client ID", "Client Secret"], status: "desconectado" },
            ].map((int) => (
              <div key={int.label} className="space-y-3 border-b border-border pb-5 last:border-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {int.icon}
                    <h3 className="font-medium text-foreground">{int.label}</h3>
                  </div>
                  <Badge variant="secondary" className={`text-[10px] gap-1 ${
                    int.status === "conectado" ? "bg-green-500/15 text-green-600" : "bg-muted text-muted-foreground"
                  }`}>
                    {int.status === "conectado" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {int.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {int.fields.map((f) => (
                    <div key={f}><Label className="text-xs">{f}</Label><Input type="password" placeholder="••••••••" className="mt-1" /></div>
                  ))}
                </div>
              </div>
            ))}
            <Button onClick={() => toast.success("Integrações salvas!")}>Salvar Integrações</Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ── Auditoria ── */}
      <TabsContent value="auditoria">
        <LogsAuditoria />
      </TabsContent>

      {/* ── Webhooks ── */}
      <TabsContent value="webhooks">
        <GestorWebhooks />
      </TabsContent>

      {/* ── Notificações ── */}
      <TabsContent value="notificacoes">
        <CentralNotificacoes />
      </TabsContent>

      {/* ── Permissões ── */}
      <TabsContent value="permissoes">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Matriz de Permissões
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Módulo</TableHead>
                  <TableHead className="text-center">Admin</TableHead>
                  <TableHead className="text-center">Técnico</TableHead>
                  <TableHead className="text-center">Estoquista</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { modulo: "Dashboard", admin: true, tecnico: true, estoquista: true },
                  { modulo: "Produtos", admin: true, tecnico: true, estoquista: true },
                  { modulo: "Clientes", admin: true, tecnico: true, estoquista: false },
                  { modulo: "Agenda", admin: true, tecnico: true, estoquista: false },
                  { modulo: "Financeiro", admin: true, tecnico: false, estoquista: false },
                  { modulo: "Usuários", admin: true, tecnico: false, estoquista: false },
                  { modulo: "Configurações", admin: true, tecnico: false, estoquista: false },
                  { modulo: "Auditoria", admin: true, tecnico: false, estoquista: false },
                ].map(p => (
                  <TableRow key={p.modulo}>
                    <TableCell className="font-medium text-sm">{p.modulo}</TableCell>
                    <TableCell className="text-center">{p.admin ? <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" /> : <XCircle className="h-4 w-4 text-destructive/40 mx-auto" />}</TableCell>
                    <TableCell className="text-center">{p.tecnico ? <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" /> : <XCircle className="h-4 w-4 text-destructive/40 mx-auto" />}</TableCell>
                    <TableCell className="text-center">{p.estoquista ? <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" /> : <XCircle className="h-4 w-4 text-destructive/40 mx-auto" />}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="mt-4 rounded-lg bg-amber-500/10 border border-amber-300/30 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-600">Para ativar permissões granulares com RLS, conecte o Lovable Cloud e configure Supabase com tabela de roles.</p>
          </div>
        </div>
      </TabsContent>

      {/* ── Assinatura ── */}
      <TabsContent value="assinatura">
        <Card>
          <CardHeader><CardTitle className="text-base">Plano e Assinatura</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div>
                <p className="font-semibold text-foreground">Plano Profissional</p>
                <p className="text-sm text-muted-foreground">Manutenção mensal + infraestrutura</p>
              </div>
              <p className="text-2xl font-bold text-primary">R$ 300<span className="text-sm text-muted-foreground">/mês</span></p>
            </div>
            <Button variant="outline">Histórico de Faturas</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
);

export default Configuracoes;
