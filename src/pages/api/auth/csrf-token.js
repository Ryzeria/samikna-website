import { generateCsrfToken, buildCsrfCookieString } from '../../../lib/csrf';

/**
 * GET /api/auth/csrf-token
 *
 * Public endpoint — no authentication required.
 * Generates a fresh CSRF token, sets it as a non-httpOnly cookie, and returns
 * the token in the response body so the client can store it in memory.
 *
 * Called by apiClient.initCsrfToken() on application startup and after logout.
 */
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' },
    });
  }

  const token = generateCsrfToken();
  res.setHeader('Set-Cookie', buildCsrfCookieString(token));

  return res.status(200).json({
    success: true,
    data: { csrfToken: token },
  });
}
