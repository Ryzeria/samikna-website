/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

const isStaticExport = process.env.DEPLOY_TARGET === 'static';
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,

  // Static export option (for shared hosting - uncomment if needed)
  ...(isStaticExport && {
    output: 'export',
    trailingSlash: true,
    distDir: 'out',
  }),

  // Public environment variables
  env: {
    CUSTOM_KEY: isProduction ? 'samikna-production' : 'samikna-development',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ||
      (isProduction ? 'https://samikna.id' : 'http://localhost:3000'),
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://samikna.id',
  },

  // CORS & cache headers
  ...(!isStaticExport && {
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            { key: 'Access-Control-Allow-Origin',  value: isProduction ? 'https://samikna.id' : '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
            { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-CSRF-Token' },
          ],
        },
        {
          source: '/_next/static/:path*',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
      ];
    },
  }),

  // Image optimization — remotePatterns replaces deprecated `domains`
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      { protocol: 'https', hostname: 'samikna.id' },
      { protocol: 'https', hostname: 'www.samikna.id' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'earthengine.google.com' },
      { protocol: 'https', hostname: 'ee-samikna.projects.earthengine.app' },
      { protocol: 'http',  hostname: 'localhost' },
    ],
    formats: ['image/webp', 'image/avif'],
    ...(isStaticExport && { loader: 'custom', loaderFile: './lib/imageLoader.js' }),
  },

  // Turbopack config (Next.js 16 default bundler)
  // Empty object silences the "webpack config with no turbopack config" warning.
  turbopack: {},

  // Webpack config kept for fallback / non-Turbopack builds
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, net: false, tls: false, crypto: false,
        stream: false, url: false, zlib: false, http: false,
        https: false, assert: false, os: false, path: false,
      };
    }
    return config;
  },

  // Server external packages
  ...(!isStaticExport && {
    serverExternalPackages: ['mysql2', 'bcryptjs', 'jsonwebtoken'],
  }),

  // Performance
  compress: true,
  poweredByHeader: false,

  // Build ID
  generateBuildId: async () => `samikna-${Date.now()}`,

  // Page extensions
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],

  // Experimental features
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Compiler
  compiler: {
    removeConsole: isProduction,
    reactRemoveProperties: isProduction,
  },

  // Asset & base path
  assetPrefix: isProduction ? (process.env.CDN_URL || '') : '',
  basePath: process.env.BASE_PATH || '',

  // TypeScript (ignore errors in production build)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Redirects
  ...(!isStaticExport && {
    async redirects() {
      return [
        { source: '/home',  destination: '/', permanent: true },
        { source: '/admin', destination: '/dashboard', permanent: true },
      ];
    },
  }),
};

module.exports = withBundleAnalyzer(nextConfig);
