import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Registration/profile forms can include a ~1MB profile photo plus
      // other fields and multipart overhead.
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
