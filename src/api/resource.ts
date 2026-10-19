import { request } from './client';
import type {
  CrmActivity,
  CrmCompany,
  CrmContact,
  CrmDeal,
  ListParams,
  ListResponse,
} from './types';

export interface ResourceApi<T> {
  list(params?: ListParams, signal?: AbortSignal): Promise<ListResponse<T>>;
  get(id: number | string, signal?: AbortSignal): Promise<T>;
  create(data: Partial<T>, signal?: AbortSignal): Promise<T>;
  update(id: number | string, data: Partial<T>, signal?: AbortSignal): Promise<T>;
  destroy(id: number | string, signal?: AbortSignal): Promise<void>;
}

/**
 * Creates a standard CRUD resource client for a NocoBase collection.
 */
export function createResource<T>(collectionName: string): ResourceApi<T> {
  return {
    /**
     * VERIFIED:
     * GET /api/<collection>:list?page=1&pageSize=20&sort=-createdAt&filter=<JSON>&appends[]=<relation>
     */
    async list(params?: ListParams, signal?: AbortSignal): Promise<ListResponse<T>> {
      return request<ListResponse<T>>(`/api/${collectionName}:list`, {
        method: 'GET',
        params,
        signal,
      });
    },

    /**
     * UNVERIFIED:
     * Standard NocoBase convention for retrieving a single record by primary key:
     * GET /api/<collection>:get?filterByTk=<id>
     */
    async get(id: number | string, signal?: AbortSignal): Promise<T> {
      const response = await request<{ data: T }>(`/api/${collectionName}:get`, {
        method: 'GET',
        params: { filterByTk: id },
        signal,
      });
      return response.data;
    },

    /**
     * VERIFIED:
     * POST /api/<collection>:create with JSON body -> {"data": <record>}
     */
    async create(data: Partial<T>, signal?: AbortSignal): Promise<T> {
      const response = await request<{ data: T }>(`/api/${collectionName}:create`, {
        method: 'POST',
        body: JSON.stringify(data),
        signal,
      });
      return response.data;
    },

    /**
     * UNVERIFIED:
     * Standard NocoBase convention for partial updates:
     * POST /api/<collection>:update?filterByTk=<id>
     */
    async update(id: number | string, data: Partial<T>, signal?: AbortSignal): Promise<T> {
      const response = await request<{ data: T }>(`/api/${collectionName}:update`, {
        method: 'POST',
        params: { filterByTk: id },
        body: JSON.stringify(data),
        signal,
      });
      return response.data;
    },

    /**
     * UNVERIFIED:
     * Standard NocoBase convention for deletion:
     * POST /api/<collection>:destroy?filterByTk=<id>
     */
    async destroy(id: number | string, signal?: AbortSignal): Promise<void> {
      await request<void>(`/api/${collectionName}:destroy`, {
        method: 'POST',
        params: { filterByTk: id },
        signal,
      });
    },
  };
}

// Concrete resource instances for the 4 CRM collections
export const companiesApi = createResource<CrmCompany>('crmCompanies');
export const contactsApi = createResource<CrmContact>('crmContacts');
export const dealsApi = createResource<CrmDeal>('crmDeals');
export const activitiesApi = createResource<CrmActivity>('crmActivities');
