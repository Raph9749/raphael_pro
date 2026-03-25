/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: process.env.GITHUB_PAGES === "true" ? "/raphael_pro" : "",
  assetPrefix: process.env.GITHUB_PAGES === "true" ? "/raphael_pro/" : "",
  images: {
    unoptimized: true,
    domains: ["localhost", "api.raphael.pro"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
