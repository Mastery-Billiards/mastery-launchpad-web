import type { NextConfig } from 'next'

const envVars = {
  HOST: 'http://103.90.226.218:8080',
}

const nextConfig: NextConfig = {
  env: envVars,
  reactStrictMode: true,
  serverRuntimeConfig: {
    mySecret: envVars.HOST,
  },
}

export default nextConfig
