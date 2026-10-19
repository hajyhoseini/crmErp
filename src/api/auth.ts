import { request } from './client';
import type { AuthUser, SignInResponse } from './types';

/**
 * VERIFIED:
 * Authenticate with basic authenticator against NocoBase auth endpoint:
 * POST /api/auth:signIn
 * headers: Content-Type: application/json, X-Authenticator: basic
 * body: {"account": "<email>", "password": "<pw>"}
 * -> {"data": {"user": {...}, "token": "<JWT>"}}
 */
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

/**
 * UNVERIFIED:
 * Check authentication status and fetch current user profile:
 * GET /api/auth:check
 * Standard NocoBase convention to validate the Bearer token.
 */
export async function checkAuth(signal?: AbortSignal): Promise<AuthUser> {
  const response = await request<{ data: AuthUser }>('/api/auth:check', {
    method: 'GET',
    signal,
  });
  return response.data;
}
