/**
 * Uniafy API Client — Mock implementation
 * All endpoints return mock data. Replace with real fetch calls when backend is ready.
 */
import {
  mockUser, mockTenants, mockMembers, mockSquads, mockCustomers,
  mockAdAccounts, mockMetrics, mockAlerts, mockRecommendations,
  mockWhiteLabel, mockBilling, mockPlans, mockReports, mockApprovals,
} from './mockData';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// ── Auth ──
export const apiAuth = {
  login: async (_email: string, _password: string) => {
    await delay();
    return { user: mockUser, token: 'mock-jwt-token' };
  },
  me: async () => {
    await delay(150);
    return mockUser;
  },
  oauthGoogle: async () => {
    await delay();
    return { user: mockUser, token: 'mock-jwt-token' };
  },
  logout: async () => {
    await delay(100);
  },
};

// ── Tenants ──
export const apiTenants = {
  list: async () => { await delay(); return mockTenants; },
  create: async (data: Partial<typeof mockTenants[0]>) => { await delay(); return { ...mockTenants[0], ...data, id: 'new-t' }; },
  get: async (id: string) => { await delay(); return mockTenants.find((t) => t.id === id) || mockTenants[0]; },
  update: async (id: string, data: any) => { await delay(); return { ...mockTenants[0], ...data }; },
};

// ── Members ──
export const apiMembers = {
  list: async (_tenantId: string) => { await delay(); return mockMembers; },
  invite: async (_tenantId: string, _data: any) => { await delay(); return { success: true }; },
  update: async (_tenantId: string, _memberId: string, _data: any) => { await delay(); return { success: true }; },
};

// ── Squads ──
export const apiSquads = {
  list: async (_tenantId: string) => { await delay(); return mockSquads; },
  create: async (_tenantId: string, _data: any) => { await delay(); return mockSquads[0]; },
  get: async (_tenantId: string, squadId: string) => { await delay(); return mockSquads.find((s) => s.id === squadId) || mockSquads[0]; },
};

// ── Customers ──
export const apiCustomers = {
  list: async (_tenantId: string) => { await delay(); return mockCustomers; },
  create: async (_tenantId: string, _data: any) => { await delay(); return mockCustomers[0]; },
  get: async (_tenantId: string, customerId: string) => { await delay(); return mockCustomers.find((c) => c.id === customerId) || mockCustomers[0]; },
  update: async (_tenantId: string, _customerId: string, _data: any) => { await delay(); return { success: true }; },
};

// ── Ad Accounts ──
export const apiAdAccounts = {
  list: async (_tenantId: string) => { await delay(); return mockAdAccounts; },
  connect: async (_tenantId: string, _data: any) => { await delay(); return mockAdAccounts[0]; },
  disconnect: async (_tenantId: string, _adAccountId: string) => { await delay(); return { success: true }; },
};

// ── Metrics & Reports ──
export const apiMetrics = {
  get: async (_tenantId: string, _customerId: string, _range?: string) => { await delay(); return mockMetrics; },
  reports: async (_tenantId: string, _customerId?: string) => { await delay(); return mockReports; },
};

// ── AI ──
export const apiAI = {
  recommendations: async (_tenantId: string, _customerId?: string) => { await delay(); return mockRecommendations; },
  confirm: async (_tenantId: string, _actionId: string) => { await delay(); return { success: true }; },
  reject: async (_tenantId: string, _actionId: string) => { await delay(); return { success: true }; },
  history: async (_tenantId: string, _customerId?: string) => { await delay(); return mockRecommendations.filter((r) => r.status !== 'pending'); },
};

// ── White Label ──
export const apiWhiteLabel = {
  get: async (_tenantId: string) => { await delay(); return mockWhiteLabel; },
  update: async (_tenantId: string, _data: any) => { await delay(); return mockWhiteLabel; },
  addDomain: async (_tenantId: string, _domain: string) => { await delay(); return { id: 'new-d', domain: _domain, status: 'pending' as const }; },
  listDomains: async (_tenantId: string) => { await delay(); return mockWhiteLabel.domains; },
  testSmtp: async (_tenantId: string) => { await delay(); return { success: true }; },
};

// ── Billing ──
export const apiBilling = {
  get: async (_tenantId: string) => { await delay(); return mockBilling; },
  upgrade: async (_tenantId: string, _data: any) => { await delay(); return { success: true }; },
  plans: async () => { await delay(); return mockPlans; },
};

// ── Alerts ──
export const apiAlerts = {
  list: async (_tenantId: string) => { await delay(); return mockAlerts; },
};

// ── Approvals ──
export const apiApprovals = {
  list: async (_tenantId: string) => { await delay(); return mockApprovals; },
  approve: async (_tenantId: string, _approvalId: string) => { await delay(); return { success: true }; },
  reject: async (_tenantId: string, _approvalId: string) => { await delay(); return { success: true }; },
};
