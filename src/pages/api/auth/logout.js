import { validateCsrfToken, generateCsrfToken, buildCsrfCookieString } from '../../../lib/csrf';

/**
 * POST /api/auth/logout
 *
 * Validates the CSRF token, then clears the `samikna_token` httpOnly auth cookie.
 * Returns a fresh CSRF token so the client can continue making authenticated requests
 * (e.g. immediately logging in again) without a page reload.
 */
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' },
    });
  }

  if (!validateCsrfToken(req)) {
    return res.status(403).json({
      success: false,
      error: { code: 'CSRF_INVALID', message: 'Permintaan tidak valid. Muat ulang halaman dan coba lagi.' },
    });
  }

  const newCsrfToken = generateCsrfToken();
  const isProduction  = process.env.NODE_ENV === 'production';
  const secure        = isProduction ? '; Secure' : '';

  res.setHeader('Set-Cookie', [
    // Clear auth cookie
    `samikna_token=; HttpOnly; Path=/; SameSite=Strict${secure}; Max-Age=0`,
    // Issue a fresh CSRF token for the next login attempt
    buildCsrfCookieString(newCsrfToken),
  ]);

  return res.status(200).json({
    success: true,
    data: { message: 'Logout berhasil', csrfToken: newCsrfToken },
  });
}
