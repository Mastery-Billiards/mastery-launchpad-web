/** @type {import('next').NextConfig} */

const envVars = {
  HOST: 'http://14.225.206.52:8080',
}

const nextConfig = {
  output: 'export',
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
