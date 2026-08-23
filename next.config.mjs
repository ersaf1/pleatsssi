/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 400, 480, 600],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.charleskeith.co.id",
      },
      {
        protocol: "https",
        hostname: "lkiaakfodasgkqpgfhno.supabase.co",
      },
    ],
  },
};

export default nextConfig;
