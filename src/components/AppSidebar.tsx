import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, MonitorSmartphone, FileBarChart, Brain,
  ListTodo, Bell, UsersRound, Palette, Plug, CreditCard,
  PanelLeft, ChevronLeft, Zap, LogOut, BarChart3,
  CheckSquare,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuthStore } from '@/stores/authStore';
import { useTenantStore } from '@/stores/tenantStore';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  url: string;
  icon: any;
  roles: string[];
  agencyOnly?: boolean;
}

const coreNav: NavItem[] = [
  { title: 'Dashboard', url: '/app', icon: LayoutDashboard, roles: ['OWNER', 'HEAD', 'MEMBER'] },
  { title: 'Clientes', url: '/app/clientes', icon: Users, roles: ['OWNER', 'HEAD', 'MEMBER'] },
  { title: 'Contas de Anúncios', url: '/app/ad-accounts', icon: MonitorSmartphone, roles: ['OWNER', 'HEAD', 'MEMBER'] },
  { title: 'Relatórios', url: '/app/relatorios', icon: FileBarChart, roles: ['OWNER', 'HEAD', 'MEMBER'] },
  { title: 'IA & Insights', url: '/app/ia', icon: Brain, roles: ['OWNER', 'HEAD', 'MEMBER'] },
  { title: 'Tarefas', url: '/app/tarefas', icon: ListTodo, roles: ['OWNER', 'HEAD', 'MEMBER'] },
  { title: 'Alertas', url: '/app/alertas', icon: Bell, roles: ['OWNER', 'HEAD', 'MEMBER'] },
  { title: 'Squad & Time', url: '/app/squads', icon: UsersRound, roles: ['OWNER', 'HEAD'], agencyOnly: true },
];

const agencyNav: NavItem[] = [
  { title: 'White Label', url: '/app/whitelabel', icon: Palette, roles: ['OWNER'] },
  { title: 'Integrações', url: '/app/integracoes', icon: Plug, roles: ['OWNER'] },
  { title: 'Billing', url: '/app/billing', icon: CreditCard, roles: ['OWNER'] },
];

const clientNav: NavItem[] = [
  { title: 'Meu Painel', url: '/app/portal', icon: BarChart3, roles: ['CLIENT'] },
  { title: 'Relatórios', url: '/app/portal/relatorios', icon: FileBarChart, roles: ['CLIENT'] },
  { title: 'Aprovações', url: '/app/portal/aprovacoes', icon: CheckSquare, roles: ['CLIENT'] },
];

const AppSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { currentTenant, currentRole, clearTenant } = useTenantStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  const isAgency = currentTenant?.type === 'AGENCY';
  const isClient = currentRole === 'CLIENT';

  const filterByRole = (items: NavItem[]) =>
    items.filter((item) => {
      if (!currentRole) return false;
      if (item.agencyOnly && !isAgency) return false;
      return item.roles.includes(currentRole);
    });

  const visibleCore = isClient ? [] : filterByRole(coreNav);
  const visibleAgency = isClient ? [] : (isAgency ? filterByRole(agencyNav) : []);
  const visibleClient = isClient ? filterByRole(clientNav) : [];

  const handleLogout = () => {
    logout();
    clearTenant();
    navigate('/');
  };

  return (
    <aside
      className={cn(
        'sticky top-0 flex h-screen shrink-0 flex-col border-r transition-all duration-300',
        'bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] border-[hsl(var(--sidebar-border))]',
        sidebarCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-[hsl(var(--sidebar-border))] px-4 py-4">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gradient">Uniafy</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-[hsl(var(--sidebar-accent))] hover:text-foreground transition-colors"
        >
          {sidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-2 py-4">
        {visibleCore.length > 0 && (
          <NavSection label="CORE" items={visibleCore} collapsed={sidebarCollapsed} />
        )}
        {visibleAgency.length > 0 && (
          <NavSection label="AGENCY" items={visibleAgency} collapsed={sidebarCollapsed} />
        )}
        {visibleClient.length > 0 && (
          <NavSection label="PORTAL" items={visibleClient} collapsed={sidebarCollapsed} />
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-[hsl(var(--sidebar-border))] p-2">
        <button
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
            'text-muted-foreground hover:bg-[hsl(var(--sidebar-accent))] hover:text-foreground transition-colors',
            sidebarCollapsed && 'justify-center px-0'
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!sidebarCollapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
};

const NavSection = ({ label, items, collapsed }: { label: string; items: NavItem[]; collapsed: boolean }) => (
  <div>
    {!collapsed && (
      <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
        {label}
      </p>
    )}
    <div className="space-y-0.5">
      {items.map((item) => (
        <NavLink
          key={item.url}
          to={item.url}
          end={item.url === '/app'}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            'text-[hsl(var(--sidebar-foreground))]/70 hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))]',
            collapsed && 'justify-center px-0'
          )}
          activeClassName="bg-[hsl(var(--sidebar-accent))] text-primary"
        >
          <item.icon className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>{item.title}</span>}
        </NavLink>
      ))}
    </div>
  </div>
);

export default AppSidebar;
