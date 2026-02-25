import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, Calculator, TrendingUp, QrCode, CalendarDays } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const stats = [
  { label: "Materiais Cadastrados", value: "247", icon: Package, change: "+12" },
  { label: "Clientes Ativos", value: "89", icon: Users, change: "+5" },
  { label: "Cálculos Realizados", value: "34", icon: Calculator, change: "+8" },
  { label: "QR Codes Escaneados", value: "1.2k", icon: QrCode, change: "+156" },
  { label: "Faturamento Mensal", value: "R$ 78.5k", icon: TrendingUp, change: "+12%" },
  { label: "Visitas Agendadas", value: "7", icon: CalendarDays, change: "Esta semana" },
];

const salesData = [
  { mes: "Jan", vendas: 42000 },
  { mes: "Fev", vendas: 38000 },
  { mes: "Mar", vendas: 55000 },
  { mes: "Abr", vendas: 49000 },
  { mes: "Mai", vendas: 62000 },
  { mes: "Jun", vendas: 78500 },
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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Visão geral da plataforma ISO-GESSO
        </p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={item}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {s.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">{s.value}</span>
                    <span className="text-xs text-success font-medium">{s.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vendas por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="mes" className="text-xs" tick={{ fill: "hsl(220, 10%, 46%)" }} />
                    <YAxis className="text-xs" tick={{ fill: "hsl(220, 10%, 46%)" }} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(220, 25%, 12%)",
                        border: "none",
                        borderRadius: "8px",
                        color: "hsl(220, 10%, 92%)",
                      }}
                      formatter={(value: number) => [`R$ ${(value / 1000).toFixed(1)}k`, "Vendas"]}
                    />
                    <Bar dataKey="vendas" fill="hsl(25, 95%, 53%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Produtos Mais Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {productsData.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-2">
                {productsData.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                      <span className="text-muted-foreground">{p.name}</span>
                    </div>
                    <span className="font-medium text-foreground">{p.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
