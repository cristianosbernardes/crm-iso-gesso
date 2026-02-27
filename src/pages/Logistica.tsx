import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Truck, Package, ClipboardList, PenTool, MapPin, Clock, CheckCircle2,
  AlertTriangle, ChevronRight, Eye, User, Calendar, Building2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Romaneio {
  id: string;
  obra: string;
  cliente: string;
  endereco: string;
  data: string;
  status: "preparando" | "a_caminho" | "entregue" | "aguardando_retirada";
  motorista: string;
  itens: { produto: string; quantidade: number; unidade: string }[];
  assinatura?: { nome: string; data: string; hora: string };
}

const romaneiosMock: Romaneio[] = [
  {
    id: "ROM-2026-041", obra: "Edifício Harmonia", cliente: "Construtora Acústica Ltda",
    endereco: "Av. Paulista, 1000 - Bela Vista, SP", data: "27/02/2026", status: "a_caminho",
    motorista: "Ricardo Santos",
    itens: [
      { produto: "Lã de Rocha 75mm", quantidade: 120, unidade: "m²" },
      { produto: "Perfil Montante 70mm", quantidade: 45, unidade: "un" },
      { produto: "Perfil Guia 70mm", quantidade: 30, unidade: "un" },
      { produto: "Parafuso TA 3.5x25", quantidade: 2000, unidade: "un" },
    ],
  },
  {
    id: "ROM-2026-040", obra: "Auditório UFMG", cliente: "Carlos Pereira Engenharia",
    endereco: "Av. Antônio Carlos, 6627 - BH, MG", data: "26/02/2026", status: "entregue",
    motorista: "José Oliveira",
    itens: [
      { produto: "Placa de Gesso RF 15mm", quantidade: 80, unidade: "un" },
      { produto: "Lã de Rocha 50mm", quantidade: 200, unidade: "m²" },
      { produto: "Banda Acústica 70mm", quantidade: 10, unidade: "rolo" },
    ],
    assinatura: { nome: "Carlos Pereira", data: "26/02/2026", hora: "14:30" },
  },
  {
    id: "ROM-2026-039", obra: "Home Theater Ipanema", cliente: "Ana Martins",
    endereco: "Rua Visconde de Pirajá, 300 - Ipanema, RJ", data: "25/02/2026", status: "aguardando_retirada",
    motorista: "—",
    itens: [
      { produto: "Lã de Vidro 75mm", quantidade: 30, unidade: "m²" },
      { produto: "Placa de Gesso RU 12.5mm", quantidade: 20, unidade: "un" },
    ],
  },
  {
    id: "ROM-2026-038", obra: "Coworking Innovation Hub", cliente: "Carlos Pereira Engenharia",
    endereco: "Av. do Contorno, 3000 - BH, MG", data: "28/02/2026", status: "preparando",
    motorista: "Ricardo Santos",
    itens: [
      { produto: "Lã de Vidro 50mm", quantidade: 150, unidade: "m²" },
      { produto: "Perfil Montante 48mm", quantidade: 60, unidade: "un" },
      { produto: "Fita Telada 50mm", quantidade: 5, unidade: "rolo" },
      { produto: "Massa para Juntas 28kg", quantidade: 8, unidade: "balde" },
    ],
  },
];

const statusConfig: Record<string, { label: string; cor: string; icon: React.ReactNode }> = {
  preparando: { label: "Preparando", cor: "bg-warning/15 text-warning", icon: <ClipboardList className="h-4 w-4" /> },
  a_caminho: { label: "A Caminho", cor: "bg-primary/15 text-primary", icon: <Truck className="h-4 w-4" /> },
  entregue: { label: "Entregue", cor: "bg-green-500/15 text-green-600", icon: <CheckCircle2 className="h-4 w-4" /> },
  aguardando_retirada: { label: "Aguardando Retirada", cor: "bg-chart-4/15 text-chart-4", icon: <Clock className="h-4 w-4" /> },
};

const Logistica = () => {
  const [romaneioAberto, setRomaneioAberto] = useState<Romaneio | null>(null);

  const assinarRecebimento = (rom: Romaneio) => {
    toast({ title: "Assinatura registrada!", description: `Recebimento do romaneio ${rom.id} confirmado digitalmente.` });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Logística & Expedição</h1>
        <p className="text-sm text-muted-foreground">Romaneios de carga, rastreamento e assinatura digital</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Em Preparação", value: romaneiosMock.filter(r => r.status === "preparando").length, icon: <ClipboardList className="h-5 w-5" />, cor: "bg-warning/10 text-warning" },
          { label: "A Caminho", value: romaneiosMock.filter(r => r.status === "a_caminho").length, icon: <Truck className="h-5 w-5" />, cor: "bg-primary/10 text-primary" },
          { label: "Entregues (mês)", value: romaneiosMock.filter(r => r.status === "entregue").length, icon: <CheckCircle2 className="h-5 w-5" />, cor: "bg-green-500/10 text-green-600" },
          { label: "Aguardando Retirada", value: romaneiosMock.filter(r => r.status === "aguardando_retirada").length, icon: <Clock className="h-5 w-5" />, cor: "bg-chart-4/10 text-chart-4" },
        ].map((kpi, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${kpi.cor}`}>{kpi.icon}</div>
              <div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="text-xl font-bold text-foreground">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Romaneio detail or list */}
      {romaneioAberto ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Button variant="ghost" onClick={() => setRomaneioAberto(null)} className="gap-2">
            <ChevronRight className="h-4 w-4 rotate-180" /> Voltar
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{romaneioAberto.id} — {romaneioAberto.obra}</CardTitle>
                <Badge className={statusConfig[romaneioAberto.status].cor}>{statusConfig[romaneioAberto.status].label}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><User className="h-4 w-4" /> {romaneioAberto.cliente}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> {romaneioAberto.endereco}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" /> {romaneioAberto.data}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Truck className="h-4 w-4" /> Motorista: {romaneioAberto.motorista}</div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-2">Itens do Romaneio</p>
                <div className="space-y-2">
                  {romaneioAberto.itens.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-primary" />
                        <span className="text-sm text-foreground">{item.produto}</span>
                      </div>
                      <span className="font-mono text-sm font-semibold text-foreground">{item.quantidade} {item.unidade}</span>
                    </div>
                  ))}
                </div>
              </div>

              {romaneioAberto.assinatura ? (
                <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <PenTool className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-medium text-green-600">Recebimento Confirmado</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Assinado por <span className="font-medium text-foreground">{romaneioAberto.assinatura.nome}</span> em {romaneioAberto.assinatura.data} às {romaneioAberto.assinatura.hora}
                  </p>
                </div>
              ) : (
                <Button className="w-full gap-2" onClick={() => assinarRecebimento(romaneioAberto)}>
                  <PenTool className="h-4 w-4" /> Assinar Recebimento Digital
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {romaneiosMock.map(rom => {
            const st = statusConfig[rom.status];
            return (
              <Card key={rom.id} className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setRomaneioAberto(rom)}>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${st.cor}`}>{st.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{rom.id}</p>
                      <Badge className={`text-[10px] ${st.cor}`}>{st.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rom.obra} — {rom.cliente}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {rom.endereco}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-foreground">{rom.itens.length} itens</p>
                    <p className="text-xs text-muted-foreground">{rom.data}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Logistica;
