/**
 * SERVER-SIDE ONLY — API Route Authentication & CSRF Middleware.
 * Import this file only in pages/api/* — never in client-side pages or components.
 *
 * For protecting client-side pages, use `withAuth` from `@/contexts/AuthContext`.
 */
import jwt from 'jsonwebtoken';
import { validateCsrfToken } from './csrf';

/**
 * Verify a JWT token string.
 * @param {string} token
 * @returns {{ valid: boolean, data?: object, error?: string }}
 */
export const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required but not set.');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'samikna-platform',
      audience: 'samikna-dashboard',
    });
    return { valid: true, data: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

/**
 * API route middleware — applies JWT authentication AND CSRF validation.
 *
 * - Reads the auth token from the httpOnly `samikna_token` cookie.
 * - For mutating requests (POST / PUT / PATCH / DELETE) also validates the
 *   `X-CSRF-Token` header against the `csrf_token` cookie.
 * - Attaches the decoded JWT payload to `req.user` on success.
 *
 * Usage:
 *   export default authMiddleware(handler);
 */
export const authMiddleware = (handler) => {
  return async (req, res) => {
    // ── JWT authentication ────────────────────────────────────────────────
    const token = req.cookies?.samikna_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'NO_TOKEN', message: 'Token tidak ditemukan' },
      });
    }

    const { valid, data, error } = verifyToken(token);

    if (!valid) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Token tidak valid atau sudah kedaluwarsa', detail: error },
      });
    }

    // ── CSRF validation (mutating requests only) ──────────────────────────
    if (!validateCsrfToken(req)) {
      return res.status(403).json({
        success: false,
        error: { code: 'CSRF_INVALID', message: 'Permintaan tidak valid. Muat ulang halaman dan coba lagi.' },
      });
    }

    req.user = data;
    return handler(req, res);
  };
};
