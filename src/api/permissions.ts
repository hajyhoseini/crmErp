function globToRegExp(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
  return new RegExp(`^${escaped}$`);
}

// UNVERIFIED: Evaluates allowAll, negation patterns with glob matching, and allowed patterns.
export function hasSnippet(
  snippets: string[] | undefined | null,
  name: string,
  allowAll = false
): boolean {
  if (allowAll) {
    return true;
  }
  if (!snippets || snippets.length === 0) {
    return false;
  }

  for (const entry of snippets) {
    if (entry.startsWith('!')) {
      const deniedPattern = entry.slice(1);
      if (globToRegExp(deniedPattern).test(name)) {
        return false;
      }
    }
  }

  for (const entry of snippets) {
    if (!entry.startsWith('!')) {
      if (globToRegExp(entry).test(name)) {
        return true;
      }
    }
  }

  return false;
}
