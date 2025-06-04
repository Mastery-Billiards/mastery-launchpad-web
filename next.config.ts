/** @type {import('next').NextConfig} */

const envVars = {
  HOST: 'https://14.225.206.52:443',
}

const nextConfig = {
  env: envVars,
  reactStrictMode: true,
  serverRuntimeConfig: {
    mySecret: envVars.HOST,
  },
  experimental: {
    serverActions: true,
    appDir: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
