import React, { useMemo } from 'react';
import { ConfigProvider, App as AntdApp } from 'antd';
import fa_IR from 'antd/locale/fa_IR';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { appTheme } from './theme/theme';
import { AuthProvider } from './auth/AuthProvider';
import { AppRoutes } from './router';
import { ApiError } from './api/client';

export function App() {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              if (error instanceof ApiError && error.status === 401) {
                return false;
              }
              return failureCount < 1;
            },
            refetchOnWindowFocus: false,
            staleTime: 30000,
          },
        },
      }),
    []
  );

  return (
    <ConfigProvider direction="rtl" locale={fa_IR} theme={appTheme}>
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
