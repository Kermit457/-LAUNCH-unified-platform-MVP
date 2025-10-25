const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
})

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/7.x/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'development'
              ? "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://auth.privy.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*; frame-src 'self' https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org;"
              : "default-src 'self'; script-src 'self' 'unsafe-inline' https://auth.privy.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*; frame-src 'self' https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org;",
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Handle Solana packages for browser compatibility
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };

      // Aggressive code splitting for performance
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          // Privy authentication library
          privy: {
            test: /[\\/]node_modules[\\/]@privy-io/,
            name: 'privy',
            priority: 20,
            reuseExistingChunk: true,
          },
          // Reown/WalletConnect (6.6MB bloat)
          reown: {
            test: /[\\/]node_modules[\\/](@reown|@walletconnect)/,
            name: 'reown',
            priority: 20,
            reuseExistingChunk: true,
          },
          // Solana dependencies
          solana: {
            test: /[\\/]node_modules[\\/](@solana|@coral-xyz|@pump-fun)/,
            name: 'solana',
            priority: 15,
            reuseExistingChunk: true,
          },
          // UI libraries - split framer-motion separately (heavy)
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion/,
            name: 'framer',
            priority: 12,
            reuseExistingChunk: true,
          },
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|recharts)/,
            name: 'ui',
            priority: 10,
            reuseExistingChunk: true,
          },
          // Lucide icons - separate chunk
          icons: {
            test: /[\\/]node_modules[\\/]lucide-react/,
            name: 'icons',
            priority: 11,
            reuseExistingChunk: true,
          },
          // Generic vendor chunks
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };

      // Performance budgets
      config.performance = {
        maxAssetSize: 512000,      // 512KB per asset (realistic for chunks)
        maxEntrypointSize: 512000, // 512KB total entry
        hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
      };
    }

    return config;
  },
  // Optimize package imports
  experimental: {
    optimizePackageImports: ['@privy-io/react-auth', 'lucide-react'],
  },
};

module.exports = withBundleAnalyzer(withPWA(nextConfig));
