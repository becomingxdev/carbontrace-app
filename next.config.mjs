/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Docker multi-stage builds — emits a self-contained
  // server bundle under .next/standalone instead of requiring node_modules
  output: 'standalone',
};

export default nextConfig;
