/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['mongose']
  },
  swcMinify: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com'
      },
      {
        protocol: 'https',
        hostname: 'img.clrek.dev'
      },
      {
        protocol: 'https',
        hostname: 'img.clrek.com'
      },
      {
        protocol: 'https',
        hostname: 'uploadthing.co'
      },
      {
        protocol: 'https',
        hostname: 'placehold.co'
      },
    ]
  }
}

module.exports = nextConfig
