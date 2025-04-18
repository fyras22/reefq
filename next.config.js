/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['three'],
  // App Router does not support the i18n config in next.config.js
  // Instead, use the middleware-based approach
  
  // Production deployment settings
  output: 'standalone',
  
  // Configure API routes and server components
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
    // Improved API route handling
    appDir: true,
    serverActions: true,
  },
  
  // Image configuration for deployment
  images: {
    domains: ['reefq.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
    ],
  },
}

module.exports = nextConfig 