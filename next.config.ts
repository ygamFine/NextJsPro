import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // 启用静态导出
  // distDir: 'out', // 自定义输出目录
  trailingSlash: true, // 确保URL一致性
  images: {
    unoptimized: true,
    // domains: ['strong-harmony-39363ef403.media.strapiapp.com', 'strong-harmony-39363ef403.strapiapp.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      }
    ],
  },
};

export default nextConfig;
