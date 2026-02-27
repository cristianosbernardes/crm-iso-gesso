import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ArrowLeft, Package, QrCode, Edit, Layers, Ruler, Wrench, Disc, Sparkles,
  AlertTriangle, TrendingUp, ShieldCheck, Flame, Droplets, Thermometer, Volume2,
  Calculator, ClipboardList, BarChart3, History, FileText, Link2, PackagePlus,
  ArrowUpDown, StickyNote, GitCompare, Download, Plus, Minus, Calendar,
  DollarSign, ArrowUp, ArrowDown, Clock, User, FileBadge, FileCheck,
  MapPin, Palette, BoxSelect, Image, BookOpen
} from "lucide-react";
import { findProdutoById, produtos, categoriaColor, type La, type Perfil, type Parafuso, type Placa, type Acessorio, type Produto } from "@/data/produtos";
import { toast } from "sonner";

const categoriaIcon: Record<string, React.ReactNode> = {
  "Lãs": <Layers className="h-5 w-5" />,
  "Perfis": <Ruler className="h-5 w-5" />,
  "Parafusos": <Wrench className="h-5 w-5" />,
  "Placas": <Disc className="h-5 w-5" />,
  "Acessórios": <Sparkles className="h-5 w-5" />,
};

// ── Info Card helper ──
const InfoCard = ({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) => (
  <div className="rounded-xl border bg-card p-4 space-y-1">
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </div>
    <p className="text-lg font-bold text-foreground">{value}</p>
    {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
  </div>
);

// ── Seção de Lãs ──
const SectionLa = ({ p }: { p: La }) => {
  const maxAlpha = Math.max(...Object.values(p.alpha));
  const bestFreq = Object.entries(p.alpha).find(([, v]) => v === maxAlpha)?.[0] || "";
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard icon={<Ruler className="h-4 w-4" />} label="Espessura" value={p.espessura} />
        <InfoCard icon={<Package className="h-4 w-4" />} label="Densidade" value={p.densidade} />
        <InfoCard icon={<Thermometer className="h-4 w-4" />} label="Resistência Térmica" value={p.resistenciaTermica} sub="Isolamento térmico" />
        <InfoCard icon={<Volume2 className="h-4 w-4" />} label="NRC" value={p.nrc} sub="Coeficiente de redução de ruído" />
      </div>
      <Card>
        <Accordion type="single" collapsible>
          <AccordionItem value="alpha" className="border-none">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <BarChart3 className="h-4 w-4 text-primary" />
                Coeficientes de Absorção Sonora (α)
                <span className="text-xs font-normal text-muted-foreground ml-2">Melhor: {bestFreq} (α = {maxAlpha.toFixed(2)})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 space-y-3">
              {Object.entries(p.alpha).map(([freq, val]) => (
                <div key={freq} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground">{freq}</span>
                    <span className="font-mono text-muted-foreground">{val.toFixed(2)}</span>
                  </div>
                  <Progress value={val * 100} className="h-2" />
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-primary" />
            Aplicações Recomendadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: <ShieldCheck className="h-4 w-4" />, text: "Isolamento em paredes drywall" },
              { icon: <Volume2 className="h-4 w-4" />, text: "Tratamento acústico de forros" },
              { icon: <Thermometer className="h-4 w-4" />, text: "Isolamento térmico de coberturas" },
              { icon: <Flame className="h-4 w-4" />, text: "Proteção passiva contra incêndio" },
            ].map((app, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <div className="text-primary">{app.icon}</div>
                <span className="text-sm text-foreground">{app.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ── Seção de Perfis ──
const SectionPerfil = ({ p }: { p: Perfil }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <InfoCard icon={<Ruler className="h-4 w-4" />} label="Tipo" value={p.tipo} />
      <InfoCard icon={<Ruler className="h-4 w-4" />} label="Largura" value={p.largura} />
      <InfoCard icon={<Ruler className="h-4 w-4" />} label="Comprimento" value={p.comprimento} />
      <InfoCard icon={<ShieldCheck className="h-4 w-4" />} label="Espessura do Aço" value={p.espessuraAco} sub="Norma NBR 15253" />
      <InfoCard icon={<Sparkles className="h-4 w-4" />} label="Acabamento" value={p.acabamento} />
    </div>
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Calculator className="h-4 w-4 text-primary" />Consumo Estimado</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground mb-1">{p.tipo === "Montante" ? "Montantes por m²" : "Guias por metro linear"}</p>
            <p className="text-xl font-bold text-foreground">{p.tipo === "Montante" ? "~1.67 un/m²" : "2 un/ml"}</p>
            <p className="text-xs text-muted-foreground mt-1">{p.tipo === "Montante" ? "Espaçamento de 600mm entre eixos" : "Superior + inferior"}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground mb-1">Peso linear</p>
            <p className="text-xl font-bold text-foreground">~0.42 kg/m</p>
            <p className="text-xs text-muted-foreground">Aço galvanizado {p.espessuraAco}</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><ClipboardList className="h-4 w-4 text-primary" />Compatibilidade</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-2">
          {[
            `Lãs de ${p.largura === "48mm" ? "50mm" : "75mm"} (encaixe interno)`,
            `Guias / Montantes de ${p.largura}`,
            "Placas de gesso ST, RU e RF",
            "Parafusos TB 4.2x13 (metal-metal) e TA 3.5x25 (placa-perfil)",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// ── Seção de Parafusos ──
const SectionParafuso = ({ p }: { p: Parafuso }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <InfoCard icon={<Wrench className="h-4 w-4" />} label="Tipo" value={p.tipo} />
      <InfoCard icon={<Ruler className="h-4 w-4" />} label="Diâmetro" value={p.diametro} />
      <InfoCard icon={<Ruler className="h-4 w-4" />} label="Comprimento" value={p.comprimento} />
      <InfoCard icon={<ShieldCheck className="h-4 w-4" />} label="Material" value={p.material} />
      <InfoCard icon={<Calculator className="h-4 w-4" />} label="Rendimento / m²" value={`${p.rendimentoM2} un`} sub="Espaçamento padrão de 200mm" />
    </div>
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2"><Calculator className="h-4 w-4 text-primary" />Calculadora Rápida</CardTitle>
        <p className="text-xs text-muted-foreground">Com base no rendimento de {p.rendimentoM2} un/m²</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {[10, 50, 100].map(area => (
            <div key={area} className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">{area} m²</p>
              <p className="text-xl font-bold text-foreground">{(area * p.rendimentoM2).toLocaleString("pt-BR")}</p>
              <p className="text-xs text-muted-foreground">parafusos</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><ClipboardList className="h-4 w-4 text-primary" />Indicação de Uso</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-2">
          {p.tipo.includes("TA") ? (
            <>
              <UsageItem text="Fixação de placas de gesso em perfis metálicos" />
              <UsageItem text={p.comprimento === "25mm" ? "Camada simples de placa" : "Dupla camada de placas"} />
              <UsageItem text="Utilizar parafusadeira com controle de torque" />
              <UsageItem text="Afundar 1mm abaixo da superfície da placa" />
            </>
          ) : (
            <>
              <UsageItem text="Fixação de perfil montante em perfil guia" />
              <UsageItem text="Conexões metal-metal em geral" />
              <UsageItem text="Ponta broca autoroscante — dispensa pré-furo" />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
);

// ── Seção de Placas ──
const SectionPlaca = ({ p }: { p: Placa }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <InfoCard icon={<Disc className="h-4 w-4" />} label="Tipo" value={p.tipo} />
      <InfoCard icon={<Ruler className="h-4 w-4" />} label="Espessura" value={p.espessura} />
      <InfoCard icon={<Ruler className="h-4 w-4" />} label="Dimensão" value={p.dimensao} />
      <InfoCard icon={<Package className="h-4 w-4" />} label="Peso" value={p.peso} />
      <InfoCard icon={<Volume2 className="h-4 w-4" />} label="NRC" value={p.nrc} sub="Absorção sonora da placa isolada" />
      <InfoCard icon={<Layers className="h-4 w-4" />} label="Borda" value={p.bordaModelo} />
    </div>
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" />Propriedades Especiais</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <PropertyBadge icon={<Droplets className="h-5 w-5" />} label="Resistência à Umidade" active={p.tipo.includes("RU")} />
          <PropertyBadge icon={<Flame className="h-5 w-5" />} label="Resistência ao Fogo" active={p.tipo.includes("RF")} />
          <PropertyBadge icon={<ShieldCheck className="h-5 w-5" />} label="Uso Geral" active={p.tipo.includes("ST")} />
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Calculator className="h-4 w-4 text-primary" />Rendimento por Placa</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground mb-1">Área por placa</p>
            <p className="text-xl font-bold text-foreground">2.88 m²</p>
            <p className="text-xs text-muted-foreground">1.20 × 2.40m</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground mb-1">Placas para 100m²</p>
            <p className="text-xl font-bold text-foreground">~35 un</p>
            <p className="text-xs text-muted-foreground">+5% de perda recomendado</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// ── Seção de Acessórios ──
const SectionAcessorio = ({ p }: { p: Acessorio }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <InfoCard icon={<Sparkles className="h-4 w-4" />} label="Tipo" value={p.tipo} />
      <InfoCard icon={<ClipboardList className="h-4 w-4" />} label="Aplicação" value={p.aplicacao} />
      <InfoCard icon={<TrendingUp className="h-4 w-4" />} label="Rendimento" value={p.rendimento} />
    </div>
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><ClipboardList className="h-4 w-4 text-primary" />Instruções de Uso</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-2">
          {p.tipo === "Fita de Junta" && (
            <>
              <UsageItem text="Aplicar sobre a massa fresca na junta entre placas" />
              <UsageItem text="Alisar com espátula removendo bolhas de ar" />
              <UsageItem text="Aplicar segunda demão de massa após secagem" />
              <UsageItem text="Lixar após secagem completa (24h)" />
            </>
          )}
          {p.tipo === "Massa de Acabamento" && (
            <>
              <UsageItem text="Produto pronto para uso — não diluir" />
              <UsageItem text="Aplicar com espátula de 15cm ou 20cm" />
              <UsageItem text="Tempo de secagem: 4 a 6 horas entre demãos" />
              <UsageItem text="Armazenar em local fresco e seco, tampa fechada" />
            </>
          )}
          {p.tipo === "Banda Acústica" && (
            <>
              <UsageItem text="Aplicar na base e topo dos perfis guia antes da fixação" />
              <UsageItem text="Garantir que toda a largura do perfil seja coberta" />
              <UsageItem text="Essencial para desempenho acústico do sistema" />
              <UsageItem text="Não reutilizar em caso de remoção do perfil" />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
);

// ── Helpers ──
const UsageItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 text-sm text-foreground">
    <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
    {text}
  </div>
);

const PropertyBadge = ({ icon, label, active }: { icon: React.ReactNode; label: string; active: boolean }) => (
  <div className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors ${active ? "border-primary/30 bg-primary/5" : "opacity-40"}`}>
    <div className={active ? "text-primary" : "text-muted-foreground"}>{icon}</div>
    <span className="text-xs font-medium">{label}</span>
    {active && <Badge variant="secondary" className="text-[10px] bg-primary/15 text-primary">Ativo</Badge>}
  </div>
);

const renderSection = (p: Produto) => {
  switch (p.categoria) {
    case "Lãs": return <SectionLa p={p as La} />;
    case "Perfis": return <SectionPerfil p={p as Perfil} />;
    case "Parafusos": return <SectionParafuso p={p as Parafuso} />;
    case "Placas": return <SectionPlaca p={p as Placa} />;
    case "Acessórios": return <SectionAcessorio p={p as Acessorio} />;
    default: return null;
  }
};

// ── Mock data for new modules ──
const mockHistoricoPrecos = [
  { data: "01/02/2026", preco: 28.50, variacao: 0 },
  { data: "15/01/2026", preco: 27.80, variacao: -2.46 },
  { data: "01/01/2026", preco: 27.00, variacao: -2.88 },
  { data: "01/12/2025", preco: 26.50, variacao: -1.85 },
  { data: "01/11/2025", preco: 25.90, variacao: -2.26 },
  { data: "01/10/2025", preco: 25.00, variacao: -3.47 },
];

const mockMovimentacoes = [
  { id: 1, data: "27/02/2026", tipo: "entrada", qtd: 200, responsavel: "Carlos Silva", motivo: "Compra fornecedor", documento: "NF 4521" },
  { id: 2, data: "25/02/2026", tipo: "saida", qtd: 50, responsavel: "Ana Oliveira", motivo: "Venda cliente", documento: "OS 1283" },
  { id: 3, data: "22/02/2026", tipo: "saida", qtd: 30, responsavel: "Pedro Santos", motivo: "Obra Centro SP", documento: "OS 1280" },
  { id: 4, data: "18/02/2026", tipo: "entrada", qtd: 100, responsavel: "Carlos Silva", motivo: "Devolução", documento: "DEV 089" },
  { id: 5, data: "15/02/2026", tipo: "saida", qtd: 80, responsavel: "Ana Oliveira", motivo: "Venda cliente", documento: "OS 1275" },
  { id: 6, data: "10/02/2026", tipo: "ajuste", qtd: -5, responsavel: "Sistema", motivo: "Ajuste inventário", documento: "INV 002" },
];

const mockDocumentos = [
  { id: 1, nome: "Ficha Técnica", tipo: "PDF", tamanho: "2.4 MB", data: "15/01/2026", categoria: "tecnico" },
  { id: 2, nome: "Laudo Acústico NBR 15575", tipo: "PDF", tamanho: "5.1 MB", data: "10/12/2025", categoria: "laudo" },
  { id: 3, nome: "Certificado de Qualidade", tipo: "PDF", tamanho: "1.8 MB", data: "01/11/2025", categoria: "certificado" },
  { id: 4, nome: "Manual de Instalação", tipo: "PDF", tamanho: "8.3 MB", data: "20/09/2025", categoria: "manual" },
  { id: 5, nome: "Laudo de Flamabilidade", tipo: "PDF", tamanho: "3.2 MB", data: "05/08/2025", categoria: "laudo" },
];

const mockNotas = [
  { id: 1, texto: "Fornecedor principal: Isover. Prazo de entrega 5-7 dias úteis após pedido.", autor: "Carlos Silva", data: "26/02/2026 14:30" },
  { id: 2, texto: "Cliente Construtora Alpha solicitou 500m² para março. Verificar disponibilidade.", autor: "Ana Oliveira", data: "24/02/2026 10:15" },
  { id: 3, texto: "Preço renegociado com fornecedor para compras acima de 1000m²: R$ 25,50/m².", autor: "Pedro Santos", data: "20/02/2026 16:45" },
];

// ── Módulo: Histórico de Preços ──
const HistoricoPrecos = ({ produto }: { produto: Produto }) => {
  const precoAtual = produto.preco;
  const precoAnterior = mockHistoricoPrecos[1]?.preco || precoAtual;
  const variacaoTotal = ((precoAtual - mockHistoricoPrecos[mockHistoricoPrecos.length - 1].preco) / mockHistoricoPrecos[mockHistoricoPrecos.length - 1].preco * 100);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Preço Atual</p>
            <p className="text-2xl font-bold text-foreground">R$ {precoAtual.toFixed(2)}</p>
            <div className="flex items-center gap-1 mt-1">
              {precoAtual >= precoAnterior ? <ArrowUp className="h-3 w-3 text-destructive" /> : <ArrowDown className="h-3 w-3 text-green-500" />}
              <span className={`text-xs font-medium ${precoAtual >= precoAnterior ? "text-destructive" : "text-green-500"}`}>
                {((precoAtual - precoAnterior) / precoAnterior * 100).toFixed(1)}% vs anterior
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Variação 6 meses</p>
            <p className="text-2xl font-bold text-foreground">+{variacaoTotal.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">De R$ {mockHistoricoPrecos[mockHistoricoPrecos.length - 1].preco.toFixed(2)} a R$ {precoAtual.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Preço Médio</p>
            <p className="text-2xl font-bold text-foreground">
              R$ {(mockHistoricoPrecos.reduce((s, h) => s + h.preco, 0) / mockHistoricoPrecos.length).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Últimos 6 registros</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico visual simples com barras */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" />Evolução do Preço</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...mockHistoricoPrecos].reverse().map((h, i) => {
              const min = Math.min(...mockHistoricoPrecos.map(x => x.preco));
              const max = Math.max(...mockHistoricoPrecos.map(x => x.preco), precoAtual);
              const perc = ((h.preco - min) / (max - min)) * 100;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-24 shrink-0">{h.data}</span>
                  <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-primary/70 rounded-full transition-all" style={{ width: `${Math.max(perc, 10)}%` }} />
                  </div>
                  <span className="text-xs font-mono font-semibold text-foreground w-20 text-right">R$ {h.preco.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><History className="h-4 w-4 text-primary" />Registro Detalhado</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-right">Variação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockHistoricoPrecos.map((h, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm">{h.data}</TableCell>
                  <TableCell className="text-right font-mono font-semibold text-sm">R$ {h.preco.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    {i === 0 ? (
                      <Badge className="bg-primary/15 text-primary text-xs">Atual</Badge>
                    ) : (
                      <span className={`text-xs font-medium ${h.variacao > 0 ? "text-green-500" : "text-destructive"}`}>
                        {h.variacao > 0 ? "+" : ""}{h.variacao.toFixed(2)}%
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// ── Módulo: Movimentações de Estoque ──
const MovimentacoesEstoque = ({ produto }: { produto: Produto }) => {
  const entradas = mockMovimentacoes.filter(m => m.tipo === "entrada").reduce((s, m) => s + m.qtd, 0);
  const saidas = mockMovimentacoes.filter(m => m.tipo === "saida").reduce((s, m) => s + m.qtd, 0);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Estoque Atual</p>
            <p className="text-2xl font-bold text-foreground">{produto.estoque.toLocaleString("pt-BR")}</p>
            <p className="text-xs text-muted-foreground">{produto.unidade}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Entradas (mês)</p>
            <p className="text-2xl font-bold text-green-500">+{entradas}</p>
            <p className="text-xs text-muted-foreground">{produto.unidade}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Saídas (mês)</p>
            <p className="text-2xl font-bold text-destructive">-{saidas}</p>
            <p className="text-xs text-muted-foreground">{produto.unidade}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Saldo Líquido</p>
            <p className={`text-2xl font-bold ${entradas - saidas >= 0 ? "text-green-500" : "text-destructive"}`}>
              {entradas - saidas >= 0 ? "+" : ""}{entradas - saidas}
            </p>
            <p className="text-xs text-muted-foreground">{produto.unidade}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2"><ArrowUpDown className="h-4 w-4 text-primary" />Movimentações Recentes</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Qtd</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Documento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMovimentacoes.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="text-sm">{m.data}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={
                      m.tipo === "entrada" ? "bg-green-500/15 text-green-600" :
                      m.tipo === "saida" ? "bg-destructive/15 text-destructive" :
                      "bg-muted text-muted-foreground"
                    }>
                      {m.tipo === "entrada" ? "Entrada" : m.tipo === "saida" ? "Saída" : "Ajuste"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    <span className={m.tipo === "entrada" ? "text-green-500" : m.tipo === "saida" ? "text-destructive" : "text-muted-foreground"}>
                      {m.tipo === "entrada" ? "+" : m.tipo === "saida" ? "-" : ""}{Math.abs(m.qtd)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{m.responsavel}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{m.motivo}</TableCell>
                  <TableCell><Badge variant="outline" className="font-mono text-xs">{m.documento}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// ── Módulo: Documentos Técnicos ──
const DocumentosTecnicos = () => {
  const catIcon: Record<string, React.ReactNode> = {
    tecnico: <FileText className="h-4 w-4" />,
    laudo: <FileBadge className="h-4 w-4" />,
    certificado: <FileCheck className="h-4 w-4" />,
    manual: <ClipboardList className="h-4 w-4" />,
  };
  const catLabel: Record<string, string> = {
    tecnico: "Ficha Técnica",
    laudo: "Laudo",
    certificado: "Certificado",
    manual: "Manual",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{mockDocumentos.length} documentos vinculados</p>
        <Button variant="outline" size="sm" className="gap-2"><Plus className="h-4 w-4" />Adicionar Documento</Button>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {mockDocumentos.map((doc) => (
          <Card key={doc.id} className="hover:bg-muted/30 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                {catIcon[doc.categoria] || <FileText className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{doc.nome}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <Badge variant="secondary" className="text-[10px]">{catLabel[doc.categoria]}</Badge>
                  <span className="text-xs text-muted-foreground">{doc.tipo} · {doc.tamanho}</span>
                  <span className="text-xs text-muted-foreground">Atualizado em {doc.data}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <Download className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ── Módulo: Produtos Relacionados ──
const ProdutosRelacionados = ({ produto }: { produto: Produto }) => {
  const navigate = useNavigate();
  
  // Sugere produtos compatíveis baseado na categoria
  const getRelacionados = (): Produto[] => {
    switch (produto.categoria) {
      case "Lãs":
        return produtos.filter(p => ["Perfis", "Placas"].includes(p.categoria)).slice(0, 4);
      case "Perfis":
        return produtos.filter(p => ["Lãs", "Parafusos", "Placas"].includes(p.categoria)).slice(0, 4);
      case "Parafusos":
        return produtos.filter(p => ["Perfis", "Placas"].includes(p.categoria)).slice(0, 4);
      case "Placas":
        return produtos.filter(p => ["Parafusos", "Acessórios", "Perfis"].includes(p.categoria)).slice(0, 4);
      case "Acessórios":
        return produtos.filter(p => ["Placas"].includes(p.categoria)).slice(0, 4);
      default:
        return [];
    }
  };

  const relacionados = getRelacionados();
  const mesmaCat = produtos.filter(p => p.categoria === produto.categoria && p.id !== produto.id).slice(0, 3);

  const catIconSmall: Record<string, React.ReactNode> = {
    "Lãs": <Layers className="h-4 w-4" />,
    "Perfis": <Ruler className="h-4 w-4" />,
    "Parafusos": <Wrench className="h-4 w-4" />,
    "Placas": <Disc className="h-4 w-4" />,
    "Acessórios": <Sparkles className="h-4 w-4" />,
  };

  const ProdutoCard = ({ p }: { p: Produto }) => (
    <Card className="cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => navigate(`/dashboard/produtos/${p.id}`)}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
          {catIconSmall[p.categoria]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{p.nome}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-mono text-muted-foreground">{p.sku}</span>
            <Badge variant="secondary" className={`text-[10px] ${categoriaColor[p.categoria]}`}>{p.categoria}</Badge>
          </div>
        </div>
        <p className="text-sm font-bold text-foreground shrink-0">R$ {p.preco.toFixed(2)}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Link2 className="h-4 w-4 text-primary" />
          Produtos Compatíveis
        </h3>
        <p className="text-xs text-muted-foreground mb-3">Itens que complementam este produto em uma instalação típica</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {relacionados.map(p => <ProdutoCard key={p.id} p={p} />)}
        </div>
      </div>

      {mesmaCat.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <GitCompare className="h-4 w-4 text-primary" />
            Mesma Categoria — {produto.categoria}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mesmaCat.map(p => <ProdutoCard key={p.id} p={p} />)}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Módulo: Notas e Observações ──
const NotasObservacoes = () => {
  const [novaNota, setNovaNota] = useState("");

  const handleAddNota = () => {
    if (!novaNota.trim()) return;
    toast.success("Nota adicionada com sucesso!");
    setNovaNota("");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-3">
          <Textarea
            placeholder="Adicione uma nota sobre este produto (fornecedor, prazo, observações internas...)"
            value={novaNota}
            onChange={(e) => setNovaNota(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button size="sm" className="gap-2" onClick={handleAddNota} disabled={!novaNota.trim()}>
              <Plus className="h-4 w-4" /> Adicionar Nota
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {mockNotas.map((nota) => (
          <Card key={nota.id}>
            <CardContent className="p-4">
              <p className="text-sm text-foreground">{nota.texto}</p>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  {nota.autor}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {nota.data}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ── Módulo: Ajuste Rápido de Estoque (Modal) ──
const AjusteEstoqueModal = ({ produto }: { produto: Produto }) => {
  const [tipo, setTipo] = useState<string>("entrada");
  const [quantidade, setQuantidade] = useState("");
  const [motivo, setMotivo] = useState("");

  const handleAjuste = () => {
    toast.success(`Estoque ${tipo === "entrada" ? "adicionado" : "removido"}: ${quantidade} ${produto.unidade}`);
    setQuantidade("");
    setMotivo("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2"><PackagePlus className="h-4 w-4" />Ajustar Estoque</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5 text-primary" />
            Ajuste de Estoque — {produto.nome}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tipo de Movimentação</label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="saida">Saída</SelectItem>
                <SelectItem value="ajuste">Ajuste / Inventário</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Quantidade ({produto.unidade})</label>
            <Input type="number" placeholder="0" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
            <p className="text-xs text-muted-foreground">Estoque atual: {produto.estoque.toLocaleString("pt-BR")} {produto.unidade}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Motivo</label>
            <Textarea placeholder="Compra fornecedor, venda, ajuste..." value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
          <Button onClick={handleAjuste} disabled={!quantidade || !motivo} className="gap-2">
            {tipo === "entrada" ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
            Confirmar {tipo === "entrada" ? "Entrada" : tipo === "saida" ? "Saída" : "Ajuste"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── Módulo: Orçamento Rápido ──
const OrcamentoRapido = ({ produto }: { produto: Produto }) => {
  const [area, setArea] = useState("");
  const [margem, setMargem] = useState("15");
  
  const areaNum = parseFloat(area) || 0;
  const margemNum = parseFloat(margem) || 0;
  const custoBase = areaNum * produto.preco;
  const custoComMargem = custoBase * (1 + margemNum / 100);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          Gerador de Orçamento Rápido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Quantidade ({produto.unidade})</label>
            <Input type="number" placeholder="Ex: 100" value={area} onChange={(e) => setArea(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Margem de lucro (%)</label>
            <Input type="number" placeholder="15" value={margem} onChange={(e) => setMargem(e.target.value)} />
          </div>
        </div>

        {areaNum > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">Custo Base</p>
                <p className="text-xl font-bold text-foreground">R$ {custoBase.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-muted-foreground">{areaNum} × R$ {produto.preco.toFixed(2)}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">Margem ({margemNum}%)</p>
                <p className="text-xl font-bold text-green-500">+ R$ {(custoComMargem - custoBase).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-muted-foreground">Lucro estimado</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
                <p className="text-xs text-primary font-medium">Preço Final</p>
                <p className="text-xl font-bold text-primary">R$ {custoComMargem.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-muted-foreground">R$ {(custoComMargem / areaNum).toFixed(2)} / {produto.unidade}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.success("Orçamento copiado para a área de transferência!")}>
                <Download className="h-4 w-4" /> Exportar Orçamento
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

// ── Módulo: Comparação ──
const CompararProduto = ({ produto }: { produto: Produto }) => {
  const [comparId, setComparId] = useState<string>("");
  const mesmaCategoria = produtos.filter(p => p.categoria === produto.categoria && p.id !== produto.id);
  const comparProduto = comparId ? findProdutoById(Number(comparId)) : null;

  const getSpecs = (p: Produto): { label: string; value: string }[] => {
    const base = [
      { label: "Preço", value: `R$ ${p.preco.toFixed(2)}` },
      { label: "Estoque", value: `${p.estoque.toLocaleString("pt-BR")} ${p.unidade}` },
    ];
    switch (p.categoria) {
      case "Lãs": {
        const la = p as La;
        return [...base, { label: "Espessura", value: la.espessura }, { label: "Densidade", value: la.densidade }, { label: "NRC", value: la.nrc }, { label: "R. Térmica", value: la.resistenciaTermica }];
      }
      case "Perfis": {
        const pf = p as Perfil;
        return [...base, { label: "Tipo", value: pf.tipo }, { label: "Largura", value: pf.largura }, { label: "Comprimento", value: pf.comprimento }, { label: "Esp. Aço", value: pf.espessuraAco }];
      }
      case "Parafusos": {
        const pa = p as Parafuso;
        return [...base, { label: "Tipo", value: pa.tipo }, { label: "Diâmetro", value: pa.diametro }, { label: "Comprimento", value: pa.comprimento }, { label: "Rend./m²", value: `${pa.rendimentoM2} un` }];
      }
      case "Placas": {
        const pl = p as Placa;
        return [...base, { label: "Tipo", value: pl.tipo }, { label: "Espessura", value: pl.espessura }, { label: "Peso", value: pl.peso }, { label: "NRC", value: pl.nrc }];
      }
      case "Acessórios": {
        const ac = p as Acessorio;
        return [...base, { label: "Tipo", value: ac.tipo }, { label: "Aplicação", value: ac.aplicacao }, { label: "Rendimento", value: ac.rendimento }];
      }
      default: return base;
    }
  };

  const specsA = getSpecs(produto);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={comparId} onValueChange={setComparId}>
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Selecione um produto para comparar..." />
          </SelectTrigger>
          <SelectContent>
            {mesmaCategoria.map(p => (
              <SelectItem key={p.id} value={String(p.id)}>{p.nome} ({p.sku})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {comparProduto && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Especificação</TableHead>
                    <TableHead>{produto.nome}</TableHead>
                    <TableHead>{comparProduto.nome}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {specsA.map((spec, i) => {
                    const specsB = getSpecs(comparProduto);
                    const valB = specsB[i]?.value || "—";
                    const isDiff = spec.value !== valB;
                    return (
                      <TableRow key={spec.label}>
                        <TableCell className="font-medium text-sm text-muted-foreground">{spec.label}</TableCell>
                        <TableCell className={`text-sm font-semibold ${isDiff ? "text-primary" : "text-foreground"}`}>{spec.value}</TableCell>
                        <TableCell className={`text-sm font-semibold ${isDiff ? "text-primary" : "text-foreground"}`}>{valB}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {!comparProduto && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <GitCompare className="h-10 w-10 mb-2 opacity-40" />
          <p className="text-sm">Selecione um produto da mesma categoria para comparar especificações</p>
        </div>
      )}
    </div>
  );
};

// ── Página Principal ──
const ProdutoDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const produto = findProdutoById(Number(id));

  if (!produto) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-muted-foreground">
        <Package className="h-12 w-12 mb-3 opacity-40" />
        <p className="text-lg font-semibold">Produto não encontrado</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard/produtos")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar aos Produtos
        </Button>
      </div>
    );
  }

  const estoquePerc = Math.min((produto.estoque / 500) * 100, 100);
  const estoqueBaixo = produto.estoque < 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 lg:p-8 space-y-6 w-full"
    >
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => navigate("/dashboard/produtos")}>
          <ArrowLeft className="h-4 w-4" /> Produtos
        </Button>
        <span>/</span>
        <span className="text-foreground font-medium">{produto.nome}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {categoriaIcon[produto.categoria]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{produto.nome}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-mono text-sm text-muted-foreground">{produto.sku}</span>
              <Badge variant="secondary" className={categoriaColor[produto.categoria] || ""}>
                {produto.categoria}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <AjusteEstoqueModal produto={produto} />
          <Button variant="outline" className="gap-2"><QrCode className="h-4 w-4" /> QR Code</Button>
          <Button variant="outline" className="gap-2"><Edit className="h-4 w-4" /> Editar</Button>
        </div>
      </div>

      {/* Galeria de Imagens do Produto */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-0">
            {/* Imagem principal */}
            <div className="relative bg-muted/30 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
              {produto.fotos && produto.fotos.length > 0 ? (
                <img src={produto.fotos[0]} alt={produto.nome} className="object-contain max-h-[400px] w-full p-6" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    {categoriaIcon[produto.categoria] || <Package className="h-10 w-10" />}
                  </div>
                  <p className="text-sm">Imagem ilustrativa</p>
                </div>
              )}
              {produto.classificacaoFogo && (
                <Badge className="absolute top-4 left-4 bg-destructive/90 text-destructive-foreground text-xs gap-1">
                  <Flame className="h-3 w-3" /> {produto.classificacaoFogo.split("(")[0].trim()}
                </Badge>
              )}
              {"nrc" in produto && (
                <Badge className="absolute top-4 right-4 bg-primary/90 text-primary-foreground text-xs font-mono">
                  NRC {(produto as any).nrc}
                </Badge>
              )}
            </div>
            {/* Painel lateral com info + descrição */}
            <div className="border-t md:border-t-0 md:border-l p-6 flex flex-col gap-4 bg-card">
              <div>
                <h2 className="text-lg font-bold text-foreground">{produto.nome}</h2>
                <p className="text-xs font-mono text-muted-foreground mt-0.5">{produto.sku}</p>
              </div>
              <Badge variant="secondary" className={`${categoriaColor[produto.categoria] || ""} w-fit`}>
                {produto.categoria}
              </Badge>
              <p className="text-sm text-muted-foreground leading-relaxed">{produto.descricao}</p>
              {produto.especificacao && (
                <p className="text-xs text-muted-foreground leading-relaxed border-t pt-3">{produto.especificacao}</p>
              )}
              {produto.cores && produto.cores.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  <Palette className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                  {produto.cores.map(c => <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>)}
                </div>
              )}
              {produto.dimensoes && (
                <div className="text-xs text-muted-foreground space-y-0.5 border-t pt-3">
                  <p className="font-medium text-foreground text-xs mb-1">Dimensões</p>
                  {produto.dimensoes.comprimento && <p>Comprimento: {produto.dimensoes.comprimento}</p>}
                  {produto.dimensoes.largura && <p>Largura: {produto.dimensoes.largura}</p>}
                  {produto.dimensoes.espessura && <p>Espessura: {produto.dimensoes.espessura}</p>}
                </div>
              )}
              {/* Thumbnails placeholder */}
              <div className="flex gap-2 mt-auto pt-3 border-t">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-14 w-14 rounded-lg bg-muted/50 border flex items-center justify-center">
                    <Image className="h-5 w-5 text-muted-foreground/30" />
                  </div>
                ))}
                <div className="h-14 w-14 rounded-lg bg-muted/50 border flex items-center justify-center text-xs text-muted-foreground">
                  +
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Resumo comercial */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Preço Unitário</p>
              <p className="text-xl font-bold text-foreground">R$ {produto.preco.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">por {produto.unidade}</p>
            </div>
          </CardContent>
        </Card>
        <Card className={estoqueBaixo ? "border-destructive/30" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Estoque Atual</p>
              {estoqueBaixo && <AlertTriangle className="h-4 w-4 text-destructive" />}
            </div>
            <p className={`text-xl font-bold ${estoqueBaixo ? "text-destructive" : "text-foreground"}`}>
              {produto.estoque.toLocaleString("pt-BR")} {produto.unidade}
            </p>
            <Progress value={estoquePerc} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Valor em Estoque</p>
            <p className="text-xl font-bold text-foreground">
              R$ {(produto.estoque * produto.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground">{produto.estoque} × R$ {produto.preco.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Destaques Técnicos — Consulta rápida para técnico em obra */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-primary" />
            Destaques Técnicos — Consulta Rápida
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* NRC — só para Lãs e Placas */}
            {"nrc" in produto && (
              <div className="rounded-lg bg-background p-3 text-center border">
                <p className="text-xs text-muted-foreground">NRC</p>
                <p className="text-2xl font-bold font-mono text-primary">{(produto as any).nrc}</p>
              </div>
            )}
            {/* Classificação de Fogo */}
            {produto.classificacaoFogo && (
              <div className="rounded-lg bg-background p-3 text-center border">
                <Flame className="h-4 w-4 mx-auto mb-1 text-destructive" />
                <p className="text-xs text-muted-foreground">Fogo</p>
                <p className="text-sm font-semibold text-foreground">{produto.classificacaoFogo.split("(")[0].trim()}</p>
              </div>
            )}
            {/* Qtd por Embalagem */}
            {produto.qtdEmbalagem && (
              <div className="rounded-lg bg-background p-3 text-center border">
                <p className="text-xs text-muted-foreground">Embalagem</p>
                <p className="text-lg font-bold text-foreground">{produto.qtdEmbalagem}</p>
                <p className="text-[10px] text-muted-foreground">{produto.unidadeEmbalagem}</p>
              </div>
            )}
            {/* Peso */}
            {produto.pesoEmbalagem && (
              <div className="rounded-lg bg-background p-3 text-center border">
                <p className="text-xs text-muted-foreground">Peso Emb.</p>
                <p className="text-lg font-bold text-foreground">{produto.pesoEmbalagem}</p>
              </div>
            )}
          </div>
          {/* Locais de instalação */}
          {produto.locaisInstalacao && produto.locaisInstalacao.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
              {produto.locaisInstalacao.map(l => (
                <Badge key={l} variant="secondary" className="text-[10px]">{l}</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Abas com todos os módulos */}
      <Tabs defaultValue="ficha" className="w-full">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="ficha" className="gap-1.5 text-xs">
            <Package className="h-3.5 w-3.5" />
            Ficha Técnica
          </TabsTrigger>
          <TabsTrigger value="cadastro" className="gap-1.5 text-xs">
            <BookOpen className="h-3.5 w-3.5" />
            Cadastro Enterprise
          </TabsTrigger>
          <TabsTrigger value="movimentacoes" className="gap-1.5 text-xs">
            <ArrowUpDown className="h-3.5 w-3.5" />
            Movimentações
          </TabsTrigger>
          <TabsTrigger value="precos" className="gap-1.5 text-xs">
            <History className="h-3.5 w-3.5" />
            Histórico de Preços
          </TabsTrigger>
          <TabsTrigger value="documentos" className="gap-1.5 text-xs">
            <FileText className="h-3.5 w-3.5" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="relacionados" className="gap-1.5 text-xs">
            <Link2 className="h-3.5 w-3.5" />
            Relacionados
          </TabsTrigger>
          <TabsTrigger value="orcamento" className="gap-1.5 text-xs">
            <DollarSign className="h-3.5 w-3.5" />
            Orçamento
          </TabsTrigger>
          <TabsTrigger value="notas" className="gap-1.5 text-xs">
            <StickyNote className="h-3.5 w-3.5" />
            Notas
          </TabsTrigger>
          <TabsTrigger value="comparar" className="gap-1.5 text-xs">
            <GitCompare className="h-3.5 w-3.5" />
            Comparar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ficha" className="mt-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            {categoriaIcon[produto.categoria]}
            Ficha Técnica — {produto.categoria}
          </h2>
          {renderSection(produto)}
        </TabsContent>

        {/* ── Cadastro Enterprise ── */}
        <TabsContent value="cadastro" className="mt-6">
          <div className="space-y-6">
            {/* 1. Identificação e Visual */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Image className="h-4 w-4 text-primary" />
                  Identificação e Visual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nome Material</p>
                    <p className="text-sm font-semibold text-foreground">{produto.nome}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">SKU</p>
                    <p className="text-sm font-mono text-foreground">{produto.sku}</p>
                  </div>
                </div>
                {produto.especificacao && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Especificação Material</p>
                    <p className="text-sm text-foreground">{produto.especificacao}</p>
                  </div>
                )}
                {produto.cores && produto.cores.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Palette className="h-3 w-3" /> Cores Disponíveis</p>
                    <div className="flex flex-wrap gap-1.5">
                      {produto.cores.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
                    </div>
                  </div>
                )}
                <div className="p-3 rounded-lg bg-muted/30 flex items-center gap-3">
                  <Image className="h-8 w-8 text-muted-foreground opacity-30" />
                  <div>
                    <p className="text-sm text-muted-foreground">Galeria de Fotos</p>
                    <p className="text-xs text-muted-foreground">Upload de múltiplas imagens requer Lovable Cloud (Storage)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Performance Técnica — oculto para Parafusos e Acessórios sem NRC */}
            {"nrc" in produto && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-primary" />
                    Performance Técnica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="rounded-lg bg-muted/50 p-4 text-center">
                      <p className="text-xs text-muted-foreground">NRC</p>
                      <p className="text-3xl font-bold font-mono text-primary">{(produto as any).nrc}</p>
                      <p className="text-[10px] text-muted-foreground">Noise Reduction Coefficient</p>
                    </div>
                    {produto.classificacaoFogo && (
                      <div className="rounded-lg bg-muted/50 p-4 text-center">
                        <Flame className="h-5 w-5 mx-auto mb-1 text-destructive" />
                        <p className="text-sm font-semibold text-foreground">{produto.classificacaoFogo}</p>
                        <p className="text-[10px] text-muted-foreground">Classificação quanto ao Fogo</p>
                      </div>
                    )}
                    {"alpha" in produto && (
                      <div className="rounded-lg bg-muted/50 p-4 text-center">
                        <BarChart3 className="h-5 w-5 mx-auto mb-1 text-chart-4" />
                        <p className="text-sm font-semibold text-foreground">6 bandas</p>
                        <p className="text-[10px] text-muted-foreground">Curva de Desempenho (125Hz–4kHz)</p>
                      </div>
                    )}
                  </div>
                  {"alpha" in produto && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Curva de Absorção por Frequência</p>
                      {Object.entries((produto as La).alpha).map(([freq, val]) => (
                        <div key={freq} className="flex items-center gap-3">
                          <span className="text-xs font-mono text-muted-foreground w-12">{freq}</span>
                          <Progress value={val * 100} className="h-2.5 flex-1" />
                          <span className="text-xs font-mono font-semibold text-foreground w-10 text-right">{val.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 3. Variantes e Dimensões */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BoxSelect className="h-4 w-4 text-primary" />
                  Variantes, Dimensões e Logística
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {produto.dimensoes?.comprimento && (
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Comprimento</p>
                      <p className="text-sm font-semibold text-foreground">{produto.dimensoes.comprimento}</p>
                    </div>
                  )}
                  {produto.dimensoes?.largura && (
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Largura</p>
                      <p className="text-sm font-semibold text-foreground">{produto.dimensoes.largura}</p>
                    </div>
                  )}
                  {produto.dimensoes?.espessura && (
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Espessura</p>
                      <p className="text-sm font-semibold text-foreground">{produto.dimensoes.espessura}</p>
                    </div>
                  )}
                  {produto.qtdEmbalagem && (
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Qtde/Embalagem</p>
                      <p className="text-sm font-semibold text-foreground">{produto.qtdEmbalagem} {produto.unidadeEmbalagem}</p>
                    </div>
                  )}
                  {produto.pesoEmbalagem && (
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Peso Embalagem</p>
                      <p className="text-sm font-semibold text-foreground">{produto.pesoEmbalagem}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 4. Aplicação e Guia do Instalador */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-primary" />
                  Aplicação e Guia do Instalador
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {produto.locaisInstalacao && produto.locaisInstalacao.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Locais de Instalação Recomendados</p>
                    <div className="flex flex-wrap gap-2">
                      {produto.locaisInstalacao.map(l => (
                        <div key={l} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                          <MapPin className="h-3 w-3" /> {l}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {produto.formaInstalacao && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Forma de Instalação</p>
                    <div className="p-4 rounded-lg bg-muted/30 border-l-4 border-primary/30">
                      <p className="text-sm text-foreground leading-relaxed">{produto.formaInstalacao}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="movimentacoes" className="mt-6">
          <MovimentacoesEstoque produto={produto} />
        </TabsContent>

        <TabsContent value="precos" className="mt-6">
          <HistoricoPrecos produto={produto} />
        </TabsContent>

        <TabsContent value="documentos" className="mt-6">
          <DocumentosTecnicos />
        </TabsContent>

        <TabsContent value="relacionados" className="mt-6">
          <ProdutosRelacionados produto={produto} />
        </TabsContent>

        <TabsContent value="orcamento" className="mt-6">
          <OrcamentoRapido produto={produto} />
        </TabsContent>

        <TabsContent value="notas" className="mt-6">
          <NotasObservacoes />
        </TabsContent>

        <TabsContent value="comparar" className="mt-6">
          <CompararProduto produto={produto} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ProdutoDetalhe;
