/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "cdn.zeebiz.com",
        },
      ],
    },
  };
  
export default nextConfig;
