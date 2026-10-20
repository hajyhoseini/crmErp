import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { checkAuth, checkRoles, signIn } from '../api/auth';
import { ApiError, registerUnauthorizedHandler, unregisterUnauthorizedHandler } from '../api/client';
import type { AuthUser } from '../api/types';
import { clearToken, getToken, setToken } from './token';

export interface AuthContextValue {
  user: AuthUser | null;
  snippets: string[];
  allowAll: boolean;
  isRoot: boolean;
  loading: boolean;
  login: (account: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [snippets, setSnippets] = useState<string[]>([]);
  const [allowAll, setAllowAll] = useState<boolean>(false);
  const [isRoot, setIsRoot] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();

  const handleUnauthenticated = useCallback(() => {
    clearToken();
    queryClient.clear();
    setUser(null);
    setSnippets([]);
    setAllowAll(false);
    setIsRoot(false);
    setLoading(false);
  }, [queryClient]);

  const logout = useCallback(() => {
    handleUnauthenticated();
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }, [handleUnauthenticated]);

  const loadSessionData = useCallback(async (signal?: AbortSignal) => {
    const userData = await checkAuth(signal);
    const rolesData = await checkRoles(signal);

    const userHasRoot = Array.isArray(userData.roles) && userData.roles.some((r) => r.name === 'root');
    const rolesHasRoot = Array.isArray(rolesData.roles) && rolesData.roles.includes('root');
    const rootDetected = Boolean(userHasRoot || rolesHasRoot);

    setUser(userData);
    setSnippets(Array.isArray(rolesData.snippets) ? rolesData.snippets : []);
    setAllowAll(Boolean(rolesData.allowAll));
    setIsRoot(rootDetected);
  }, []);

  const login = useCallback(
    async (account: string, password: string): Promise<void> => {
      const res = await signIn(account, password);
      if (res?.data?.token) {
        setToken(res.data.token);
        await loadSessionData();
      } else {
        throw new Error('Invalid token response from server');
      }
    },
    [loadSessionData]
  );

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      handleUnauthenticated();
    });
    return () => {
      unregisterUnauthorizedHandler();
    };
  }, [handleUnauthenticated]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    async function bootstrap() {
      try {
        await loadSessionData(controller.signal);
        if (isMounted) {
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        if (err instanceof ApiError && err.status === 401) {
          handleUnauthenticated();
          return;
        }
        handleUnauthenticated();
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [handleUnauthenticated, loadSessionData]);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user,
      snippets,
      allowAll,
      isRoot,
      loading,
      login,
      logout,
    }),
    [user, snippets, allowAll, isRoot, loading, login, logout]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
