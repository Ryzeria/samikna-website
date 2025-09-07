/** @type {import('next').NextConfig} */

// Deployment Configuration
const isStaticExport = process.env.DEPLOY_TARGET === 'static';
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  
  // DEPLOYMENT OPTIONS:
  // Option 1: Static Export for Hostinger Shared Hosting (Uncomment below)
  // output: 'export',
  // trailingSlash: true,
  // distDir: 'out',
  
  // Option 2: Server-side with API routes (Default - requires VPS/Node.js hosting)
  ...(isStaticExport && {
    output: 'export',
    trailingSlash: true,
    distDir: 'out',
  }),

  // Environment variables (available on both client and server)
  env: {
    CUSTOM_KEY: isProduction ? 'samikna-production' : 'samikna-development',
    
    // For static export, these won't be used for API routes
    // Instead, point to external API server
    DB_HOST: process.env.DB_HOST || 'srv566.hstgr.io',
    DB_PORT: process.env.DB_PORT || '3306',
    DB_NAME: process.env.DB_NAME || 'u722506862_samikna',
    DB_USER: process.env.DB_USER || 'u722506862_samikna',
    DB_PASS: process.env.DB_PASS || 'S@m1Kn4!',
    
    // API endpoint for static builds
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 
      (isProduction ? 'https://samikna-api.vercel.app' : 'http://localhost:3000'),
    
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://samikna.id',
    JWT_SECRET: process.env.JWT_SECRET || 'samikna-jwt-secret-2024',
  },

  // Public environment variables (accessible in browser)
  publicRuntimeConfig: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://samikna.id',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 
      (isProduction ? 'https://samikna-api.vercel.app' : 'http://localhost:3000'),
  },

  // Headers configuration (only works with server-side rendering)
  ...(!isStaticExport && {
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: isProduction ? 'https://samikna.id' : '*',
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET, POST, PUT, DELETE, OPTIONS',
            },
            {
              key: 'Access-Control-Allow-Headers',
              value: 'Content-Type, Authorization',
            },
          ],
        },
        // Cache static assets
        {
          source: '/_next/static/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ];
    },
  }),

  // Image optimization
  images: {
    unoptimized: isStaticExport || isProduction, // Always unoptimized for static export
    domains: [
      'localhost',
      'samikna.id',
      'www.samikna.id',
      'images.unsplash.com',
      'via.placeholder.com',
      'earthengine.google.com',
      'ee-samikna.projects.earthengine.app'
    ],
    formats: ['image/webp', 'image/avif'],
    // For static export, disable image optimization
    ...(isStaticExport && {
      loader: 'custom',
      loaderFile: './lib/imageLoader.js'
    }),
  },

  // Webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Handle client-side fallbacks for static export
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }

    // Optimize bundle size
    if (!dev && isProduction) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }

    return config;
  },

  // Server external packages (only for server-side builds)
  ...(!isStaticExport && {
    serverExternalPackages: ['mysql2', 'bcryptjs', 'jsonwebtoken'],
  }),

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Generate build ID
  generateBuildId: async () => {
    return `samikna-${new Date().getTime()}`;
  },

  // Page extensions
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],

  // Experimental features for Next.js 15
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    // Remove features that don't work with static export
    ...(!isStaticExport && {
      instrumentationHook: true,
    }),
  },

  // Compiler options
  compiler: {
    removeConsole: isProduction,
    reactRemoveProperties: isProduction,
  },

  // Static file serving
  assetPrefix: isProduction ? process.env.CDN_URL || '' : '',
  
  // Base path (useful if hosting in subdirectory)
  basePath: process.env.BASE_PATH || '',

  // Build configuration
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  },

  typescript: {
    ignoreBuildErrors: isProduction, // Ignore TypeScript errors in production build
  },

  // Redirects (only works with server-side rendering)
  ...(!isStaticExport && {
    async redirects() {
      return [
        {
          source: '/home',
          destination: '/',
          permanent: true,
        },
        {
          source: '/admin',
          destination: '/dashboard',
          permanent: true,
        },
      ];
    },
  }),

  // Rewrites for client-side routing in static export
  ...(isStaticExport && {
    async rewrites() {
      return {
        fallback: [
          {
            source: '/:path*',
            destination: '/404.html',
          },
        ],
      };
    },
  }),
};

module.exports = nextConfig;