/**
 * Centralized HTTP client for all API calls in the SAMIKNA frontend.
 *
 * Features:
 *  - Automatically attaches the CSRF token (`X-CSRF-Token`) to every mutating request
 *    (POST, PUT, PATCH, DELETE).
 *  - Automatically retries once after refreshing the CSRF token on a 403 response.
 *  - Always sends `credentials: 'same-origin'` so auth cookies are included.
 *  - Provides `initCsrfToken()` that AuthContext calls on startup / after logout.
 *
 * CLIENT-SIDE ONLY — do not import this file in API routes.
 */

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

// Module-level singleton — survives across React renders.
let _csrfToken = null;

/**
 * Fetch a fresh CSRF token from the server and store it in memory.
 * Also updates the `csrf_token` cookie on the client (server sets it in Set-Cookie).
 */
export async function initCsrfToken() {
  try {
    const res = await fetch('/api/auth/csrf-token', { credentials: 'same-origin' });
    if (res.ok) {
      const { data } = await res.json();
      _csrfToken = data.csrfToken;
    }
  } catch {
    // Network error — CSRF token stays null; mutations will fail with 403 until resolved.
  }
}

/**
 * Directly set the CSRF token (used after login when the server returns a fresh token).
 * @param {string} token
 */
export function setCsrfToken(token) {
  _csrfToken = token;
}

/**
 * Drop-in replacement for `fetch` that adds CSRF and credentials automatically.
 *
 * On a 403 response, the CSRF token is refreshed and the request is retried once.
 * This handles the case where the token was rotated server-side (e.g. after login).
 *
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<Response>}
 */
export async function apiFetch(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const isMutating = MUTATING_METHODS.has(method);

  const buildHeaders = (token) => ({
    'Content-Type': 'application/json',
    ...options.headers,
    ...(isMutating && token ? { 'X-CSRF-Token': token } : {}),
  });

  const request = (token) =>
    fetch(url, {
      ...options,
      credentials: 'same-origin',
      headers: buildHeaders(token),
    });

  const res = await request(_csrfToken);

  // Retry once after refreshing the CSRF token on a 403
  if (res.status === 403 && isMutating) {
    await initCsrfToken();
    return request(_csrfToken);
  }

  return res;
}
