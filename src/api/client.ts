import { getToken, setToken, clearToken } from '../auth/token';
import { getActiveRole, clearActiveRole } from '../auth/role';
import { fa } from '../i18n/fa';
import type { ApiErrorBody } from './types';

export class ApiError extends Error {
  public status: number;
  public code?: string;
  public raw: unknown;

  constructor(status: number, message: string, code?: string, raw?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.raw = raw;
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, unknown>;
  skipAuth?: boolean;
  _isRetry?: boolean;
}

type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;
let renewalPromise: Promise<void> | null = null;

export function registerUnauthorizedHandler(handler: UnauthorizedHandler): void {
  unauthorizedHandler = handler;
}

export function unregisterUnauthorizedHandler(): void {
  unauthorizedHandler = null;
}

export function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return '';

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        searchParams.append(`${key}[]`, String(item));
      });
    } else if (typeof value === 'object') {
      searchParams.append(key, JSON.stringify(value));
    } else {
      searchParams.append(key, String(value));
    }
  }

  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

function extractErrorMessage(status: number, body: unknown): string {
  if (status === 403) {
    return fa.errors.forbidden;
  }

  if (body && typeof body === 'object') {
    const errorBody = body as ApiErrorBody;
    const firstErrorMessage = errorBody.errors?.[0]?.message;
    if (typeof firstErrorMessage === 'string' && firstErrorMessage.trim() && firstErrorMessage !== 'No permissions') {
      return firstErrorMessage;
    }
    if (typeof errorBody.message === 'string' && errorBody.message.trim() && errorBody.message !== 'No permissions') {
      return errorBody.message;
    }
  }

  if (status === 401) {
    return fa.auth.sessionExpired;
  }
  if (status === 404) {
    return fa.errors.notFound;
  }
  if (status >= 500) {
    return fa.errors.serverError;
  }

  return fa.errors.default;
}

function extractErrorCode(body: unknown): string | undefined {
  if (body && typeof body === 'object') {
    const errorBody = body as ApiErrorBody;
    const code = errorBody.errors?.[0]?.code;
    if (typeof code === 'string') {
      return code;
    }
  }
  return undefined;
}

async function runSingleTokenRenewal(): Promise<void> {
  if (!renewalPromise) {
    renewalPromise = (async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch('/api/auth:check', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'X-Locale': 'fa-IR',
            Authorization: `Bearer ${token}`,
          },
        });
        const newToken = res.headers.get('x-new-token');
        if (newToken && newToken !== token) {
          setToken(newToken);
        }
      } finally {
        renewalPromise = null;
      }
    })();
  }
  return renewalPromise;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, skipAuth = false, headers: customHeaders, _isRetry = false, ...fetchOptions } = options;

  const queryString = buildQueryString(params);
  const url = `${endpoint}${queryString}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Locale': 'fa-IR',
  };

  if (fetchOptions.body && typeof fetchOptions.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }

  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const role = getActiveRole();
    if (role) {
      headers['X-Role'] = role;
    }
  }

  const finalHeaders = {
    ...headers,
    ...(customHeaders as Record<string, string>),
  };

  let response: Response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers: finalHeaders,
    });
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    throw new ApiError(0, fa.errors.networkError, undefined, err);
  }

  const newToken = response.headers.get('x-new-token');
  if (newToken) {
    const currentToken = getToken();
    if (newToken !== currentToken) {
      setToken(newToken);
    }
  }

  let body: unknown = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      body = await response.json();
    } catch {
      body = null;
    }
  } else {
    try {
      body = await response.text();
    } catch {
      body = null;
    }
  }

  if (response.status === 401) {
    const errorCode = extractErrorCode(body);
    const isStream = finalHeaders.Accept === 'text/event-stream' || finalHeaders.accept === 'text/event-stream';

    if (isStream && errorCode === 'SKIP_TOKEN_RENEW' && !_isRetry) {
      await runSingleTokenRenewal();
      return request<T>(endpoint, {
        ...options,
        _isRetry: true,
      });
    }

    if (
      errorCode === 'EMPTY_TOKEN' ||
      errorCode === 'INVALID_TOKEN' ||
      errorCode === 'EXPIRED_SESSION' ||
      !errorCode
    ) {
      clearToken();
      clearActiveRole();
      if (unauthorizedHandler) {
        unauthorizedHandler();
      }
    }

    const message = extractErrorMessage(response.status, body);
    throw new ApiError(response.status, message, errorCode, body);
  }

  if (!response.ok) {
    const errorCode = extractErrorCode(body);
    const message = extractErrorMessage(response.status, body);
    throw new ApiError(response.status, message, errorCode, body);
  }

  return body as T;
}
