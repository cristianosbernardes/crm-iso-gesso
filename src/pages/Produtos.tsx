import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, QrCode, Package, Eye, Edit, ChevronRight, Layers, Ruler, Wrench, Disc, Sparkles } from "lucide-react";
import { produtos, categorias, categoriaColor } from "@/data/produtos";

const categoriaIcon: Record<string, React.ReactNode> = {
  "Lãs": <Layers className="h-4 w-4" />,
  "Perfis": <Ruler className="h-4 w-4" />,
  "Parafusos": <Wrench className="h-4 w-4" />,
  "Placas": <Disc className="h-4 w-4" />,
  "Acessórios": <Sparkles className="h-4 w-4" />,
};

const Produtos = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const navigate = useNavigate();

  const filtered = produtos.filter((p) => {
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "Todos" || p.categoria === activeCategory;
    return matchSearch && matchCategory;
  });

  const countByCategory = (cat: string) => cat === "Todos" ? produtos.length : produtos.filter(p => p.categoria === cat).length;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Produtos</h1>
          <p className="text-sm text-muted-foreground">
            {produtos.length} produtos cadastrados · {filtered.length} exibidos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><QrCode className="h-4 w-4" /> Gerar QR Codes</Button>
          <Button className="gap-2"><Plus className="h-4 w-4" /> Novo Produto</Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nome ou SKU..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full sm:w-auto">
          <TabsList className="h-auto flex-wrap">
            {categorias.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="gap-1.5 text-xs">
                {cat !== "Todos" && categoriaIcon[cat]}
                {cat}
                <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-mono">{countByCategory(cat)}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

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
                      onClick={() => navigate(`/dashboard/produtos/${p.id}`)}
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
                        <Badge variant="secondary" className={categoriaColor[p.categoria] || ""}>{p.categoria}</Badge>
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
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/produtos/${p.id}`); }}>
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
    </div>
  );
};

export default Produtos;
