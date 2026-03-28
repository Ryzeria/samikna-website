import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '../../../lib/database';
import { checkRateLimit, recordFailedAttempt, resetAttempts } from '../../../lib/rateLimiter';
import { validateCsrfToken, generateCsrfToken, buildCsrfCookieString } from '../../../lib/csrf';
import { validateLogin } from '../../../lib/validators';

const SESSION_DURATION_SECONDS = 8 * 60 * 60; // 8 jam

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' },
    });
  }

  const clientIP = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';

  // ── 1. Rate limiting ──────────────────────────────────────────────────────
  const rateLimit = checkRateLimit(clientIP);
  if (!rateLimit.allowed) {
    const retryAfterSec = Math.ceil(rateLimit.retryAfterMs / 1000);
    res.setHeader('Retry-After', String(retryAfterSec));
    return res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: `Terlalu banyak percobaan login. Coba lagi dalam ${Math.ceil(retryAfterSec / 60)} menit.`,
      },
    });
  }

  // ── 2. CSRF validation ────────────────────────────────────────────────────
  if (!validateCsrfToken(req)) {
    return res.status(403).json({
      success: false,
      error: { code: 'CSRF_INVALID', message: 'Permintaan tidak valid. Muat ulang halaman dan coba lagi.' },
    });
  }

  // ── 3. Input validation ───────────────────────────────────────────────────
  const { username, password, rememberMe } = req.body;

  const loginValidation = validateLogin({ username, password });
  if (!loginValidation.valid) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: loginValidation.errors[0],
        detail: loginValidation.errors,
      },
    });
  }

  const normalizedUsername = username.trim().toLowerCase();

  let connection = null;

  try {
    connection = await connectDB();

    const userQuery = `
      SELECT id, username, password, kabupaten, full_name, email, position, department,
             earth_engine_url, created_at, last_login, is_active
      FROM users
      WHERE LOWER(username) = ? AND is_active = TRUE
      LIMIT 1
    `;

    const [users] = await connection.execute(userQuery, [normalizedUsername]);

    // Constant-time response: always run bcrypt even if user not found (timing attack mitigation)
    if (users.length === 0) {
      await bcrypt.compare(password, '$2a$12$placeholderhashabcdefghijklmnopqrstuvwx');
      recordFailedAttempt(clientIP);
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Username atau password tidak valid' },
      });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      recordFailedAttempt(clientIP);
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Username atau password tidak valid' },
      });
    }

    // ── 4. Authentication success ─────────────────────────────────────────
    resetAttempts(clientIP);

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username, kabupaten: user.kabupaten, role: 'admin', loginIP: clientIP },
      process.env.JWT_SECRET,
      { expiresIn: `${SESSION_DURATION_SECONDS}s`, issuer: 'samikna-platform', audience: 'samikna-dashboard' }
    );

    // Update last login timestamp
    await connection.execute('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    // Build cookie strings
    const isProduction = process.env.NODE_ENV === 'production';
    const secure = isProduction ? '; Secure' : '';
    const maxAge = rememberMe ? `; Max-Age=${SESSION_DURATION_SECONDS}` : '';

    const authCookie  = `samikna_token=${token}; HttpOnly; Path=/; SameSite=Strict${secure}${maxAge}`;
    const newCsrfToken = generateCsrfToken();
    const csrfCookie  = buildCsrfCookieString(newCsrfToken);

    res.setHeader('Set-Cookie', [authCookie, csrfCookie]);

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          kabupaten: user.kabupaten,
          fullName: user.full_name,
          email: user.email,
          position: user.position,
          department: user.department,
          earthEngineUrl: user.earth_engine_url,
          lastLogin: user.last_login,
        },
        csrfToken: newCsrfToken,
        sessionExpiry: new Date(Date.now() + SESSION_DURATION_SECONDS * 1000).toISOString(),
      },
      meta: { loginTime: new Date().toISOString() },
    });

  } catch (error) {
    console.error('Login system error:', { message: error.message, username: normalizedUsername, ip: clientIP });
    return res.status(500).json({
      success: false,
      error: { code: 'SYSTEM_ERROR', message: 'Terjadi kesalahan sistem. Silakan coba lagi.' },
    });
  } finally {
    if (connection) {
      try { connection.release(); } catch (_) { /* ignore close error */ }
    }
  }
}

export function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
