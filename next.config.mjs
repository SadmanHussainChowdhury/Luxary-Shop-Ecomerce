/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'files.stripe.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ],
    unoptimized: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  // Optimize for Vercel
  poweredByHeader: false,
};

export default nextConfig;


