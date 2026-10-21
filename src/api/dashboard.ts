import { request } from './client';
import type { AuthUser, RolesCheckData } from './types';

// UNVERIFIED
export interface ProcessItem {
  id: number | string;
  title: string;
  description?: string | null;
  category?: string | null;
  updatedAt: string;
  currentVersion: number;
}

// UNVERIFIED
export interface PositionItem {
  id: number | string;
  title: string;
  authority?: string;
  departmentId?: number | null;
  updatedAt?: string;
}

// UNVERIFIED
export interface PositionsResponse {
  data: PositionItem[];
  meta?: { count?: number };
}

// UNVERIFIED
export interface DepartmentItem {
  id: number | string;
  title: string;
  parentId?: number | string | null;
  isLeaf?: boolean;
}

// UNVERIFIED
export interface KnowledgeCategoryItem {
  id: number | string;
  title: string;
  documents: number;
  ready: number;
}

// UNVERIFIED
export interface KnowledgeStateData {
  configured: boolean;
  maxMegabytes: number;
}

// UNVERIFIED
export interface SpeechStateData {
  available: boolean;
  configured: boolean;
}

// UNVERIFIED
export async function getAuthCheck(signal?: AbortSignal): Promise<AuthUser> {
  const res = await request<{ data: AuthUser }>('/api/auth:check', { method: 'GET', signal });
  return res.data;
}

// UNVERIFIED
export async function getRolesCheck(signal?: AbortSignal): Promise<RolesCheckData> {
  const res = await request<{ data: RolesCheckData }>('/api/roles:check', { method: 'GET', signal });
  return res.data;
}

// UNVERIFIED
export async function getProcessesOverview(signal?: AbortSignal): Promise<ProcessItem[]> {
  const res = await request<{ data: ProcessItem[] }>('/api/ictProcesses:overview', { method: 'GET', signal });
  return Array.isArray(res.data) ? res.data : [];
}

// UNVERIFIED
export async function getPositionsList(signal?: AbortSignal): Promise<{ positions: PositionItem[]; count: number }> {
  const res = await request<PositionsResponse>('/api/ictPositions:list', { method: 'GET', signal });
  const positions = Array.isArray(res.data) ? res.data : [];
  const count = typeof res.meta?.count === 'number' ? res.meta.count : positions.length;
  return { positions, count };
}

// UNVERIFIED
export async function getDepartmentsList(signal?: AbortSignal): Promise<DepartmentItem[]> {
  const res = await request<{ data: DepartmentItem[] }>('/api/departments:list', { method: 'GET', signal });
  return Array.isArray(res.data) ? res.data : [];
}

// UNVERIFIED
export async function getKnowledgeCategories(signal?: AbortSignal): Promise<KnowledgeCategoryItem[]> {
  const res = await request<{ data: KnowledgeCategoryItem[] }>('/api/ictKnowledge:categories', { method: 'GET', signal });
  return Array.isArray(res.data) ? res.data : [];
}

// UNVERIFIED
export async function getKnowledgeState(signal?: AbortSignal): Promise<KnowledgeStateData> {
  const res = await request<{ data?: KnowledgeStateData; configured?: boolean; maxMegabytes?: number }>('/api/ictKnowledge:state', {
    method: 'GET',
    signal,
  });
  const configured = Boolean(res.data?.configured ?? res.configured);
  const maxMegabytes = Number(res.data?.maxMegabytes ?? res.maxMegabytes ?? 0);
  return { configured, maxMegabytes };
}

// UNVERIFIED
export async function getExternalSyncs(signal?: AbortSignal): Promise<unknown[]> {
  const res = await request<{ data: unknown[] }>('/api/ictExternalSyncs:list', { method: 'GET', signal });
  return Array.isArray(res.data) ? res.data : [];
}

// UNVERIFIED
export async function getExternalSyncRuns(signal?: AbortSignal): Promise<unknown[]> {
  const res = await request<{ data: unknown[] }>('/api/ictExternalSyncRuns:list', { method: 'GET', signal });
  return Array.isArray(res.data) ? res.data : [];
}

// UNVERIFIED
export async function getSpeechStatus(signal?: AbortSignal): Promise<SpeechStateData> {
  try {
    const res = await request<{ data?: { configured?: boolean }; configured?: boolean }>('/api/ictSpeech:state', {
      method: 'GET',
      signal,
    });
    return {
      available: true,
      configured: Boolean(res.data?.configured ?? res.configured),
    };
  } catch {
    return {
      available: false,
      configured: false,
    };
  }
}
