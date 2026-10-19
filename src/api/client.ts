import { getToken, clearToken } from '../auth/token';
import { fa } from '../i18n/fa';
import type { ListParams } from './types';

/**
 * Normalized API error class containing HTTP status, user-friendly Persian message,
 * and the raw response body if available.
 */
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
  params?: ListParams | Record<string, unknown>;
  skipAuth?: boolean;
}

type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

/**
 * Register a callback triggered when an HTTP 401 Unauthorized occurs.
 */
export function registerUnauthorizedHandler(handler: UnauthorizedHandler): void {
  unauthorizedHandler = handler;
}

/**
 * Unregister the unauthorized callback.
 */
export function unregisterUnauthorizedHandler(): void {
  unauthorizedHandler = null;
}

/**
 * Builds a query string adhering to NocoBase API conventions:
 * - Arrays with brackets, e.g. appends[]=relation1&appends[]=relation2
 * - Complex filter objects encoded as JSON strings: filter=%7B%22stage%22%3A%22lead%22%7D
 * - Simple primitives serialized directly
 */
export function buildQueryString(params?: ListParams | Record<string, unknown>): string {
  if (!params) return '';

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    if (key === 'filter' && typeof value === 'object') {
      searchParams.append('filter', JSON.stringify(value));
    } else if (key === 'appends' && Array.isArray(value)) {
      value.forEach((item) => {
        searchParams.append('appends[]', String(item));
      });
    } else if (Array.isArray(value)) {
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

/**
 * Extracts a normalized Persian error message from an unknown error response.
 */
function extractErrorMessage(status: number, body: unknown): string {
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

  if (body && typeof body === 'object') {
    const errorObj = body as {
      errors?: Array<{ message?: string }>;
      message?: string;
      error?: string;
    };

    if (Array.isArray(errorObj.errors) && errorObj.errors.length > 0) {
      const firstMsg = errorObj.errors[0]?.message;
      if (firstMsg && typeof firstMsg === 'string' && firstMsg.trim()) {
        return firstMsg;
      }
    }

    if (typeof errorObj.message === 'string' && errorObj.message.trim()) {
      return errorObj.message;
    }

    if (typeof errorObj.error === 'string' && errorObj.error.trim()) {
      return errorObj.error;
    }
  }

  return fa.errors.default;
}

/**
 * Core HTTP request client wrapping native fetch with authorization,
 * query string serialization, and error normalization.
 */
export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, skipAuth = false, headers: customHeaders, ...fetchOptions } = options;

  const queryString = buildQueryString(params);
  const url = `${endpoint}${queryString}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  // Only set Content-Type if body exists and is not FormData
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
    // Network failure / server offline
    throw new ApiError(0, fa.errors.networkError, err);
  }

  // Handle 401 Unauthorized
  if (response.status === 401) {
    clearToken();
    if (unauthorizedHandler) {
      unauthorizedHandler();
    }
  }

  // Parse response body
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
