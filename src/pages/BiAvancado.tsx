import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Brain, TrendingUp, Package, QrCode, CalendarDays, Target, DollarSign,
  BarChart3, Percent, ThermometerSun, Volume2, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Legend, PieChart, Pie, Cell
} from "recharts";

const tooltipStyle = {
  backgroundColor: "hsl(220, 25%, 12%)",
  border: "1px solid hsl(220, 20%, 20%)",
  borderRadius: "8px",
  color: "hsl(220, 10%, 92%)",
  fontSize: "12px",
};

// ── Previsão de Demanda ──
const demandaMensal = [
  { mes: "Jan", acustico: 42, termico: 28 },
  { mes: "Fev", acustico: 38, termico: 22 },
  { mes: "Mar", acustico: 55, termico: 30 },
  { mes: "Abr", acustico: 48, termico: 35 },
  { mes: "Mai", acustico: 52, termico: 45 },
  { mes: "Jun", acustico: 45, termico: 58 },
  { mes: "Jul", acustico: 40, termico: 65 },
  { mes: "Ago", acustico: 50, termico: 55 },
  { mes: "Set", acustico: 58, termico: 42 },
  { mes: "Out", acustico: 62, termico: 35 },
  { mes: "Nov", acustico: 70, termico: 28 },
  { mes: "Dez", acustico: 75, termico: 25 },
];

// ── Performance de Produtos ──
const produtosPerformance = [
  { nome: "Lã de Rocha 75mm", margemBruta: 42, margemReal: 35, perdaInstalacao: 7, vendas: 285, receita: 22230 },
  { nome: "Lã de Vidro 50mm", margemBruta: 38, margemReal: 33, perdaInstalacao: 5, vendas: 960, receita: 27360 },
  { nome: "Placa Gesso ST 12.5mm", margemBruta: 35, margemReal: 32, perdaInstalacao: 3, vendas: 1280, receita: 40960 },
  { nome: "Perfil Montante 70mm", margemBruta: 30, margemReal: 29, perdaInstalacao: 1, vendas: 320, receita: 7840 },
  { nome: "Placa Gesso RF 15mm", margemBruta: 40, margemReal: 34, perdaInstalacao: 6, vendas: 80, receita: 4960 },
  { nome: "Lã de Rocha 50mm", margemBruta: 36, margemReal: 30, perdaInstalacao: 6, vendas: 95, receita: 5225 },
];

// ── QR Code Leads ──
const qrLeads = [
  { local: "Obra Edifício Harmonia - SP", scans: 342, orcamentos: 28, conversao: 8.2, receita: 48500 },
  { local: "Obra Auditório UFMG - BH", scans: 218, orcamentos: 15, conversao: 6.9, receita: 32000 },
  { local: "Showroom ISO-GESSO - SP", scans: 890, orcamentos: 68, conversao: 7.6, receita: 125000 },
  { local: "Feira Acústica 2025 - SP", scans: 1250, orcamentos: 95, conversao: 7.6, receita: 180000 },
  { local: "Obra Studio Mix - SP", scans: 156, orcamentos: 12, conversao: 7.7, receita: 22000 },
  { local: "Catálogo Digital (Site)", scans: 2100, orcamentos: 142, conversao: 6.8, receita: 210000 },
];

const BiAvancado = () => {
  const [periodo, setPeriodo] = useState("12m");

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">BI Avançado</h1>
          <p className="text-sm text-muted-foreground">Inteligência de mercado, previsão de demanda e análise estratégica</p>
        </div>
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-[140px]"><CalendarDays className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="6m">6 meses</SelectItem>
            <SelectItem value="12m">12 meses</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Demanda Acústica", value: "+18%", desc: "vs ano anterior", icon: <Volume2 className="h-5 w-5" />, cor: "bg-primary/10 text-primary", trend: "up" },
          { label: "Demanda Térmica", value: "-5%", desc: "sazonalidade", icon: <ThermometerSun className="h-5 w-5" />, cor: "bg-warning/10 text-warning", trend: "down" },
          { label: "Margem Real Média", value: "32%", desc: "após perdas", icon: <DollarSign className="h-5 w-5" />, cor: "bg-chart-5/10 text-chart-5", trend: "up" },
          { label: "Leads via QR Code", value: "4.956", desc: "scans totais", icon: <QrCode className="h-5 w-5" />, cor: "bg-chart-4/10 text-chart-4", trend: "up" },
        ].map((kpi, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
                  <div className={`flex items-center gap-1 text-xs mt-1 ${kpi.trend === "up" ? "text-green-600" : "text-destructive"}`}>
                    {kpi.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {kpi.desc}
                  </div>
                </div>
                <div className={`p-2 rounded-lg ${kpi.cor}`}>{kpi.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="demanda" className="space-y-6">
        <TabsList>
          <TabsTrigger value="demanda" className="gap-1.5 text-xs"><Brain className="h-3.5 w-3.5" /> Previsão de Demanda</TabsTrigger>
          <TabsTrigger value="performance" className="gap-1.5 text-xs"><Target className="h-3.5 w-3.5" /> Performance de Produtos</TabsTrigger>
          <TabsTrigger value="leads" className="gap-1.5 text-xs"><QrCode className="h-3.5 w-3.5" /> Relatório de Leads</TabsTrigger>
        </TabsList>

        {/* ── Previsão de Demanda ── */}
        <TabsContent value="demanda" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                Demanda Mensal: Acústico vs Térmico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={demandaMensal}>
                    <defs>
                      <linearGradient id="gradAcustico" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradTermico" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(200, 70%, 50%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(200, 70%, 50%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="mes" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Area type="monotone" dataKey="acustico" stroke="hsl(25, 95%, 53%)" fill="url(#gradAcustico)" strokeWidth={2} name="Isolamento Acústico" />
                    <Area type="monotone" dataKey="termico" stroke="hsl(200, 70%, 50%)" fill="url(#gradTermico)" strokeWidth={2} name="Isolamento Térmico" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                📈 Insight: Demanda acústica cresce nos meses de Set–Dez (reformas corporativas). Demanda térmica pico em Jun–Jul (inverno).
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Performance de Produtos ── */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Margem de Lucro Real vs Bruta (considerando perdas de instalação)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={produtosPerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} unit="%" />
                    <YAxis dataKey="nome" type="category" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 11 }} width={140} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
                    <Legend />
                    <Bar dataKey="margemBruta" fill="hsl(200, 70%, 50%)" radius={[0, 4, 4, 0]} name="Margem Bruta" opacity={0.4} />
                    <Bar dataKey="margemReal" fill="hsl(25, 95%, 53%)" radius={[0, 4, 4, 0]} name="Margem Real" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Detalhamento por Produto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {produtosPerformance.map((p, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{p.nome}</p>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{p.vendas} un vendidas</span>
                      <span>Receita: R$ {p.receita.toLocaleString("pt-BR")}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{p.margemReal}%</p>
                    <p className="text-[10px] text-destructive">-{p.perdaInstalacao}% perda</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Relatório de Leads ── */}
        <TabsContent value="leads" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <QrCode className="h-4 w-4 text-primary" />
                Desempenho de QR Codes por Local
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={qrLeads}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="local" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 10 }} angle={-15} textAnchor="end" height={60} />
                    <YAxis tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Bar dataKey="scans" fill="hsl(200, 70%, 50%)" radius={[4, 4, 0, 0]} name="Scans" />
                    <Bar dataKey="orcamentos" fill="hsl(25, 95%, 53%)" radius={[4, 4, 0, 0]} name="Orçamentos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {qrLeads.sort((a, b) => b.receita - a.receita).map((lead, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-chart-4/10 text-chart-4">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{lead.local}</p>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{lead.scans} scans</span>
                      <span>{lead.orcamentos} orçamentos</span>
                      <span>Conversão: {lead.conversao}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold font-mono text-foreground">R$ {(lead.receita / 1000).toFixed(0)}k</p>
                    <p className="text-[10px] text-muted-foreground">receita gerada</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BiAvancado;
