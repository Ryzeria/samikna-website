import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { initCsrfToken, setCsrfToken, apiFetch } from '../lib/apiClient';

const AuthContext = createContext(null);

/**
 * Provides authentication state and CSRF token management to the entire application.
 *
 * Startup sequence (on every page load / refresh):
 *  1. Fetch a CSRF token → stored in apiClient module variable.
 *  2. Call /api/auth/me (reads httpOnly cookie) → restore user state.
 *
 * After login:
 *  - Server returns a fresh CSRF token alongside user data.
 *  - We update the apiClient with the new token (no extra round-trip needed).
 *
 * After logout:
 *  - Auth cookie is cleared server-side.
 *  - We fetch a fresh CSRF token for any subsequent requests (e.g. login again).
 */
export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Restore the session from the server (reads httpOnly cookie) and
   * ensure the CSRF token is initialised.
   */
  const refreshUser = useCallback(async () => {
    try {
      // Run both in parallel — CSRF init doesn't depend on session state
      const [, meRes] = await Promise.all([
        initCsrfToken(),
        fetch('/api/auth/me', { credentials: 'same-origin' }),
      ]);

      if (meRes.ok) {
        const { data } = await meRes.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Restore session on initial mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  /**
   * Authenticate the user. Calls /api/auth/login (via apiFetch so the CSRF
   * token is attached automatically). On success the server sets:
   *   - `samikna_token`  → httpOnly auth cookie
   *   - `csrf_token`     → non-httpOnly CSRF cookie
   * and returns a fresh CSRF token in the body which we store immediately.
   *
   * @param {string} username
   * @param {string} password
   * @param {boolean} [rememberMe]
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  const login = useCallback(async (username, password, rememberMe = false) => {
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: username.trim().toLowerCase(), password, rememberMe }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        // Update the in-memory CSRF token with the freshly rotated one from the server
        if (json.data?.csrfToken) {
          setCsrfToken(json.data.csrfToken);
        }
        setUser(json.data.user);
        return { success: true };
      }

      return { success: false, error: json.error?.message || 'Login gagal.' };
    } catch {
      return { success: false, error: 'Terjadi kesalahan koneksi. Silakan coba lagi.' };
    }
  }, []);

  /**
   * End the session. Calls /api/auth/logout (via apiFetch so CSRF is attached).
   * The server clears the auth cookie. We then fetch a fresh CSRF token so the
   * user can log in again without reloading.
   */
  const logout = useCallback(async () => {
    try {
      const res = await apiFetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        // Use the fresh CSRF token returned by the logout endpoint (no extra round-trip needed)
        if (json.data?.csrfToken) {
          setCsrfToken(json.data.csrfToken);
        }
      }
    } catch {
      // Network error — still clear state and get a fresh CSRF token
      await initCsrfToken();
    } finally {
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to consume authentication context.
 * Must be used inside <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

/**
 * Higher-order component that protects a page from unauthenticated access.
 * Redirects to /login if the user is not authenticated.
 *
 * Usage:
 *   export default withAuth(MyPage);
 */
export function withAuth(WrappedComponent) {
  function ProtectedPage(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.replace('/login');
      }
    }, [loading, user, router]);

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat...</p>
          </div>
        </div>
      );
    }

    if (!user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  }

  ProtectedPage.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return ProtectedPage;
}
