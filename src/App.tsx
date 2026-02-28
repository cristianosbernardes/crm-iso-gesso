import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/modules/auth/Login";
import SelectOrg from "@/modules/auth/SelectOrg";
import AppLayout from "@/layouts/AppLayout";
import Dashboard from "@/modules/dashboard/Dashboard";
import { AuthGuard, TenantGuard } from "@/components/guards/AuthGuard";
import PlaceholderPage from "@/components/PlaceholderPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Login />} />
          <Route path="/select-org" element={
            <AuthGuard><SelectOrg /></AuthGuard>
          } />

          {/* Protected App */}
          <Route path="/app" element={
            <AuthGuard><TenantGuard><AppLayout /></TenantGuard></AuthGuard>
          }>
            <Route index element={<Dashboard />} />
            <Route path="clientes" element={<PlaceholderPage title="Clientes" />} />
            <Route path="ad-accounts" element={<PlaceholderPage title="Contas de Anúncios" />} />
            <Route path="relatorios" element={<PlaceholderPage title="Relatórios" />} />
            <Route path="ia" element={<PlaceholderPage title="IA & Insights" />} />
            <Route path="tarefas" element={<PlaceholderPage title="Tarefas" />} />
            <Route path="alertas" element={<PlaceholderPage title="Alertas" />} />
            <Route path="squads" element={<PlaceholderPage title="Squad & Time" />} />
            <Route path="whitelabel" element={<PlaceholderPage title="White Label" />} />
            <Route path="integracoes" element={<PlaceholderPage title="Integrações" />} />
            <Route path="billing" element={<PlaceholderPage title="Billing" />} />
            <Route path="portal" element={<PlaceholderPage title="Meu Painel" />} />
            <Route path="portal/relatorios" element={<PlaceholderPage title="Relatórios" />} />
            <Route path="portal/aprovacoes" element={<PlaceholderPage title="Aprovações" />} />
            <Route path="perfil" element={<PlaceholderPage title="Perfil" />} />
            <Route path="configuracoes" element={<PlaceholderPage title="Configurações" />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
