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
        hostname: 'images.unsplash.com',
        pathname: '/photo-**',
<<<<<<< HEAD
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
=======
      },
      {
        protocol: 'https',
        hostname: 'iili.io', // Add this line for iili.io
        pathname: '/**', // Match all paths under iili.io
      
      },

>>>>>>> origin/ubaidbranch
    ],
  },
};

module.exports = nextConfig;
