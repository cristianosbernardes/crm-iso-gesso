import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Receipt } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const monthlyData = [
  { mes: "Jan", receita: 42000, despesa: 28000 },
  { mes: "Fev", receita: 38000, despesa: 25000 },
  { mes: "Mar", receita: 55000, despesa: 32000 },
  { mes: "Abr", receita: 49000, despesa: 30000 },
  { mes: "Mai", receita: 62000, despesa: 35000 },
  { mes: "Jun", receita: 78500, despesa: 40000 },
];

const Financeiro = () => (
  <div className="p-6 lg:p-8 space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Financeiro</h1>
      <p className="text-sm text-muted-foreground">Visão financeira e faturamento</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Receita Mensal", value: "R$ 78.5k", icon: TrendingUp, color: "text-success" },
        { label: "Despesas", value: "R$ 40.0k", icon: TrendingDown, color: "text-destructive" },
        { label: "Lucro Líquido", value: "R$ 38.5k", icon: DollarSign, color: "text-primary" },
        { label: "Orçamentos Pendentes", value: "12", icon: Receipt, color: "text-warning" },
      ].map((s) => (
        <Card key={s.label}>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card>
      <CardHeader><CardTitle className="text-base">Receita vs Despesa</CardTitle></CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="mes" tick={{ fill: "hsl(220, 10%, 46%)" }} />
              <YAxis tick={{ fill: "hsl(220, 10%, 46%)" }} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(220, 25%, 12%)", border: "none", borderRadius: "8px", color: "hsl(220, 10%, 92%)" }} />
              <Bar dataKey="receita" fill="hsl(25, 95%, 53%)" radius={[4, 4, 0, 0]} name="Receita" />
              <Bar dataKey="despesa" fill="hsl(200, 70%, 50%)" radius={[4, 4, 0, 0]} name="Despesa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default Financeiro;
