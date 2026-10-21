import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { checkAuth, checkRoles, signIn } from '../api/auth';
import { ApiError, registerUnauthorizedHandler, unregisterUnauthorizedHandler } from '../api/client';
import type { AuthUser } from '../api/types';
import { clearToken, getToken, setToken } from './token';
import { getActiveRole, setActiveRole, clearActiveRole } from './role';

export interface AuthContextValue {
  user: AuthUser | null;
  snippets: string[];
  allowAll: boolean;
  activeRole: string | null;
  isRoot: boolean;
  loading: boolean;
  login: (account: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [snippets, setSnippets] = useState<string[]>([]);
  const [allowAll, setAllowAll] = useState<boolean>(false);
  const [activeRole, setActiveRoleState] = useState<string | null>(getActiveRole());
  const [loading, setLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();

  const isRoot = useMemo(() => {
    const hasRootRole = Array.isArray(user?.roles) && user.roles.some((r) => r.name === 'root');
    return Boolean(hasRootRole && activeRole === 'root');
  }, [user, activeRole]);

  const handleUnauthenticated = useCallback(() => {
    clearToken();
    clearActiveRole();
    queryClient.clear();
    setUser(null);
    setSnippets([]);
    setAllowAll(false);
    setActiveRoleState(null);
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

    const serverRole = rolesData.role || (Array.isArray(rolesData.roles) ? rolesData.roles[0] : null);
    const existingStoredRole = getActiveRole();
    const resolvedRole = existingStoredRole || serverRole || (userData.roles && userData.roles[0]?.name) || null;

    if (resolvedRole) {
      setActiveRole(resolvedRole);
      setActiveRoleState(resolvedRole);
    }

    setUser(userData);
    setSnippets(Array.isArray(rolesData.snippets) ? rolesData.snippets : []);
    setAllowAll(Boolean(rolesData.allowAll));
  }, []);

  const switchRole = useCallback(
    async (newRole: string) => {
      setActiveRole(newRole);
      setActiveRoleState(newRole);
      const rolesData = await checkRoles();
      setSnippets(Array.isArray(rolesData.snippets) ? rolesData.snippets : []);
      setAllowAll(Boolean(rolesData.allowAll));
    },
    []
  );

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
      activeRole,
      isRoot,
      loading,
      login,
      logout,
      switchRole,
    }),
    [user, snippets, allowAll, activeRole, isRoot, loading, login, logout, switchRole]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
