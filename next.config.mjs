/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.zeebiz.com",
      },
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com", 
      },
    ],
  },
};

export default nextConfig;
