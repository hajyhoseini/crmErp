function matchPattern(pattern: string, name: string): boolean {
  if (pattern === name) {
    return true;
  }
  if (pattern.endsWith('.*')) {
    const prefix = pattern.slice(0, -2);
    return name === prefix || name.startsWith(`${prefix}.`);
  }
  if (pattern.endsWith('*')) {
    const prefix = pattern.slice(0, -1);
    return name.startsWith(prefix);
  }
  return false;
}

// UNVERIFIED: Evaluates allowAll, negation patterns with prefix or exact matches, and positive wildcard patterns.
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
      const negationPattern = entry.slice(1);
      if (matchPattern(negationPattern, name)) {
        return false;
      }
    }
  }

  for (const entry of snippets) {
    if (!entry.startsWith('!')) {
      if (matchPattern(entry, name)) {
        return true;
      }
    }
  }

  return false;
}
