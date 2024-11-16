import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpg|gif)$/i,
      use: {
        loader: 'url-loader',
      },
    });
    return config;
  },
};

export default nextConfig;
