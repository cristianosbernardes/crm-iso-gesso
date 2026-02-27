import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import {
  CalendarDays, Clock, MapPin, User, Plus, Navigation, Phone,
  MessageSquare, CheckCircle2, Circle, ClipboardCheck, Thermometer,
  Volume2, Ruler, Building2, ArrowRight, Send, ExternalLink,
  AlertCircle, ChevronLeft, ChevronRight, Eye, Filter, Search,
  Wifi, WifiOff, Route
} from "lucide-react";
import { toast } from "sonner";

// ── Types ──
interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  value?: string;
}

interface Visita {
  id: number;
  titulo: string;
  tipo: "visita" | "medicao" | "instalacao" | "orcamento";
  cliente: string;
  telefone: string;
  endereco: string;
  cidade: string;
  lat: number;
  lng: number;
  data: string;
  hora: string;
  duracao: string;
  status: "confirmado" | "pendente" | "em_campo" | "concluido" | "cancelado";
  tecnico: string;
  observacoes: string;
  lembreteWhatsApp: boolean;
  checklist: ChecklistItem[];
}

// ── Mock Data ──
const mockVisitas: Visita[] = [
  {
    id: 1, titulo: "Visita técnica — Studio Acústico", tipo: "visita",
    cliente: "Roberto Silva", telefone: "(11) 99876-5432",
    endereco: "Rua Augusta, 1200", cidade: "São Paulo, SP",
    lat: -23.5505, lng: -46.6333,
    data: "2026-02-27", hora: "08:00", duracao: "2h",
    status: "confirmado", tecnico: "João Mendes",
    observacoes: "Cliente quer isolamento acústico para estúdio de música. Levar medidor de decibéis.",
    lembreteWhatsApp: true,
    checklist: [
      { id: "c1", label: "Tipo de teto", checked: false, value: "" },
      { id: "c2", label: "Paredes existentes", checked: false, value: "" },
      { id: "c3", label: "Ruído de fundo (dB)", checked: false, value: "" },
      { id: "c4", label: "Pé-direito (metros)", checked: false, value: "" },
      { id: "c5", label: "Área total (m²)", checked: false, value: "" },
      { id: "c6", label: "Tipo de piso", checked: false, value: "" },
      { id: "c7", label: "Janelas / aberturas", checked: false, value: "" },
      { id: "c8", label: "Instalação elétrica visível", checked: false, value: "" },
    ],
  },
  {
    id: 2, titulo: "Medição — Sala de Reuniões", tipo: "medicao",
    cliente: "Ana Martins", telefone: "(21) 98765-4321",
    endereco: "Av. Rio Branco, 156", cidade: "Rio de Janeiro, RJ",
    lat: -22.9035, lng: -43.2096,
    data: "2026-02-28", hora: "10:00", duracao: "1h30",
    status: "pendente", tecnico: "Maria Souza",
    observacoes: "Empresa precisa de tratamento acústico na sala de reuniões do 12º andar.",
    lembreteWhatsApp: false,
    checklist: [
      { id: "c1", label: "Tipo de teto", checked: true, value: "Forro de gesso" },
      { id: "c2", label: "Paredes existentes", checked: true, value: "Drywall duplo" },
      { id: "c3", label: "Ruído de fundo (dB)", checked: false, value: "" },
      { id: "c4", label: "Pé-direito (metros)", checked: true, value: "2.80m" },
      { id: "c5", label: "Área total (m²)", checked: true, value: "45m²" },
      { id: "c6", label: "Tipo de piso", checked: false, value: "" },
      { id: "c7", label: "Janelas / aberturas", checked: false, value: "" },
      { id: "c8", label: "Instalação elétrica visível", checked: false, value: "" },
    ],
  },
  {
    id: 3, titulo: "Instalação — Home Theater", tipo: "instalacao",
    cliente: "Carlos Pereira", telefone: "(31) 97654-3210",
    endereco: "Rua Espírito Santo, 890", cidade: "Belo Horizonte, MG",
    lat: -19.9245, lng: -43.9352,
    data: "2026-03-01", hora: "14:00", duracao: "4h",
    status: "em_campo", tecnico: "João Mendes",
    observacoes: "Instalação de drywall duplo com lã de rocha 75mm. Material já no local.",
    lembreteWhatsApp: true,
    checklist: [
      { id: "c1", label: "Tipo de teto", checked: true, value: "Laje" },
      { id: "c2", label: "Paredes existentes", checked: true, value: "Alvenaria" },
      { id: "c3", label: "Ruído de fundo (dB)", checked: true, value: "42 dB" },
      { id: "c4", label: "Pé-direito (metros)", checked: true, value: "3.00m" },
      { id: "c5", label: "Área total (m²)", checked: true, value: "28m²" },
      { id: "c6", label: "Tipo de piso", checked: true, value: "Porcelanato" },
      { id: "c7", label: "Janelas / aberturas", checked: true, value: "2 janelas anti-ruído" },
      { id: "c8", label: "Instalação elétrica visível", checked: true, value: "Não" },
    ],
  },
  {
    id: 4, titulo: "Orçamento — Auditório Corporativo", tipo: "orcamento",
    cliente: "Fernanda Costa", telefone: "(41) 96543-2109",
    endereco: "Rua XV de Novembro, 1500", cidade: "Curitiba, PR",
    lat: -25.4284, lng: -49.2733,
    data: "2026-03-02", hora: "09:00", duracao: "1h",
    status: "pendente", tecnico: "Maria Souza",
    observacoes: "Auditório com 200 lugares. Projeto completo de acústica e isolamento.",
    lembreteWhatsApp: false,
    checklist: [
      { id: "c1", label: "Tipo de teto", checked: false, value: "" },
      { id: "c2", label: "Paredes existentes", checked: false, value: "" },
      { id: "c3", label: "Ruído de fundo (dB)", checked: false, value: "" },
      { id: "c4", label: "Pé-direito (metros)", checked: false, value: "" },
      { id: "c5", label: "Área total (m²)", checked: false, value: "" },
      { id: "c6", label: "Tipo de piso", checked: false, value: "" },
      { id: "c7", label: "Janelas / aberturas", checked: false, value: "" },
      { id: "c8", label: "Instalação elétrica visível", checked: false, value: "" },
    ],
  },
  {
    id: 5, titulo: "Visita técnica — Apartamento", tipo: "visita",
    cliente: "Marcos Almeida", telefone: "(11) 91234-5678",
    endereco: "Av. Paulista, 2000", cidade: "São Paulo, SP",
    lat: -23.5613, lng: -46.6560,
    data: "2026-03-03", hora: "11:00", duracao: "1h30",
    status: "confirmado", tecnico: "João Mendes",
    observacoes: "Vizinho superior faz muito barulho. Avaliar isolamento de teto.",
    lembreteWhatsApp: true,
    checklist: [
      { id: "c1", label: "Tipo de teto", checked: false, value: "" },
      { id: "c2", label: "Paredes existentes", checked: false, value: "" },
      { id: "c3", label: "Ruído de fundo (dB)", checked: false, value: "" },
      { id: "c4", label: "Pé-direito (metros)", checked: false, value: "" },
      { id: "c5", label: "Área total (m²)", checked: false, value: "" },
      { id: "c6", label: "Tipo de piso", checked: false, value: "" },
      { id: "c7", label: "Janelas / aberturas", checked: false, value: "" },
      { id: "c8", label: "Instalação elétrica visível", checked: false, value: "" },
    ],
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  confirmado: { label: "Confirmado", color: "bg-green-500/15 text-green-600", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  pendente: { label: "Pendente", color: "bg-amber-500/15 text-amber-600", icon: <Circle className="h-3.5 w-3.5" /> },
  em_campo: { label: "Em Campo", color: "bg-blue-500/15 text-blue-600", icon: <Navigation className="h-3.5 w-3.5" /> },
  concluido: { label: "Concluído", color: "bg-primary/15 text-primary", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  cancelado: { label: "Cancelado", color: "bg-destructive/15 text-destructive", icon: <AlertCircle className="h-3.5 w-3.5" /> },
};

const tipoConfig: Record<string, { label: string; color: string }> = {
  visita: { label: "Visita Técnica", color: "bg-primary/15 text-primary" },
  medicao: { label: "Medição", color: "bg-blue-500/15 text-blue-600" },
  instalacao: { label: "Instalação", color: "bg-green-500/15 text-green-600" },
  orcamento: { label: "Orçamento", color: "bg-amber-500/15 text-amber-600" },
};

// ── Helper: Dias do mês ──
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

// ── Componente: Calendário Visual ──
const CalendarView = ({ visitas, onSelectVisita }: { visitas: Visita[]; onSelectVisita: (v: Visita) => void }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1)); // Feb 2026
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));

  const getVisitasForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return visitas.filter(v => v.data === dateStr);
  };

  const today = new Date();
  const isToday = (day: number) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
          <CardTitle className="text-base">{meses[month]} {year}</CardTitle>
          <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => (
            <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayVisitas = getVisitasForDay(day);
            const hasVisitas = dayVisitas.length > 0;

            return (
              <div
                key={day}
                className={`relative min-h-[80px] rounded-lg border p-1.5 transition-colors cursor-pointer hover:bg-muted/50 ${
                  isToday(day) ? "border-primary bg-primary/5" : "border-border"
                } ${hasVisitas ? "ring-1 ring-primary/20" : ""}`}
                onClick={() => hasVisitas && onSelectVisita(dayVisitas[0])}
              >
                <span className={`text-xs font-medium ${isToday(day) ? "text-primary font-bold" : "text-foreground"}`}>
                  {day}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayVisitas.slice(0, 2).map(v => (
                    <div
                      key={v.id}
                      className={`text-[10px] px-1 py-0.5 rounded truncate ${tipoConfig[v.tipo]?.color || "bg-muted"}`}
                    >
                      {v.hora} {v.titulo.split("—")[0]}
                    </div>
                  ))}
                  {dayVisitas.length > 2 && (
                    <span className="text-[10px] text-muted-foreground">+{dayVisitas.length - 2} mais</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// ── Componente: Card da Visita na Lista ──
const VisitaCard = ({ visita, onClick }: { visita: Visita; onClick: () => void }) => {
  const checklistDone = visita.checklist.filter(c => c.checked).length;
  const checklistTotal = visita.checklist.length;
  const checklistPerc = (checklistDone / checklistTotal) * 100;
  const sc = statusConfig[visita.status];

  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="hover:shadow-md transition-all cursor-pointer group" onClick={onClick}>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-foreground">{visita.titulo}</h3>
                  <Badge variant="secondary" className={`text-[10px] mt-1 ${tipoConfig[visita.tipo]?.color}`}>
                    {tipoConfig[visita.tipo]?.label}
                  </Badge>
                </div>
                <Badge variant="secondary" className={`gap-1 shrink-0 ${sc.color}`}>
                  {sc.icon}{sc.label}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{visita.cliente}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{visita.cidade}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{new Date(visita.data + "T12:00").toLocaleDateString("pt-BR")} às {visita.hora} ({visita.duracao})</span>
                <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />Téc: {visita.tecnico}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 flex-1 max-w-xs">
                  <ClipboardCheck className="h-3.5 w-3.5 text-muted-foreground" />
                  <Progress value={checklistPerc} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground">{checklistDone}/{checklistTotal}</span>
                </div>
                {visita.lembreteWhatsApp && (
                  <Badge variant="outline" className="text-[10px] gap-1 text-green-600 border-green-300">
                    <MessageSquare className="h-3 w-3" />WhatsApp
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ── Modal: Detalhe da Visita ──
const VisitaDetalheModal = ({ visita, open, onClose }: { visita: Visita | null; open: boolean; onClose: () => void }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [activeTab, setActiveTab] = useState("detalhes");

  // Sync checklist quando visita muda
  useState(() => {
    if (visita) setChecklist([...visita.checklist]);
  });

  if (!visita) return null;

  const handleCheckToggle = (id: string) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  const handleValueChange = (id: string, value: string) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, value, checked: value.length > 0 } : c));
  };

  const checklistDone = checklist.filter(c => c.checked).length;
  const checklistPerc = (checklistDone / checklist.length) * 100;
  const sc = statusConfig[visita.status];

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(visita.endereco + ", " + visita.cidade)}&zoom=15`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(visita.endereco + ", " + visita.cidade)}`;

  const handleSendWhatsApp = () => {
    const msg = encodeURIComponent(
      `Olá ${visita.cliente}! 👋\n\nLembrete: O técnico *${visita.tecnico}* está a caminho da sua obra!\n\n📍 ${visita.endereco}, ${visita.cidade}\n🕐 Horário: ${visita.hora}\n\nISO-GESSO — Soluções em Acústica`
    );
    window.open(`https://wa.me/${visita.telefone.replace(/\D/g, "")}?text=${msg}`, "_blank");
    toast.success("WhatsApp aberto com mensagem pré-formatada!");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg">{visita.titulo}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className={`text-[10px] ${tipoConfig[visita.tipo]?.color}`}>
                  {tipoConfig[visita.tipo]?.label}
                </Badge>
                <Badge variant="secondary" className={`gap-1 text-[10px] ${sc.color}`}>
                  {sc.icon}{sc.label}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="detalhes" className="flex-1 gap-1.5 text-xs"><User className="h-3.5 w-3.5" />Detalhes</TabsTrigger>
            <TabsTrigger value="mapa" className="flex-1 gap-1.5 text-xs"><MapPin className="h-3.5 w-3.5" />Mapa & Rota</TabsTrigger>
            <TabsTrigger value="checklist" className="flex-1 gap-1.5 text-xs"><ClipboardCheck className="h-3.5 w-3.5" />Checklist</TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex-1 gap-1.5 text-xs"><MessageSquare className="h-3.5 w-3.5" />WhatsApp</TabsTrigger>
          </TabsList>

          {/* ── Detalhes ── */}
          <TabsContent value="detalhes" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Cliente</p>
                  <p className="text-sm font-semibold text-foreground">{visita.cliente}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Phone className="h-3 w-3" />{visita.telefone}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Endereço</p>
                  <p className="text-sm font-semibold text-foreground">{visita.endereco}</p>
                  <p className="text-xs text-muted-foreground">{visita.cidade}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Data & Horário</p>
                  <p className="text-sm font-semibold text-foreground">
                    {new Date(visita.data + "T12:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
                  </p>
                  <p className="text-xs text-muted-foreground">{visita.hora} — Duração: {visita.duracao}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Técnico Responsável</p>
                  <p className="text-sm font-semibold text-foreground">{visita.tecnico}</p>
                </div>
              </div>
            </div>
            {visita.observacoes && (
              <div className="rounded-lg border p-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">Observações</p>
                <p className="text-sm text-foreground">{visita.observacoes}</p>
              </div>
            )}
          </TabsContent>

          {/* ── Mapa & Rota ── */}
          <TabsContent value="mapa" className="mt-4 space-y-4">
            <div className="rounded-xl overflow-hidden border bg-muted aspect-video relative">
              <iframe
                src={mapUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa da visita"
                allowFullScreen
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1 gap-2" onClick={() => window.open(directionsUrl, "_blank")}>
                <Route className="h-4 w-4" /> Abrir Rota no Google Maps
              </Button>
              <Button variant="outline" className="flex-1 gap-2" onClick={() => {
                navigator.clipboard.writeText(`${visita.endereco}, ${visita.cidade}`);
                toast.success("Endereço copiado!");
              }}>
                <MapPin className="h-4 w-4" /> Copiar Endereço
              </Button>
            </div>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <Navigation className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{visita.endereco}</p>
                    <p className="text-xs text-muted-foreground">{visita.cidade} — Lat: {visita.lat}, Lng: {visita.lng}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Checklist de Levantamento ── */}
          <TabsContent value="checklist" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ClipboardCheck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Checklist de Levantamento</p>
                  <p className="text-xs text-muted-foreground">{checklistDone} de {checklist.length} itens preenchidos</p>
                </div>
              </div>
              <Badge variant="secondary" className={checklistPerc === 100 ? "bg-green-500/15 text-green-600" : "bg-amber-500/15 text-amber-600"}>
                {Math.round(checklistPerc)}%
              </Badge>
            </div>
            <Progress value={checklistPerc} className="h-2" />

            <div className="space-y-3">
              {checklist.map((item) => {
                const icons: Record<string, React.ReactNode> = {
                  "Tipo de teto": <Building2 className="h-4 w-4" />,
                  "Paredes existentes": <Building2 className="h-4 w-4" />,
                  "Ruído de fundo (dB)": <Volume2 className="h-4 w-4" />,
                  "Pé-direito (metros)": <Ruler className="h-4 w-4" />,
                  "Área total (m²)": <Ruler className="h-4 w-4" />,
                  "Tipo de piso": <Building2 className="h-4 w-4" />,
                  "Janelas / aberturas": <Building2 className="h-4 w-4" />,
                  "Instalação elétrica visível": <Thermometer className="h-4 w-4" />,
                };
                return (
                  <div key={item.id} className={`rounded-lg border p-3 transition-colors ${item.checked ? "border-green-300/50 bg-green-500/5" : "border-border"}`}>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => handleCheckToggle(item.id)}
                        className="shrink-0"
                      />
                      <div className="flex items-center gap-2 text-muted-foreground shrink-0">
                        {icons[item.label] || <ClipboardCheck className="h-4 w-4" />}
                      </div>
                      <label className="text-sm font-medium text-foreground flex-shrink-0">{item.label}</label>
                      <Input
                        className="flex-1 h-8 text-sm"
                        placeholder="Preencher..."
                        value={item.value}
                        onChange={(e) => handleValueChange(item.id, e.target.value)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => {
                setChecklist(prev => prev.map(c => ({ ...c, checked: false, value: "" })));
                toast.info("Checklist limpo!");
              }}>Limpar</Button>
              <Button size="sm" className="gap-2" onClick={() => toast.success("Checklist salvo com sucesso!")}>
                <CheckCircle2 className="h-4 w-4" /> Salvar Checklist
              </Button>
            </div>
          </TabsContent>

          {/* ── WhatsApp ── */}
          <TabsContent value="whatsapp" className="mt-4 space-y-4">
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 shrink-0">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">Lembrete via WhatsApp</p>
                    <p className="text-xs text-muted-foreground">Enviar lembrete ao cliente antes da visita</p>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-4 space-y-2 border-l-4 border-green-500">
                  <p className="text-xs font-medium text-muted-foreground">Preview da mensagem:</p>
                  <div className="text-sm text-foreground space-y-1">
                    <p>Olá {visita.cliente}! 👋</p>
                    <p>Lembrete: O técnico <strong>{visita.tecnico}</strong> está a caminho da sua obra!</p>
                    <p className="text-muted-foreground">📍 {visita.endereco}, {visita.cidade}</p>
                    <p className="text-muted-foreground">🕐 Horário: {visita.hora}</p>
                    <p className="text-xs text-muted-foreground mt-2 italic">ISO-GESSO — Soluções em Acústica</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{visita.cliente}</p>
                    <p className="text-xs text-muted-foreground">{visita.telefone}</p>
                  </div>
                  <Badge variant={visita.lembreteWhatsApp ? "secondary" : "outline"} className={visita.lembreteWhatsApp ? "bg-green-500/15 text-green-600" : ""}>
                    {visita.lembreteWhatsApp ? "Automático ativado" : "Manual"}
                  </Badge>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white" onClick={handleSendWhatsApp}>
                    <Send className="h-4 w-4" /> Enviar Lembrete Agora
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => toast.info("Para automação completa, conecte a Evolution API via Lovable Cloud")}>
                    <Wifi className="h-4 w-4" /> Configurar Automação
                  </Button>
                </div>

                <div className="rounded-lg bg-amber-500/10 border border-amber-300/30 p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-amber-700">Automação via Evolution API</p>
                      <p className="text-xs text-amber-600">Para envio automático 1h antes da visita, ative o Lovable Cloud e conecte a Evolution API. O envio manual via botão já funciona.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// ── Página Principal ──
const Agenda = () => {
  const [view, setView] = useState<"lista" | "calendario">("lista");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [selectedVisita, setSelectedVisita] = useState<Visita | null>(null);

  const filtered = mockVisitas.filter(v => {
    const matchStatus = filtroStatus === "todos" || v.status === filtroStatus;
    const matchTipo = filtroTipo === "todos" || v.tipo === filtroTipo;
    const matchSearch = v.titulo.toLowerCase().includes(search.toLowerCase()) ||
      v.cliente.toLowerCase().includes(search.toLowerCase()) ||
      v.cidade.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchTipo && matchSearch;
  });

  const totalConfirmados = mockVisitas.filter(v => v.status === "confirmado").length;
  const totalPendentes = mockVisitas.filter(v => v.status === "pendente").length;
  const totalEmCampo = mockVisitas.filter(v => v.status === "em_campo").length;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agenda & Visitas Técnicas</h1>
          <p className="text-sm text-muted-foreground">
            {mockVisitas.length} compromissos · {totalConfirmados} confirmados · {totalPendentes} pendentes · {totalEmCampo} em campo
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setView(view === "lista" ? "calendario" : "lista")}>
            <CalendarDays className="h-4 w-4" />
            {view === "lista" ? "Calendário" : "Lista"}
          </Button>
          <Button className="gap-2"><Plus className="h-4 w-4" /> Nova Visita</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Confirmados</p>
              <p className="text-xl font-bold text-foreground">{totalConfirmados}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 shrink-0">
              <Circle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pendentes</p>
              <p className="text-xl font-bold text-foreground">{totalPendentes}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 shrink-0">
              <Navigation className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Em Campo</p>
              <p className="text-xl font-bold text-foreground">{totalEmCampo}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 shrink-0">
              <MessageSquare className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">WhatsApp Ativo</p>
              <p className="text-xl font-bold text-foreground">{mockVisitas.filter(v => v.lembreteWhatsApp).length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por cliente, título ou cidade..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos Status</SelectItem>
            <SelectItem value="confirmado">Confirmado</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="em_campo">Em Campo</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos Tipos</SelectItem>
            <SelectItem value="visita">Visita Técnica</SelectItem>
            <SelectItem value="medicao">Medição</SelectItem>
            <SelectItem value="instalacao">Instalação</SelectItem>
            <SelectItem value="orcamento">Orçamento</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Conteúdo */}
      <AnimatePresence mode="wait">
        {view === "lista" ? (
          <motion.div key="lista" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {filtered.map(v => (
              <VisitaCard key={v.id} visita={v} onClick={() => setSelectedVisita(v)} />
            ))}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <CalendarDays className="h-10 w-10 mb-2 opacity-40" />
                <p className="text-sm">Nenhum compromisso encontrado</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="calendario" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CalendarView visitas={mockVisitas} onSelectVisita={setSelectedVisita} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de detalhe */}
      <VisitaDetalheModal
        visita={selectedVisita}
        open={!!selectedVisita}
        onClose={() => setSelectedVisita(null)}
      />
    </div>
  );
};

export default Agenda;
