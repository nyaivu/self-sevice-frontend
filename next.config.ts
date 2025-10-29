import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost", // <-- Replace this with your API's domain
        port: "8000", // Leave empty unless you use a specific port
        pathname: "/**", // Or be more specific, e.g., '/uploads/**'
      },
      {
        // 1. For your "via.placeholder.com" fallback
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
