/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // remove `eslint` completely
  transpilePackages: ['@mtaa/types', '@mtaa/config'],
  webpack(config, options) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  turbopack: {} // explicitly add this to avoid the Turbopack error
}

module.exports = nextConfig
