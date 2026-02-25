import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, Phone, Mail, MapPin } from "lucide-react";

const mockClientes = [
  { id: 1, nome: "Roberto Silva", email: "roberto@empresa.com", telefone: "(11) 99999-1234", cidade: "São Paulo, SP", obras: 3, ultimoContato: "2 dias atrás" },
  { id: 2, nome: "Ana Martins", email: "ana.martins@corp.com", telefone: "(21) 98888-5678", cidade: "Rio de Janeiro, RJ", obras: 1, ultimoContato: "1 semana" },
  { id: 3, nome: "Carlos Pereira", email: "carlos@studio.com", telefone: "(31) 97777-9012", cidade: "Belo Horizonte, MG", obras: 5, ultimoContato: "Hoje" },
  { id: 4, nome: "Fernanda Costa", email: "fer.costa@arq.com", telefone: "(41) 96666-3456", cidade: "Curitiba, PR", obras: 2, ultimoContato: "3 dias atrás" },
  { id: 5, nome: "Marcos Oliveira", email: "marcos@engenharia.com", telefone: "(51) 95555-7890", cidade: "Porto Alegre, RS", obras: 4, ultimoContato: "5 dias atrás" },
  { id: 6, nome: "Juliana Santos", email: "ju.santos@design.com", telefone: "(61) 94444-2345", cidade: "Brasília, DF", obras: 1, ultimoContato: "2 semanas" },
];

const Clientes = () => {
  const [search, setSearch] = useState("");

  const filtered = mockClientes.filter((c) =>
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.cidade.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground">{mockClientes.length} clientes cadastrados</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Novo Cliente
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou cidade..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <Card key={c.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {c.nome.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">{c.nome}</h3>
                  <p className="text-xs text-muted-foreground">Último contato: {c.ultimoContato}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{c.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{c.telefone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{c.cidade}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {c.obras} {c.obras === 1 ? "obra" : "obras"}
                </span>
                <Button variant="outline" size="sm">Ver detalhes</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
};

export default Clientes;
