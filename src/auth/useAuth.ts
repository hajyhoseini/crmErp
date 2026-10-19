import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from './AuthProvider';

/**
 * Hook to access authentication state and actions.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
