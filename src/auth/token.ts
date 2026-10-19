/**
 * Local storage token management.
 * This is the ONLY file in the entire application allowed to touch localStorage.
 */

const TOKEN_KEY = 'crm_auth_token';

/**
 * Retrieves the stored JWT token, or null if not found or on error.
 */
export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to read auth token from localStorage:', error);
    return null;
  }
}

/**
 * Stores the JWT token in localStorage.
 */
export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save auth token to localStorage:', error);
  }
}

/**
 * Clears the stored JWT token from localStorage.
 */
export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to clear auth token from localStorage:', error);
  }
}
