import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/harmony_family',
  assetPrefix: '/harmony_family',
  images: { unoptimized: true },
};

export default nextConfig;
