/** @type {import('next').NextConfig} */

const envVars = {
  HOST: 'https://14.225.206.52',
}

const nextConfig = {
  env: envVars,
  reactStrictMode: true,
  serverRuntimeConfig: {
    mySecret: envVars.HOST,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
