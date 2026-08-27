/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: '/shop',
        destination: '/decorations',
        permanent: true,
      },
      {
        source: '/shop/:slug*',
        destination: '/decorations/:slug*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
// Force Next.js dev server restart
