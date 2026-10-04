import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Pin the workspace root. Without it Turbopack walks up past this repo
  // and picks up an unrelated lockfile from a parent directory.
  turbopack: { root: __dirname },

  poweredByHeader: false,

  images: {
    // AVIF first, WebP fallback. Cuts hero/gallery payload roughly in half
    // versus the JPEG/PNG originals.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 1920, 2560],
    imageSizes: [48, 64, 96, 128, 192, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "framerusercontent.com" },
    ],
  },

  experimental: {
    // Rewrites barrel imports to deep paths so a single icon does not pull
    // the whole package into the client bundle.
    optimizePackageImports: ["motion", "lucide-react"],
  },

  // mongoose/nodemailer are server-only; keep them out of the bundler graph.
  serverExternalPackages: ["mongoose", "nodemailer"],

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
