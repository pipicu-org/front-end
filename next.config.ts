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
        // destination: "https://api.pipicucu.vmdigitai.com/api/:path*",
        destination: "https://preview-pipicucuapi-backend-qrp2oh-unljxj-31-97-92-203.traefik.me/api/:path"
      },
    ];
  },
};

export default nextConfig;