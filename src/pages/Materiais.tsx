import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, QrCode, Package } from "lucide-react";

const mockMateriais = [
  { id: 1, nome: "Lã de Vidro 50mm", sku: "LV-050", categoria: "Lãs", estoque: 320, unidade: "m²", alpha: "0.65", preco: 28.5 },
  { id: 2, nome: "Lã de Vidro 75mm", sku: "LV-075", categoria: "Lãs", estoque: 180, unidade: "m²", alpha: "0.80", preco: 42.0 },
  { id: 3, nome: "Lã de Rocha 50mm", sku: "LR-050", categoria: "Lãs", estoque: 95, unidade: "m²", alpha: "0.72", preco: 55.0 },
  { id: 4, nome: "Perfil Montante 48mm", sku: "PM-048", categoria: "Perfis", estoque: 540, unidade: "un", alpha: "—", preco: 18.9 },
  { id: 5, nome: "Perfil Guia 48mm", sku: "PG-048", categoria: "Perfis", estoque: 410, unidade: "un", alpha: "—", preco: 15.5 },
  { id: 6, nome: "Parafuso TA 3.5x25", sku: "PT-325", categoria: "Parafusos", estoque: 5000, unidade: "un", alpha: "—", preco: 0.12 },
  { id: 7, nome: "Placa de Gesso ST 12.5mm", sku: "PG-125", categoria: "Placas", estoque: 200, unidade: "un", alpha: "0.05", preco: 32.0 },
  { id: 8, nome: "Fita Telada 50mm", sku: "FT-050", categoria: "Acessórios", estoque: 150, unidade: "rolo", alpha: "—", preco: 8.5 },
];

const categoriaColor: Record<string, string> = {
  "Lãs": "bg-primary/15 text-primary",
  "Perfis": "bg-info/15 text-info",
  "Parafusos": "bg-success/15 text-success",
  "Placas": "bg-chart-4/15 text-chart-4",
  "Acessórios": "bg-warning/15 text-warning",
};

const Materiais = () => {
  const [search, setSearch] = useState("");

  const filtered = mockMateriais.filter(
    (m) =>
      m.nome.toLowerCase().includes(search.toLowerCase()) ||
      m.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Materiais</h1>
          <p className="text-sm text-muted-foreground">
            {mockMateriais.length} produtos cadastrados
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Novo Material
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou SKU..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {filtered.map((m) => (
          <Card key={m.id} className="hover:shadow-md transition-shadow group">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">{m.nome}</CardTitle>
                  <p className="text-xs font-mono text-muted-foreground">{m.sku}</p>
                </div>
              </div>
              <Badge variant="secondary" className={categoriaColor[m.categoria] || ""}>
                {m.categoria}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Estoque</p>
                  <p className={`font-semibold ${m.estoque < 100 ? "text-destructive" : "text-foreground"}`}>
                    {m.estoque} {m.unidade}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">α (NRC)</p>
                  <p className="font-mono font-medium text-foreground">{m.alpha}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Preço</p>
                  <p className="font-semibold text-foreground">
                    R$ {m.preco.toFixed(2)}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <QrCode className="h-3.5 w-3.5" /> Gerar QR Code
              </Button>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
};

export default Materiais;
