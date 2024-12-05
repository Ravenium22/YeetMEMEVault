/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      unoptimized: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    // Allow uploading files
    api: {
      bodyParser: {
        sizeLimit: '10mb',
      },
    },
  }
  
  module.exports = nextConfig