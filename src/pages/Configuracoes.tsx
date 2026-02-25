import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Plug, Shield, Mail, CreditCard } from "lucide-react";

const Configuracoes = () => (
  <div className="p-6 lg:p-8 space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
      <p className="text-sm text-muted-foreground">Gerencie sua empresa e integrações</p>
    </div>

    <Tabs defaultValue="empresa" className="space-y-6">
      <TabsList className="bg-muted">
        <TabsTrigger value="empresa" className="gap-2"><Building2 className="h-3.5 w-3.5" />Empresa</TabsTrigger>
        <TabsTrigger value="integracoes" className="gap-2"><Plug className="h-3.5 w-3.5" />Integrações</TabsTrigger>
        <TabsTrigger value="permissoes" className="gap-2"><Shield className="h-3.5 w-3.5" />Permissões</TabsTrigger>
        <TabsTrigger value="email" className="gap-2"><Mail className="h-3.5 w-3.5" />E-mail</TabsTrigger>
        <TabsTrigger value="assinatura" className="gap-2"><CreditCard className="h-3.5 w-3.5" />Assinatura</TabsTrigger>
      </TabsList>

      <TabsContent value="empresa">
        <Card>
          <CardHeader><CardTitle className="text-base">Dados da Empresa</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Razão Social</Label><Input defaultValue="ISO-GESSO Soluções Acústicas LTDA" /></div>
            <div><Label>CNPJ</Label><Input defaultValue="12.345.678/0001-90" /></div>
            <div><Label>Endereço</Label><Input defaultValue="Av. Paulista, 1000" /></div>
            <div><Label>Cidade/UF</Label><Input defaultValue="São Paulo, SP" /></div>
            <div className="md:col-span-2"><Button>Salvar Alterações</Button></div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="integracoes">
        <Card>
          <CardHeader><CardTitle className="text-base">APIs e Integrações</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {[
              { label: "WhatsApp (Evolution API)", fields: ["URL da API", "API Key"] },
              { label: "Telegram Bot", fields: ["Token do Bot"] },
              { label: "E-mail (Resend)", fields: ["API Key", "Domínio"] },
              { label: "Google Calendar", fields: ["Client ID", "Client Secret"] },
            ].map((int) => (
              <div key={int.label} className="space-y-3 border-b border-border pb-4 last:border-0">
                <h3 className="font-medium text-foreground">{int.label}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {int.fields.map((f) => (
                    <div key={f}><Label className="text-xs">{f}</Label><Input type="password" placeholder="••••••••" /></div>
                  ))}
                </div>
              </div>
            ))}
            <Button>Salvar Integrações</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="permissoes">
        <Card>
          <CardHeader><CardTitle className="text-base">Matriz de Permissões</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Configure permissões por cargo (Admin, Técnico, Estoquista). Funcionalidade disponível com backend ativo.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="email">
        <Card>
          <CardHeader><CardTitle className="text-base">Templates de E-mail</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Editor de templates para mensagens transacionais e marketing. Funcionalidade disponível com backend ativo.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="assinatura">
        <Card>
          <CardHeader><CardTitle className="text-base">Plano e Assinatura</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div>
                <p className="font-semibold text-foreground">Plano Profissional</p>
                <p className="text-sm text-muted-foreground">Manutenção mensal + infraestrutura</p>
              </div>
              <p className="text-2xl font-bold text-primary">R$ 300<span className="text-sm text-muted-foreground">/mês</span></p>
            </div>
            <Button variant="outline">Histórico de Faturas</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
);

export default Configuracoes;
