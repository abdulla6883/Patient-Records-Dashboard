import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    unoptimized: true,
    loader: "default",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fedskillstest.ct.digital',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'fedskillstest.coalitiontechnologies.workers.dev',
      },
      {
        protocol: 'https',
        hostname: 'avatar.iran.liara.run',
      },
    ],
  },
};

export default nextConfig;
