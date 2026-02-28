import type {
  User, Tenant, Member, Squad, Customer, AdAccount,
  MetricSnapshot, AIRecommendation, Alert, WhiteLabelConfig,
  BillingInfo, PlanOption, Report, Approval
} from '@/types';

export const mockUser: User = {
  id: 'u1',
  name: 'Lucas Martins',
  email: 'lucas@uniafy.io',
  avatar: '',
  tenants: [
    { tenantId: 't1', role: 'OWNER' },
    { tenantId: 't2', role: 'MEMBER' },
  ],
};

export const mockTenants: Tenant[] = [
  { id: 't1', name: 'Martins Agency', slug: 'martins-agency', type: 'AGENCY', plan: 'BLACK', billingCycle: 'MONTHLY', createdAt: '2025-01-10' },
  { id: 't2', name: 'Solo Ads Pro', slug: 'solo-ads-pro', type: 'SOLO', plan: 'BUSINESS', billingCycle: 'ANNUAL', createdAt: '2025-03-15' },
];

export const mockMembers: Member[] = [
  { id: 'm1', userId: 'u1', name: 'Lucas Martins', email: 'lucas@uniafy.io', role: 'OWNER', status: 'active' },
  { id: 'm2', userId: 'u2', name: 'Ana Costa', email: 'ana@uniafy.io', role: 'HEAD', squadId: 'sq1', status: 'active' },
  { id: 'm3', userId: 'u3', name: 'Pedro Silva', email: 'pedro@uniafy.io', role: 'MEMBER', squadId: 'sq1', status: 'active' },
  { id: 'm4', userId: 'u4', name: 'Carlos Neto', email: 'carlos@cliente.com', role: 'CLIENT', status: 'active' },
];

export const mockSquads: Squad[] = [
  { id: 'sq1', name: 'Squad Alpha', leaderId: 'm2', memberIds: ['m2', 'm3'] },
  { id: 'sq2', name: 'Squad Beta', leaderId: 'm3', memberIds: ['m3'] },
];

export const mockCustomers: Customer[] = [
  { id: 'c1', name: 'TechStore Brasil', email: 'contato@techstore.com.br', company: 'TechStore', status: 'active', responsibleId: 'm3', squadId: 'sq1', adAccountIds: ['ad1', 'ad2'], createdAt: '2025-04-01' },
  { id: 'c2', name: 'Fit Club SP', email: 'mkt@fitclub.com.br', company: 'Fit Club', status: 'active', responsibleId: 'm2', squadId: 'sq1', adAccountIds: ['ad3'], createdAt: '2025-05-10' },
  { id: 'c3', name: 'Dr. Smile Odonto', email: 'adm@drsmile.com.br', company: 'Dr. Smile', status: 'paused', responsibleId: 'm3', adAccountIds: [], createdAt: '2025-06-01' },
];

export const mockAdAccounts: AdAccount[] = [
  { id: 'ad1', platform: 'meta', name: 'TechStore - Meta Ads', externalId: 'act_123', status: 'connected', customerId: 'c1' },
  { id: 'ad2', platform: 'google', name: 'TechStore - Google Ads', externalId: 'gads_456', status: 'connected', customerId: 'c1' },
  { id: 'ad3', platform: 'meta', name: 'FitClub - Meta Ads', externalId: 'act_789', status: 'connected', customerId: 'c2' },
];

export const mockMetrics: MetricSnapshot = {
  spend: 42580,
  leads: 1247,
  roas: 4.2,
  ctr: 3.8,
  cpa: 34.15,
  impressions: 890000,
  clicks: 33820,
};

export const mockAlerts: Alert[] = [
  { id: 'a1', type: 'critical', title: 'CPA acima do limite', message: 'TechStore - Meta Ads: CPA subiu 35% nas últimas 24h', customerId: 'c1', read: false, createdAt: '2026-02-28T10:00:00' },
  { id: 'a2', type: 'warning', title: 'Orçamento quase esgotado', message: 'Fit Club - Meta Ads: 92% do orçamento mensal consumido', customerId: 'c2', read: false, createdAt: '2026-02-28T08:30:00' },
  { id: 'a3', type: 'info', title: 'Novo relatório disponível', message: 'Relatório semanal do TechStore pronto para envio', customerId: 'c1', read: true, createdAt: '2026-02-27T18:00:00' },
];

export const mockRecommendations: AIRecommendation[] = [
  { id: 'ai1', customerId: 'c1', customerName: 'TechStore Brasil', impact: 'high', title: 'Pausar conjunto "Remarketing Frio"', summary: 'CTR caiu 60% nos últimos 3 dias. IA recomenda pausar e redistribuir orçamento.', details: 'O conjunto "Remarketing Frio" apresenta CTR de 0.4% vs média de 1.2%. Recomendamos pausar e realocar R$1.200/dia para o conjunto "Lookalike Compradores 30d" que mantém ROAS de 5.8x.', status: 'pending', createdAt: '2026-02-28T09:00:00' },
  { id: 'ai2', customerId: 'c2', customerName: 'Fit Club SP', impact: 'medium', title: 'Aumentar orçamento "Leads Quentes"', summary: 'Conjunto com ROAS 6.2x tem espaço para escalar.', details: 'O conjunto "Leads Quentes" está com frequência 1.2 e ROAS estável em 6.2x nos últimos 7 dias. Sugerimos aumento de 30% no orçamento diário (de R$500 para R$650).', status: 'pending', createdAt: '2026-02-28T07:00:00' },
  { id: 'ai3', customerId: 'c1', customerName: 'TechStore Brasil', impact: 'low', title: 'Atualizar criativos do conjunto "Promoção"', summary: 'Criativos com mais de 14 dias sem atualização.', details: 'Os criativos ativos há mais de 14 dias tendem a perder performance. Recomendamos criar 3 novas variações.', status: 'confirmed', createdAt: '2026-02-27T15:00:00' },
];

export const mockWhiteLabel: WhiteLabelConfig = {
  primaryColor: '#FF6600',
  companyName: 'Martins Agency',
  domains: [
    { id: 'd1', domain: 'app.martinsagency.com', status: 'active' },
    { id: 'd2', domain: 'painel.martinsagency.com', status: 'pending' },
  ],
  smtp: { host: 'smtp.martinsagency.com', port: 587, user: 'noreply@martinsagency.com', status: 'verified' },
};

export const mockBilling: BillingInfo = {
  plan: 'BLACK',
  tenantType: 'AGENCY',
  cycle: 'MONTHLY',
  price: 1149.90,
  usage: {
    adAccounts: { used: 12, limit: 50 },
    users: { used: 8, limit: 30 },
    customers: { used: 15, limit: 100 },
  },
  nextBillingDate: '2026-03-28',
};

export const mockPlans: PlanOption[] = [
  // SOLO
  { tier: 'STARTER', tenantType: 'SOLO', monthlyPrice: 49.90, annualPrice: 499.90, features: ['Até 3 contas de ads', 'IA limitada', 'Relatórios básicos', 'Suporte por email'], limits: { adAccounts: 3, aiUsage: 'limited', whiteLabel: false, apiPublic: false } },
  { tier: 'BUSINESS', tenantType: 'SOLO', monthlyPrice: 119.90, annualPrice: 1199.00, features: ['Até 7 contas de ads', 'IA limitada', 'Relatórios avançados', 'White label via upgrade', 'Suporte prioritário'], limits: { adAccounts: 7, aiUsage: 'limited', whiteLabel: false, apiPublic: false } },
  { tier: 'BLACK', tenantType: 'SOLO', monthlyPrice: 149.90, annualPrice: 1499.00, features: ['Até 15 contas de ads', 'IA ilimitada', 'Relatórios completos', 'White label via upgrade', 'Suporte VIP'], limits: { adAccounts: 15, aiUsage: 'unlimited', whiteLabel: false, apiPublic: false } },
  // AGENCY
  { tier: 'STARTER', tenantType: 'AGENCY', monthlyPrice: 499.90, annualPrice: 4999.00, features: ['Limites base', 'White label incluso', 'Squads', 'Suporte prioritário'], limits: { adAccounts: 20, aiUsage: 'limited', whiteLabel: true, apiPublic: false } },
  { tier: 'BUSINESS', tenantType: 'AGENCY', monthlyPrice: 1119.90, annualPrice: 11199.00, features: ['Limites maiores', 'White label incluso', 'Squads', 'API pública', 'Suporte VIP'], limits: { adAccounts: 35, aiUsage: 'limited', whiteLabel: true, apiPublic: true } },
  { tier: 'BLACK', tenantType: 'AGENCY', monthlyPrice: 1149.90, annualPrice: 11499.00, features: ['Limites máximos', 'White label incluso', 'Squads', 'API pública', 'IA ilimitada', 'Suporte dedicado'], limits: { adAccounts: 50, aiUsage: 'unlimited', whiteLabel: true, apiPublic: true } },
];

export const mockReports: Report[] = [
  { id: 'r1', customerId: 'c1', title: 'Relatório Semanal - Semana 8', period: '17/02 - 23/02', createdAt: '2026-02-24', status: 'sent' },
  { id: 'r2', customerId: 'c1', title: 'Relatório Semanal - Semana 9', period: '24/02 - 28/02', createdAt: '2026-02-28', status: 'ready' },
  { id: 'r3', customerId: 'c2', title: 'Relatório Mensal - Fevereiro', period: '01/02 - 28/02', createdAt: '2026-02-28', status: 'draft' },
];

export const mockApprovals: Approval[] = [
  { id: 'ap1', customerId: 'c1', title: 'Novo criativo - Banner Promoção Verão', type: 'creative', status: 'pending', imageUrl: '/placeholder.svg', createdAt: '2026-02-27' },
  { id: 'ap2', customerId: 'c2', title: 'Aumento de orçamento - Campanha Leads', type: 'budget', status: 'pending', createdAt: '2026-02-28' },
  { id: 'ap3', customerId: 'c1', title: 'Nova campanha - Remarketing Q1', type: 'campaign', status: 'approved', createdAt: '2026-02-25' },
];
