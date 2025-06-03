/** @type {import('next').NextConfig} */

const envVars = {
  HOST: 'http://14.225.206.52:8080',
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
}

export default nextConfig
