const ROLE_KEY = 'smartbase_active_role';
let inMemoryRole: string | null = null;

export function getActiveRole(): string | null {
  if (inMemoryRole) {
    return inMemoryRole;
  }
  try {
    return localStorage.getItem(ROLE_KEY);
  } catch {
    return null;
  }
}

export function setActiveRole(role: string | null): void {
  inMemoryRole = role;
  try {
    if (role) {
      localStorage.setItem(ROLE_KEY, role);
    } else {
      localStorage.removeItem(ROLE_KEY);
    }
  } catch {}
}

export function clearActiveRole(): void {
  inMemoryRole = null;
  try {
    localStorage.removeItem(ROLE_KEY);
  } catch {}
}
