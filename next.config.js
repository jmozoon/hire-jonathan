/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/hire-jonathan' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/hire-jonathan' : '',
  images: {
    unoptimized: true,
  },
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  trailingSlash: true,
}

module.exports = nextConfig;
