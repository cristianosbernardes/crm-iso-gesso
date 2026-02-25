import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, Sun, Moon, Save } from "lucide-react";

const Perfil = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
        <p className="text-sm text-muted-foreground">Gerencie seus dados pessoais e preferências</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:row-span-2">
          <CardContent className="flex flex-col items-center pt-8 pb-6 text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                JA
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-foreground">João Administrador</h2>
            <p className="text-sm text-muted-foreground mt-1">Diretor</p>
            <Badge variant="secondary" className="mt-3 gap-1 bg-primary/15 text-primary">
              <Shield className="h-3 w-3" /> Administrador
            </Badge>
            <p className="text-xs text-muted-foreground mt-4">Membro desde Jan 2024</p>
          </CardContent>
        </Card>

        {/* Personal Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nome completo</Label>
              <Input defaultValue="João Administrador" />
            </div>
            <div>
              <Label>E-mail</Label>
              <Input defaultValue="joao@isogesso.com" type="email" />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input defaultValue="(11) 99999-0001" />
            </div>
            <div>
              <Label>Cargo</Label>
              <Input defaultValue="Diretor" />
            </div>
            <div className="md:col-span-2">
              <Button className="gap-2">
                <Save className="h-4 w-4" /> Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Preferências</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
                <div>
                  <p className="font-medium text-foreground">Modo {darkMode ? "Escuro" : "Claro"}</p>
                  <p className="text-xs text-muted-foreground">Alterne entre os temas claro e escuro</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Perfil;
