import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen, Play, MessageCircle, Search, ExternalLink, FileText,
  Calculator, Package, Users, Calendar, BarChart3, Settings, ChevronRight, Send
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const artigos = [
  { id: 1, titulo: "Como calibrar o cálculo de reverberação (RT₆₀)", categoria: "Calculadora", icone: <Calculator className="h-4 w-4" />, leitura: "3 min" },
  { id: 2, titulo: "Cadastrando novos perfis e materiais", categoria: "Produtos", icone: <Package className="h-4 w-4" />, leitura: "2 min" },
  { id: 3, titulo: "Gerenciando múltiplas obras por cliente", categoria: "Clientes", icone: <Users className="h-4 w-4" />, leitura: "4 min" },
  { id: 4, titulo: "Configurando integrações com n8n e WhatsApp", categoria: "Configurações", icone: <Settings className="h-4 w-4" />, leitura: "5 min" },
  { id: 5, titulo: "Entendendo os logs de auditoria", categoria: "Segurança", icone: <FileText className="h-4 w-4" />, leitura: "3 min" },
  { id: 6, titulo: "Agendando visitas técnicas com checklist", categoria: "Agenda", icone: <Calendar className="h-4 w-4" />, leitura: "3 min" },
  { id: 7, titulo: "Interpretando o painel financeiro e KPIs", categoria: "Financeiro", icone: <BarChart3 className="h-4 w-4" />, leitura: "4 min" },
  { id: 8, titulo: "Gerando propostas técnicas em PDF", categoria: "Calculadora", icone: <Calculator className="h-4 w-4" />, leitura: "2 min" },
];

const videos = [
  { id: 1, titulo: "Tour completo pelo Dashboard", duracao: "5:30", thumb: "📊" },
  { id: 2, titulo: "Simulador Acústico — Do zero à proposta", duracao: "8:15", thumb: "🔊" },
  { id: 3, titulo: "CRM 360° — Ficha completa do cliente", duracao: "6:45", thumb: "👥" },
  { id: 4, titulo: "Configurando webhooks com n8n", duracao: "4:20", thumb: "🔗" },
  { id: 5, titulo: "Ranking de vendedores e metas", duracao: "3:50", thumb: "🏆" },
  { id: 6, titulo: "Logística: romaneio e assinatura digital", duracao: "5:10", thumb: "🚚" },
];

const Ajuda = () => {
  const [searchArtigo, setSearchArtigo] = useState("");
  const [ticketAssunto, setTicketAssunto] = useState("");
  const [ticketMsg, setTicketMsg] = useState("");

  const artigosFiltrados = artigos.filter(a =>
    a.titulo.toLowerCase().includes(searchArtigo.toLowerCase()) ||
    a.categoria.toLowerCase().includes(searchArtigo.toLowerCase())
  );

  const enviarTicket = () => {
    if (!ticketAssunto || !ticketMsg) return;
    toast({ title: "Ticket enviado!", description: "Nossa equipe responderá em até 24h via e-mail." });
    setTicketAssunto("");
    setTicketMsg("");
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Central de Ajuda</h1>
        <p className="text-sm text-muted-foreground">Base de conhecimento, tutoriais e suporte técnico</p>
      </div>

      <Tabs defaultValue="wiki" className="space-y-4">
        <TabsList>
          <TabsTrigger value="wiki" className="gap-1.5 text-xs"><BookOpen className="h-3.5 w-3.5" /> Base de Conhecimento</TabsTrigger>
          <TabsTrigger value="videos" className="gap-1.5 text-xs"><Play className="h-3.5 w-3.5" /> Tutoriais em Vídeo</TabsTrigger>
          <TabsTrigger value="suporte" className="gap-1.5 text-xs"><MessageCircle className="h-3.5 w-3.5" /> Suporte</TabsTrigger>
        </TabsList>

        <TabsContent value="wiki" className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar artigos..." className="pl-10" value={searchArtigo} onChange={e => setSearchArtigo(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {artigosFiltrados.map(a => (
              <Card key={a.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">{a.icone}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{a.titulo}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px]">{a.categoria}</Badge>
                      <span className="text-[10px] text-muted-foreground">{a.leitura} de leitura</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map(v => (
              <Card key={v.id} className="hover:shadow-md transition-shadow cursor-pointer group overflow-hidden">
                <div className="h-32 bg-muted/50 flex items-center justify-center text-5xl">{v.thumb}</div>
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{v.titulo}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Play className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{v.duracao}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suporte">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Abrir Ticket de Suporte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground">Assunto</label>
                  <Input value={ticketAssunto} onChange={e => setTicketAssunto(e.target.value)} placeholder="Descreva o problema..." />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Mensagem</label>
                  <Textarea value={ticketMsg} onChange={e => setTicketMsg(e.target.value)} placeholder="Detalhe o que está acontecendo..." rows={5} />
                </div>
                <Button className="w-full gap-2" onClick={enviarTicket} disabled={!ticketAssunto || !ticketMsg}>
                  <Send className="h-4 w-4" /> Enviar Ticket
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contato Direto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full gap-2 justify-start" onClick={() => window.open("https://wa.me/5511999999999", "_blank")}>
                  <MessageCircle className="h-4 w-4 text-green-500" /> WhatsApp — Suporte Técnico
                </Button>
                <Button variant="outline" className="w-full gap-2 justify-start" onClick={() => window.open("mailto:suporte@iso-gesso.com.br")}>
                  <Send className="h-4 w-4 text-primary" /> suporte@iso-gesso.com.br
                </Button>
                <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Horário de Atendimento</p>
                  <p>Segunda a Sexta: 08:00 — 18:00</p>
                  <p>Sábado: 08:00 — 12:00</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Ajuda;
