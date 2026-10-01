import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/scroll-animation",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;