import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Plus, Trash2, Volume2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface Material {
  id: number;
  nome: string;
  area: number;
  alpha: number;
}

const materiaisDisponiveis = [
  { nome: "Lã de Vidro 50mm", alpha: 0.65 },
  { nome: "Lã de Vidro 75mm", alpha: 0.80 },
  { nome: "Lã de Rocha 50mm", alpha: 0.72 },
  { nome: "Placa de Gesso 12.5mm", alpha: 0.05 },
  { nome: "Piso Cerâmico", alpha: 0.02 },
  { nome: "Vidro Simples 6mm", alpha: 0.04 },
  { nome: "Cortina Pesada", alpha: 0.55 },
];

const Calculadora = () => {
  const [comprimento, setComprimento] = useState("");
  const [largura, setLargura] = useState("");
  const [altura, setAltura] = useState("");
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [resultado, setResultado] = useState<number | null>(null);

  const addMaterial = () => {
    setMateriais([...materiais, { id: Date.now(), nome: materiaisDisponiveis[0].nome, area: 0, alpha: materiaisDisponiveis[0].alpha }]);
  };

  const removeMaterial = (id: number) => {
    setMateriais(materiais.filter((m) => m.id !== id));
  };

  const updateMaterial = (id: number, field: string, value: string) => {
    setMateriais(materiais.map((m) => {
      if (m.id !== id) return m;
      if (field === "nome") {
        const found = materiaisDisponiveis.find((mat) => mat.nome === value);
        return { ...m, nome: value, alpha: found?.alpha || 0 };
      }
      if (field === "area") return { ...m, area: parseFloat(value) || 0 };
      return m;
    }));
  };

  const calcular = () => {
    const V = (parseFloat(comprimento) || 0) * (parseFloat(largura) || 0) * (parseFloat(altura) || 0);
    if (V === 0 || materiais.length === 0) return;
    const A = materiais.reduce((sum, m) => sum + m.area * m.alpha, 0);
    if (A === 0) return;
    const rt60 = (0.161 * V) / A;
    setResultado(rt60);
  };

  const freqData = [
    { freq: "125Hz", rt60: resultado ? resultado * 1.3 : 0, ideal: 0.8 },
    { freq: "250Hz", rt60: resultado ? resultado * 1.15 : 0, ideal: 0.7 },
    { freq: "500Hz", rt60: resultado ? resultado : 0, ideal: 0.6 },
    { freq: "1kHz", rt60: resultado ? resultado * 0.9 : 0, ideal: 0.55 },
    { freq: "2kHz", rt60: resultado ? resultado * 0.8 : 0, ideal: 0.5 },
    { freq: "4kHz", rt60: resultado ? resultado * 0.7 : 0, ideal: 0.45 },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Calculadora Acústica</h1>
        <p className="text-sm text-muted-foreground">Cálculo de Tempo de Reverberação (RT₆₀) — Fórmula de Sabine</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dimensões da Sala</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs">Comprimento (m)</Label>
                <Input type="number" value={comprimento} onChange={(e) => setComprimento(e.target.value)} placeholder="0.0" />
              </div>
              <div>
                <Label className="text-xs">Largura (m)</Label>
                <Input type="number" value={largura} onChange={(e) => setLargura(e.target.value)} placeholder="0.0" />
              </div>
              <div>
                <Label className="text-xs">Altura (m)</Label>
                <Input type="number" value={altura} onChange={(e) => setAltura(e.target.value)} placeholder="0.0" />
              </div>
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
                <p className="text-sm text-muted-foreground text-center py-4">
                  Adicione materiais para calcular
                </p>
              )}
              {materiais.map((m) => (
                <div key={m.id} className="flex items-end gap-3">
                  <div className="flex-1">
                    <Label className="text-xs">Material</Label>
                    <Select value={m.nome} onValueChange={(v) => updateMaterial(m.id, "nome", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {materiaisDisponiveis.map((mat) => (
                          <SelectItem key={mat.nome} value={mat.nome}>{mat.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24">
                    <Label className="text-xs">Área (m²)</Label>
                    <Input type="number" value={m.area || ""} onChange={(e) => updateMaterial(m.id, "area", e.target.value)} placeholder="0" />
                  </div>
                  <div className="w-16 text-center">
                    <Label className="text-xs">α</Label>
                    <p className="py-2 font-mono text-sm font-medium text-foreground">{m.alpha}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeMaterial(m.id)} className="text-destructive shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={calcular} className="w-full mt-4 gap-2" disabled={materiais.length === 0}>
                <Calculator className="h-4 w-4" /> Calcular RT₆₀
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output */}
        <div className="space-y-6">
          {resultado !== null && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-primary" />
                    Resultado — Tempo de Reverberação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-4">
                    <p className="text-5xl font-bold font-mono text-primary">
                      {resultado.toFixed(2)}
                      <span className="text-lg text-muted-foreground ml-1">s</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">RT₆₀ médio (500 Hz)</p>
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={freqData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="freq" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} />
                        <YAxis tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} unit="s" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(220, 25%, 12%)",
                            border: "none",
                            borderRadius: "8px",
                            color: "hsl(220, 10%, 92%)",
                          }}
                        />
                        <ReferenceLine y={0.6} stroke="hsl(150, 60%, 45%)" strokeDasharray="5 5" label={{ value: "NC ideal", fill: "hsl(150, 60%, 45%)", fontSize: 11 }} />
                        <Bar dataKey="rt60" fill="hsl(25, 95%, 53%)" radius={[4, 4, 0, 0]} name="RT₆₀" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Fórmula de Sabine: RT₆₀ = 0.161 × V / A — Linha verde = curva NC recomendada
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {resultado === null && (
            <Card className="flex items-center justify-center h-64">
              <div className="text-center text-muted-foreground">
                <Volume2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Preencha os dados e clique em calcular</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculadora;
