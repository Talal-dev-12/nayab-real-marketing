/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'images.unsplash.com',
      'res.cloudinary.com',   // Cloudinary CDN
      'ui-avatars.com',       // Agent avatar fallback
    ],
  },
};

module.exports = nextConfig;
