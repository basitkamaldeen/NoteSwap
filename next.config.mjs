/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    turbo: {
      rules: { '*.ts': {}, '*.tsx': {} },
    },
  },
};

export default nextConfig;
