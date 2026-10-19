import type { ListParams } from './types';

/**
 * Central Query Key factory for TanStack React Query.
 * Organizes cache keys for all CRM resources and auth state.
 */
export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    currentUser: () => [...queryKeys.auth.all, 'currentUser'] as const,
  },
  companies: {
    all: ['companies'] as const,
    lists: () => [...queryKeys.companies.all, 'list'] as const,
    list: (params?: ListParams) => [...queryKeys.companies.lists(), params ?? {}] as const,
    details: () => [...queryKeys.companies.all, 'detail'] as const,
    detail: (id: number | string) => [...queryKeys.companies.details(), id] as const,
  },
  contacts: {
    all: ['contacts'] as const,
    lists: () => [...queryKeys.contacts.all, 'list'] as const,
    list: (params?: ListParams) => [...queryKeys.contacts.lists(), params ?? {}] as const,
    details: () => [...queryKeys.contacts.all, 'detail'] as const,
    detail: (id: number | string) => [...queryKeys.contacts.details(), id] as const,
  },
  deals: {
    all: ['deals'] as const,
    lists: () => [...queryKeys.deals.all, 'list'] as const,
    list: (params?: ListParams) => [...queryKeys.deals.lists(), params ?? {}] as const,
    details: () => [...queryKeys.deals.all, 'detail'] as const,
    detail: (id: number | string) => [...queryKeys.deals.details(), id] as const,
  },
  activities: {
    all: ['activities'] as const,
    lists: () => [...queryKeys.activities.all, 'list'] as const,
    list: (params?: ListParams) => [...queryKeys.activities.lists(), params ?? {}] as const,
    details: () => [...queryKeys.activities.all, 'detail'] as const,
    detail: (id: number | string) => [...queryKeys.activities.details(), id] as const,
  },
} as const;
