/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@export-hub/remotion", "@remotion/player", "remotion"],
  experimental: {
    serverComponentsExternalPackages: ["@anthropic-ai/sdk", "@export-hub/agents"],
  },
  webpack: (config) => {
    // TypeScript kaynak dosyaları .js uzantılı import kullanır — webpack'e .ts/.tsx de dene
    config.resolve.extensionAlias = {
      ".js": [".js", ".ts", ".tsx"],
      ".jsx": [".jsx", ".tsx"],
    };
    return config;
  },
};

export default nextConfig;
