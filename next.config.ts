import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    if (process.env.NODE_ENV === "development") {
      config.module.rules.push({
        test: /\.(jsx|tsx)$/,
        exclude: /node_modules/,
        enforce: "pre",
        use: "@dyad-sh/nextjs-webpack-component-tagger",
      });
    }
    return config;
  },
  async redirects() {
    return [
      // Phase 2: Library migration
      {
        source: '/library',
        destination: '/my-study',
        permanent: true, // HTTP 308
      },
      {
        source: '/library/notes',
        destination: '/my-study/notes',
        permanent: true, // HTTP 308
      },
      // Phase 2: Topics migration
      {
        source: '/explore/topics',
        destination: '/topics',
        permanent: true, // HTTP 308
      },
      {
        source: '/explore/topics/:slug',
        destination: '/topics/:slug',
        permanent: true, // HTTP 308
      },
      // Final IA: Study Journeys migration
      {
        source: '/study-journeys',
        destination: '/learn/journeys',
        permanent: true, // HTTP 308
      },
      {
        source: '/study-journeys/:slug',
        destination: '/learn/journeys/:slug',
        permanent: true, // HTTP 308
      },
      // Final IA: Discover migration
      {
        source: '/discover',
        destination: '/explore',
        permanent: true, // HTTP 308
      },
    ];
  },
};

export default nextConfig;
