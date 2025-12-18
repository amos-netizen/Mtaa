/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // remove `eslint` completely
  transpilePackages: ['@mtaa/types', '@mtaa/config'],
  webpack(config, options) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  turbopack: {}, // explicitly add this to avoid the Turbopack error
  // Disable static optimization for search page
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig
