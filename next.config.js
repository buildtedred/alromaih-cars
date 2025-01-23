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
        pathname: '/**',
      },
=======
        hostname: 'images.unsplash.com',
        pathname: '/photo-**',
      },
      {
        protocol: 'https',
        hostname: 'iili.io', // Add this line for iili.io
        pathname: '/**', // Match all paths under iili.io
        hostname: 'iili.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
>>>>>>> 071443a1a1edf0e45e5c6d95bdeb4044c33c976c
    ],
  },
};

module.exports = nextConfig;
