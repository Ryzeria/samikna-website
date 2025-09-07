import jwt from 'jsonwebtoken';

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'samikna-secret-key');
    return { valid: true, data: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

export const authMiddleware = (handler) => {
  return async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    const { valid, data, error } = verifyToken(token);

    if (!valid) {
      return res.status(401).json({ message: 'Token tidak valid', error });
    }

    req.user = data;
    return handler(req, res);
  };
};

// Client-side auth check
export const checkAuth = () => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('samikna_token');
  const user = localStorage.getItem('samikna_user');
  
  if (!token || !user) return null;
  
  try {
    const parsedUser = JSON.parse(user);
    return { token, user: parsedUser };
  } catch {
    return null;
  }
};

// Protected page HOC
export const withAuth = (WrappedComponent) => {
  return function ProtectedRoute(props) {
    const { useEffect, useState } = require('react');
    const { useRouter } = require('next/router');
    
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
      const auth = checkAuth();
      if (!auth) {
        router.push('/login');
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
    }, [router]);

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (!authenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};