/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  compiler: {
    removeConsole: {
      exclude: ['error', 'warn']
    }
  },
  output: 'standalone',
}

export default nextConfig