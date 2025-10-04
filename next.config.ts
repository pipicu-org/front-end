import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
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