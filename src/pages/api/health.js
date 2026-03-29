/**
 * GET /api/health
 * Diagnostic endpoint — checks env vars and DB connectivity.
 * REMOVE or PROTECT this endpoint before going fully public in production.
 */
export default async function handler(req, res) {
  const start = Date.now();

  // 1. Check environment variables
  const envCheck = {
    DB_HOST:     !!process.env.DB_HOST,
    DB_PORT:     !!process.env.DB_PORT,
    DB_USER:     !!process.env.DB_USER,
    DB_PASS:     !!process.env.DB_PASS,
    DB_NAME:     !!process.env.DB_NAME,
    JWT_SECRET:  !!process.env.JWT_SECRET,
    NODE_ENV:    process.env.NODE_ENV,
  };

  const missingEnv = Object.entries(envCheck)
    .filter(([k, v]) => k !== 'NODE_ENV' && v === false)
    .map(([k]) => k);

  if (missingEnv.length > 0) {
    return res.status(500).json({
      status: 'error',
      message: `Missing environment variables: ${missingEnv.join(', ')}`,
      env: envCheck,
      elapsed_ms: Date.now() - start,
    });
  }

  // 2. Test DB connection
  let dbStatus = 'not_tested';
  let dbError  = null;
  let dbInfo   = null;

  try {
    // Dynamic import to avoid module-level crash if this file is loaded before env is set
    const { connectDB } = await import('../../lib/database.js');
    const conn = await connectDB();
    const [[row]] = await conn.execute('SELECT VERSION() AS version, NOW() AS now');
    conn.release();
    dbStatus = 'connected';
    dbInfo   = row;
  } catch (err) {
    dbStatus = 'failed';
    dbError  = err.message;
  }

  const ok = dbStatus === 'connected';
  return res.status(ok ? 200 : 503).json({
    status: ok ? 'ok' : 'error',
    env:    envCheck,
    db:     { status: dbStatus, info: dbInfo, error: dbError },
    elapsed_ms: Date.now() - start,
  });
}
