/** @type {import('next').NextConfig} */
const nextConfig = {
  // remove `eslint` completely
  webpack(config, options) {
    return config
  },
  turbopack: {} // explicitly add this to avoid the Turbopack error
}

module.exports = nextConfig
