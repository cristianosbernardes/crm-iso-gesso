import {
  LayoutDashboard,
  Package,
  Users,
  Calculator,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Volume2,
  UsersRound,
  UserCircle,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Produtos", url: "/dashboard/produtos", icon: Package },
  { title: "Clientes", url: "/dashboard/clientes", icon: Users },
  { title: "Usuários", url: "/dashboard/usuarios", icon: UsersRound },
  { title: "Calculadora", url: "/dashboard/calculadora", icon: Calculator },
  { title: "Agenda", url: "/dashboard/agenda", icon: Calendar },
  { title: "Financeiro", url: "/dashboard/financeiro", icon: BarChart3 },
  { title: "Perfil", url: "/dashboard/perfil", icon: UserCircle },
  { title: "Configurações", url: "/dashboard/configuracoes", icon: Settings },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
        <Volume2 className="h-7 w-7 text-sidebar-primary" />
        <span className="text-xl font-bold tracking-tight">
          ISO<span className="text-sidebar-primary">-GESSO</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url || 
            (item.url !== "/dashboard" && location.pathname.startsWith(item.url));

          return (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/dashboard"}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
              activeClassName="bg-sidebar-accent text-sidebar-primary"
            >
              <item.icon className="h-4.5 w-4.5" />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="h-4.5 w-4.5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
