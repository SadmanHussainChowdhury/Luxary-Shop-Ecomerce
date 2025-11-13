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
  webpack: (config, { isServer }) => {
    // Handle optional dependencies (twilio, nodemailer) gracefully
    // These are optional server-side dependencies that may not be installed
    // The warning is harmless - the code handles missing modules gracefully at runtime
    if (isServer) {
      // Mark as external to prevent webpack from trying to bundle them
      // This suppresses the warning while still allowing require() to work if installed
      const originalExternals = config.externals || []
      config.externals = [
        ...(Array.isArray(originalExternals) ? originalExternals : [originalExternals]),
        function ({ request }, callback) {
          if (request === 'twilio' || request === 'nodemailer') {
            // Mark as external - webpack won't try to resolve it
            return callback(null, `commonjs ${request}`)
          }
          callback()
        },
      ]
    }
    return config
  },
};

export default nextConfig;


