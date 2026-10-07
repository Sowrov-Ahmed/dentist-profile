import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: false,
  outputFileTracingRoot: __dirname,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "www.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" }
    ]
  },
  async redirects() {
    return [
      { source: "/service", destination: "/services", permanent: true },
      { source: "/service-details", destination: "/services", permanent: true },
      { source: "/service-details/:slug", destination: "/services/:slug", permanent: true },
      { source: "/case-study", destination: "/case-studies", permanent: true },
      { source: "/case-details", destination: "/case-studies", permanent: true },
      { source: "/case-details/:slug", destination: "/case-studies/:slug", permanent: true },
      { source: "/blog-grid", destination: "/blog", permanent: true },
      { source: "/blog-details", destination: "/blog", permanent: true },
      { source: "/blog-details/:slug", destination: "/blog/:slug", permanent: true }
    ];
  }
};

export default nextConfig;
