/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.fallback = { fs: false, path: false, os: false, crypto: false };
    return config;
  },
};

export default nextConfig;
