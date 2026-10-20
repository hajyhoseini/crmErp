import { getToken, clearToken } from '../auth/token';
import { fa } from '../i18n/fa';
import type { ApiErrorBody } from './types';

export class ApiError extends Error {
  public status: number;
  public raw: unknown;

  constructor(status: number, message: string, raw?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.raw = raw;
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, unknown>;
  skipAuth?: boolean;
}

type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

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
  if (body && typeof body === 'object') {
    const errorBody = body as ApiErrorBody;
    const firstErrorMessage = errorBody.errors?.[0]?.message;
    if (typeof firstErrorMessage === 'string' && firstErrorMessage.trim()) {
      return firstErrorMessage;
    }
    if (typeof errorBody.message === 'string' && errorBody.message.trim()) {
      return errorBody.message;
    }
  }

  if (status === 401) {
    return fa.auth.sessionExpired;
  }
  if (status === 403) {
    return fa.errors.forbidden;
  }
  if (status === 404) {
    return fa.errors.notFound;
  }
  if (status >= 500) {
    return fa.errors.serverError;
  }

  return fa.errors.default;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, skipAuth = false, headers: customHeaders, ...fetchOptions } = options;

  const queryString = buildQueryString(params);
  const url = `${endpoint}${queryString}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (fetchOptions.body && typeof fetchOptions.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }

  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
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
    throw new ApiError(0, fa.errors.networkError, err);
  }

  if (response.status === 401) {
    clearToken();
    if (unauthorizedHandler) {
      unauthorizedHandler();
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

  if (!response.ok) {
    const message = extractErrorMessage(response.status, body);
    throw new ApiError(response.status, message, body);
  }

  return body as T;
}
