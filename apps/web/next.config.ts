import type { NextConfig } from "next";

const useWindowsBuildWorkarounds = process.platform === "win32";

const nextConfig: NextConfig = {
  transpilePackages: ["@vantanova/shared"],
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: useWindowsBuildWorkarounds
  },
  ...(useWindowsBuildWorkarounds
    ? {
        experimental: {
          cpus: 1,
          workerThreads: true
        }
      }
    : {}),
  images: {
    formats: ["image/avif", "image/webp"]
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://vercel.app/:path*"
      }
    ];
  }
};

export default nextConfig;
