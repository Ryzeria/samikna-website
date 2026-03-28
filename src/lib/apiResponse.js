/**
 * SERVER-SIDE ONLY — Do not import in client-side pages or components.
 */

/**
 * Standardised API response helpers.
 *
 * Success shape:  { success: true,  data: T,    meta?: object }
 * Error shape:    { success: false, error: { code: string, message: string, detail?: any } }
 *
 * Usage:
 *   return ok(res, data);
 *   return ok(res, data, { page: 1 });
 *   return fail(res, 400, 'MISSING_FIELDS', 'Username wajib diisi');
 *   return fail(res, 500, 'SERVER_ERROR',   'Terjadi kesalahan sistem.');
 */

/**
 * Send a successful JSON response.
 * @param {import('http').ServerResponse} res
 * @param {*} data
 * @param {object} [meta]
 * @param {number} [status=200]
 */
export function ok(res, data, meta = undefined, status = 200) {
  const body = { success: true, data };
  if (meta && Object.keys(meta).length > 0) body.meta = meta;
  return res.status(status).json(body);
}

/**
 * Send an error JSON response.
 * @param {import('http').ServerResponse} res
 * @param {number} status  HTTP status code
 * @param {string} code    Machine-readable error code (e.g. 'NOT_FOUND')
 * @param {string} message Human-readable message in Bahasa Indonesia
 * @param {*}      [detail] Optional extra info (hidden in production)
 */
export function fail(res, status, code, message, detail = undefined) {
  const error = { code, message };
  if (detail !== undefined && process.env.NODE_ENV !== 'production') {
    error.detail = detail;
  }
  return res.status(status).json({ success: false, error });
}

/**
 * Send a 405 Method Not Allowed response.
 * @param {import('http').ServerResponse} res
 * @param {string[]} [allowed]
 */
export function methodNotAllowed(res, allowed = []) {
  if (allowed.length) res.setHeader('Allow', allowed.join(', '));
  return fail(res, 405, 'METHOD_NOT_ALLOWED', 'Method tidak diizinkan.');
}
