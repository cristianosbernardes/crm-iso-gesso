import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useTenantStore } from '@/stores/tenantStore';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const TenantGuard = ({ children }: { children: React.ReactNode }) => {
  const { currentTenant } = useTenantStore();

  if (!currentTenant) {
    return <Navigate to="/select-org" replace />;
  }

  return <>{children}</>;
};

export const RoleGuard = ({ children, allowed }: { children: React.ReactNode; allowed: string[] }) => {
  const { currentRole } = useTenantStore();

  if (!currentRole || !allowed.includes(currentRole)) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};
