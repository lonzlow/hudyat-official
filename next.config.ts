import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // CMS image uploads (5 MB max, checked in src/lib/supabase/upload.ts) arrive as server action bodies.
  experimental: {
    serverActions: { bodySizeLimit: "6mb" },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wilbmjjlzgcywjltfcku.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
