import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Search, Plus, Phone, Mail, MapPin, ArrowLeft, Building2, Calendar, ShoppingCart,
  MessageSquare, FileText, Camera, DollarSign, TrendingUp, Package, Clock, Send,
  User, Cake, Shield, Filter, SortAsc, ChevronRight, QrCode, Mic2, Wrench,
  AlertTriangle, Gift, RotateCcw, X, Image
} from "lucide-react";

// ── Mock Data ──
interface Obra {
  id: number;
  nome: string;
  endereco: string;
  status: "ativa" | "concluida" | "pausada";
  rt60Calculado?: number;
}

interface Compra {
  id: number;
  data: string;
  produtos: string[];
  valor: number;
  status: "fechado" | "orcamento" | "cancelado";
}

interface LogInteracao {
  id: number;
  data: string;
  tipo: "visita" | "qrcode" | "whatsapp" | "email" | "nota" | "sistema";
  descricao: string;
  autor?: string;
}

interface Documento {
  id: number;
  nome: string;
  tipo: "foto" | "laudo" | "orcamento" | "nf";
  data: string;
  tamanho: string;
}

interface Cliente {
  id: number;
  nome: string;
  tipo: "pf" | "pj";
  documento: string;
  email: string;
  telefone: string;
  whatsapp: string;
  cidade: string;
  enderecoEntrega: string;
  enderecoObra: string;
  aniversario: string;
  dataCadastro: string;
  ultimoContato: string;
  totalInvestido: number;
  ticketMedio: number;
  produtoFavorito: string;
  qtdCompras: number;
  obras: Obra[];
  compras: Compra[];
  logs: LogInteracao[];
  documentos: Documento[];
  tags: string[];
}

const mockClientes: Cliente[] = [
  {
    id: 1, nome: "Construtora Acústica Ltda", tipo: "pj", documento: "12.345.678/0001-90",
    email: "contato@acustica.com", telefone: "(11) 3333-1234", whatsapp: "(11) 99999-1234",
    cidade: "São Paulo, SP", enderecoEntrega: "Rua Augusta, 1500 - Consolação",
    enderecoObra: "Av. Paulista, 1000 - Bela Vista", aniversario: "15/03",
    dataCadastro: "2024-01-15", ultimoContato: "2 dias atrás",
    totalInvestido: 48500, ticketMedio: 9700, produtoFavorito: "Lã de Rocha 75mm", qtdCompras: 5,
    tags: ["Construtora", "Premium", "Recorrente"],
    obras: [
      { id: 1, nome: "Edifício Harmonia", endereco: "Av. Paulista, 1000", status: "ativa", rt60Calculado: 0.65 },
      { id: 2, nome: "Studio Mix", endereco: "Rua Oscar Freire, 200", status: "concluida", rt60Calculado: 0.28 },
      { id: 3, nome: "Sala de Conferência Torre Norte", endereco: "Av. Faria Lima, 3000", status: "ativa" },
    ],
    compras: [
      { id: 1, data: "2025-02-10", produtos: ["Lã de Rocha 75mm", "Perfil Montante 70mm", "Parafuso TA 3.5x25"], valor: 12800, status: "fechado" },
      { id: 2, data: "2025-01-20", produtos: ["Lã de Vidro 50mm", "Placa de Gesso ST 12.5mm"], valor: 8500, status: "fechado" },
      { id: 3, data: "2024-12-05", produtos: ["Lã de Rocha 50mm", "Banda Acústica 70mm"], valor: 15200, status: "fechado" },
      { id: 4, data: "2025-02-25", produtos: ["Lã de Rocha 75mm", "Placa de Gesso RF 15mm"], valor: 22000, status: "orcamento" },
    ],
    logs: [
      { id: 1, data: "2025-02-25 14:30", tipo: "sistema", descricao: "Orçamento #004 gerado via Simulador Acústico — R$ 22.000" },
      { id: 2, data: "2025-02-22 09:15", tipo: "whatsapp", descricao: "Lembrete de visita enviado via Evolution API", autor: "Sistema" },
      { id: 3, data: "2025-02-20 16:00", tipo: "visita", descricao: "Visita técnica na obra Edifício Harmonia. Checklist preenchido: teto laje, paredes alvenaria, ruído 55dB", autor: "João Técnico" },
      { id: 4, data: "2025-02-18 11:30", tipo: "qrcode", descricao: "Cliente escaneou QR Code do produto Lã de Rocha 75mm na obra Edifício Harmonia" },
      { id: 5, data: "2025-02-15 08:00", tipo: "email", descricao: "E-mail de pós-venda enviado via Resend — 'Como está o desempenho acústico?'", autor: "Sistema" },
      { id: 6, data: "2025-02-10 10:00", tipo: "nota", descricao: "Cliente tem dúvida sobre densidade da lã para sala de reuniões. Recomendei 48 kg/m³", autor: "Ana Vendedora" },
    ],
    documentos: [
      { id: 1, nome: "Laudo RT60 - Edifício Harmonia.pdf", tipo: "laudo", data: "2025-02-20", tamanho: "2.4 MB" },
      { id: 2, nome: "Foto antes - Sala conferência.jpg", tipo: "foto", data: "2025-02-18", tamanho: "1.8 MB" },
      { id: 3, nome: "Foto depois - Studio Mix.jpg", tipo: "foto", data: "2025-01-10", tamanho: "2.1 MB" },
      { id: 4, nome: "Orçamento #004.pdf", tipo: "orcamento", data: "2025-02-25", tamanho: "540 KB" },
      { id: 5, nome: "NF 2025-001.pdf", tipo: "nf", data: "2025-02-10", tamanho: "180 KB" },
    ],
  },
  {
    id: 2, nome: "Ana Martins", tipo: "pf", documento: "123.456.789-00",
    email: "ana.martins@corp.com", telefone: "(21) 3333-5678", whatsapp: "(21) 98888-5678",
    cidade: "Rio de Janeiro, RJ", enderecoEntrega: "Rua Visconde de Pirajá, 300 - Ipanema",
    enderecoObra: "Rua Voluntários da Pátria, 100 - Botafogo", aniversario: "22/07",
    dataCadastro: "2024-06-10", ultimoContato: "1 semana",
    totalInvestido: 12000, ticketMedio: 6000, produtoFavorito: "Placa de Gesso RU 12.5mm", qtdCompras: 2,
    tags: ["Arquiteta", "Residencial"],
    obras: [{ id: 1, nome: "Home Theater Ipanema", endereco: "Rua Visconde de Pirajá, 300", status: "ativa", rt60Calculado: 0.35 }],
    compras: [
      { id: 1, data: "2025-01-15", produtos: ["Placa de Gesso RU 12.5mm", "Lã de Vidro 75mm"], valor: 7200, status: "fechado" },
      { id: 2, data: "2024-10-20", produtos: ["Lã de Vidro 50mm"], valor: 4800, status: "fechado" },
    ],
    logs: [
      { id: 1, data: "2025-02-20 10:00", tipo: "whatsapp", descricao: "Mensagem pós-venda enviada — sem resposta", autor: "Sistema" },
      { id: 2, data: "2025-01-15 14:00", tipo: "nota", descricao: "Cliente quer expandir tratamento para quarto ao lado do home theater", autor: "Carlos Vendedor" },
    ],
    documentos: [
      { id: 1, nome: "Foto antes - Home Theater.jpg", tipo: "foto", data: "2024-10-15", tamanho: "1.5 MB" },
    ],
  },
  {
    id: 3, nome: "Carlos Pereira Engenharia", tipo: "pj", documento: "98.765.432/0001-10",
    email: "carlos@engenharia.com", telefone: "(31) 3333-9012", whatsapp: "(31) 97777-9012",
    cidade: "Belo Horizonte, MG", enderecoEntrega: "Av. Afonso Pena, 2000 - Centro",
    enderecoObra: "Rua da Bahia, 500 - Lourdes", aniversario: "05/11",
    dataCadastro: "2023-09-01", ultimoContato: "Hoje",
    totalInvestido: 95000, ticketMedio: 19000, produtoFavorito: "Lã de Rocha 75mm", qtdCompras: 5,
    tags: ["Engenharia", "Premium", "Alto Volume", "Recorrente"],
    obras: [
      { id: 1, nome: "Centro Empresarial Minas", endereco: "Rua da Bahia, 500", status: "ativa" },
      { id: 2, nome: "Auditório UFMG", endereco: "Av. Antônio Carlos, 6627", status: "ativa", rt60Calculado: 0.92 },
      { id: 3, nome: "Clínica Audiológica Premium", endereco: "Rua Espírito Santo, 800", status: "concluida", rt60Calculado: 0.30 },
      { id: 4, nome: "Restaurante Acústico", endereco: "Rua Pium-í, 200", status: "concluida", rt60Calculado: 0.55 },
      { id: 5, nome: "Coworking Innovation Hub", endereco: "Av. do Contorno, 3000", status: "pausada" },
    ],
    compras: [
      { id: 1, data: "2025-02-01", produtos: ["Lã de Rocha 75mm", "Perfil Montante 70mm", "Perfil Guia 70mm", "Parafuso TA 3.5x35"], valor: 28000, status: "fechado" },
      { id: 2, data: "2024-11-10", produtos: ["Lã de Rocha 50mm", "Placa de Gesso RF 15mm"], valor: 18500, status: "fechado" },
    ],
    logs: [
      { id: 1, data: "2025-02-27 08:00", tipo: "sistema", descricao: "🎯 Oportunidade de venda cruzada: cliente comprou perfis mas não comprou banda acústica" },
      { id: 2, data: "2025-02-25 16:30", tipo: "visita", descricao: "Medição final no Auditório UFMG. RT₆₀ medido: 0.92s — dentro da faixa ideal", autor: "Pedro Técnico" },
      { id: 3, data: "2025-02-20 09:00", tipo: "qrcode", descricao: "Escaneou QR do produto Placa de Gesso RF 15mm no canteiro da obra Centro Empresarial" },
    ],
    documentos: [
      { id: 1, nome: "Laudo RT60 - Auditório UFMG.pdf", tipo: "laudo", data: "2025-02-25", tamanho: "3.2 MB" },
      { id: 2, nome: "Laudo RT60 - Clínica Audiológica.pdf", tipo: "laudo", data: "2024-08-15", tamanho: "2.8 MB" },
    ],
  },
  {
    id: 4, nome: "Fernanda Costa Arquitetura", tipo: "pj", documento: "45.678.901/0001-23",
    email: "fer.costa@arq.com", telefone: "(41) 3333-3456", whatsapp: "(41) 96666-3456",
    cidade: "Curitiba, PR", enderecoEntrega: "Rua XV de Novembro, 700",
    enderecoObra: "Rua Marechal Deodoro, 400", aniversario: "30/01",
    dataCadastro: "2024-04-20", ultimoContato: "3 dias atrás",
    totalInvestido: 22000, ticketMedio: 11000, produtoFavorito: "Lã de Vidro 75mm", qtdCompras: 2,
    tags: ["Arquitetura", "Residencial"],
    obras: [
      { id: 1, nome: "Apartamento Batel", endereco: "Rua Marechal Deodoro, 400", status: "ativa", rt60Calculado: 0.42 },
      { id: 2, nome: "Escritório Centro Cívico", endereco: "Rua Cândido de Abreu, 150", status: "concluida" },
    ],
    compras: [
      { id: 1, data: "2025-01-05", produtos: ["Lã de Vidro 75mm", "Fita Telada 50mm", "Massa para Juntas 28kg"], valor: 13500, status: "fechado" },
    ],
    logs: [
      { id: 1, data: "2025-02-20 11:00", tipo: "email", descricao: "E-mail com catálogo de novos produtos enviado via Resend", autor: "Sistema" },
    ],
    documentos: [],
  },
  {
    id: 5, nome: "Marcos Oliveira", tipo: "pf", documento: "987.654.321-00",
    email: "marcos@engenharia.com", telefone: "(51) 3333-7890", whatsapp: "(51) 95555-7890",
    cidade: "Porto Alegre, RS", enderecoEntrega: "Av. Borges de Medeiros, 1500",
    enderecoObra: "Rua dos Andradas, 800", aniversario: "18/09",
    dataCadastro: "2024-08-05", ultimoContato: "5 dias atrás",
    totalInvestido: 35000, ticketMedio: 8750, produtoFavorito: "Perfil Montante 48mm", qtdCompras: 4,
    tags: ["Instalador", "Recorrente"],
    obras: [
      { id: 1, nome: "Reforma Centro Histórico", endereco: "Rua dos Andradas, 800", status: "ativa" },
      { id: 2, nome: "Studio Podcast POA", endereco: "Av. Ipiranga, 1200", status: "concluida", rt60Calculado: 0.25 },
      { id: 3, nome: "Consultório Médico", endereco: "Rua Vigário José Inácio, 300", status: "ativa" },
      { id: 4, nome: "Sala de Cinema Residencial", endereco: "Av. Protásio Alves, 5000", status: "concluida", rt60Calculado: 0.38 },
    ],
    compras: [
      { id: 1, data: "2025-02-18", produtos: ["Perfil Montante 48mm", "Perfil Guia 48mm", "Parafuso TB 4.2x13"], valor: 6200, status: "fechado" },
    ],
    logs: [
      { id: 1, data: "2025-02-22 14:00", tipo: "nota", descricao: "Interessado em parceria para indicação de clientes. Avaliar programa de afiliados", autor: "Diretor Comercial" },
    ],
    documentos: [
      { id: 1, nome: "Foto depois - Studio Podcast.jpg", tipo: "foto", data: "2024-12-20", tamanho: "2.5 MB" },
    ],
  },
  {
    id: 6, nome: "Juliana Santos Design", tipo: "pj", documento: "67.890.123/0001-45",
    email: "ju.santos@design.com", telefone: "(61) 3333-2345", whatsapp: "(61) 94444-2345",
    cidade: "Brasília, DF", enderecoEntrega: "SCS Quadra 1, Bloco A",
    enderecoObra: "SQN 308, Bloco B", aniversario: "12/06",
    dataCadastro: "2025-01-10", ultimoContato: "2 semanas",
    totalInvestido: 4800, ticketMedio: 4800, produtoFavorito: "Lã de Vidro 50mm", qtdCompras: 1,
    tags: ["Design", "Novo"],
    obras: [{ id: 1, nome: "Sala de Som Residencial", endereco: "SQN 308, Bloco B, Apt 401", status: "ativa" }],
    compras: [
      { id: 1, data: "2025-01-20", produtos: ["Lã de Vidro 50mm", "Placa de Gesso ST 12.5mm"], valor: 4800, status: "fechado" },
    ],
    logs: [
      { id: 1, data: "2025-01-20 15:00", tipo: "sistema", descricao: "Primeiro pedido realizado — cliente cadastrado automaticamente" },
    ],
    documentos: [],
  },
];

const tipoLogIcone: Record<string, React.ReactNode> = {
  visita: <Wrench className="h-4 w-4 text-primary" />,
  qrcode: <QrCode className="h-4 w-4 text-chart-4" />,
  whatsapp: <Send className="h-4 w-4 text-green-500" />,
  email: <Mail className="h-4 w-4 text-chart-5" />,
  nota: <MessageSquare className="h-4 w-4 text-muted-foreground" />,
  sistema: <AlertTriangle className="h-4 w-4 text-warning" />,
};

const tipoLogBadge: Record<string, string> = {
  visita: "bg-primary/15 text-primary",
  qrcode: "bg-chart-4/15 text-chart-4",
  whatsapp: "bg-green-500/15 text-green-600",
  email: "bg-chart-5/15 text-chart-5",
  nota: "bg-muted text-muted-foreground",
  sistema: "bg-warning/15 text-warning",
};

const statusObraCor: Record<string, string> = {
  ativa: "bg-primary/15 text-primary",
  concluida: "bg-green-500/15 text-green-600",
  pausada: "bg-muted text-muted-foreground",
};

const Clientes = () => {
  const [search, setSearch] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [filtroTag, setFiltroTag] = useState("Todos");
  const [filtroUltimaCompra, setFiltroUltimaCompra] = useState("Todos");
  const [ordenacao, setOrdenacao] = useState("nome");

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    mockClientes.forEach(c => c.tags.forEach(t => tags.add(t)));
    return ["Todos", ...Array.from(tags)];
  }, []);

  const filtered = useMemo(() => {
    let result = mockClientes.filter(c =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.cidade.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.documento.includes(search)
    );
    if (filtroTag !== "Todos") result = result.filter(c => c.tags.includes(filtroTag));
    if (ordenacao === "nome") result.sort((a, b) => a.nome.localeCompare(b.nome));
    else if (ordenacao === "investido") result.sort((a, b) => b.totalInvestido - a.totalInvestido);
    else if (ordenacao === "recente") result.sort((a, b) => b.dataCadastro.localeCompare(a.dataCadastro));
    return result;
  }, [search, filtroTag, ordenacao]);

  // ── Detail View ──
  if (clienteSelecionado) {
    const c = clienteSelecionado;
    return (
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setClienteSelecionado(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
              {c.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{c.nome}</h1>
              <Badge variant="outline" className="text-xs">{c.tipo === "pj" ? "PJ" : "PF"}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{c.documento} · {c.cidade}</p>
            <div className="flex gap-1.5 mt-1">
              {c.tags.map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
            </div>
          </div>
          <div className="hidden md:flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.open(`https://wa.me/55${c.whatsapp.replace(/\D/g, "")}`, "_blank")}>
              <Send className="h-3.5 w-3.5" /> WhatsApp
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.open(`mailto:${c.email}`)}>
              <Mail className="h-3.5 w-3.5" /> E-mail
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Investido", value: `R$ ${c.totalInvestido.toLocaleString("pt-BR")}`, icon: <DollarSign className="h-5 w-5" />, cor: "text-primary" },
            { label: "Ticket Médio", value: `R$ ${c.ticketMedio.toLocaleString("pt-BR")}`, icon: <TrendingUp className="h-5 w-5" />, cor: "text-chart-4" },
            { label: "Produto Favorito", value: c.produtoFavorito, icon: <Package className="h-5 w-5" />, cor: "text-chart-5" },
            { label: "Obras Vinculadas", value: `${c.obras.length} obras`, icon: <Building2 className="h-5 w-5" />, cor: "text-warning" },
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
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="dados" className="gap-1.5 text-xs"><User className="h-3.5 w-3.5" /> Dados Gerais</TabsTrigger>
            <TabsTrigger value="compras" className="gap-1.5 text-xs"><ShoppingCart className="h-3.5 w-3.5" /> Compras</TabsTrigger>
            <TabsTrigger value="timeline" className="gap-1.5 text-xs"><Clock className="h-3.5 w-3.5" /> Timeline</TabsTrigger>
            <TabsTrigger value="docs" className="gap-1.5 text-xs"><FileText className="h-3.5 w-3.5" /> Documentos</TabsTrigger>
            <TabsTrigger value="obras" className="gap-1.5 text-xs"><Building2 className="h-3.5 w-3.5" /> Obras</TabsTrigger>
          </TabsList>

          {/* ── Dados Gerais ── */}
          <TabsContent value="dados">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-base">Informações de Contato</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: <User className="h-4 w-4" />, label: c.tipo === "pj" ? "Razão Social" : "Nome", value: c.nome },
                    { icon: <Shield className="h-4 w-4" />, label: c.tipo === "pj" ? "CNPJ" : "CPF", value: c.documento },
                    { icon: <Mail className="h-4 w-4" />, label: "E-mail", value: c.email },
                    { icon: <Phone className="h-4 w-4" />, label: "Telefone", value: c.telefone },
                    { icon: <Send className="h-4 w-4" />, label: "WhatsApp", value: c.whatsapp },
                    { icon: <Cake className="h-4 w-4" />, label: "Aniversário", value: c.aniversario },
                    { icon: <Calendar className="h-4 w-4" />, label: "Cliente desde", value: new Date(c.dataCadastro).toLocaleDateString("pt-BR") },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground">{item.icon}</span>
                      <span className="text-muted-foreground w-28">{item.label}</span>
                      <span className="text-foreground font-medium">{item.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Endereços</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">📦 Endereço de Entrega</p>
                    <p className="text-sm text-foreground">{c.enderecoEntrega}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">🏗️ Endereço de Obra Principal</p>
                    <p className="text-sm text-foreground">{c.enderecoObra}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-1">
                    <p className="text-xs font-medium text-primary">🔒 LGPD</p>
                    <p className="text-xs text-muted-foreground">Dados protegidos com criptografia. Supabase RLS + Cloudflare WAF ativo.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Compras & Orçamentos ── */}
          <TabsContent value="compras">
            <Card>
              <CardHeader><CardTitle className="text-base">Histórico de Compras & Orçamentos</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {c.compras.map(compra => (
                    <div key={compra.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className={`p-2 rounded-lg ${compra.status === "fechado" ? "bg-primary/10 text-primary" : compra.status === "orcamento" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                        <ShoppingCart className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{compra.produtos.join(", ")}</p>
                          <Badge variant="outline" className={`text-[10px] ${compra.status === "fechado" ? "border-primary/30 text-primary" : compra.status === "orcamento" ? "border-warning/30 text-warning" : ""}`}>
                            {compra.status === "fechado" ? "Fechado" : compra.status === "orcamento" ? "Orçamento" : "Cancelado"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{new Date(compra.data).toLocaleDateString("pt-BR")}</p>
                      </div>
                      <p className="font-mono font-semibold text-foreground">R$ {compra.valor.toLocaleString("pt-BR")}</p>
                    </div>
                  ))}
                </div>
                {/* Alertas de automação */}
                <div className="mt-6 space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Automações Vinculadas (n8n)</p>
                  <div className="p-3 rounded-lg border border-warning/30 bg-warning/5 flex items-start gap-3">
                    <RotateCcw className="h-4 w-4 text-warning mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Pós-Venda Automático</p>
                      <p className="text-xs text-muted-foreground">15 dias após cada compra, WhatsApp enviado: "Como está o desempenho acústico?"</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border border-chart-4/30 bg-chart-4/5 flex items-start gap-3">
                    <Gift className="h-4 w-4 text-chart-4 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Aniversário: {c.aniversario}</p>
                      <p className="text-xs text-muted-foreground">Mensagem automática com cupom de desconto via Evolution API</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Timeline ── */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader><CardTitle className="text-base">Linha do Tempo de Interações</CardTitle></CardHeader>
              <CardContent>
                <div className="relative pl-6 space-y-0">
                  {c.logs.map((log, i) => (
                    <div key={log.id} className="relative pb-6 last:pb-0">
                      {/* Line */}
                      {i < c.logs.length - 1 && <div className="absolute left-[-16px] top-6 w-px h-full bg-border" />}
                      {/* Dot */}
                      <div className="absolute left-[-22px] top-1 p-1 rounded-full bg-background border-2 border-border">
                        {tipoLogIcone[log.tipo]}
                      </div>
                      <div className="ml-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`text-[10px] ${tipoLogBadge[log.tipo]}`}>
                            {log.tipo === "visita" ? "Visita" : log.tipo === "qrcode" ? "QR Code" : log.tipo === "whatsapp" ? "WhatsApp" : log.tipo === "email" ? "E-mail" : log.tipo === "nota" ? "Nota" : "Sistema"}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{log.data}</span>
                        </div>
                        <p className="text-sm text-foreground">{log.descricao}</p>
                        {log.autor && <p className="text-[10px] text-muted-foreground mt-0.5">— {log.autor}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Documentos ── */}
          <TabsContent value="docs">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Documentos & Fotos da Obra</CardTitle>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Upload
                </Button>
              </CardHeader>
              <CardContent>
                {c.documentos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Image className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Nenhum documento cadastrado</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {c.documentos.map(doc => (
                      <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className={`p-2 rounded-lg ${doc.tipo === "foto" ? "bg-chart-5/10 text-chart-5" : doc.tipo === "laudo" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {doc.tipo === "foto" ? <Camera className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{doc.nome}</p>
                          <p className="text-xs text-muted-foreground">{new Date(doc.data).toLocaleDateString("pt-BR")} · {doc.tamanho}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          {doc.tipo === "foto" ? "Foto" : doc.tipo === "laudo" ? "Laudo" : doc.tipo === "orcamento" ? "Orçamento" : "NF"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Obras ── */}
          <TabsContent value="obras">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Projetos / Obras Vinculadas</CardTitle>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Nova Obra
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {c.obras.map(obra => (
                    <div key={obra.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{obra.nome}</p>
                          <Badge className={`text-[10px] ${statusObraCor[obra.status]}`}>
                            {obra.status === "ativa" ? "Ativa" : obra.status === "concluida" ? "Concluída" : "Pausada"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {obra.endereco}</p>
                      </div>
                      {obra.rt60Calculado && (
                        <div className="text-center">
                          <p className="text-lg font-mono font-bold text-primary">{obra.rt60Calculado}s</p>
                          <p className="text-[10px] text-muted-foreground">RT₆₀</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // ── List View ──
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes — CRM 360°</h1>
          <p className="text-sm text-muted-foreground">{mockClientes.length} clientes · R$ {mockClientes.reduce((s, c) => s + c.totalInvestido, 0).toLocaleString("pt-BR")} investidos</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Novo Cliente</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar nome, cidade, CNPJ..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filtroTag} onValueChange={setFiltroTag}>
          <SelectTrigger className="w-40"><Filter className="h-3.5 w-3.5 mr-1.5" /><SelectValue /></SelectTrigger>
          <SelectContent>
            {allTags.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={ordenacao} onValueChange={setOrdenacao}>
          <SelectTrigger className="w-44"><SortAsc className="h-3.5 w-3.5 mr-1.5" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="nome">Nome A–Z</SelectItem>
            <SelectItem value="investido">Maior investimento</SelectItem>
            <SelectItem value="recente">Mais recente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Client Cards */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(c => (
          <Card key={c.id} className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setClienteSelecionado(c)}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4 mb-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {c.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{c.nome}</h3>
                    <Badge variant="outline" className="text-[10px]">{c.tipo === "pj" ? "PJ" : "PF"}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.cidade} · {c.ultimoContato}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="flex gap-1.5 mb-3">
                {c.tags.slice(0, 3).map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Investido</p>
                  <p className="font-mono font-semibold text-sm text-foreground">R$ {(c.totalInvestido / 1000).toFixed(0)}k</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Compras</p>
                  <p className="font-mono font-semibold text-sm text-foreground">{c.qtdCompras}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Obras</p>
                  <p className="font-mono font-semibold text-sm text-foreground">{c.obras.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
};

export default Clientes;
