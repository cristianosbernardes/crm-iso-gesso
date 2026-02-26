import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Produtos from "./pages/Produtos";
import Clientes from "./pages/Clientes";
import Calculadora from "./pages/Calculadora";
import Agenda from "./pages/Agenda";
import Financeiro from "./pages/Financeiro";
import Configuracoes from "./pages/Configuracoes";
import Usuarios from "./pages/Usuarios";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="produtos" element={<Produtos />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="calculadora" element={<Calculadora />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="financeiro" element={<Financeiro />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="configuracoes" element={<Configuracoes />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
