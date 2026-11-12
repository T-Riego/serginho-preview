import type { NextConfig } from "next";

const staticExport = process.env.NEXT_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: staticExport ? "export" : "standalone",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  trailingSlash: staticExport,
  images: { unoptimized: staticExport },
};

export default nextConfig;
