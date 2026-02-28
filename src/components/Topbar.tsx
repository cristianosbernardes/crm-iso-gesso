import { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Building2, Search, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useTenantStore } from '@/stores/tenantStore';
import { cn } from '@/lib/utils';

const Topbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { tenants, currentTenant, currentRole, setCurrentTenant, clearTenant } = useTenantStore();
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const tenantRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (tenantRef.current && !tenantRef.current.contains(e.target as Node)) setTenantDropdownOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSwitchTenant = (tenantId: string) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    if (!tenant || !user) return;
    const role = user.tenants.find((t) => t.tenantId === tenantId)?.role || 'MEMBER';
    setCurrentTenant(tenant, role);
    setTenantDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    clearTenant();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-[hsl(var(--topbar-background))] px-6">
      {/* Left — Tenant Switcher */}
      <div className="flex items-center gap-4">
        <div ref={tenantRef} className="relative">
          <button
            onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-secondary/60 transition-colors"
          >
            <Building2 className="h-4 w-4 text-primary" />
            <span className="max-w-[180px] truncate">{currentTenant?.name || 'Selecionar'}</span>
            <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform', tenantDropdownOpen && 'rotate-180')} />
          </button>

          {tenantDropdownOpen && (
            <div className="absolute left-0 top-full mt-1 w-64 rounded-xl glass border border-border p-1 shadow-2xl z-50">
              <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                Organizações
              </p>
              {tenants.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSwitchTenant(t.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-secondary/60',
                    t.id === currentTenant?.id && 'bg-secondary/40 text-primary'
                  )}
                >
                  <Building2 className="h-4 w-4 shrink-0" />
                  <div className="text-left">
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.type} · {t.plan}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center — Search */}
      <div className="hidden md:flex items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar clientes, contas, relatórios..."
            className="h-8 w-80 rounded-lg border-0 bg-secondary/40 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Right — Notifications + User */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/app/alertas')}
          className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary/60 transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
        </button>

        <div ref={userRef} className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-secondary/60 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="hidden text-sm font-medium md:block">{user?.name?.split(' ')[0]}</span>
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-52 rounded-xl glass border border-border p-1 shadow-2xl z-50">
              <div className="border-b border-border px-3 py-2 mb-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {currentRole}
                </p>
              </div>
              <button
                onClick={() => { setUserDropdownOpen(false); navigate('/app/perfil'); }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary/60"
              >
                <User className="h-4 w-4" /> Perfil
              </button>
              <button
                onClick={() => { setUserDropdownOpen(false); navigate('/app/configuracoes'); }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary/60"
              >
                <Settings className="h-4 w-4" /> Configurações
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-secondary/60"
              >
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
