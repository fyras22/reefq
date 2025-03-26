/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['three'],
  // App Router does not support the i18n config in next.config.js
  // Instead, use the middleware-based approach
}

module.exports = nextConfig 