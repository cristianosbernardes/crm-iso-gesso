import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, QrCode, Package, Eye, Edit, ChevronRight, Layers, Ruler, Wrench, Disc, Sparkles } from "lucide-react";

// ── Tipos por categoria ──────────────────────────────
interface ProdutoBase {
  id: number;
  nome: string;
  sku: string;
  categoria: string;
  estoque: number;
  unidade: string;
  preco: number;
  descricao: string;
}

interface La extends ProdutoBase {
  categoria: "Lãs";
  densidade: string;
  espessura: string;
  resistenciaTermica: string;
  nrc: string;
  alpha: Record<string, number>;
}

interface Perfil extends ProdutoBase {
  categoria: "Perfis";
  tipo: string;
  largura: string;
  comprimento: string;
  espessuraAco: string;
  acabamento: string;
}

interface Parafuso extends ProdutoBase {
  categoria: "Parafusos";
  tipo: string;
  diametro: string;
  comprimento: string;
  material: string;
  rendimentoM2: number;
}

interface Placa extends ProdutoBase {
  categoria: "Placas";
  tipo: string;
  espessura: string;
  dimensao: string;
  peso: string;
  nrc: string;
  bordaModelo: string;
}

interface Acessorio extends ProdutoBase {
  categoria: "Acessórios";
  tipo: string;
  aplicacao: string;
  rendimento: string;
}

type Produto = La | Perfil | Parafuso | Placa | Acessorio;

// ── Dados mockados ──────────────────────────────────
const produtos: Produto[] = [
  {
    id: 1, nome: "Lã de Vidro 50mm", sku: "LV-050", categoria: "Lãs", estoque: 320, unidade: "m²", preco: 28.5,
    descricao: "Lã de vidro para isolamento termoacústico em paredes e forros.",
    densidade: "16 kg/m³", espessura: "50mm", resistenciaTermica: "1.25 m²K/W", nrc: "0.65",
    alpha: { "125Hz": 0.15, "250Hz": 0.45, "500Hz": 0.70, "1kHz": 0.85, "2kHz": 0.90, "4kHz": 0.88 },
  },
  {
    id: 2, nome: "Lã de Vidro 75mm", sku: "LV-075", categoria: "Lãs", estoque: 180, unidade: "m²", preco: 42.0,
    descricao: "Lã de vidro de alta densidade para isolamento superior.",
    densidade: "24 kg/m³", espessura: "75mm", resistenciaTermica: "1.87 m²K/W", nrc: "0.80",
    alpha: { "125Hz": 0.25, "250Hz": 0.60, "500Hz": 0.85, "1kHz": 0.95, "2kHz": 0.95, "4kHz": 0.92 },
  },
  {
    id: 3, nome: "Lã de Rocha 50mm", sku: "LR-050", categoria: "Lãs", estoque: 95, unidade: "m²", preco: 55.0,
    descricao: "Lã de rocha basáltica para isolamento termoacústico e proteção contra fogo.",
    densidade: "32 kg/m³", espessura: "50mm", resistenciaTermica: "1.19 m²K/W", nrc: "0.72",
    alpha: { "125Hz": 0.18, "250Hz": 0.50, "500Hz": 0.78, "1kHz": 0.90, "2kHz": 0.92, "4kHz": 0.90 },
  },
  {
    id: 4, nome: "Lã de Rocha 75mm", sku: "LR-075", categoria: "Lãs", estoque: 60, unidade: "m²", preco: 78.0,
    descricao: "Lã de rocha 75mm para máximo desempenho acústico e térmico.",
    densidade: "48 kg/m³", espessura: "75mm", resistenciaTermica: "1.78 m²K/W", nrc: "0.85",
    alpha: { "125Hz": 0.30, "250Hz": 0.65, "500Hz": 0.90, "1kHz": 0.97, "2kHz": 0.97, "4kHz": 0.94 },
  },
  {
    id: 5, nome: "Perfil Montante 48mm", sku: "PM-048", categoria: "Perfis", estoque: 540, unidade: "un", preco: 18.9,
    descricao: "Perfil montante para estruturação de paredes drywall.",
    tipo: "Montante", largura: "48mm", comprimento: "3000mm", espessuraAco: "0.50mm", acabamento: "Galvanizado",
  },
  {
    id: 6, nome: "Perfil Montante 70mm", sku: "PM-070", categoria: "Perfis", estoque: 320, unidade: "un", preco: 24.5,
    descricao: "Perfil montante 70mm para paredes com maior isolamento.",
    tipo: "Montante", largura: "70mm", comprimento: "3000mm", espessuraAco: "0.50mm", acabamento: "Galvanizado",
  },
  {
    id: 7, nome: "Perfil Guia 48mm", sku: "PG-048", categoria: "Perfis", estoque: 410, unidade: "un", preco: 15.5,
    descricao: "Perfil guia superior e inferior para montantes de 48mm.",
    tipo: "Guia", largura: "48mm", comprimento: "3000mm", espessuraAco: "0.50mm", acabamento: "Galvanizado",
  },
  {
    id: 8, nome: "Perfil Guia 70mm", sku: "PG-070", categoria: "Perfis", estoque: 280, unidade: "un", preco: 19.9,
    descricao: "Perfil guia para montantes de 70mm.",
    tipo: "Guia", largura: "70mm", comprimento: "3000mm", espessuraAco: "0.50mm", acabamento: "Galvanizado",
  },
  {
    id: 9, nome: "Parafuso TA 3.5x25", sku: "PT-325", categoria: "Parafusos", estoque: 5000, unidade: "un", preco: 0.12,
    descricao: "Parafuso ponta agulha para fixação de placas em perfis.",
    tipo: "Ponta Agulha (TA)", diametro: "3.5mm", comprimento: "25mm", material: "Aço Fosfatizado", rendimentoM2: 25,
  },
  {
    id: 10, nome: "Parafuso TA 3.5x35", sku: "PT-335", categoria: "Parafusos", estoque: 3500, unidade: "un", preco: 0.15,
    descricao: "Parafuso para dupla camada de placa de gesso.",
    tipo: "Ponta Agulha (TA)", diametro: "3.5mm", comprimento: "35mm", material: "Aço Fosfatizado", rendimentoM2: 25,
  },
  {
    id: 11, nome: "Parafuso TB 4.2x13", sku: "PT-413", categoria: "Parafusos", estoque: 8000, unidade: "un", preco: 0.08,
    descricao: "Parafuso ponta broca para fixação metal-metal.",
    tipo: "Ponta Broca (TB)", diametro: "4.2mm", comprimento: "13mm", material: "Aço Zincado", rendimentoM2: 12,
  },
  {
    id: 12, nome: "Placa de Gesso ST 12.5mm", sku: "PG-125-ST", categoria: "Placas", estoque: 200, unidade: "un", preco: 32.0,
    descricao: "Placa de gesso acartonado Standard para áreas secas.",
    tipo: "Standard (ST)", espessura: "12.5mm", dimensao: "1200 x 2400mm", peso: "8.5 kg/m²", nrc: "0.05", bordaModelo: "Rebaixada (RB)",
  },
  {
    id: 13, nome: "Placa de Gesso RU 12.5mm", sku: "PG-125-RU", categoria: "Placas", estoque: 150, unidade: "un", preco: 45.0,
    descricao: "Placa de gesso resistente à umidade para banheiros e cozinhas.",
    tipo: "Resistente à Umidade (RU)", espessura: "12.5mm", dimensao: "1200 x 2400mm", peso: "9.0 kg/m²", nrc: "0.05", bordaModelo: "Rebaixada (RB)",
  },
  {
    id: 14, nome: "Placa de Gesso RF 15mm", sku: "PG-150-RF", categoria: "Placas", estoque: 80, unidade: "un", preco: 62.0,
    descricao: "Placa de gesso resistente ao fogo para áreas de alta exigência.",
    tipo: "Resistente ao Fogo (RF)", espessura: "15mm", dimensao: "1200 x 2400mm", peso: "12.5 kg/m²", nrc: "0.05", bordaModelo: "Rebaixada (RB)",
  },
  {
    id: 15, nome: "Fita Telada 50mm", sku: "FT-050", categoria: "Acessórios", estoque: 150, unidade: "rolo", preco: 8.5,
    descricao: "Fita de fibra de vidro para tratamento de juntas.",
    tipo: "Fita de Junta", aplicacao: "Juntas entre placas de gesso", rendimento: "90m por rolo",
  },
  {
    id: 16, nome: "Massa para Juntas 28kg", sku: "MJ-028", categoria: "Acessórios", estoque: 45, unidade: "balde", preco: 42.0,
    descricao: "Massa pronta para tratamento de juntas e acabamento.",
    tipo: "Massa de Acabamento", aplicacao: "Preenchimento e acabamento de juntas", rendimento: "Aprox. 30m² por balde",
  },
  {
    id: 17, nome: "Banda Acústica 70mm", sku: "BA-070", categoria: "Acessórios", estoque: 200, unidade: "rolo", preco: 12.0,
    descricao: "Banda de isolamento acústico para desacoplamento de perfis.",
    tipo: "Banda Acústica", aplicacao: "Base de guias e montantes para desacoplamento", rendimento: "30m por rolo",
  },
];

const categorias = ["Todos", "Lãs", "Perfis", "Parafusos", "Placas", "Acessórios"] as const;

const categoriaIcon: Record<string, React.ReactNode> = {
  "Lãs": <Layers className="h-4 w-4" />,
  "Perfis": <Ruler className="h-4 w-4" />,
  "Parafusos": <Wrench className="h-4 w-4" />,
  "Placas": <Disc className="h-4 w-4" />,
  "Acessórios": <Sparkles className="h-4 w-4" />,
};

const categoriaColor: Record<string, string> = {
  "Lãs": "bg-primary/15 text-primary",
  "Perfis": "bg-info/15 text-info",
  "Parafusos": "bg-success/15 text-success",
  "Placas": "bg-chart-4/15 text-chart-4",
  "Acessórios": "bg-warning/15 text-warning",
};

// ── Componentes de detalhe por categoria ──────────────
const DetailLa = ({ p }: { p: La }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <InfoItem label="Espessura" value={p.espessura} />
      <InfoItem label="Densidade" value={p.densidade} />
      <InfoItem label="Resistência Térmica" value={p.resistenciaTermica} />
      <InfoItem label="NRC" value={p.nrc} />
    </div>
    <div>
      <p className="text-xs text-muted-foreground font-medium mb-2">Coeficientes de Absorção (α)</p>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {Object.entries(p.alpha).map(([freq, val]) => (
          <div key={freq} className="rounded-lg bg-muted/50 p-2 text-center">
            <p className="text-[10px] text-muted-foreground">{freq}</p>
            <p className="text-sm font-mono font-bold text-foreground">{val.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DetailPerfil = ({ p }: { p: Perfil }) => (
  <div className="grid grid-cols-2 gap-4">
    <InfoItem label="Tipo" value={p.tipo} />
    <InfoItem label="Largura" value={p.largura} />
    <InfoItem label="Comprimento" value={p.comprimento} />
    <InfoItem label="Espessura do Aço" value={p.espessuraAco} />
    <InfoItem label="Acabamento" value={p.acabamento} />
  </div>
);

const DetailParafuso = ({ p }: { p: Parafuso }) => (
  <div className="grid grid-cols-2 gap-4">
    <InfoItem label="Tipo" value={p.tipo} />
    <InfoItem label="Diâmetro" value={p.diametro} />
    <InfoItem label="Comprimento" value={p.comprimento} />
    <InfoItem label="Material" value={p.material} />
    <InfoItem label="Rendimento / m²" value={`${p.rendimentoM2} un`} />
  </div>
);

const DetailPlaca = ({ p }: { p: Placa }) => (
  <div className="grid grid-cols-2 gap-4">
    <InfoItem label="Tipo" value={p.tipo} />
    <InfoItem label="Espessura" value={p.espessura} />
    <InfoItem label="Dimensão" value={p.dimensao} />
    <InfoItem label="Peso" value={p.peso} />
    <InfoItem label="NRC" value={p.nrc} />
    <InfoItem label="Borda" value={p.bordaModelo} />
  </div>
);

const DetailAcessorio = ({ p }: { p: Acessorio }) => (
  <div className="grid grid-cols-2 gap-4">
    <InfoItem label="Tipo" value={p.tipo} />
    <InfoItem label="Aplicação" value={p.aplicacao} />
    <InfoItem label="Rendimento" value={p.rendimento} />
  </div>
);

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-semibold text-foreground">{value}</p>
  </div>
);

const renderDetail = (p: Produto) => {
  switch (p.categoria) {
    case "Lãs": return <DetailLa p={p as La} />;
    case "Perfis": return <DetailPerfil p={p as Perfil} />;
    case "Parafusos": return <DetailParafuso p={p as Parafuso} />;
    case "Placas": return <DetailPlaca p={p as Placa} />;
    case "Acessórios": return <DetailAcessorio p={p as Acessorio} />;
    default: return null;
  }
};

// ── Página principal ────────────────────────────────
const Produtos = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);

  const filtered = produtos.filter((p) => {
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "Todos" || p.categoria === activeCategory;
    return matchSearch && matchCategory;
  });

  const countByCategory = (cat: string) => cat === "Todos" ? produtos.length : produtos.filter(p => p.categoria === cat).length;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Produtos</h1>
          <p className="text-sm text-muted-foreground">
            {produtos.length} produtos cadastrados · {filtered.length} exibidos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <QrCode className="h-4 w-4" /> Gerar QR Codes
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Novo Produto
          </Button>
        </div>
      </div>

      {/* Search + Category filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou SKU..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full sm:w-auto">
          <TabsList className="h-auto flex-wrap">
            {categorias.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="gap-1.5 text-xs">
                {cat !== "Todos" && categoriaIcon[cat]}
                {cat}
                <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-mono">
                  {countByCategory(cat)}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[280px]">Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Estoque</TableHead>
                  <TableHead className="text-right">Preço Unit.</TableHead>
                  <TableHead className="text-right w-[140px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filtered.map((p) => (
                    <motion.tr
                      key={p.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b transition-colors hover:bg-muted/50 cursor-pointer group"
                      onClick={() => setSelectedProduct(p)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-foreground">{p.nome}</p>
                            <p className="text-xs font-mono text-muted-foreground">{p.sku}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={categoriaColor[p.categoria] || ""}>
                          {p.categoria}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`font-semibold text-sm ${p.estoque < 100 ? "text-destructive" : "text-foreground"}`}>
                          {p.estoque.toLocaleString("pt-BR")}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">{p.unidade}</span>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-sm text-foreground">
                        R$ {p.preco.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                            <QrCode className="h-4 w-4" />
                          </Button>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground inline-block group-hover:hidden" />
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Package className="h-10 w-10 mb-2 opacity-40" />
                <p className="text-sm">Nenhum produto encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-lg">
          {selectedProduct && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg">{selectedProduct.nome}</DialogTitle>
                    <DialogDescription className="font-mono">{selectedProduct.sku}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-5 pt-2">
                {/* Info geral */}
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className={categoriaColor[selectedProduct.categoria] || ""}>
                    {selectedProduct.categoria}
                  </Badge>
                  <p className="text-lg font-bold text-foreground">R$ {selectedProduct.preco.toFixed(2)}</p>
                </div>

                <p className="text-sm text-muted-foreground">{selectedProduct.descricao}</p>

                <div className="flex gap-4">
                  <div className="flex-1 rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Estoque</p>
                    <p className={`text-lg font-bold ${selectedProduct.estoque < 100 ? "text-destructive" : "text-foreground"}`}>
                      {selectedProduct.estoque.toLocaleString("pt-BR")} {selectedProduct.unidade}
                    </p>
                  </div>
                </div>

                {/* Ficha técnica por categoria */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    Ficha Técnica
                  </h3>
                  {renderDetail(selectedProduct)}
                </div>

                {/* Ações */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1 gap-2">
                    <QrCode className="h-4 w-4" /> Gerar QR Code
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Edit className="h-4 w-4" /> Editar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Produtos;
