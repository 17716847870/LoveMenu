import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["ali-oss", "urllib", "proxy-agent"],
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "love-menu.oss-cn-chengdu.aliyuncs.com",
      },
      {
        protocol: "http",
        hostname: "love-menu.oss-cn-chengdu.aliyuncs.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },
};

export default nextConfig;
