// ── Tipos por categoria ──────────────────────────────
export interface ProdutoBase {
  id: number;
  nome: string;
  sku: string;
  categoria: string;
  estoque: number;
  unidade: string;
  preco: number;
  descricao: string;
  // ── Novos campos Enterprise ──
  especificacao?: string;
  fotos?: string[];
  classificacaoFogo?: string;
  cores?: string[];
  qtdEmbalagem?: number;
  unidadeEmbalagem?: string;
  pesoEmbalagem?: string;
  locaisInstalacao?: string[];
  formaInstalacao?: string;
  dimensoes?: { comprimento?: string; largura?: string; espessura?: string };
}

export interface La extends ProdutoBase {
  categoria: "Lãs";
  densidade: string;
  espessura: string;
  resistenciaTermica: string;
  nrc: string;
  alpha: Record<string, number>;
}

export interface Perfil extends ProdutoBase {
  categoria: "Perfis";
  tipo: string;
  largura: string;
  comprimento: string;
  espessuraAco: string;
  acabamento: string;
}

export interface Parafuso extends ProdutoBase {
  categoria: "Parafusos";
  tipo: string;
  diametro: string;
  comprimento: string;
  material: string;
  rendimentoM2: number;
}

export interface Placa extends ProdutoBase {
  categoria: "Placas";
  tipo: string;
  espessura: string;
  dimensao: string;
  peso: string;
  nrc: string;
  bordaModelo: string;
}

export interface Acessorio extends ProdutoBase {
  categoria: "Acessórios";
  tipo: string;
  aplicacao: string;
  rendimento: string;
}

export type Produto = La | Perfil | Parafuso | Placa | Acessorio;

export const categorias = ["Todos", "Lãs", "Perfis", "Parafusos", "Placas", "Acessórios"] as const;

export const categoriaColor: Record<string, string> = {
  "Lãs": "bg-primary/15 text-primary",
  "Perfis": "bg-info/15 text-info",
  "Parafusos": "bg-success/15 text-success",
  "Placas": "bg-chart-4/15 text-chart-4",
  "Acessórios": "bg-warning/15 text-warning",
};

export const produtos: Produto[] = [
  {
    id: 1, nome: "Lã de Vidro 50mm", sku: "LV-050", categoria: "Lãs", estoque: 320, unidade: "m²", preco: 28.5,
    descricao: "Lã de vidro para isolamento termoacústico em paredes e forros.",
    especificacao: "Lã de vidro aglomerada com resina sintética termofixa, inodora e incombustível.",
    densidade: "16 kg/m³", espessura: "50mm", resistenciaTermica: "1.25 m²K/W", nrc: "0.65",
    alpha: { "125Hz": 0.15, "250Hz": 0.45, "500Hz": 0.70, "1kHz": 0.85, "2kHz": 0.90, "4kHz": 0.88 },
    classificacaoFogo: "Classe A (Incombustível)",
    cores: ["Amarelo"],
    qtdEmbalagem: 15, unidadeEmbalagem: "m²/pacote", pesoEmbalagem: "4.8 kg",
    dimensoes: { comprimento: "1200mm", largura: "600mm", espessura: "50mm" },
    locaisInstalacao: ["Paredes Drywall", "Forros", "Coberturas", "Steel Frame"],
    formaInstalacao: "Encaixar entre montantes sem comprimir. Não necessita fixação mecânica. Cortar com estilete para ajustes dimensionais.",
    fotos: [],
  },
  {
    id: 2, nome: "Lã de Vidro 75mm", sku: "LV-075", categoria: "Lãs", estoque: 180, unidade: "m²", preco: 42.0,
    descricao: "Lã de vidro de alta densidade para isolamento superior.",
    especificacao: "Lã de vidro de alta densidade com tratamento anti-fungo, ideal para ambientes com exigência acústica elevada.",
    densidade: "24 kg/m³", espessura: "75mm", resistenciaTermica: "1.87 m²K/W", nrc: "0.80",
    alpha: { "125Hz": 0.25, "250Hz": 0.60, "500Hz": 0.85, "1kHz": 0.95, "2kHz": 0.95, "4kHz": 0.92 },
    classificacaoFogo: "Classe A (Incombustível)",
    cores: ["Amarelo"],
    qtdEmbalagem: 10, unidadeEmbalagem: "m²/pacote", pesoEmbalagem: "7.2 kg",
    dimensoes: { comprimento: "1200mm", largura: "600mm", espessura: "75mm" },
    locaisInstalacao: ["Estúdios", "Home Theaters", "Salas de Reunião", "Paredes Drywall"],
    formaInstalacao: "Encaixar entre montantes de 70mm. Garantir cobertura total sem vãos. Usar EPI: luvas e máscara.",
    fotos: [],
  },
  {
    id: 3, nome: "Lã de Rocha 50mm", sku: "LR-050", categoria: "Lãs", estoque: 95, unidade: "m²", preco: 55.0,
    descricao: "Lã de rocha basáltica para isolamento termoacústico e proteção contra fogo.",
    especificacao: "Lã mineral de rocha basáltica com fibras entrelaçadas, resistente a temperaturas de até 750°C.",
    densidade: "32 kg/m³", espessura: "50mm", resistenciaTermica: "1.19 m²K/W", nrc: "0.72",
    alpha: { "125Hz": 0.18, "250Hz": 0.50, "500Hz": 0.78, "1kHz": 0.90, "2kHz": 0.92, "4kHz": 0.90 },
    classificacaoFogo: "Classe A (Incombustível)",
    cores: ["Marrom"],
    qtdEmbalagem: 12, unidadeEmbalagem: "m²/pacote", pesoEmbalagem: "9.6 kg",
    dimensoes: { comprimento: "1200mm", largura: "600mm", espessura: "50mm" },
    locaisInstalacao: ["Shafts", "Paredes Corta-Fogo", "Forros", "Coberturas Metálicas"],
    formaInstalacao: "Posicionar entre montantes. Para uso em shafts, fixar com grampos metálicos. Usar EPI obrigatório.",
    fotos: [],
  },
  {
    id: 4, nome: "Lã de Rocha 75mm", sku: "LR-075", categoria: "Lãs", estoque: 60, unidade: "m²", preco: 78.0,
    descricao: "Lã de rocha 75mm para máximo desempenho acústico e térmico.",
    especificacao: "Lã de rocha de alta densidade para máxima performance acústica e proteção passiva contra incêndio.",
    densidade: "48 kg/m³", espessura: "75mm", resistenciaTermica: "1.78 m²K/W", nrc: "0.85",
    alpha: { "125Hz": 0.30, "250Hz": 0.65, "500Hz": 0.90, "1kHz": 0.97, "2kHz": 0.97, "4kHz": 0.94 },
    classificacaoFogo: "Classe A (Incombustível)",
    cores: ["Marrom"],
    qtdEmbalagem: 8, unidadeEmbalagem: "m²/pacote", pesoEmbalagem: "14.4 kg",
    dimensoes: { comprimento: "1200mm", largura: "600mm", espessura: "75mm" },
    locaisInstalacao: ["Auditórios", "Cinemas", "Salas de Concerto", "Paredes Especiais RF"],
    formaInstalacao: "Encaixar em montantes de 70mm. Para paredes RF, aplicar em dupla camada se necessário. EPI obrigatório.",
    fotos: [],
  },
  {
    id: 5, nome: "Perfil Montante 48mm", sku: "PM-048", categoria: "Perfis", estoque: 540, unidade: "un", preco: 18.9,
    descricao: "Perfil montante para estruturação de paredes drywall.",
    especificacao: "Perfil de aço galvanizado conformado a frio, seção tipo C, para estruturação vertical de paredes.",
    tipo: "Montante", largura: "48mm", comprimento: "3000mm", espessuraAco: "0.50mm", acabamento: "Galvanizado",
    cores: ["Galvanizado Natural"],
    qtdEmbalagem: 20, unidadeEmbalagem: "un/fardo", pesoEmbalagem: "25 kg",
    dimensoes: { comprimento: "3000mm", largura: "48mm", espessura: "0.50mm" },
    locaisInstalacao: ["Paredes Simples", "Divisórias", "Revestimentos"],
    formaInstalacao: "Encaixar na guia inferior e superior com rotação. Fixar com parafuso TB 4.2x13 ou alicate puncionador.",
    fotos: [],
  },
  {
    id: 6, nome: "Perfil Montante 70mm", sku: "PM-070", categoria: "Perfis", estoque: 320, unidade: "un", preco: 24.5,
    descricao: "Perfil montante 70mm para paredes com maior isolamento.",
    especificacao: "Perfil montante de 70mm para paredes que requerem maior espessura de isolamento acústico e térmico.",
    tipo: "Montante", largura: "70mm", comprimento: "3000mm", espessuraAco: "0.50mm", acabamento: "Galvanizado",
    cores: ["Galvanizado Natural"],
    qtdEmbalagem: 15, unidadeEmbalagem: "un/fardo", pesoEmbalagem: "22 kg",
    dimensoes: { comprimento: "3000mm", largura: "70mm", espessura: "0.50mm" },
    locaisInstalacao: ["Paredes Acústicas", "Paredes de Alta Performance", "Shafts"],
    formaInstalacao: "Encaixar na guia de 70mm. Espaçamento máximo de 600mm entre eixos. Fixar com TB 4.2x13.",
    fotos: [],
  },
  {
    id: 7, nome: "Perfil Guia 48mm", sku: "PG-048", categoria: "Perfis", estoque: 410, unidade: "un", preco: 15.5,
    descricao: "Perfil guia superior e inferior para montantes de 48mm.",
    especificacao: "Perfil de aço galvanizado seção tipo U para fixação no piso e laje, recebendo os montantes de 48mm.",
    tipo: "Guia", largura: "48mm", comprimento: "3000mm", espessuraAco: "0.50mm", acabamento: "Galvanizado",
    cores: ["Galvanizado Natural"],
    qtdEmbalagem: 20, unidadeEmbalagem: "un/fardo", pesoEmbalagem: "20 kg",
    dimensoes: { comprimento: "3000mm", largura: "48mm", espessura: "0.50mm" },
    locaisInstalacao: ["Piso e Laje", "Base de Paredes Drywall"],
    formaInstalacao: "Fixar no piso/laje com pistola finca-pinos ou bucha+parafuso a cada 600mm. Aplicar banda acústica antes da fixação.",
    fotos: [],
  },
  {
    id: 8, nome: "Perfil Guia 70mm", sku: "PG-070", categoria: "Perfis", estoque: 280, unidade: "un", preco: 19.9,
    descricao: "Perfil guia para montantes de 70mm.",
    especificacao: "Perfil guia de 70mm para sistemas de paredes com alta exigência acústica.",
    tipo: "Guia", largura: "70mm", comprimento: "3000mm", espessuraAco: "0.50mm", acabamento: "Galvanizado",
    cores: ["Galvanizado Natural"],
    qtdEmbalagem: 15, unidadeEmbalagem: "un/fardo", pesoEmbalagem: "18 kg",
    dimensoes: { comprimento: "3000mm", largura: "70mm", espessura: "0.50mm" },
    locaisInstalacao: ["Piso e Laje", "Base de Paredes Acústicas"],
    formaInstalacao: "Fixar com finca-pinos a cada 600mm. Obrigatório uso de banda acústica 70mm entre a guia e o piso/laje.",
    fotos: [],
  },
  {
    id: 9, nome: "Parafuso TA 3.5x25", sku: "PT-325", categoria: "Parafusos", estoque: 5000, unidade: "un", preco: 0.12,
    descricao: "Parafuso ponta agulha para fixação de placas em perfis.",
    especificacao: "Parafuso auto-atarraxante com ponta agulha (TA) para fixação de placas de gesso acartonado em perfis metálicos.",
    tipo: "Ponta Agulha (TA)", diametro: "3.5mm", comprimento: "25mm", material: "Aço Fosfatizado", rendimentoM2: 25,
    cores: ["Preto Fosfatizado"],
    qtdEmbalagem: 500, unidadeEmbalagem: "un/caixa", pesoEmbalagem: "1.2 kg",
    dimensoes: { comprimento: "25mm", largura: "3.5mm" },
    locaisInstalacao: ["Fixação placa-perfil (camada simples)"],
    formaInstalacao: "Utilizar parafusadeira com controle de torque. Afundar 1mm abaixo da superfície. Espaçamento de 200mm.",
    fotos: [],
  },
  {
    id: 10, nome: "Parafuso TA 3.5x35", sku: "PT-335", categoria: "Parafusos", estoque: 3500, unidade: "un", preco: 0.15,
    descricao: "Parafuso para dupla camada de placa de gesso.",
    especificacao: "Parafuso TA de comprimento estendido para fixação de segunda camada de placa de gesso.",
    tipo: "Ponta Agulha (TA)", diametro: "3.5mm", comprimento: "35mm", material: "Aço Fosfatizado", rendimentoM2: 25,
    cores: ["Preto Fosfatizado"],
    qtdEmbalagem: 500, unidadeEmbalagem: "un/caixa", pesoEmbalagem: "1.5 kg",
    dimensoes: { comprimento: "35mm", largura: "3.5mm" },
    locaisInstalacao: ["Fixação placa-perfil (dupla camada)"],
    formaInstalacao: "Para segunda camada de placa. Parafusadeira com controle de torque. Espaçamento de 200mm.",
    fotos: [],
  },
  {
    id: 11, nome: "Parafuso TB 4.2x13", sku: "PT-413", categoria: "Parafusos", estoque: 8000, unidade: "un", preco: 0.08,
    descricao: "Parafuso ponta broca para fixação metal-metal.",
    especificacao: "Parafuso autoroscante com ponta broca (TB) para conexões metal-metal entre perfis.",
    tipo: "Ponta Broca (TB)", diametro: "4.2mm", comprimento: "13mm", material: "Aço Zincado", rendimentoM2: 12,
    cores: ["Zincado Brilhante"],
    qtdEmbalagem: 1000, unidadeEmbalagem: "un/caixa", pesoEmbalagem: "0.8 kg",
    dimensoes: { comprimento: "13mm", largura: "4.2mm" },
    locaisInstalacao: ["Conexões perfil-perfil", "Reforços estruturais"],
    formaInstalacao: "Ponta broca autoroscante dispensa pré-furo. Utilizar em conexões montante-guia.",
    fotos: [],
  },
  {
    id: 12, nome: "Placa de Gesso ST 12.5mm", sku: "PG-125-ST", categoria: "Placas", estoque: 200, unidade: "un", preco: 32.0,
    descricao: "Placa de gesso acartonado Standard para áreas secas.",
    especificacao: "Placa de gesso acartonado Standard (ST) com face cinza e verso marfim, para uso em áreas secas.",
    tipo: "Standard (ST)", espessura: "12.5mm", dimensao: "1200 x 2400mm", peso: "8.5 kg/m²", nrc: "0.05", bordaModelo: "Rebaixada (RB)",
    classificacaoFogo: "Classe B (Combustibilidade limitada)",
    cores: ["Cinza (Face)", "Marfim (Verso)"],
    qtdEmbalagem: 1, unidadeEmbalagem: "un", pesoEmbalagem: "24.5 kg",
    dimensoes: { comprimento: "2400mm", largura: "1200mm", espessura: "12.5mm" },
    locaisInstalacao: ["Paredes Internas", "Forros", "Revestimentos", "Divisórias"],
    formaInstalacao: "Fixar com parafuso TA 3.5x25 nos perfis a cada 200mm. Face cinza voltada para o ambiente. Tratar juntas com fita e massa.",
    fotos: [],
  },
  {
    id: 13, nome: "Placa de Gesso RU 12.5mm", sku: "PG-125-RU", categoria: "Placas", estoque: 150, unidade: "un", preco: 45.0,
    descricao: "Placa de gesso resistente à umidade para banheiros e cozinhas.",
    especificacao: "Placa de gesso com aditivos hidrofugantes e face verde, para áreas úmidas intermitentes.",
    tipo: "Resistente à Umidade (RU)", espessura: "12.5mm", dimensao: "1200 x 2400mm", peso: "9.0 kg/m²", nrc: "0.05", bordaModelo: "Rebaixada (RB)",
    classificacaoFogo: "Classe B (Combustibilidade limitada)",
    cores: ["Verde (Face)", "Marfim (Verso)"],
    qtdEmbalagem: 1, unidadeEmbalagem: "un", pesoEmbalagem: "26 kg",
    dimensoes: { comprimento: "2400mm", largura: "1200mm", espessura: "12.5mm" },
    locaisInstalacao: ["Banheiros", "Cozinhas", "Lavanderias", "Áreas de Serviço"],
    formaInstalacao: "Mesmo procedimento da placa ST. Não indicada para contato direto e prolongado com água (usar impermeabilizante em box).",
    fotos: [],
  },
  {
    id: 14, nome: "Placa de Gesso RF 15mm", sku: "PG-150-RF", categoria: "Placas", estoque: 80, unidade: "un", preco: 62.0,
    descricao: "Placa de gesso resistente ao fogo para áreas de alta exigência.",
    especificacao: "Placa de gesso com fibra de vidro incorporada ao núcleo, face rosa, para proteção passiva contra incêndio.",
    tipo: "Resistente ao Fogo (RF)", espessura: "15mm", dimensao: "1200 x 2400mm", peso: "12.5 kg/m²", nrc: "0.05", bordaModelo: "Rebaixada (RB)",
    classificacaoFogo: "Classe A (Incombustível)",
    cores: ["Rosa (Face)", "Marfim (Verso)"],
    qtdEmbalagem: 1, unidadeEmbalagem: "un", pesoEmbalagem: "36 kg",
    dimensoes: { comprimento: "2400mm", largura: "1200mm", espessura: "15mm" },
    locaisInstalacao: ["Shafts", "Salas de Máquinas", "Escadas Enclausuradas", "Paredes Corta-Fogo"],
    formaInstalacao: "Fixar com parafuso TA 3.5x35 (para dupla camada) ou TA 3.5x25 (camada única). Juntas tratadas com fita e massa RF.",
    fotos: [],
  },
  {
    id: 15, nome: "Fita Telada 50mm", sku: "FT-050", categoria: "Acessórios", estoque: 150, unidade: "rolo", preco: 8.5,
    descricao: "Fita de fibra de vidro para tratamento de juntas.",
    especificacao: "Fita de tela de fibra de vidro autoadesiva para reforço de juntas entre placas de gesso acartonado.",
    tipo: "Fita de Junta", aplicacao: "Juntas entre placas de gesso", rendimento: "90m por rolo",
    cores: ["Branco"],
    qtdEmbalagem: 1, unidadeEmbalagem: "rolo", pesoEmbalagem: "0.3 kg",
    dimensoes: { comprimento: "90m", largura: "50mm" },
    locaisInstalacao: ["Juntas de placas de gesso"],
    formaInstalacao: "Aplicar sobre massa fresca nas juntas entre placas. Alisar com espátula. Cobrir com segunda demão de massa.",
    fotos: [],
  },
  {
    id: 16, nome: "Massa para Juntas 28kg", sku: "MJ-028", categoria: "Acessórios", estoque: 45, unidade: "balde", preco: 42.0,
    descricao: "Massa pronta para tratamento de juntas e acabamento.",
    especificacao: "Massa de acabamento à base de gesso e aditivos, pronta para uso, para tratamento de juntas e acabamento final.",
    tipo: "Massa de Acabamento", aplicacao: "Preenchimento e acabamento de juntas", rendimento: "Aprox. 30m² por balde",
    cores: ["Branco"],
    qtdEmbalagem: 1, unidadeEmbalagem: "balde", pesoEmbalagem: "28 kg",
    locaisInstalacao: ["Juntas e cantos de placas de gesso"],
    formaInstalacao: "Produto pronto — não diluir. Aplicar com espátula de 15-20cm. Secagem: 4-6h entre demãos. Lixar após seco.",
    fotos: [],
  },
  {
    id: 17, nome: "Banda Acústica 70mm", sku: "BA-070", categoria: "Acessórios", estoque: 200, unidade: "rolo", preco: 12.0,
    descricao: "Banda de isolamento acústico para desacoplamento de perfis.",
    especificacao: "Banda autoadesiva de espuma de polietileno expandido para desacoplamento acústico entre perfis e estrutura.",
    tipo: "Banda Acústica", aplicacao: "Base de guias e montantes para desacoplamento", rendimento: "30m por rolo",
    cores: ["Preto"],
    qtdEmbalagem: 1, unidadeEmbalagem: "rolo", pesoEmbalagem: "0.5 kg",
    dimensoes: { comprimento: "30m", largura: "70mm", espessura: "3mm" },
    locaisInstalacao: ["Base de guias no piso e laje", "Juntas de dilatação"],
    formaInstalacao: "Colar na face interna da guia antes da fixação no piso/laje. Cobrir toda a largura do perfil.",
    fotos: [],
  },
];

export const findProdutoById = (id: number): Produto | undefined => produtos.find(p => p.id === id);
