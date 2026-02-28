import { create } from 'zustand';
import type { Tenant, UserRole } from '@/types';

interface TenantState {
  tenants: Tenant[];
  currentTenant: Tenant | null;
  currentRole: UserRole | null;
  setTenants: (tenants: Tenant[]) => void;
  setCurrentTenant: (tenant: Tenant, role: UserRole) => void;
  clearTenant: () => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  tenants: [],
  currentTenant: null,
  currentRole: null,
  setTenants: (tenants) => set({ tenants }),
  setCurrentTenant: (tenant, role) => set({ currentTenant: tenant, currentRole: role }),
  clearTenant: () => set({ currentTenant: null, currentRole: null, tenants: [] }),
}));
