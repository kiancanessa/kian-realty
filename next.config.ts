import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Fotos de las agencias aliadas (ver app/lib/bolsa): las sirve su dueña.
      {
        protocol: "https",
        hostname: "www.jaramesgroup.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lemusrealty.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.easybroker.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
