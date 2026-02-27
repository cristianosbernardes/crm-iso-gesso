import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ArrowLeft, Package, QrCode, Edit, Layers, Ruler, Wrench, Disc, Sparkles,
  AlertTriangle, TrendingUp, ShieldCheck, Flame, Droplets, Thermometer, Volume2,
  Calculator, ClipboardList, BarChart3
} from "lucide-react";
import { findProdutoById, categoriaColor, type La, type Perfil, type Parafuso, type Placa, type Acessorio, type Produto } from "@/data/produtos";

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
      {/* Cards de resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard icon={<Ruler className="h-4 w-4" />} label="Espessura" value={p.espessura} />
        <InfoCard icon={<Package className="h-4 w-4" />} label="Densidade" value={p.densidade} />
        <InfoCard icon={<Thermometer className="h-4 w-4" />} label="Resistência Térmica" value={p.resistenciaTermica} sub="Isolamento térmico" />
        <InfoCard icon={<Volume2 className="h-4 w-4" />} label="NRC" value={p.nrc} sub="Coeficiente de redução de ruído" />
      </div>

      {/* Gráfico de absorção em sanfona */}
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

      {/* Aplicações recomendadas */}
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
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calculator className="h-4 w-4 text-primary" />
          Consumo Estimado
        </CardTitle>
      </CardHeader>
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
            <p className="text-xs text-muted-foreground mt-1">Aço galvanizado {p.espessuraAco}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-primary" />
          Compatibilidade
        </CardTitle>
      </CardHeader>
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
        <CardTitle className="text-sm flex items-center gap-2">
          <Calculator className="h-4 w-4 text-primary" />
          Calculadora Rápida
        </CardTitle>
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
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-primary" />
          Indicação de Uso
        </CardTitle>
      </CardHeader>
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

    {/* Propriedades especiais por tipo */}
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Propriedades Especiais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <PropertyBadge
            icon={<Droplets className="h-5 w-5" />}
            label="Resistência à Umidade"
            active={p.tipo.includes("RU")}
          />
          <PropertyBadge
            icon={<Flame className="h-5 w-5" />}
            label="Resistência ao Fogo"
            active={p.tipo.includes("RF")}
          />
          <PropertyBadge
            icon={<ShieldCheck className="h-5 w-5" />}
            label="Uso Geral"
            active={p.tipo.includes("ST")}
          />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calculator className="h-4 w-4 text-primary" />
          Rendimento por Placa
        </CardTitle>
      </CardHeader>
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
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-primary" />
          Instruções de Uso
        </CardTitle>
      </CardHeader>
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
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <QrCode className="h-4 w-4" /> QR Code
          </Button>
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" /> Editar
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground max-w-2xl">{produto.descricao}</p>

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

      {/* Ficha técnica por categoria */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          {categoriaIcon[produto.categoria]}
          Ficha Técnica — {produto.categoria}
        </h2>
        {renderSection(produto)}
      </div>
    </motion.div>
  );
};

export default ProdutoDetalhe;
