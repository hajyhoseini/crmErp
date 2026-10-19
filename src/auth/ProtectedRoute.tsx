import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from './useAuth';
import { fa } from '../i18n/fa';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard wrapper. Shows a full-page spinner while auth state is initializing.
 * Redirects unauthenticated users to /login preserving target location in state.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          gap: 16,
        }}
        role="status"
        aria-label={fa.common.loading}
      >
        <Spin size="large" />
        <span style={{ color: '#64748b', fontSize: 14 }}>{fa.common.loading}</span>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
