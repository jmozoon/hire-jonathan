/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/hire-jonathan',
  assetPrefix: '/hire-jonathan',
  images: {
    unoptimized: true,
  },
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  trailingSlash: true,
}

module.exports = nextConfig;
