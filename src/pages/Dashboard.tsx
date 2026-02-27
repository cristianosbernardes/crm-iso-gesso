import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Package, Users, Calculator, TrendingUp, QrCode, CalendarDays,
  AlertTriangle, Clock, MessageSquare, FileText, MapPin, ArrowRight,
  DollarSign, Target, ShoppingCart, Zap, Eye, Activity,
  ChevronRight, Bell, Truck
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from "recharts";

// ── Data ──
const salesData = [
  { mes: "Jan", vendas: 42000, meta: 50000 },
  { mes: "Fev", vendas: 38000, meta: 50000 },
  { mes: "Mar", vendas: 55000, meta: 55000 },
  { mes: "Abr", vendas: 49000, meta: 55000 },
  { mes: "Mai", vendas: 62000, meta: 60000 },
  { mes: "Jun", vendas: 78500, meta: 75000 },
];

const productsData = [
  { name: "Lã de Vidro", value: 40 },
  { name: "Lã de Rocha", value: 25 },
  { name: "Perfis Steel", value: 20 },
  { name: "Parafusos", value: 15 },
];

const CHART_COLORS = [
  "hsl(25, 95%, 53%)",
  "hsl(200, 70%, 50%)",
  "hsl(150, 60%, 45%)",
  "hsl(280, 60%, 55%)",
];

const urgentActions = [
  {
    type: "estoque" as const,
    icon: Package,
    title: "Parafuso Cabeça Lentilha",
    description: "Estoque em 45 un. — mínimo: 200",
    severity: "critical" as const,
    time: "há 2h",
  },
  {
    type: "estoque" as const,
    icon: Package,
    title: "Lã de Rocha 50mm",
    description: "Estoque em 12 fardos — mínimo: 50",
    severity: "warning" as const,
    time: "há 5h",
  },
  {
    type: "orcamento" as const,
    icon: FileText,
    title: "Orç. #0247 — Construtora Alfa",
    description: "Enviado há 52h sem resposta",
    severity: "warning" as const,
    time: "há 52h",
  },
  {
    type: "orcamento" as const,
    icon: FileText,
    title: "Orç. #0251 — Eng. Roberto",
    description: "Enviado há 48h sem resposta",
    severity: "warning" as const,
    time: "há 48h",
  },
  {
    type: "mensagem" as const,
    icon: MessageSquare,
    title: "3 mensagens não lidas",
    description: "WhatsApp — clientes aguardando retorno",
    severity: "critical" as const,
    time: "agora",
  },
];

const activityFeed = [
  { user: "Maria Vendas", action: "fechou orçamento", target: "Construtora Beta — R$ 12.400", time: "há 15min", icon: DollarSign },
  { user: "Pedro Técnico", action: "realizou visita técnica", target: "Obra Pinheiros — Isolamento Acústico", time: "há 45min", icon: MapPin },
  { user: "João Admin", action: "cadastrou produto", target: "Lã de Rocha Rockfibras 75mm", time: "há 1h", icon: Package },
  { user: "Sistema", action: "QR Code escaneado", target: "Obra Vila Mariana — Cliente Rafael", time: "há 2h", icon: QrCode },
  { user: "Lucas Estoque", action: "deu baixa em", target: "50x Perfil Montante 48mm", time: "há 3h", icon: Truck },
  { user: "Sistema", action: "pagamento confirmado", target: "Mensalidade plataforma — Jun/2026", time: "há 5h", icon: Zap },
];

const upsellData = [
  { produto: "Placas de Gesso", oportunidade: "Lã de Rocha", taxa: 80, clientes: 34 },
  { produto: "Perfis Steel Frame", oportunidade: "Parafusos Especiais", taxa: 65, clientes: 22 },
  { produto: "Lã de Vidro", oportunidade: "Forro Mineral", taxa: 45, clientes: 18 },
];

const leadsData = [
  { canal: "QR Code em Obra", leads: 156, conversao: 34 },
  { canal: "Busca Direta", leads: 89, conversao: 28 },
  { canal: "Tráfego Pago", leads: 67, conversao: 12 },
  { canal: "Indicação", leads: 45, conversao: 38 },
];

const conversionTrend = [
  { semana: "S1", taxa: 28 },
  { semana: "S2", taxa: 32 },
  { semana: "S3", taxa: 35 },
  { semana: "S4", taxa: 31 },
  { semana: "S5", taxa: 38 },
  { semana: "S6", taxa: 42 },
];

// ── Animations ──
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const severityStyles = {
  critical: "border-l-destructive bg-destructive/5",
  warning: "border-l-warning bg-warning/5",
};

const metaMensal = 75000;
const faturamentoAtual = 78500;
const metaProgress = Math.min(Math.round((faturamentoAtual / metaMensal) * 100), 100);

const Dashboard = () => {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Central de Comando</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            ISO-GESSO · {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1 bg-success/15 text-success text-xs">
            <Activity className="h-3 w-3" /> Sistema Online
          </Badge>
        </div>
      </div>

      {/* ── KPIs with Actions ── */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Faturamento com Meta */}
        <motion.div variants={item}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Faturamento Mensal</p>
                  <span className="text-xl font-bold text-foreground">R$ 78.5k</span>
                </div>
                <Badge className="bg-success/15 text-success text-[10px]">+12%</Badge>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Meta: R$ 75k</span>
                  <span className="font-mono font-semibold text-success">{metaProgress}%</span>
                </div>
                <Progress value={metaProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cálculos com Ação */}
        <motion.div variants={item}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Calculator className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Cálculos Realizados</p>
                  <span className="text-xl font-bold text-foreground">34</span>
                </div>
                <Badge className="bg-primary/15 text-primary text-[10px]">+8</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full text-xs gap-1 mt-1">
                <Eye className="h-3 w-3" /> Ver Último Laudo
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Visitas com Próximo Alerta */}
        <motion.div variants={item}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                  <CalendarDays className="h-5 w-5 text-info" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Visitas Agendadas</p>
                  <span className="text-xl font-bold text-foreground">7</span>
                </div>
                <Badge className="bg-info/15 text-info text-[10px]">Esta semana</Badge>
              </div>
              <div className="bg-info/5 border border-info/20 rounded-lg px-3 py-2 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-info shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-foreground truncate">Próxima em 2h — Eng. Roberto</p>
                  <p className="text-[10px] text-muted-foreground">Av. Paulista, 1200 · Medição Acústica</p>
                </div>
                <MapPin className="h-3.5 w-3.5 text-info shrink-0" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* QR Codes */}
        <motion.div variants={item}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/50">
                <QrCode className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">QR Codes Escaneados</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground">1.2k</span>
                  <span className="text-[10px] text-success font-medium">+156</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Materiais */}
        <motion.div variants={item}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/50">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Materiais Cadastrados</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground">247</span>
                  <span className="text-[10px] text-success font-medium">+12</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Clientes */}
        <motion.div variants={item}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/50">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Clientes Ativos</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground">89</span>
                  <span className="text-[10px] text-success font-medium">+5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* ── Ações Urgentes + Activity Feed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Ações Urgentes
                </CardTitle>
                <Badge variant="destructive" className="text-[10px]">{urgentActions.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {urgentActions.map((a, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${severityStyles[a.severity]}`}>
                  <a.icon className={`h-4 w-4 shrink-0 ${a.severity === "critical" ? "text-destructive" : "text-warning"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                    <p className="text-[11px] text-muted-foreground">{a.description}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{a.time}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Feed de Atividades */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0 pt-0">
              {activityFeed.map((a, i) => (
                <div key={i}>
                  <div className="flex items-start gap-3 py-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/50 shrink-0 mt-0.5">
                      <a.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-relaxed">
                        <span className="font-semibold text-foreground">{a.user}</span>{" "}
                        <span className="text-muted-foreground">{a.action}</span>{" "}
                        <span className="text-foreground">{a.target}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                    </div>
                  </div>
                  {i < activityFeed.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Charts: Vendas + Produtos ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Vendas vs Meta Mensal</CardTitle>
                <Badge variant="outline" className="text-[10px]">2026</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="mes" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 11 }} />
                    <YAxis tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(220, 25%, 12%)", border: "none", borderRadius: "8px", color: "hsl(220, 10%, 92%)" }}
                      formatter={(value: number, name: string) => [`R$ ${(value / 1000).toFixed(1)}k`, name === "vendas" ? "Vendas" : "Meta"]}
                    />
                    <Bar dataKey="vendas" fill="hsl(25, 95%, 53%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="meta" fill="hsl(220, 10%, 30%)" radius={[4, 4, 0, 0]} opacity={0.3} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Mix de Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={productsData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                      {productsData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-1">
                {productsData.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                      <span className="text-muted-foreground">{p.name}</span>
                    </div>
                    <span className="font-medium font-mono text-foreground">{p.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── BI: Upsell + Leads + Conversão ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Oportunidades de Upsell */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-warning" />
                Oportunidades de Upsell
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {upsellData.map((u, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Compram <span className="text-foreground font-medium">{u.produto}</span>
                    </span>
                    <Badge variant="secondary" className="text-[10px]">{u.clientes} clientes</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-warning shrink-0" />
                    <span className="text-xs text-foreground font-medium">{u.oportunidade}</span>
                    <div className="flex-1" />
                    <span className="text-xs font-mono font-bold text-warning">{u.taxa}%</span>
                  </div>
                  <Progress value={u.taxa} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Ranking de Leads */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Ranking de Canais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {leadsData.map((l, i) => (
                <div key={i} className="flex items-center gap-3 py-1">
                  <span className="text-lg font-bold text-muted-foreground/30 w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{l.canal}</p>
                    <p className="text-[10px] text-muted-foreground">{l.leads} leads · {l.conversao}% conversão</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold font-mono text-foreground">{l.conversao}%</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Tendência de Conversão */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                Tendência de Conversão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={conversionTrend}>
                    <defs>
                      <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(150, 60%, 45%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(150, 60%, 45%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="semana" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 10 }} />
                    <YAxis tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(220, 25%, 12%)", border: "none", borderRadius: "8px", color: "hsl(220, 10%, 92%)" }}
                      formatter={(v: number) => [`${v}%`, "Conversão"]}
                    />
                    <Area type="monotone" dataKey="taxa" stroke="hsl(150, 60%, 45%)" fill="url(#convGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t">
                <span className="text-muted-foreground">Média 6 semanas</span>
                <span className="font-mono font-bold text-success">34.3%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
