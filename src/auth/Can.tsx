import React from 'react';
import { useCan } from './useCan';

export interface CanProps {
  snippet: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ snippet, fallback = null, children }) => {
  const can = useCan(snippet);
  if (!can) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
};
