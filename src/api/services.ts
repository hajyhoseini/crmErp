import { request } from './client';
import type { ServiceStateResponse } from './types';

export async function getKnowledgeState(signal?: AbortSignal): Promise<boolean> {
  const response = await request<ServiceStateResponse>('/api/ictKnowledge:state', {
    method: 'GET',
    signal,
  });
  if (typeof response.configured === 'boolean') {
    return response.configured;
  }
  if (response.data && typeof response.data.configured === 'boolean') {
    return response.data.configured;
  }
  return false;
}

export async function getSpeechState(signal?: AbortSignal): Promise<boolean> {
  const response = await request<ServiceStateResponse>('/api/ictSpeech:state', {
    method: 'GET',
    signal,
  });
  if (typeof response.configured === 'boolean') {
    return response.configured;
  }
  if (response.data && typeof response.data.configured === 'boolean') {
    return response.data.configured;
  }
  return false;
}
