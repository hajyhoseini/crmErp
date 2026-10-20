import { useAuth } from './useAuth';
import { hasSnippet } from '../api/permissions';

export function useCan(snippet?: string): boolean {
  const { snippets, allowAll } = useAuth();
  if (!snippet) {
    return true;
  }
  return hasSnippet(snippets, snippet, allowAll);
}
