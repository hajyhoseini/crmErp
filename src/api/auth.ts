import { request } from './client';
import type { AuthUser, RolesCheckData, SignInResponse } from './types';

export async function signIn(account: string, password: string): Promise<SignInResponse> {
  return request<SignInResponse>('/api/auth:signIn', {
    method: 'POST',
    skipAuth: true,
    headers: {
      'Content-Type': 'application/json',
      'X-Authenticator': 'basic',
    },
    body: JSON.stringify({ account, password }),
  });
}

export async function checkAuth(signal?: AbortSignal): Promise<AuthUser> {
  const response = await request<{ data: AuthUser }>('/api/auth:check', {
    method: 'GET',
    signal,
  });
  return response.data;
}

// UNVERIFIED: Calling /api/roles:check to retrieve session roles, snippets, and allowAll while snippet matching semantics are still being verified.
export async function checkRoles(signal?: AbortSignal): Promise<RolesCheckData> {
  const response = await request<{ data: RolesCheckData }>('/api/roles:check', {
    method: 'GET',
    signal,
  });
  return response.data;
}
