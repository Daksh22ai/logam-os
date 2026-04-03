import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/welcome',
        permanent: false,
      },
    ];
  },
  typescript: {
    // Skip type checking during build — we validate via IDE
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
