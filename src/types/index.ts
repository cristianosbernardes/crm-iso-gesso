// ── Uniafy Core Types ──

export type TenantType = 'SOLO' | 'AGENCY';
export type UserRole = 'OWNER' | 'HEAD' | 'MEMBER' | 'CLIENT';
export type PlanTier = 'STARTER' | 'BUSINESS' | 'BLACK';
export type BillingCycle = 'MONTHLY' | 'ANNUAL';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  tenants: TenantMembership[];
}

export interface TenantMembership {
  tenantId: string;
  role: UserRole;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  type: TenantType;
  logo?: string;
  plan: PlanTier;
  billingCycle: BillingCycle;
  createdAt: string;
}

export interface Member {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  squadId?: string;
  status: 'active' | 'invited' | 'disabled';
}

export interface Squad {
  id: string;
  name: string;
  leaderId: string;
  memberIds: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'active' | 'paused' | 'churned';
  responsibleId: string;
  squadId?: string;
  adAccountIds: string[];
  createdAt: string;
}

export interface AdAccount {
  id: string;
  platform: 'google' | 'meta' | 'tiktok';
  name: string;
  externalId: string;
  status: 'connected' | 'disconnected' | 'error';
  customerId?: string;
}

export interface MetricSnapshot {
  spend: number;
  leads: number;
  roas: number;
  ctr: number;
  cpa: number;
  impressions: number;
  clicks: number;
}

export interface AIRecommendation {
  id: string;
  customerId: string;
  customerName: string;
  impact: 'high' | 'medium' | 'low';
  title: string;
  summary: string;
  details: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  message: string;
  customerId?: string;
  read: boolean;
  createdAt: string;
}

export interface WhiteLabelConfig {
  logo?: string;
  primaryColor: string;
  companyName: string;
  domains: Domain[];
  smtp?: SmtpConfig;
}

export interface Domain {
  id: string;
  domain: string;
  status: 'pending' | 'active' | 'error';
}

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  status: 'pending' | 'verified' | 'error';
}

export interface BillingInfo {
  plan: PlanTier;
  tenantType: TenantType;
  cycle: BillingCycle;
  price: number;
  usage: {
    adAccounts: { used: number; limit: number };
    users: { used: number; limit: number };
    customers: { used: number; limit: number };
  };
  nextBillingDate: string;
}

export interface PlanOption {
  tier: PlanTier;
  tenantType: TenantType;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  limits: {
    adAccounts: number;
    aiUsage: 'limited' | 'unlimited';
    whiteLabel: boolean;
    apiPublic: boolean;
  };
}

export interface Report {
  id: string;
  customerId: string;
  title: string;
  period: string;
  createdAt: string;
  status: 'draft' | 'ready' | 'sent';
}

export interface Approval {
  id: string;
  customerId: string;
  title: string;
  type: 'creative' | 'budget' | 'campaign';
  status: 'pending' | 'approved' | 'rejected';
  imageUrl?: string;
  createdAt: string;
}
