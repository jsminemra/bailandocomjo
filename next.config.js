/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ← IGNORA ERROS DE ESLINT NO BUILD
  },
};

module.exports = nextConfig;