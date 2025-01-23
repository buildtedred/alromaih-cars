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
<<<<<<< HEAD
        hostname: 'iili.io',
=======
        hostname: 'images.unsplash.com',
        pathname: '/photo-**',
      },
      {
        protocol: 'https',
        hostname: 'iili.io', // Add this line for iili.io
        pathname: '/**', // Match all paths under iili.io
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
>>>>>>> 953d5cd913c4e2c9ab0c3c2a205de1f8bcfca7c0
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
