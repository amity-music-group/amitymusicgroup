import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // The public Companies page moved to /labels, like UMG.
        // The old URL keeps working permanently.
        source: "/companies",
        destination: "/labels",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
