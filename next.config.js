/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();

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
      },
      {
        protocol: 'https',
        hostname: 'iili.io', // Add this line for iili.io
        pathname: '/**', // Match all paths under iili.io
      
      },
      {
        protocol: 'https',
        hostname: 'alromaihcars.com', 
        pathname: '/**',
      
      },
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com', 
        pathname: '/**',
      
      },

    ],
  },
};

module.exports = withNextIntl(nextConfig)
