import { verifyToken } from '../../../lib/authMiddleware';

/**
 * GET /api/auth/me
 * Reads the httpOnly cookie, verifies the JWT, and returns the current user.
 * Used by AuthContext to restore session on page refresh.
 */
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' },
    });
  }

  const token = req.cookies?.samikna_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'NO_TOKEN', message: 'Tidak ada sesi aktif' },
    });
  }

  const { valid, data, error } = verifyToken(token);

  if (!valid) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Sesi tidak valid atau sudah kedaluwarsa', detail: error },
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: data.userId,
        username: data.username,
        kabupaten: data.kabupaten,
        role: data.role,
      },
    },
  });
}
