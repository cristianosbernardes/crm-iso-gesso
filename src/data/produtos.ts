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

export const findProdutoById = (id: number): Produto | undefined => produtos.find(p => p.id === id);
