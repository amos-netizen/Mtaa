/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mtaa/types', '@mtaa/config'],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
  eslint: {
    // Allow production builds even with ESLint warnings (console.log statements)
    ignoreDuringBuilds: true,
  },
  output: 'standalone', // For Docker deployment
};

module.exports = nextConfig;



