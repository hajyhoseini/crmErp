/**
 * Data model types and API interfaces for the Persian CRM system.
 */

export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export type ActivityType = 'call' | 'meeting' | 'task' | 'note';

export interface BaseRecord {
  id: number | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CrmCompany extends BaseRecord {
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface CrmContact extends BaseRecord {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  notes?: string;
  companyId?: number | string | null;
  company?: CrmCompany | null;
}

export interface CrmDeal extends BaseRecord {
  title: string;
  amount: number;
  currency: string;
  stage: DealStage;
  expectedCloseDate?: string;
  notes?: string;
  companyId?: number | string | null;
  contactId?: number | string | null;
  company?: CrmCompany | null;
  contact?: CrmContact | null;
}

export interface CrmActivity extends BaseRecord {
  type: ActivityType;
  subject: string;
  description?: string;
  dueAt?: string;
  done: boolean;
  contactId?: number | string | null;
  dealId?: number | string | null;
  contact?: CrmContact | null;
  deal?: CrmDeal | null;
}

export interface ListMeta {
  count: number;
  page: number;
  pageSize: number;
  totalPage: number;
}

export interface ListResponse<T> {
  data: T[];
  meta: ListMeta;
}

export interface ListParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  filter?: Record<string, unknown>;
  appends?: string[];
}

export interface AuthUser {
  id: number | string;
  account?: string;
  email?: string;
  nickname?: string;
  name?: string;
  role?: string;
  [key: string]: unknown;
}

export interface SignInResponse {
  data: {
    user: AuthUser;
    token: string;
  };
}
