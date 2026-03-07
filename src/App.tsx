import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Produtos from "./pages/Produtos";
import ProdutoDetalhe from "./pages/ProdutoDetalhe";
import Clientes from "./pages/Clientes";
import ClienteDetalhePage from "./pages/ClienteDetalhePage";
import Calculadora from "./pages/Calculadora";
import Agenda from "./pages/Agenda";
import Financeiro from "./pages/Financeiro";
import Configuracoes from "./pages/Configuracoes";
import Usuarios from "./pages/Usuarios";
import Perfil from "./pages/Perfil";
import Notificacoes from "./pages/Notificacoes";
import Ajuda from "./pages/Ajuda";
import Logistica from "./pages/Logistica";
import Documentos from "./pages/Documentos";
import BiAvancado from "./pages/BiAvancado";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="materiais" element={<Navigate to="/dashboard/produtos" replace />} />
              <Route path="produtos" element={<Produtos />} />
              <Route path="produtos/:id" element={<ProdutoDetalhe />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="clientes/:id" element={<ClienteDetalhePage />} />
              <Route path="usuarios" element={<Usuarios />} />
              <Route path="calculadora" element={<Calculadora />} />
              <Route path="agenda" element={<Agenda />} />
              <Route path="financeiro" element={<Financeiro />} />
              <Route path="logistica" element={<Logistica />} />
              <Route path="documentos" element={<Documentos />} />
              <Route path="bi" element={<BiAvancado />} />
              <Route path="notificacoes" element={<Notificacoes />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="ajuda" element={<Ajuda />} />
              <Route path="configuracoes" element={<Configuracoes />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
