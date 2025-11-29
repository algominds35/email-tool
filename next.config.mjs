/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Disable webpack cache to save disk space
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};

export default nextConfig;

