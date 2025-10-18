const nextConfig = {
  images: {
    domains: ['cdn.secilstore.com', 'api.secilstore.com'],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.secilstore.com',
      },
    ],
  },
}

export default nextConfig
