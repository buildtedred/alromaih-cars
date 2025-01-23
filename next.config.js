/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xn--mgbml9eg4a.com',
        pathname: '/web/image/**',
      },
      {
        protocol: 'https',
        hostname: 'xn--mgbml9eg4a.com',
        pathname: '/web/content/**',
      },
      {
        protocol: 'https',
        hostname: 'iili.io',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
