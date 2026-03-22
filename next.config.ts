import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['ali-oss', 'urllib', 'proxy-agent'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'love-menu.oss-cn-chengdu.aliyuncs.com',
      },
      {
        protocol: 'http',
        hostname: 'love-menu.oss-cn-chengdu.aliyuncs.com',
      },
    ],
  },
};

export default nextConfig;
