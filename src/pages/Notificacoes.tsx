import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Bell, AlertTriangle, Activity, Settings2, Package, Wifi, WifiOff,
  QrCode, ShoppingCart, Clock, CheckCircle2, XCircle, Send, Mail, Smartphone
} from "lucide-react";

interface Alerta {
  id: number;
  tipo: "estoque" | "integracao" | "sistema" | "vencimento";
  titulo: string;
  descricao: string;
  data: string;
  lido: boolean;
  severidade: "critico" | "alerta" | "info";
}

interface Atividade {
  id: number;
  tipo: "qrcode" | "compra" | "orcamento" | "visita" | "cadastro";
  descricao: string;
  data: string;
  lido: boolean;
}

const alertasMock: Alerta[] = [
  { id: 1, tipo: "estoque", titulo: "Estoque Baixo — Lã de Rocha 50mm", descricao: "Restam apenas 95 unidades. Ponto de reposição: 100 un.", data: "Agora", lido: false, severidade: "critico" },
  { id: 2, tipo: "integracao", titulo: "Evolution API — Desconectada", descricao: "A conexão com WhatsApp foi perdida às 14:30. Reconecte no módulo de Configurações.", data: "2h atrás", lido: false, severidade: "critico" },
  { id: 3, tipo: "estoque", titulo: "Estoque Baixo — Placa RF 15mm", descricao: "Restam 80 unidades. Ponto de reposição: 100 un.", data: "5h atrás", lido: false, severidade: "alerta" },
  { id: 4, tipo: "sistema", titulo: "Backup automático concluído", descricao: "Backup do banco de dados realizado com sucesso às 03:00.", data: "Hoje 03:00", lido: true, severidade: "info" },
  { id: 5, tipo: "vencimento", titulo: "Orçamento ORC-2024-086 vence em 3 dias", descricao: "Orçamento de R$ 67.000 para Obra Industrial MG expira em 06/03/2026.", data: "Ontem", lido: true, severidade: "alerta" },
  { id: 6, tipo: "integracao", titulo: "Resend — E-mail de pós-venda falhou", descricao: "Falha ao enviar e-mail para ana.martins@corp.com. Erro: quota excedida.", data: "Ontem 18:00", lido: true, severidade: "alerta" },
];

const atividadesMock: Atividade[] = [
  { id: 1, tipo: "qrcode", descricao: "Carlos Pereira Engenharia escaneou QR Code do produto Placa de Gesso RF 15mm na obra Centro Empresarial", data: "10 min atrás", lido: false },
  { id: 2, tipo: "compra", descricao: "Construtora Acústica Ltda realizou pedido #1285 — R$ 18.500", data: "30 min atrás", lido: false },
  { id: 3, tipo: "orcamento", descricao: "Novo orçamento ORC-2024-090 gerado via Simulador Acústico por Ana Vendedora", data: "1h atrás", lido: false },
  { id: 4, tipo: "visita", descricao: "Pedro Técnico preencheu checklist de levantamento na obra Auditório UFMG", data: "2h atrás", lido: true },
  { id: 5, tipo: "cadastro", descricao: "Novo cliente cadastrado: Studio Podcast RS — via formulário do site", data: "3h atrás", lido: true },
  { id: 6, tipo: "qrcode", descricao: "Marcos Oliveira escaneou QR Code do produto Lã de Vidro 75mm na obra Studio Podcast POA", data: "4h atrás", lido: true },
  { id: 7, tipo: "compra", descricao: "Fernanda Costa Arquitetura confirmou pagamento do pedido #1283 via PIX", data: "5h atrás", lido: true },
];

const sevCor: Record<string, string> = {
  critico: "bg-destructive/15 text-destructive border-destructive/20",
  alerta: "bg-warning/15 text-warning border-warning/20",
  info: "bg-primary/15 text-primary border-primary/20",
};

const tipoAtivIcone: Record<string, React.ReactNode> = {
  qrcode: <QrCode className="h-4 w-4 text-chart-4" />,
  compra: <ShoppingCart className="h-4 w-4 text-primary" />,
  orcamento: <Clock className="h-4 w-4 text-warning" />,
  visita: <Activity className="h-4 w-4 text-chart-5" />,
  cadastro: <CheckCircle2 className="h-4 w-4 text-green-500" />,
};

const Notificacoes = () => {
  const [alertas, setAlertas] = useState(alertasMock);
  const [atividades, setAtividades] = useState(atividadesMock);
  const [pushBrowser, setPushBrowser] = useState(true);
  const [pushTelegram, setPushTelegram] = useState(false);
  const [pushWhatsapp, setPushWhatsapp] = useState(true);
  const [pushEmail, setPushEmail] = useState(true);

  const naoLidosAlertas = alertas.filter(a => !a.lido).length;
  const naoLidosAtiv = atividades.filter(a => !a.lido).length;

  const marcarTodosLidos = (tipo: "alertas" | "atividades") => {
    if (tipo === "alertas") setAlertas(alertas.map(a => ({ ...a, lido: true })));
    else setAtividades(atividades.map(a => ({ ...a, lido: true })));
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Central de Notificações</h1>
        <p className="text-sm text-muted-foreground">Alertas de sistema, atividade em tempo real e configurações de push</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Alertas Críticos", value: alertas.filter(a => a.severidade === "critico" && !a.lido).length.toString(), icon: <AlertTriangle className="h-5 w-5" />, cor: "bg-destructive/10 text-destructive" },
          { label: "Não Lidos", value: (naoLidosAlertas + naoLidosAtiv).toString(), icon: <Bell className="h-5 w-5" />, cor: "bg-warning/10 text-warning" },
          { label: "Atividades Hoje", value: atividades.length.toString(), icon: <Activity className="h-5 w-5" />, cor: "bg-primary/10 text-primary" },
          { label: "Canais Ativos", value: [pushBrowser, pushTelegram, pushWhatsapp, pushEmail].filter(Boolean).length.toString(), icon: <Smartphone className="h-5 w-5" />, cor: "bg-chart-5/10 text-chart-5" },
        ].map((kpi, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${kpi.cor}`}>{kpi.icon}</div>
              <div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="text-xl font-bold text-foreground">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="alertas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alertas" className="gap-1.5 text-xs">
            <AlertTriangle className="h-3.5 w-3.5" /> Alertas {naoLidosAlertas > 0 && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">{naoLidosAlertas}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="atividade" className="gap-1.5 text-xs">
            <Activity className="h-3.5 w-3.5" /> Atividade {naoLidosAtiv > 0 && <Badge className="text-[10px] px-1.5 py-0 bg-primary">{naoLidosAtiv}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="config" className="gap-1.5 text-xs">
            <Settings2 className="h-3.5 w-3.5" /> Push Config
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alertas">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Alertas de Sistema</CardTitle>
              <Button variant="outline" size="sm" onClick={() => marcarTodosLidos("alertas")}>Marcar todos como lidos</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {alertas.map(a => (
                <motion.div key={a.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${a.lido ? "bg-muted/20" : "bg-muted/50 border-l-4 border-l-destructive/50"}`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${a.tipo === "estoque" ? "bg-warning/10 text-warning" : a.tipo === "integracao" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                    {a.tipo === "estoque" ? <Package className="h-4 w-4" /> : a.tipo === "integracao" ? <WifiOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${a.lido ? "text-muted-foreground" : "text-foreground"}`}>{a.titulo}</p>
                      <Badge variant="outline" className={`text-[10px] ${sevCor[a.severidade]}`}>{a.severidade}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.descricao}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{a.data}</p>
                  </div>
                  {!a.lido && <div className="h-2.5 w-2.5 rounded-full bg-destructive shrink-0 mt-1" />}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="atividade">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Feed de Atividade</CardTitle>
              <Button variant="outline" size="sm" onClick={() => marcarTodosLidos("atividades")}>Marcar todos como lidos</Button>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 space-y-0">
                {atividades.map((a, i) => (
                  <div key={a.id} className="relative pb-5 last:pb-0">
                    {i < atividades.length - 1 && <div className="absolute left-[-16px] top-6 w-px h-full bg-border" />}
                    <div className="absolute left-[-22px] top-1 p-1 rounded-full bg-background border-2 border-border">
                      {tipoAtivIcone[a.tipo]}
                    </div>
                    <div className="ml-2">
                      <p className={`text-sm ${a.lido ? "text-muted-foreground" : "text-foreground font-medium"}`}>{a.descricao}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{a.data}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configurações de Notificação Push</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: "Navegador (Browser Push)", desc: "Notificações nativas do navegador", icon: <Bell className="h-5 w-5" />, checked: pushBrowser, set: setPushBrowser },
                { label: "Telegram Bot", desc: "Alertas via bot @IsoGessoBot", icon: <Send className="h-5 w-5" />, checked: pushTelegram, set: setPushTelegram },
                { label: "WhatsApp (Evolution API)", desc: "Mensagens automáticas via Evolution", icon: <Smartphone className="h-5 w-5" />, checked: pushWhatsapp, set: setPushWhatsapp },
                { label: "E-mail (Resend)", desc: "Resumo diário por e-mail", icon: <Mail className="h-5 w-5" />, checked: pushEmail, set: setPushEmail },
              ].map((ch, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">{ch.icon}</div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{ch.label}</p>
                      <p className="text-xs text-muted-foreground">{ch.desc}</p>
                    </div>
                  </div>
                  <Switch checked={ch.checked} onCheckedChange={ch.set} />
                </div>
              ))}
              <p className="text-xs text-muted-foreground text-center">Integrações reais requerem Lovable Cloud + n8n configurados.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notificacoes;
