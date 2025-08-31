import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.pipicucu.vmdigitai.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;