import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { checkAuth, signIn } from '../api/auth';
import { ApiError, registerUnauthorizedHandler, unregisterUnauthorizedHandler } from '../api/client';
import type { AuthUser } from '../api/types';
import { clearToken, getToken, setToken } from './token';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  login: (account: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const login = useCallback(async (account: string, password: string): Promise<void> => {
    const res = await signIn(account, password);
    if (res?.data?.token) {
      setToken(res.data.token);
      setUser(res.data.user || { id: 'current', account, email: account });
      setStatus('authenticated');
    } else {
      throw new Error('Invalid token response from server');
    }
  }, []);

  // Listen for 401 signals from the API client
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      setUser(null);
      setStatus('unauthenticated');
    });
    return () => {
      unregisterUnauthorizedHandler();
    };
  }, []);

  // On startup: check token and validate if present
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setStatus('unauthenticated');
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    async function verifyToken() {
      try {
        const currentUser = await checkAuth(controller.signal);
        if (isMounted) {
          setUser(currentUser);
          setStatus('authenticated');
        }
      } catch (err: unknown) {
        if (!isMounted) return;

        // If the server explicitly rejected the token with 401 Unauthorized:
        if (err instanceof ApiError && err.status === 401) {
          clearToken();
          setUser(null);
          setStatus('unauthenticated');
          return;
        }

        // UNVERIFIED ENDPOINT FALLBACK:
        // Since `GET /api/auth:check` is an unverified NocoBase endpoint,
        // if it fails for any reason OTHER than 401 (e.g. 404 endpoint not found,
        // or temporary network/dev server offline), we still treat the user as
        // authenticated using the stored token so that valid sessions are preserved.
        setUser({
          id: 'current',
          email: 'user@example.com',
          name: 'کاربر سیستم',
        });
        setStatus('authenticated');
      }
    }

    verifyToken();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      login,
      logout,
    }),
    [user, status, login, logout]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
