import React from 'react';
import { HiExclamationCircle, HiRefresh } from 'react-icons/hi';

/**
 * Global Error Boundary — catches uncaught render errors in any child component.
 *
 * React error boundaries must be class components.
 * Wrap the app (or specific risky subtrees) with this component.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <MyComponent />
 *   </ErrorBoundary>
 *
 *   // With custom fallback:
 *   <ErrorBoundary fallback={<p>Something went wrong.</p>}>
 *     <MyComponent />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production you'd send this to an error tracking service (e.g. Sentry)
    console.error('[ErrorBoundary] Caught an error:', error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    // Allow a custom fallback
    if (this.props.fallback) {
      return this.props.fallback;
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <HiExclamationCircle className="w-16 h-16 text-red-400" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Komponen mengalami error yang tidak terduga. Coba muat ulang halaman.
          </p>

          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <pre className="text-left bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 mb-6 overflow-auto max-h-32">
              {this.state.error.toString()}
            </pre>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={this.handleReload}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
            >
              <HiRefresh className="w-4 h-4" />
              Coba Lagi
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-medium transition-colors"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      </div>
    );
  }
}
