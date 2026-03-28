/**
 * SERVER-SIDE ONLY — Do not import in client-side pages or components.
 */

/**
 * In-memory rate limiter for login attempts.
 *
 * Strategy: sliding window per IP address.
 *   - Max 5 failed attempts within a 15-minute window.
 *   - After 5 failures the IP is blocked for 30 minutes.
 *   - Successful login resets the counter for that IP.
 *   - The store is cleaned up every hour to prevent unbounded memory growth.
 *
 * Note: This implementation is per-process. For multi-instance deployments
 * (multiple Node.js servers / Vercel edge nodes) use a shared store (Redis).
 */

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;   // 15 minutes
const BLOCK_MS  = 30 * 60 * 1000;   // 30 minutes
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

/** @type {Map<string, { failures: number, windowStart: number, blockedUntil: number }>} */
const store = new Map();

// Periodic cleanup — removes stale entries to prevent memory leaks.
// `unref()` prevents this timer from keeping the Node process alive.
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      const isBlockExpired = entry.blockedUntil && now >= entry.blockedUntil;
      const isWindowExpired = now - entry.windowStart >= WINDOW_MS;
      if (isBlockExpired || (isWindowExpired && entry.blockedUntil === 0)) {
        store.delete(key);
      }
    }
  }, CLEANUP_INTERVAL_MS);

  if (timer.unref) timer.unref();
}

/**
 * Check whether the given IP is currently allowed to attempt a login.
 *
 * @param {string} ip
 * @returns {{ allowed: boolean, retryAfterMs?: number }}
 */
export function checkRateLimit(ip) {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry) return { allowed: true };

  // IP is blocked
  if (entry.blockedUntil && now < entry.blockedUntil) {
    return { allowed: false, retryAfterMs: entry.blockedUntil - now };
  }

  // Block has expired — reset
  if (entry.blockedUntil && now >= entry.blockedUntil) {
    store.delete(ip);
    return { allowed: true };
  }

  // Sliding window has expired — reset
  if (now - entry.windowStart >= WINDOW_MS) {
    store.delete(ip);
    return { allowed: true };
  }

  // Still within window but under the failure limit
  if (entry.failures < MAX_FAILURES) {
    return { allowed: true };
  }

  // Should not reach here; treat as blocked
  return { allowed: false, retryAfterMs: BLOCK_MS };
}

/**
 * Record a failed login attempt for the given IP.
 * Blocks the IP when it exceeds MAX_FAILURES within the window.
 *
 * @param {string} ip
 */
export function recordFailedAttempt(ip) {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry) {
    store.set(ip, { failures: 1, windowStart: now, blockedUntil: 0 });
    return;
  }

  // Reset window if it has expired
  if (now - entry.windowStart >= WINDOW_MS) {
    store.set(ip, { failures: 1, windowStart: now, blockedUntil: 0 });
    return;
  }

  const newFailures = entry.failures + 1;
  const blockedUntil = newFailures >= MAX_FAILURES ? now + BLOCK_MS : 0;
  store.set(ip, { ...entry, failures: newFailures, blockedUntil });
}

/**
 * Reset the failure counter for the given IP after a successful login.
 *
 * @param {string} ip
 */
export function resetAttempts(ip) {
  store.delete(ip);
}
