/**
 * SERVER-SIDE ONLY — Do not import in client-side pages or components.
 */

/**
 * CSRF protection utilities (Double Submit Cookie pattern).
 *
 * Flow:
 *  1. Server generates a random token, sets it as a non-httpOnly cookie (`csrf_token`).
 *  2. Client (apiClient.js) reads the token and sends it in the `X-CSRF-Token` header.
 *  3. Server compares the header value against the cookie value using a timing-safe comparison.
 *
 * Why this works: An attacker from a different origin cannot read the `csrf_token` cookie
 * (same-origin policy), so they cannot produce the correct header value.
 *
 * Note: `samikna_token` (auth) uses `SameSite=Strict`, which already blocks most CSRF vectors
 * in modern browsers. This layer provides defense-in-depth.
 *
 * SERVER-SIDE ONLY — do not import this file in client-side code.
 */
import crypto from 'crypto';

/**
 * Generate a cryptographically secure random CSRF token (64 hex chars).
 * @returns {string}
 */
export function generateCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Build the Set-Cookie string for the CSRF token.
 * NOT httpOnly — JavaScript must be able to read it so it can echo it back as a header.
 *
 * @param {string} token
 * @returns {string}
 */
export function buildCsrfCookieString(token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `csrf_token=${token}; Path=/; SameSite=Strict${secure}`;
}

/**
 * Validate the CSRF token from an incoming request.
 * Compares the `X-CSRF-Token` header with the `csrf_token` cookie using a
 * timing-safe byte comparison to prevent timing attacks.
 *
 * Returns `false` for non-mutating methods (GET, HEAD, OPTIONS) — they don't need CSRF.
 *
 * @param {import('http').IncomingMessage} req
 * @returns {boolean}
 */
export function validateCsrfToken(req) {
  const safeMethods = new Set(['GET', 'HEAD', 'OPTIONS']);
  if (safeMethods.has(req.method?.toUpperCase())) return true;

  const cookieToken  = req.cookies?.csrf_token;
  const headerToken  = req.headers?.['x-csrf-token'];

  if (!cookieToken || !headerToken) return false;
  if (cookieToken.length !== headerToken.length) return false;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(cookieToken,  'utf8'),
      Buffer.from(headerToken, 'utf8')
    );
  } catch {
    return false;
  }
}
