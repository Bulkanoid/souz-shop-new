import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'souz-shop.ru',
        port: '',
        pathname: '/wp-content/uploads/product/2011/Lambre-05.jpg',
        search: '',
      },
    ],
  },
};

export default nextConfig;
