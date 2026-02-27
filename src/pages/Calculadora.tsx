import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Plus, Trash2, Volume2, Building2, Mic2, Headphones, FileText, Target, TrendingDown, TrendingUp, CheckCircle2, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LineChart, Line, Legend, AreaChart, Area } from "recharts";
import { produtos, type Produto, type La } from "@/data/produtos";

interface Material {
  id: number;
  nome: string;
  area: number;
  alpha: Record<string, number>;
  alphaMedio: number;
  preco: number;
  unidade: string;
  produtoId?: number;
}

interface Preset {
  nome: string;
  icone: React.ReactNode;
  descricao: string;
  comprimento: string;
  largura: string;
  altura: string;
  rt60Ideal: Record<string, number>;
  cor: string;
}

const presets: Preset[] = [
  {
    nome: "Escritório",
    icone: <Building2 className="h-5 w-5" />,
    descricao: "Sala de reuniões ou open space",
    comprimento: "10", largura: "8", altura: "2.8",
    rt60Ideal: { "125Hz": 0.8, "250Hz": 0.7, "500Hz": 0.6, "1kHz": 0.55, "2kHz": 0.5, "4kHz": 0.45 },
    cor: "hsl(var(--primary))",
  },
  {
    nome: "Auditório",
    icone: <Mic2 className="h-5 w-5" />,
    descricao: "Palestra e apresentações",
    comprimento: "20", largura: "15", altura: "4.5",
    rt60Ideal: { "125Hz": 1.2, "250Hz": 1.1, "500Hz": 1.0, "1kHz": 0.95, "2kHz": 0.9, "4kHz": 0.85 },
    cor: "hsl(var(--chart-4))",
  },
  {
    nome: "Estúdio",
    icone: <Headphones className="h-5 w-5" />,
    descricao: "Gravação e mixagem",
    comprimento: "6", largura: "5", altura: "3.0",
    rt60Ideal: { "125Hz": 0.4, "250Hz": 0.35, "500Hz": 0.3, "1kHz": 0.28, "2kHz": 0.25, "4kHz": 0.22 },
    cor: "hsl(var(--chart-5))",
  },
];

const materiaisDisponiveis: { nome: string; alpha: Record<string, number>; alphaMedio: number; preco: number; unidade: string; produtoId?: number }[] = (() => {
  const fromProdutos = produtos
    .filter((p): p is La => p.categoria === "Lãs" && "alpha" in p)
    .map(p => ({
      nome: p.nome,
      alpha: p.alpha,
      alphaMedio: Object.values(p.alpha).reduce((s, v) => s + v, 0) / Object.values(p.alpha).length,
      preco: p.preco,
      unidade: p.unidade,
      produtoId: p.id,
    }));

  const extras = [
    { nome: "Placa de Gesso 12.5mm", alpha: { "125Hz": 0.08, "250Hz": 0.06, "500Hz": 0.05, "1kHz": 0.04, "2kHz": 0.04, "4kHz": 0.04 }, alphaMedio: 0.05, preco: 32.0, unidade: "m²" },
    { nome: "Piso Cerâmico", alpha: { "125Hz": 0.01, "250Hz": 0.01, "500Hz": 0.02, "1kHz": 0.02, "2kHz": 0.02, "4kHz": 0.03 }, alphaMedio: 0.02, preco: 0, unidade: "m²" },
    { nome: "Vidro Simples 6mm", alpha: { "125Hz": 0.10, "250Hz": 0.06, "500Hz": 0.04, "1kHz": 0.03, "2kHz": 0.02, "4kHz": 0.02 }, alphaMedio: 0.04, preco: 0, unidade: "m²" },
    { nome: "Cortina Pesada", alpha: { "125Hz": 0.14, "250Hz": 0.35, "500Hz": 0.55, "1kHz": 0.72, "2kHz": 0.70, "4kHz": 0.65 }, alphaMedio: 0.55, preco: 0, unidade: "m²" },
    { nome: "Concreto Aparente", alpha: { "125Hz": 0.01, "250Hz": 0.01, "500Hz": 0.02, "1kHz": 0.02, "2kHz": 0.02, "4kHz": 0.03 }, alphaMedio: 0.02, preco: 0, unidade: "m²" },
    { nome: "Carpete Grosso", alpha: { "125Hz": 0.08, "250Hz": 0.25, "500Hz": 0.57, "1kHz": 0.69, "2kHz": 0.71, "4kHz": 0.73 }, alphaMedio: 0.50, preco: 0, unidade: "m²" },
  ];
  return [...fromProdutos, ...extras];
})();

const freqs = ["125Hz", "250Hz", "500Hz", "1kHz", "2kHz", "4kHz"];

const Calculadora = () => {
  const [comprimento, setComprimento] = useState("");
  const [largura, setLargura] = useState("");
  const [altura, setAltura] = useState("");
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [presetAtivo, setPresetAtivo] = useState<Preset | null>(null);

  const V = useMemo(() => (parseFloat(comprimento) || 0) * (parseFloat(largura) || 0) * (parseFloat(altura) || 0), [comprimento, largura, altura]);

  // Real-time RT60 per frequency
  const rt60PorFreq = useMemo(() => {
    if (V === 0 || materiais.length === 0) return null;
    const result: Record<string, number> = {};
    for (const f of freqs) {
      const A = materiais.reduce((sum, m) => sum + m.area * (m.alpha[f] || m.alphaMedio), 0);
      result[f] = A > 0 ? (0.161 * V) / A : 0;
    }
    return result;
  }, [V, materiais]);

  const rt60Medio = useMemo(() => rt60PorFreq ? rt60PorFreq["500Hz"] : null, [rt60PorFreq]);

  // RT60 sem tratamento (superfícies reflexivas)
  const rt60SemTratamento = useMemo(() => {
    if (V === 0) return null;
    const areaTotal = 2 * ((parseFloat(comprimento) || 0) * (parseFloat(largura) || 0) + (parseFloat(comprimento) || 0) * (parseFloat(altura) || 0) + (parseFloat(largura) || 0) * (parseFloat(altura) || 0));
    const result: Record<string, number> = {};
    const alphaConcreto: Record<string, number> = { "125Hz": 0.01, "250Hz": 0.01, "500Hz": 0.02, "1kHz": 0.02, "2kHz": 0.02, "4kHz": 0.03 };
    for (const f of freqs) {
      const A = areaTotal * (alphaConcreto[f] || 0.02);
      result[f] = A > 0 ? (0.161 * V) / A : 0;
    }
    return result;
  }, [V, comprimento, largura, altura]);

  // Chart data
  const chartData = useMemo(() => {
    return freqs.map(f => ({
      freq: f,
      semTratamento: rt60SemTratamento ? Math.min(rt60SemTratamento[f], 8) : 0,
      comTratamento: rt60PorFreq ? Math.min(rt60PorFreq[f], 8) : 0,
      ideal: presetAtivo ? presetAtivo.rt60Ideal[f] : 0,
    }));
  }, [rt60SemTratamento, rt60PorFreq, presetAtivo]);

  const aplicarPreset = (preset: Preset) => {
    setPresetAtivo(preset);
    setComprimento(preset.comprimento);
    setLargura(preset.largura);
    setAltura(preset.altura);
  };

  const addMaterial = () => {
    const mat = materiaisDisponiveis[0];
    setMateriais(prev => [...prev, { id: Date.now(), nome: mat.nome, area: 0, alpha: mat.alpha, alphaMedio: mat.alphaMedio, preco: mat.preco, unidade: mat.unidade, produtoId: mat.produtoId }]);
  };

  const removeMaterial = (id: number) => setMateriais(prev => prev.filter(m => m.id !== id));

  const updateMaterial = (id: number, field: string, value: string) => {
    setMateriais(prev => prev.map(m => {
      if (m.id !== id) return m;
      if (field === "nome") {
        const found = materiaisDisponiveis.find(mat => mat.nome === value);
        if (!found) return m;
        return { ...m, nome: value, alpha: found.alpha, alphaMedio: found.alphaMedio, preco: found.preco, unidade: found.unidade, produtoId: found.produtoId };
      }
      if (field === "area") return { ...m, area: parseFloat(value) || 0 };
      return m;
    }));
  };

  // Classificação do resultado
  const classificacao = useMemo(() => {
    if (!rt60Medio || !presetAtivo) return null;
    const ideal = presetAtivo.rt60Ideal["500Hz"];
    const diff = Math.abs(rt60Medio - ideal);
    const pct = (diff / ideal) * 100;
    if (pct <= 10) return { label: "Excelente", cor: "text-green-500", icone: <CheckCircle2 className="h-5 w-5 text-green-500" /> };
    if (pct <= 25) return { label: "Aceitável", cor: "text-yellow-500", icone: <AlertTriangle className="h-5 w-5 text-yellow-500" /> };
    return { label: rt60Medio > ideal ? "Reverberante demais" : "Absorvente demais", cor: "text-destructive", icone: rt60Medio > ideal ? <TrendingUp className="h-5 w-5 text-destructive" /> : <TrendingDown className="h-5 w-5 text-destructive" /> };
  }, [rt60Medio, presetAtivo]);

  // Lista de compras
  const listaCompras = useMemo(() => {
    return materiais.filter(m => m.area > 0 && m.preco > 0).map(m => ({
      nome: m.nome,
      area: m.area,
      unidade: m.unidade,
      precoUnit: m.preco,
      total: m.area * m.preco,
    }));
  }, [materiais]);

  const totalCompras = useMemo(() => listaCompras.reduce((s, i) => s + i.total, 0), [listaCompras]);

  // PDF export
  const gerarProposta = useCallback(() => {
    const w = window.open("", "_blank");
    if (!w) return;
    const materiaisRows = materiais.map(m =>
      `<tr><td>${m.nome}</td><td>${m.area} m²</td><td>${m.alphaMedio.toFixed(2)}</td></tr>`
    ).join("");
    const comprasRows = listaCompras.map(i =>
      `<tr><td>${i.nome}</td><td>${i.area} ${i.unidade}</td><td>R$ ${i.precoUnit.toFixed(2)}</td><td>R$ ${i.total.toFixed(2)}</td></tr>`
    ).join("");
    const freqRows = freqs.map(f =>
      `<tr><td>${f}</td><td>${rt60SemTratamento ? rt60SemTratamento[f].toFixed(2) + "s" : "—"}</td><td>${rt60PorFreq ? rt60PorFreq[f].toFixed(2) + "s" : "—"}</td><td>${presetAtivo ? presetAtivo.rt60Ideal[f].toFixed(2) + "s" : "—"}</td></tr>`
    ).join("");

    w.document.write(`<!DOCTYPE html><html><head><title>Proposta Técnica — ISO-GESSO</title>
<style>
  body{font-family:system-ui,sans-serif;max-width:800px;margin:0 auto;padding:40px;color:#1a1a2e}
  h1{color:#e8621c;border-bottom:3px solid #e8621c;padding-bottom:12px}
  h2{color:#334155;margin-top:30px}
  table{width:100%;border-collapse:collapse;margin:16px 0}
  th,td{border:1px solid #ddd;padding:8px 12px;text-align:left;font-size:13px}
  th{background:#f1f5f9;font-weight:600}
  .badge{display:inline-block;padding:4px 12px;border-radius:20px;font-weight:600;font-size:13px}
  .ok{background:#dcfce7;color:#166534} .warn{background:#fef9c3;color:#854d0e} .bad{background:#fecaca;color:#991b1b}
  .footer{margin-top:60px;padding-top:20px;border-top:2px solid #e2e8f0;font-size:11px;color:#94a3b8}
  .kpi{display:flex;gap:20px;margin:20px 0}
  .kpi-item{flex:1;padding:16px;border:1px solid #e2e8f0;border-radius:8px;text-align:center}
  .kpi-val{font-size:28px;font-weight:700;color:#e8621c}
  .kpi-label{font-size:11px;color:#64748b;margin-top:4px}
  @media print{body{padding:20px}}
</style></head><body>
<h1>🔊 Proposta Técnica Acústica</h1>
<p><strong>ISO-GESSO</strong> — Laudo de Simulação Acústica</p>
<p>Data: ${new Date().toLocaleDateString("pt-BR")} | Ambiente: ${presetAtivo?.nome || "Personalizado"}</p>

<h2>📐 Dimensões do Ambiente</h2>
<div class="kpi">
  <div class="kpi-item"><div class="kpi-val">${comprimento}m × ${largura}m × ${altura}m</div><div class="kpi-label">C × L × A</div></div>
  <div class="kpi-item"><div class="kpi-val">${V.toFixed(1)} m³</div><div class="kpi-label">Volume</div></div>
</div>

<h2>🧱 Materiais Aplicados</h2>
<table><thead><tr><th>Material</th><th>Área</th><th>α médio</th></tr></thead><tbody>${materiaisRows}</tbody></table>

<h2>📊 RT₆₀ por Frequência</h2>
<table><thead><tr><th>Frequência</th><th>Sem Tratamento</th><th>Com Tratamento</th><th>Ideal</th></tr></thead><tbody>${freqRows}</tbody></table>

<h2>📋 Resultado</h2>
<div class="kpi">
  <div class="kpi-item"><div class="kpi-val">${rt60Medio?.toFixed(2) || "—"}s</div><div class="kpi-label">RT₆₀ médio (500 Hz)</div></div>
  <div class="kpi-item"><div class="kpi-val">${presetAtivo ? presetAtivo.rt60Ideal["500Hz"].toFixed(2) + "s" : "—"}</div><div class="kpi-label">RT₆₀ ideal</div></div>
  <div class="kpi-item"><div class="kpi-val"><span class="badge ${classificacao?.label === "Excelente" ? "ok" : classificacao?.label === "Aceitável" ? "warn" : "bad"}">${classificacao?.label || "—"}</span></div><div class="kpi-label">Classificação</div></div>
</div>

${listaCompras.length > 0 ? `
<h2>🛒 Lista de Compras</h2>
<table><thead><tr><th>Material</th><th>Quantidade</th><th>Preço Unit.</th><th>Total</th></tr></thead><tbody>${comprasRows}</tbody></table>
<p><strong>Total Estimado: R$ ${totalCompras.toFixed(2)}</strong></p>
` : ""}

<div class="footer">
  <p>Fórmula de Sabine: RT₆₀ = 0.161 × V / A</p>
  <p>Documento gerado automaticamente pelo sistema ISO-GESSO. Este laudo é uma estimativa baseada em coeficientes tabelados.</p>
  <p>© ${new Date().getFullYear()} ISO-GESSO — Soluções Acústicas</p>
</div>
</body></html>`);
    w.document.close();
    w.print();
  }, [materiais, listaCompras, rt60PorFreq, rt60SemTratamento, rt60Medio, presetAtivo, classificacao, comprimento, largura, altura, V, totalCompras]);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Simulador Acústico</h1>
          <p className="text-sm text-muted-foreground">Simulação de RT₆₀ em tempo real — Fórmula de Sabine</p>
        </div>
        {rt60Medio !== null && (
          <Button onClick={gerarProposta} className="gap-2">
            <FileText className="h-4 w-4" /> Gerar Proposta Técnica
          </Button>
        )}
      </div>

      {/* Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {presets.map(p => (
          <motion.div key={p.nome} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card
              className={`cursor-pointer transition-all border-2 ${presetAtivo?.nome === p.nome ? "border-primary bg-primary/5" : "border-transparent hover:border-muted-foreground/20"}`}
              onClick={() => aplicarPreset(p)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`p-3 rounded-xl ${presetAtivo?.nome === p.nome ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {p.icone}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{p.nome}</p>
                  <p className="text-xs text-muted-foreground">{p.descricao}</p>
                  <p className="text-xs font-mono text-muted-foreground mt-1">RT₆₀ ideal: {p.rt60Ideal["500Hz"]}s</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Input */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dimensões da Sala</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs">Comprimento (m)</Label>
                  <Input type="number" value={comprimento} onChange={e => setComprimento(e.target.value)} placeholder="0.0" />
                </div>
                <div>
                  <Label className="text-xs">Largura (m)</Label>
                  <Input type="number" value={largura} onChange={e => setLargura(e.target.value)} placeholder="0.0" />
                </div>
                <div>
                  <Label className="text-xs">Altura (m)</Label>
                  <Input type="number" value={altura} onChange={e => setAltura(e.target.value)} placeholder="0.0" />
                </div>
              </div>
              {V > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  Volume: <span className="font-mono font-semibold text-foreground">{V.toFixed(1)} m³</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Materiais Aplicados</CardTitle>
              <Button variant="outline" size="sm" onClick={addMaterial} className="gap-1">
                <Plus className="h-3.5 w-3.5" /> Adicionar
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {materiais.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Adicione materiais para simular</p>
              )}
              <AnimatePresence>
                {materiais.map(m => (
                  <motion.div key={m.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-end gap-3">
                    <div className="flex-1">
                      <Label className="text-xs">Material</Label>
                      <Select value={m.nome} onValueChange={v => updateMaterial(m.id, "nome", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {materiaisDisponiveis.map(mat => (
                            <SelectItem key={mat.nome} value={mat.nome}>{mat.nome} (α {mat.alphaMedio.toFixed(2)})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-24">
                      <Label className="text-xs">Área (m²)</Label>
                      <Input type="number" value={m.area || ""} onChange={e => updateMaterial(m.id, "area", e.target.value)} placeholder="0" />
                    </div>
                    <div className="w-14 text-center">
                      <Label className="text-xs">α</Label>
                      <p className="py-2 font-mono text-sm font-medium text-foreground">{m.alphaMedio.toFixed(2)}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeMaterial(m.id)} className="text-destructive shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Lista de compras */}
          {listaCompras.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Lista de Compras Estimada</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {listaCompras.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.nome} — {item.area} {item.unidade}</span>
                        <span className="font-mono font-semibold text-foreground">R$ {item.total.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-primary font-mono">R$ {totalCompras.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Right — Output */}
        <div className="space-y-6">
          {/* KPI Card */}
          <AnimatePresence mode="wait">
            {rt60Medio !== null ? (
              <motion.div key="resultado" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Volume2 className="h-5 w-5 text-primary" />
                      Resultado em Tempo Real
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-center gap-8 py-4">
                      <div className="text-center">
                        <p className="text-4xl font-bold font-mono text-primary">{rt60Medio.toFixed(2)}<span className="text-lg text-muted-foreground ml-1">s</span></p>
                        <p className="text-xs text-muted-foreground mt-1">RT₆₀ (500 Hz)</p>
                      </div>
                      {presetAtivo && (
                        <div className="text-center">
                          <p className="text-4xl font-bold font-mono text-muted-foreground">{presetAtivo.rt60Ideal["500Hz"].toFixed(2)}<span className="text-lg ml-1">s</span></p>
                          <p className="text-xs text-muted-foreground mt-1">Ideal ({presetAtivo.nome})</p>
                        </div>
                      )}
                    </div>
                    {classificacao && (
                      <div className="flex items-center justify-center gap-2">
                        {classificacao.icone}
                        <span className={`font-semibold ${classificacao.cor}`}>{classificacao.label}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="flex items-center justify-center h-48">
                <div className="text-center text-muted-foreground">
                  <Volume2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Defina dimensões e adicione materiais</p>
                  <p className="text-xs mt-1">O gráfico atualiza em tempo real</p>
                </div>
              </Card>
            )}
          </AnimatePresence>

          {/* Chart — Antes vs Depois */}
          {V > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Curva NC — Antes vs Depois do Tratamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} barGap={2}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="freq" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} />
                        <YAxis tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} unit="s" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                          formatter={(value: number) => [`${value.toFixed(2)}s`]}
                        />
                        <Legend />
                        <Bar dataKey="semTratamento" fill="hsl(0, 70%, 55%)" radius={[4, 4, 0, 0]} name="Sem Tratamento" opacity={0.5} />
                        <Bar dataKey="comTratamento" fill="hsl(25, 95%, 53%)" radius={[4, 4, 0, 0]} name="Com Tratamento" />
                        {presetAtivo && (
                          <ReferenceLine y={presetAtivo.rt60Ideal["500Hz"]} stroke="hsl(150, 60%, 45%)" strokeDasharray="5 5" label={{ value: `Ideal ${presetAtivo.nome}`, fill: "hsl(150, 60%, 45%)", fontSize: 11 }} />
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Vermelho = ambiente sem tratamento (concreto) · Laranja = com materiais aplicados · Verde = meta NC
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Tabela de frequências */}
          {rt60PorFreq && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">RT₆₀ por Frequência</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 gap-2">
                    {freqs.map(f => {
                      const val = rt60PorFreq[f];
                      const ideal = presetAtivo?.rt60Ideal[f];
                      const isGood = ideal ? Math.abs(val - ideal) / ideal <= 0.15 : null;
                      return (
                        <div key={f} className="text-center p-2 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">{f}</p>
                          <p className={`text-lg font-mono font-bold ${isGood === true ? "text-primary" : isGood === false ? "text-destructive" : "text-foreground"}`}>
                            {val.toFixed(2)}
                          </p>
                          {ideal && <p className="text-[10px] text-muted-foreground">ideal: {ideal.toFixed(2)}</p>}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculadora;
