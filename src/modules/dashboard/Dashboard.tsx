import { motion } from 'framer-motion';
import { TrendingUp, Users, MonitorSmartphone, Target, DollarSign, ArrowUpRight, ArrowDownRight, AlertTriangle, Clock, Plus, FileBarChart, Zap } from 'lucide-react';
import { useTenantStore } from '@/stores/tenantStore';
import { mockMetrics, mockAlerts, mockCustomers } from '@/api/mockData';

const statCards = [
  { label: 'SPEND TOTAL', value: 'R$ 42.580', change: '+12%', up: true, icon: DollarSign },
  { label: 'LEADS', value: '1.247', change: '+8%', up: true, icon: Target },
  { label: 'ROAS', value: '4.2x', change: '+0.3', up: true, icon: TrendingUp },
  { label: 'CTR', value: '3.8%', change: '-0.2%', up: false, icon: ArrowUpRight },
  { label: 'CPA', value: 'R$ 34,15', change: '+5%', up: false, icon: DollarSign },
];

const Dashboard = () => {
  const { currentTenant } = useTenantStore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wider">Dashboard</h1>
        <p className="text-sm text-muted-foreground">{currentTenant?.name} · Visão geral</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass glass-hover rounded-xl p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {card.label}
              </span>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <div className="mt-1 flex items-center gap-1 text-xs">
              {card.up ? (
                <ArrowUpRight className="h-3 w-3 text-green-400" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-400" />
              )}
              <span className={card.up ? 'text-green-400' : 'text-red-400'}>{card.change}</span>
              <span className="text-muted-foreground">vs mês anterior</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Alertas */}
        <div className="glass rounded-xl p-6 lg:col-span-2">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Alertas Recentes
          </h2>
          <div className="space-y-3">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 rounded-lg bg-secondary/30 p-4"
              >
                <div className={`mt-0.5 rounded-full p-1.5 ${
                  alert.type === 'critical' ? 'bg-red-500/20 text-red-400' :
                  alert.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  <AlertTriangle className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.title}</p>
                  <p className="text-xs text-muted-foreground">{alert.message}</p>
                </div>
                <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap">
                  <Clock className="mr-1 inline h-3 w-3" />
                  {new Date(alert.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-xl p-6">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Ações Rápidas
          </h2>
          <div className="space-y-2">
            {[
              { label: 'Criar cliente', icon: Plus },
              { label: 'Conectar conta', icon: MonitorSmartphone },
              { label: 'Gerar relatório', icon: FileBarChart },
              { label: 'Ver insights IA', icon: Zap },
            ].map((action) => (
              <button
                key={action.label}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary/60"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <action.icon className="h-4 w-4 text-primary" />
                </div>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clients overview */}
      <div className="glass rounded-xl p-6">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Clientes Ativos
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <th className="pb-3 pr-4">Cliente</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Contas</th>
                <th className="pb-3">Criado em</th>
              </tr>
            </thead>
            <tbody>
              {mockCustomers.map((c) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 pr-4 font-medium">{c.name}</td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      c.status === 'active' ? 'bg-green-500/15 text-green-400' :
                      c.status === 'paused' ? 'bg-yellow-500/15 text-yellow-400' :
                      'bg-red-500/15 text-red-400'
                    }`}>
                      {c.status === 'active' ? 'Ativo' : c.status === 'paused' ? 'Pausado' : 'Churn'}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{c.adAccountIds.length}</td>
                  <td className="py-3 text-muted-foreground">{c.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
