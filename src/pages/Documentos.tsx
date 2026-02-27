import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText, Download, Search, FolderOpen, Award, FileSignature, FilePlus,
  Calendar, Eye, Printer, Volume2
} from "lucide-react";

interface Documento {
  id: number;
  nome: string;
  tipo: "laudo" | "contrato" | "certificado" | "orcamento";
  cliente?: string;
  data: string;
  tamanho: string;
  geradoPor: string;
}

const documentosMock: Documento[] = [
  { id: 1, nome: "Laudo RT60 - Edifício Harmonia.pdf", tipo: "laudo", cliente: "Construtora Acústica Ltda", data: "2025-02-20", tamanho: "2.4 MB", geradoPor: "Simulador Acústico" },
  { id: 2, nome: "Laudo RT60 - Auditório UFMG.pdf", tipo: "laudo", cliente: "Carlos Pereira Engenharia", data: "2025-02-25", tamanho: "3.2 MB", geradoPor: "Simulador Acústico" },
  { id: 3, nome: "Laudo RT60 - Clínica Audiológica.pdf", tipo: "laudo", cliente: "Carlos Pereira Engenharia", data: "2024-08-15", tamanho: "2.8 MB", geradoPor: "Simulador Acústico" },
  { id: 4, nome: "Proposta Técnica - Studio Mix.pdf", tipo: "laudo", cliente: "Construtora Acústica Ltda", data: "2025-01-10", tamanho: "1.9 MB", geradoPor: "Simulador Acústico" },
  { id: 5, nome: "Contrato Prestação de Serviço - Construtora Acústica.pdf", tipo: "contrato", cliente: "Construtora Acústica Ltda", data: "2024-01-15", tamanho: "540 KB", geradoPor: "Template" },
  { id: 6, nome: "Contrato Fornecimento - Carlos Pereira Eng.pdf", tipo: "contrato", cliente: "Carlos Pereira Engenharia", data: "2023-09-01", tamanho: "620 KB", geradoPor: "Template" },
  { id: 7, nome: "Contrato Instalação - Fernanda Costa Arq.pdf", tipo: "contrato", cliente: "Fernanda Costa Arquitetura", data: "2024-04-20", tamanho: "480 KB", geradoPor: "Template" },
  { id: 8, nome: "ISO 9001 - Isover Saint-Gobain.pdf", tipo: "certificado", data: "2024-06-01", tamanho: "1.2 MB", geradoPor: "Upload" },
  { id: 9, nome: "Laudo Ensaio Absorção - Lã de Rocha 75mm.pdf", tipo: "certificado", data: "2024-03-10", tamanho: "3.5 MB", geradoPor: "Upload" },
  { id: 10, nome: "Certificado NR-18 - Equipe Técnica.pdf", tipo: "certificado", data: "2025-01-05", tamanho: "890 KB", geradoPor: "Upload" },
  { id: 11, nome: "Certificado Acústico NBR 15575 - Lã de Vidro.pdf", tipo: "certificado", data: "2024-09-20", tamanho: "2.1 MB", geradoPor: "Upload" },
];

const tipoCor: Record<string, string> = {
  laudo: "bg-primary/15 text-primary",
  contrato: "bg-chart-4/15 text-chart-4",
  certificado: "bg-warning/15 text-warning",
  orcamento: "bg-chart-5/15 text-chart-5",
};

const tipoIcon: Record<string, React.ReactNode> = {
  laudo: <Volume2 className="h-4 w-4" />,
  contrato: <FileSignature className="h-4 w-4" />,
  certificado: <Award className="h-4 w-4" />,
  orcamento: <FileText className="h-4 w-4" />,
};

const Documentos = () => {
  const [search, setSearch] = useState("");
  const [tabAtiva, setTabAtiva] = useState("laudos");

  const tipoFiltro: Record<string, string> = { laudos: "laudo", contratos: "contrato", certificados: "certificado" };

  const filtered = documentosMock.filter(d => {
    const matchTipo = d.tipo === tipoFiltro[tabAtiva];
    const matchSearch = d.nome.toLowerCase().includes(search.toLowerCase()) ||
      (d.cliente || "").toLowerCase().includes(search.toLowerCase());
    return matchTipo && matchSearch;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documentos & Laudos</h1>
          <p className="text-sm text-muted-foreground">Repositório central de documentos técnicos, contratos e certificações</p>
        </div>
        <Button className="gap-2"><FilePlus className="h-4 w-4" /> Upload Documento</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Laudos Gerados", value: documentosMock.filter(d => d.tipo === "laudo").length, icon: <Volume2 className="h-5 w-5" />, cor: "bg-primary/10 text-primary" },
          { label: "Contratos Ativos", value: documentosMock.filter(d => d.tipo === "contrato").length, icon: <FileSignature className="h-5 w-5" />, cor: "bg-chart-4/10 text-chart-4" },
          { label: "Certificações", value: documentosMock.filter(d => d.tipo === "certificado").length, icon: <Award className="h-5 w-5" />, cor: "bg-warning/10 text-warning" },
          { label: "Total Documentos", value: documentosMock.length, icon: <FolderOpen className="h-5 w-5" />, cor: "bg-muted text-muted-foreground" },
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

      <Tabs value={tabAtiva} onValueChange={setTabAtiva} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <TabsList>
            <TabsTrigger value="laudos" className="gap-1.5 text-xs"><Volume2 className="h-3.5 w-3.5" /> Laudos & Propostas</TabsTrigger>
            <TabsTrigger value="contratos" className="gap-1.5 text-xs"><FileSignature className="h-3.5 w-3.5" /> Contratos</TabsTrigger>
            <TabsTrigger value="certificados" className="gap-1.5 text-xs"><Award className="h-3.5 w-3.5" /> Certificações</TabsTrigger>
          </TabsList>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar documento..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {["laudos", "contratos", "certificados"].map(tab => (
          <TabsContent key={tab} value={tab}>
            <div className="space-y-2">
              {filtered.length === 0 ? (
                <Card className="flex items-center justify-center h-32">
                  <p className="text-sm text-muted-foreground">Nenhum documento encontrado</p>
                </Card>
              ) : filtered.map(doc => (
                <Card key={doc.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`p-2.5 rounded-lg shrink-0 ${tipoCor[doc.tipo]}`}>{tipoIcon[doc.tipo]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{doc.nome}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        {doc.cliente && <span>{doc.cliente}</span>}
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(doc.data).toLocaleDateString("pt-BR")}</span>
                        <span>{doc.tamanho}</span>
                        <Badge variant="secondary" className="text-[10px]">{doc.geradoPor}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Printer className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Documentos;
