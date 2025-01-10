/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'iili.io',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'images.unsplash.com',
            pathname: '/**',
          },
          {
            protocol: 'http', // Use http as you are running on localhost
            hostname: 'localhost',
            port: '8069', // Specify the port here
            pathname: '/web/image/**', // Ensure the pattern matches the image path
          },
        ],
      },
};

export default nextConfig;
