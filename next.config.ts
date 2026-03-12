import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/s2/favicons**',
      },
    ],
  },
  experimental: {
    // Disable static generation for problematic pages
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
