import type { NextConfig } from "next";
import path from "path";

const projectRoot = process.cwd();

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  webpack: (config) => {
    config.resolve.modules = [
      path.join(projectRoot, "node_modules"),
      ...(config.resolve.modules || []),
    ];
    return config;
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    '.space-z.ai',
    '.chatglm.site',
    'localhost',
  ],
};

export default nextConfig;
