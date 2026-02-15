import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: false, // 已修复，恢复 ESLint 检查
  },
  images: {
    // 允许从 API 路由加载图片
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/static/**',
      },
      {
        protocol: 'https',
        hostname: 'kiki-luo.com', // 替换为你的实际域名
        pathname: '/api/static/**',
      },
    ],
    // 优化配置
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
