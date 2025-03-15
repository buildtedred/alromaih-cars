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
        pathname: '/**',
      
      },
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com', 
        pathname: '/**',
      
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com', 
        pathname: '/**',
      
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com', 
        pathname: '/**',
      
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org', 
        pathname: '/**',
      
      },
      {
        protocol: 'https',
        hostname: 'ibb.co', 
        pathname: '/**',
      
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc', 
        pathname: '/**',
      
      },
      {
        protocol: 'https',
        hostname: 'lrwhopvhunjxwihtiwxn.supabase.co', 
        pathname: '/**',
      
      },

    ],
  },
};

module.exports = withNextIntl(nextConfig)
