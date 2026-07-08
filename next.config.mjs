/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { cpus: 4 },
  typescript: {
    // Preserved from the existing project; TypeScript is validated separately with `tsc --noEmit`.
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Keep mixed Python/ML/GIS assets in the repository, but do not trace them into Next.js server output.
  outputFileTracingExcludes: {
    '/*': [
      './models/**/*',
      './geojson/**/*',
      './pages/**/*.py',
      './src/**/*.py',
      './utils/**/*.py',
      './app.py',
    ],
  },
}

export default nextConfig
