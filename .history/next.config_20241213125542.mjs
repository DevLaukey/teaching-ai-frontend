/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://eduai-rsjn.onrender.com/:path*",
      },
    ];
  },
};

export default nextConfig;
