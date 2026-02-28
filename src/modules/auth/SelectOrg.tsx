import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, ChevronRight, Zap } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useTenantStore } from '@/stores/tenantStore';

const SelectOrg = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { tenants, setCurrentTenant } = useTenantStore();

  const handleSelect = (tenantId: string) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    if (!tenant || !user) return;
    const role = user.tenants.find((t) => t.tenantId === tenantId)?.role || 'MEMBER';
    setCurrentTenant(tenant, role);
    navigate('/app');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg"
      >
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary glow-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-gradient">Uniafy</span>
          </div>
          <h2 className="mt-2 text-lg font-semibold text-foreground">Selecionar Organização</h2>
          <p className="text-sm text-muted-foreground">Escolha a organização que deseja acessar</p>
        </div>

        <div className="space-y-3">
          {tenants.map((tenant, i) => (
            <motion.button
              key={tenant.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleSelect(tenant.id)}
              className="glass glass-hover flex w-full items-center gap-4 rounded-xl p-5 text-left"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{tenant.name}</p>
                <p className="text-xs text-muted-foreground">
                  {tenant.type === 'AGENCY' ? 'Agência' : 'Solo'} · Plano {tenant.plan}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SelectOrg;
