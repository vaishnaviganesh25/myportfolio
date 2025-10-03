/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  distDir: "out",
  images: {
    unoptimized: true,
  },
  // Disable server-side features for static export
  experimental: {
    // Keep empty for compatibility
  },
};

module.exports = nextConfig;
