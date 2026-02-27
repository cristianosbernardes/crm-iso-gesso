import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp, TrendingDown, DollarSign, Receipt, ArrowUpRight, ArrowDownRight,
  Package, QrCode, MapPin, Filter, Download, CalendarDays, BarChart3, PieChart as PieChartIcon,
  Wallet, CreditCard, FileText, Eye, Trophy, Users, Target, Percent, Medal, Star, ChevronRight, ArrowLeft, ShoppingCart
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend
} from "recharts";
import { motion } from "framer-motion";

// ── Dados mock ──
const monthlyData = [
  { mes: "Jan", receita: 42000, despesa: 28000, lucro: 14000 },
  { mes: "Fev", receita: 38000, despesa: 25000, lucro: 13000 },
  { mes: "Mar", receita: 55000, despesa: 32000, lucro: 23000 },
  { mes: "Abr", receita: 49000, despesa: 30000, lucro: 19000 },
  { mes: "Mai", receita: 62000, despesa: 35000, lucro: 27000 },
  { mes: "Jun", receita: 78500, despesa: 40000, lucro: 38500 },
  { mes: "Jul", receita: 71000, despesa: 37000, lucro: 34000 },
  { mes: "Ago", receita: 85000, despesa: 42000, lucro: 43000 },
  { mes: "Set", receita: 69000, despesa: 36000, lucro: 33000 },
  { mes: "Out", receita: 92000, despesa: 45000, lucro: 47000 },
  { mes: "Nov", receita: 88000, despesa: 43000, lucro: 45000 },
  { mes: "Dez", receita: 105000, despesa: 50000, lucro: 55000 },
];

const topProdutos = [
  { nome: "Placa ST 12.5mm", vendas: 1280, receita: 48640, pct: 100 },
  { nome: "Lã de Vidro 50mm", vendas: 960, receita: 38400, pct: 79 },
  { nome: "Montante 48mm 3m", vendas: 2100, receita: 29400, pct: 60 },
  { nome: "Placa RU 12.5mm", vendas: 620, receita: 27900, pct: 57 },
  { nome: "Parafuso TA 3.5x25", vendas: 8500, receita: 21250, pct: 44 },
  { nome: "Guia 48mm 3m", vendas: 1500, receita: 18000, pct: 37 },
  { nome: "Massa de Acabamento 28kg", vendas: 340, receita: 15300, pct: 31 },
];

const despesasPorCategoria = [
  { name: "Materiais", value: 45, color: "hsl(25, 95%, 53%)" },
  { name: "Frete", value: 20, color: "hsl(200, 70%, 50%)" },
  { name: "Operacional", value: 18, color: "hsl(150, 60%, 45%)" },
  { name: "Impostos", value: 12, color: "hsl(280, 60%, 55%)" },
  { name: "Outros", value: 5, color: "hsl(340, 65%, 55%)" },
];

const qrCodeRegiao = [
  { regiao: "São Paulo", scans: 1240, conversao: 34 },
  { regiao: "Rio de Janeiro", scans: 890, conversao: 28 },
  { regiao: "Minas Gerais", scans: 670, conversao: 31 },
  { regiao: "Paraná", scans: 520, conversao: 26 },
  { regiao: "Bahia", scans: 380, conversao: 22 },
  { regiao: "Rio Grande do Sul", scans: 310, conversao: 29 },
];

const transacoes = [
  { id: 1, tipo: "entrada", descricao: "Venda #1284 — Construtora Alpha", valor: 12500, data: "27/02/2026", status: "pago", metodo: "Boleto" },
  { id: 2, tipo: "entrada", descricao: "Venda #1283 — Obra Vila Mariana", valor: 8900, data: "26/02/2026", status: "pago", metodo: "PIX" },
  { id: 3, tipo: "saida", descricao: "Compra de materiais — Fornecedor B", valor: 15200, data: "25/02/2026", status: "pago", metodo: "Transferência" },
  { id: 4, tipo: "entrada", descricao: "Venda #1282 — Reformas JP", valor: 6400, data: "24/02/2026", status: "pendente", metodo: "Boleto" },
  { id: 5, tipo: "saida", descricao: "Frete — Transportadora Express", valor: 2800, data: "24/02/2026", status: "pago", metodo: "PIX" },
  { id: 6, tipo: "entrada", descricao: "Venda #1281 — Drywall Center", valor: 22300, data: "23/02/2026", status: "pago", metodo: "Cartão" },
  { id: 7, tipo: "saida", descricao: "Salários — Equipe operacional", valor: 18000, data: "22/02/2026", status: "pago", metodo: "Transferência" },
  { id: 8, tipo: "entrada", descricao: "Venda #1280 — Obra Morumbi", valor: 31000, data: "21/02/2026", status: "pendente", metodo: "Boleto" },
];

const orcamentos = [
  { id: "ORC-2024-089", cliente: "Construtora Nova Era", valor: 45000, data: "27/02/2026", validade: "13/03/2026", status: "enviado" },
  { id: "ORC-2024-088", cliente: "Arq. Studio Design", valor: 12800, data: "25/02/2026", validade: "11/03/2026", status: "visualizado" },
  { id: "ORC-2024-087", cliente: "Reformas SP Ltda", valor: 28500, data: "23/02/2026", validade: "09/03/2026", status: "aprovado" },
  { id: "ORC-2024-086", cliente: "Obra Industrial MG", valor: 67000, data: "20/02/2026", validade: "06/03/2026", status: "enviado" },
  { id: "ORC-2024-085", cliente: "Condomínio Parque", valor: 19200, data: "18/02/2026", validade: "04/03/2026", status: "recusado" },
];

interface Vendedor {
  id: number;
  nome: string;
  iniciais: string;
  cargo: string;
  vendasTotal: number;
  qtdVendas: number;
  ticketMedio: number;
  comissaoPct: number;
  comissaoAcumulada: number;
  orcamentosGerados: number;
  orcamentosFechados: number;
  taxaConversao: number;
  meta: number;
  evolucao: { mes: string; vendas: number }[];
}

const vendedores: Vendedor[] = [
  {
    id: 1, nome: "João Administrador", iniciais: "JA", cargo: "Gerente Comercial",
    vendasTotal: 285000, qtdVendas: 42, ticketMedio: 6786, comissaoPct: 5,
    comissaoAcumulada: 14250, orcamentosGerados: 68, orcamentosFechados: 42, taxaConversao: 61.8, meta: 300000,
    evolucao: [
      { mes: "Set", vendas: 38000 }, { mes: "Out", vendas: 45000 }, { mes: "Nov", vendas: 52000 },
      { mes: "Dez", vendas: 58000 }, { mes: "Jan", vendas: 42000 }, { mes: "Fev", vendas: 50000 },
    ],
  },
  {
    id: 2, nome: "Ana Vendedora", iniciais: "AV", cargo: "Consultora Técnica",
    vendasTotal: 198000, qtdVendas: 35, ticketMedio: 5657, comissaoPct: 4,
    comissaoAcumulada: 7920, orcamentosGerados: 52, orcamentosFechados: 35, taxaConversao: 67.3, meta: 220000,
    evolucao: [
      { mes: "Set", vendas: 28000 }, { mes: "Out", vendas: 32000 }, { mes: "Nov", vendas: 35000 },
      { mes: "Dez", vendas: 38000 }, { mes: "Jan", vendas: 30000 }, { mes: "Fev", vendas: 35000 },
    ],
  },
  {
    id: 3, nome: "Carlos Vendedor", iniciais: "CV", cargo: "Vendedor Externo",
    vendasTotal: 156000, qtdVendas: 28, ticketMedio: 5571, comissaoPct: 4,
    comissaoAcumulada: 6240, orcamentosGerados: 45, orcamentosFechados: 28, taxaConversao: 62.2, meta: 180000,
    evolucao: [
      { mes: "Set", vendas: 22000 }, { mes: "Out", vendas: 25000 }, { mes: "Nov", vendas: 28000 },
      { mes: "Dez", vendas: 30000 }, { mes: "Jan", vendas: 24000 }, { mes: "Fev", vendas: 27000 },
    ],
  },
  {
    id: 4, nome: "Mariana Sales", iniciais: "MS", cargo: "Vendedora Interna",
    vendasTotal: 112000, qtdVendas: 22, ticketMedio: 5091, comissaoPct: 3.5,
    comissaoAcumulada: 3920, orcamentosGerados: 38, orcamentosFechados: 22, taxaConversao: 57.9, meta: 150000,
    evolucao: [
      { mes: "Set", vendas: 15000 }, { mes: "Out", vendas: 18000 }, { mes: "Nov", vendas: 20000 },
      { mes: "Dez", vendas: 22000 }, { mes: "Jan", vendas: 17000 }, { mes: "Fev", vendas: 20000 },
    ],
  },
  {
    id: 5, nome: "Pedro Técnico", iniciais: "PT", cargo: "Técnico Comercial",
    vendasTotal: 83500, qtdVendas: 15, ticketMedio: 5567, comissaoPct: 3,
    comissaoAcumulada: 2505, orcamentosGerados: 30, orcamentosFechados: 15, taxaConversao: 50.0, meta: 120000,
    evolucao: [
      { mes: "Set", vendas: 10000 }, { mes: "Out", vendas: 12000 }, { mes: "Nov", vendas: 15000 },
      { mes: "Dez", vendas: 18000 }, { mes: "Jan", vendas: 13000 }, { mes: "Fev", vendas: 15500 },
    ],
  },
];

const faturamentoTotal = vendedores.reduce((s, v) => s + v.vendasTotal, 0);

const medalhas = ["🥇", "🥈", "🥉"];

const statusColor: Record<string, string> = {
  pago: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  pendente: "bg-amber-500/15 text-amber-600 border-amber-500/20",
  enviado: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  visualizado: "bg-purple-500/15 text-purple-600 border-purple-500/20",
  aprovado: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  recusado: "bg-red-500/15 text-red-600 border-red-500/20",
};

const tooltipStyle = {
  backgroundColor: "hsl(220, 25%, 12%)",
  border: "1px solid hsl(220, 20%, 20%)",
  borderRadius: "8px",
  color: "hsl(220, 10%, 92%)",
  fontSize: "12px",
};

// ── Helpers ──
const KPICard = ({ label, value, icon: Icon, color, trend, trendValue }: {
  label: string; value: string; icon: any; color: string;
  trend?: "up" | "down"; trendValue?: string;
}) => (
  <Card className="overflow-hidden">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 text-xs font-medium ${trend === "up" ? "text-emerald-600" : "text-red-500"}`}>
              {trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {trendValue} vs mês anterior
            </div>
          )}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const Financeiro = () => {
  const [periodo, setPeriodo] = useState("12m");
  const [filtroTransacao, setFiltroTransacao] = useState("todas");
  const [vendedorDetalhe, setVendedorDetalhe] = useState<Vendedor | null>(null);

  const transacoesFiltradas = transacoes.filter(t =>
    filtroTransacao === "todas" || t.tipo === filtroTransacao
  );

  const totalReceita = monthlyData.reduce((s, d) => s + d.receita, 0);
  const totalDespesa = monthlyData.reduce((s, d) => s + d.despesa, 0);
  const totalLucro = totalReceita - totalDespesa;
  const margemLucro = ((totalLucro / totalReceita) * 100).toFixed(1);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Financeiro</h1>
          <p className="text-sm text-muted-foreground">
            Business Intelligence · Visão completa do faturamento e performance
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[140px]">
              <CalendarDays className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Últimos 3 meses</SelectItem>
              <SelectItem value="6m">Últimos 6 meses</SelectItem>
              <SelectItem value="12m">Últimos 12 meses</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Exportar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Receita Total" value={`R$ ${(totalReceita / 1000).toFixed(0)}k`} icon={TrendingUp} color="bg-emerald-500/10 text-emerald-600" trend="up" trendValue="+18.2%" />
        <KPICard label="Despesas Totais" value={`R$ ${(totalDespesa / 1000).toFixed(0)}k`} icon={TrendingDown} color="bg-red-500/10 text-red-500" trend="down" trendValue="+5.3%" />
        <KPICard label="Lucro Líquido" value={`R$ ${(totalLucro / 1000).toFixed(0)}k`} icon={DollarSign} color="bg-primary/10 text-primary" trend="up" trendValue="+24.7%" />
        <KPICard label="Margem de Lucro" value={`${margemLucro}%`} icon={Wallet} color="bg-blue-500/10 text-blue-600" trend="up" trendValue="+3.1pp" />
      </div>

      {/* Tabs principais */}
      <Tabs defaultValue="visao-geral" className="space-y-6">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="visao-geral" className="gap-1.5 text-xs">
            <BarChart3 className="h-4 w-4" /> Visão Geral
          </TabsTrigger>
          <TabsTrigger value="transacoes" className="gap-1.5 text-xs">
            <CreditCard className="h-4 w-4" /> Transações
          </TabsTrigger>
          <TabsTrigger value="produtos" className="gap-1.5 text-xs">
            <Package className="h-4 w-4" /> Produtos
          </TabsTrigger>
          <TabsTrigger value="orcamentos" className="gap-1.5 text-xs">
            <FileText className="h-4 w-4" /> Orçamentos
          </TabsTrigger>
          <TabsTrigger value="qrcode" className="gap-1.5 text-xs">
            <QrCode className="h-4 w-4" /> QR Code Analytics
          </TabsTrigger>
          <TabsTrigger value="vendedores" className="gap-1.5 text-xs">
            <Trophy className="h-4 w-4" /> Performance de Vendas
          </TabsTrigger>
        </TabsList>

        {/* ── VISÃO GERAL ── */}
        <TabsContent value="visao-geral" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gráfico receita vs despesa */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Receita vs Despesa Mensal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="mes" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} />
                      <YAxis tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`} />
                      <Legend />
                      <Bar dataKey="receita" fill="hsl(25, 95%, 53%)" radius={[4, 4, 0, 0]} name="Receita" />
                      <Bar dataKey="despesa" fill="hsl(200, 70%, 50%)" radius={[4, 4, 0, 0]} name="Despesa" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Distribuição de despesas */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4 text-primary" />
                  Despesas por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={despesasPorCategoria} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                        {despesasPorCategoria.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-2">
                  {despesasPorCategoria.map((d) => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-foreground">{d.name}</span>
                      </div>
                      <span className="font-mono text-muted-foreground">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Evolução do lucro */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Evolução do Lucro Líquido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="lucroGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="mes" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`} />
                    <Area type="monotone" dataKey="lucro" stroke="hsl(25, 95%, 53%)" fill="url(#lucroGradient)" strokeWidth={2} name="Lucro" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── TRANSAÇÕES ── */}
        <TabsContent value="transacoes" className="space-y-4">
          <div className="flex items-center justify-between">
            <Select value={filtroTransacao} onValueChange={setFiltroTransacao}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="entrada">Entradas</SelectItem>
                <SelectItem value="saida">Saídas</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" /> Exportar CSV
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transacoesFiltradas.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${t.tipo === "entrada" ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                            {t.tipo === "entrada"
                              ? <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                              : <ArrowDownRight className="h-4 w-4 text-red-500" />
                            }
                          </div>
                          <span className="text-sm font-medium text-foreground">{t.descricao}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{t.data}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{t.metodo}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${statusColor[t.status]}`}>
                          {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-semibold text-sm ${t.tipo === "entrada" ? "text-emerald-600" : "text-red-500"}`}>
                        {t.tipo === "entrada" ? "+" : "-"} R$ {t.valor.toLocaleString("pt-BR")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── PRODUTOS MAIS VENDIDOS ── */}
        <TabsContent value="produtos" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Ranking de Produtos por Receita
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topProdutos.map((p, i) => (
                <div key={p.nome} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}º
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.nome}</p>
                        <p className="text-xs text-muted-foreground">{p.vendas.toLocaleString("pt-BR")} un vendidas</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground">R$ {p.receita.toLocaleString("pt-BR")}</span>
                  </div>
                  <Progress value={p.pct} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── ORÇAMENTOS ── */}
        <TabsContent value="orcamentos" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KPICard label="Orçamentos Enviados" value="12" icon={FileText} color="bg-blue-500/10 text-blue-600" />
            <KPICard label="Taxa de Aprovação" value="58%" icon={TrendingUp} color="bg-emerald-500/10 text-emerald-600" trend="up" trendValue="+4%" />
            <KPICard label="Valor em Aberto" value="R$ 124.8k" icon={Receipt} color="bg-amber-500/10 text-amber-600" />
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Orçamento</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right w-[80px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orcamentos.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-mono text-sm text-foreground">{o.id}</TableCell>
                      <TableCell className="text-sm font-medium text-foreground">{o.cliente}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{o.data}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{o.validade}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${statusColor[o.status]}`}>
                          {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-sm text-foreground">
                        R$ {o.valor.toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── QR CODE ANALYTICS ── */}
        <TabsContent value="qrcode" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KPICard label="Total de Scans" value="4.010" icon={QrCode} color="bg-primary/10 text-primary" trend="up" trendValue="+32%" />
            <KPICard label="Taxa de Conversão Média" value="28.3%" icon={TrendingUp} color="bg-emerald-500/10 text-emerald-600" trend="up" trendValue="+2.1pp" />
            <KPICard label="Regiões Ativas" value="6" icon={MapPin} color="bg-blue-500/10 text-blue-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scans por região */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Scans por Região
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={qrCodeRegiao} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} />
                      <YAxis dataKey="regiao" type="category" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 11 }} width={110} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="scans" fill="hsl(25, 95%, 53%)" radius={[0, 4, 4, 0]} name="Scans" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Taxa de conversão por região */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Conversão por Região (%)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {qrCodeRegiao.map((r) => (
                  <div key={r.regiao} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{r.regiao}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-muted-foreground">{r.scans} scans</span>
                        <span className="font-bold text-foreground">{r.conversao}%</span>
                      </div>
                    </div>
                    <Progress value={r.conversao} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── PERFORMANCE DE VENDAS ── */}
        <TabsContent value="vendedores" className="space-y-6">
          {vendedorDetalhe ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Detalhe individual */}
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setVendedorDetalhe(null)}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">{vendedorDetalhe.iniciais}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{vendedorDetalhe.nome}</h2>
                  <p className="text-sm text-muted-foreground">{vendedorDetalhe.cargo}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPICard label="Total Vendido" value={`R$ ${(vendedorDetalhe.vendasTotal / 1000).toFixed(0)}k`} icon={DollarSign} color="bg-primary/10 text-primary" />
                <KPICard label="Comissão Acumulada" value={`R$ ${vendedorDetalhe.comissaoAcumulada.toLocaleString("pt-BR")}`} icon={Wallet} color="bg-emerald-500/10 text-emerald-600" />
                <KPICard label="Taxa de Conversão" value={`${vendedorDetalhe.taxaConversao}%`} icon={Target} color="bg-blue-500/10 text-blue-600" />
                <KPICard label="Atingimento da Meta" value={`${((vendedorDetalhe.vendasTotal / vendedorDetalhe.meta) * 100).toFixed(0)}%`} icon={Trophy} color="bg-amber-500/10 text-amber-600" />
              </div>

              {/* Evolução individual */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Evolução de Vendas — {vendedorDetalhe.nome}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={vendedorDetalhe.evolucao}>
                        <defs>
                          <linearGradient id="vendedorGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="mes" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} />
                        <YAxis tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
                        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`} />
                        <Area type="monotone" dataKey="vendas" stroke="hsl(25, 95%, 53%)" fill="url(#vendedorGrad)" strokeWidth={2} name="Vendas" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Funil de conversão */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Funil de Conversão</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Orçamentos Gerados</span>
                        <span className="font-semibold text-foreground">{vendedorDetalhe.orcamentosGerados}</span>
                      </div>
                      <Progress value={100} className="h-3" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Vendas Fechadas</span>
                        <span className="font-semibold text-foreground">{vendedorDetalhe.orcamentosFechados}</span>
                      </div>
                      <Progress value={vendedorDetalhe.taxaConversao} className="h-3" />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Taxa de conversão: <span className="font-bold text-foreground">{vendedorDetalhe.taxaConversao}%</span>
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Meta vs Realizado</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-4">
                      <p className="text-4xl font-bold font-mono text-primary">
                        {((vendedorDetalhe.vendasTotal / vendedorDetalhe.meta) * 100).toFixed(0)}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">da meta atingida</p>
                    </div>
                    <Progress value={Math.min((vendedorDetalhe.vendasTotal / vendedorDetalhe.meta) * 100, 100)} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>R$ {(vendedorDetalhe.vendasTotal / 1000).toFixed(0)}k vendido</span>
                      <span>Meta: R$ {(vendedorDetalhe.meta / 1000).toFixed(0)}k</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-muted bg-muted/20">
                <CardContent className="p-4 flex items-start gap-3">
                  <Star className="h-5 w-5 text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Integração Telegram (Bot)</p>
                    <p className="text-xs text-muted-foreground">Relatório semanal automático enviado aos administradores com destaque do vendedor da semana. Requer Lovable Cloud + n8n para ativação.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <>
              {/* KPIs de equipe */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <KPICard label="Faturamento da Equipe" value={`R$ ${(faturamentoTotal / 1000).toFixed(0)}k`} icon={DollarSign} color="bg-primary/10 text-primary" trend="up" trendValue="+22%" />
                <KPICard label="Total de Vendas" value={`${vendedores.reduce((s, v) => s + v.qtdVendas, 0)}`} icon={ShoppingCart} color="bg-emerald-500/10 text-emerald-600" />
                <KPICard label="Comissões Pagas" value={`R$ ${(vendedores.reduce((s, v) => s + v.comissaoAcumulada, 0) / 1000).toFixed(1)}k`} icon={Wallet} color="bg-amber-500/10 text-amber-600" />
                <KPICard label="Conversão Média" value={`${(vendedores.reduce((s, v) => s + v.taxaConversao, 0) / vendedores.length).toFixed(1)}%`} icon={Target} color="bg-blue-500/10 text-blue-600" />
              </div>

              {/* Ranking */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    Ranking de Vendedores
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {vendedores.map((v, i) => {
                    const share = ((v.vendasTotal / faturamentoTotal) * 100).toFixed(1);
                    return (
                      <motion.div
                        key={v.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                        onClick={() => setVendedorDetalhe(v)}
                      >
                        {/* Posição */}
                        <div className="w-10 text-center">
                          {i < 3 ? (
                            <span className="text-2xl">{medalhas[i]}</span>
                          ) : (
                            <span className="text-lg font-bold text-muted-foreground">{i + 1}º</span>
                          )}
                        </div>

                        {/* Avatar + Info */}
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={`font-semibold text-sm ${i === 0 ? "bg-amber-500/15 text-amber-600" : i === 1 ? "bg-slate-400/15 text-slate-500" : i === 2 ? "bg-orange-600/15 text-orange-700" : "bg-muted text-muted-foreground"}`}>
                            {v.iniciais}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">{v.nome}</p>
                            <span className="text-xs text-muted-foreground hidden sm:inline">{v.cargo}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <Progress value={parseFloat(share)} className="h-2 flex-1 max-w-[200px]" />
                            <span className="text-xs font-mono text-muted-foreground">{share}% share</span>
                          </div>
                        </div>

                        {/* Métricas */}
                        <div className="hidden md:flex items-center gap-6 text-right">
                          <div>
                            <p className="text-sm font-bold font-mono text-foreground">R$ {(v.vendasTotal / 1000).toFixed(0)}k</p>
                            <p className="text-[10px] text-muted-foreground">Faturado</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold font-mono text-foreground">{v.qtdVendas}</p>
                            <p className="text-[10px] text-muted-foreground">Vendas</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold font-mono text-foreground">R$ {v.ticketMedio.toLocaleString("pt-BR")}</p>
                            <p className="text-[10px] text-muted-foreground">Ticket Médio</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold font-mono text-foreground">{v.taxaConversao}%</p>
                            <p className="text-[10px] text-muted-foreground">Conversão</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold font-mono text-emerald-600">R$ {v.comissaoAcumulada.toLocaleString("pt-BR")}</p>
                            <p className="text-[10px] text-muted-foreground">Comissão ({v.comissaoPct}%)</p>
                          </div>
                        </div>

                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Gráfico comparativo */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Comparativo de Faturamento por Vendedor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={vendedores.map(v => ({ nome: v.nome.split(" ")[0], vendas: v.vendasTotal, meta: v.meta }))}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="nome" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} />
                        <YAxis tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
                        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`} />
                        <Legend />
                        <Bar dataKey="vendas" fill="hsl(25, 95%, 53%)" radius={[4, 4, 0, 0]} name="Realizado" />
                        <Bar dataKey="meta" fill="hsl(200, 70%, 50%)" radius={[4, 4, 0, 0]} name="Meta" opacity={0.4} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Financeiro;
