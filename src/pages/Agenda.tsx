import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, User } from "lucide-react";

const mockAgenda = [
  { id: 1, titulo: "Visita técnica — Studio Acústico", cliente: "Roberto Silva", local: "São Paulo, SP", data: "25/02/2026", hora: "08:00", status: "confirmado" },
  { id: 2, titulo: "Medição — Sala de Reuniões", cliente: "Ana Martins", local: "Rio de Janeiro, RJ", data: "26/02/2026", hora: "10:00", status: "pendente" },
  { id: 3, titulo: "Instalação — Home Theater", cliente: "Carlos Pereira", local: "Belo Horizonte, MG", data: "27/02/2026", hora: "14:00", status: "confirmado" },
  { id: 4, titulo: "Orçamento — Auditório", cliente: "Fernanda Costa", local: "Curitiba, PR", data: "28/02/2026", hora: "09:00", status: "pendente" },
];

const statusMap: Record<string, string> = {
  confirmado: "bg-success/15 text-success",
  pendente: "bg-warning/15 text-warning",
};

const Agenda = () => (
  <div className="p-6 lg:p-8 space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
      <p className="text-sm text-muted-foreground">Visitas técnicas e compromissos</p>
    </div>

    <div className="space-y-4">
      {mockAgenda.map((a) => (
        <Card key={a.id} className="hover:shadow-md transition-shadow">
          <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold text-foreground">{a.titulo}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{a.cliente}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{a.local}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{a.data} às {a.hora}</span>
              </div>
            </div>
            <Badge variant="secondary" className={statusMap[a.status]}>
              {a.status}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Agenda;
