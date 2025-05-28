/** @type {import('next').NextConfig} */

const envVars = {
  HOST: 'http://103.90.226.218:8080',
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
