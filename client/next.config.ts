import { NextConfig } from 'next'
 
const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
    ],
    domains: ['localhost'],
    unoptimized: true, // Desactivar la optimización de imágenes temporalmente
  },
}
 
export default config