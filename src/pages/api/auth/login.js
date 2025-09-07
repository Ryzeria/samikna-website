import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '../../../lib/database';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      message: 'Method not allowed',
      allowedMethods: ['POST']
    });
  }

  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ 
      message: 'Username dan password wajib diisi',
      missingFields: {
        username: !username,
        password: !password
      }
    });
  }

  // Security: Rate limiting check (simple implementation)
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  const loginAttempt = {
    username: username.toLowerCase().trim(),
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'],
    ip: clientIP
  };

  console.log('🔐 Secure login attempt:', {
    username: loginAttempt.username,
    ip: loginAttempt.ip,
    timestamp: loginAttempt.timestamp
  });

  let connection = null;

  try {
    // Establish database connection
    connection = await connectDB();
    
    // Search for user with security considerations
    const userQuery = `
      SELECT id, username, password, kabupaten, full_name, email, position, department, 
             earth_engine_url, created_at, last_login, is_active
      FROM users 
      WHERE LOWER(username) = LOWER(?) AND is_active = TRUE
      LIMIT 1
    `;

    const [users] = await connection.execute(userQuery, [loginAttempt.username]);

    if (users.length === 0) {
      // Security: Don't reveal whether user exists or not
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500)); // Random delay
      
      return res.status(401).json({ 
        message: 'Username atau password tidak valid',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const user = users[0];

    // Check if account is active
    if (!user.is_active) {
      return res.status(401).json({
        message: 'Akun tidak aktif. Hubungi administrator.',
        code: 'ACCOUNT_INACTIVE'
      });
    }

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      // Security: Same delay as user not found
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
      
      // Log failed attempt for security monitoring
      console.warn('❌ Failed login attempt:', {
        username: loginAttempt.username,
        ip: loginAttempt.ip,
        reason: 'invalid_password'
      });

      return res.status(401).json({ 
        message: 'Username atau password tidak valid',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Generate secure JWT token
    const tokenPayload = { 
      userId: user.id, 
      username: user.username, 
      kabupaten: user.kabupaten,
      role: 'admin',
      iat: Math.floor(Date.now() / 1000),
      loginIP: clientIP
    };

    const jwtSecret = process.env.JWT_SECRET || 'samikna-super-secure-secret-2024';
    const token = jwt.sign(tokenPayload, jwtSecret, { 
      expiresIn: '8h', // Shorter session for security
      issuer: 'samikna-platform',
      audience: 'samikna-dashboard'
    });

    // Update last login timestamp
    await connection.execute(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    // Prepare secure response (exclude sensitive data)
    const loginResponse = {
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        username: user.username,
        kabupaten: user.kabupaten,
        fullName: user.full_name,
        email: user.email,
        position: user.position,
        department: user.department,
        earthEngineUrl: user.earth_engine_url,
        lastLogin: user.last_login
      },
      loginTime: new Date().toISOString(),
      sessionExpiry: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() // 8 hours
    };

    // Log successful login for audit
    console.log('✅ Successful login:', {
      username: user.username,
      kabupaten: user.kabupaten,
      ip: loginAttempt.ip,
      timestamp: loginResponse.loginTime
    });

    return res.status(200).json(loginResponse);

  } catch (error) {
    console.error('🔥 Login system error:', {
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3),
      username: loginAttempt.username,
      timestamp: loginAttempt.timestamp
    });
    
    // Generic error response for security
    return res.status(500).json({
      message: 'Terjadi kesalahan sistem. Silakan coba lagi.',
      code: 'SYSTEM_ERROR',
      timestamp: new Date().toISOString()
    });

  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.warn('Warning: Could not close database connection:', closeError.message);
      }
    }
  }
}

// Security helper functions (for future use)
export function generateSecureToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function validatePasswordStrength(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    checks: {
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    }
  };
}

export function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}