import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      // Allow scripts from same origin, inline (required by Next.js hydration/font),
      // and eval (required by some Next.js internals in dev/prod)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com",
      // Allow styles from same origin and inline (CSS-in-JS / Next.js font injection)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Allow fonts from Google Fonts CDN
      "font-src 'self' https://fonts.gstatic.com",
      // Allow images from anywhere (matches your remotePatterns)
      "img-src 'self' data: blob: https:",
      // Allow connections to your API, Stripe, and WebSocket for HMR
      "connect-src 'self' https://wordsquaresbackend.nextbusinesssolution.com https://api.emailjs.com https://api.stripe.com wss:",
      // Allow iframes for Stripe Checkout
      "frame-src 'self' https://js.stripe.com https://checkout.stripe.com https://hooks.stripe.com",
      // Allow media from same origin
      "media-src 'self'",
      // Only allow same-origin as base URI
      "base-uri 'self'",
      // Disallow form submissions to external URLs
      "form-action 'self'",
    ].join("; "),
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  reactStrictMode: true,

  // IMPORTANT: ensure routes don't break
  trailingSlash: false,

  experimental: {
    // optimizePackageImports: ["react-icons"],
  },

  // Attach security headers to all routes (only applies when NOT using static export)
  ...(process.env.NEXT_STATIC_EXPORT !== 'true'
    ? {
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: securityHeaders,
            },
          ];
        },
      }
    : {}),

  ...(process.env.NEXT_STATIC_EXPORT === 'true'
    ? { output: 'export', distDir: 'out' }
    : {}),
};

export default nextConfig;


//import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   // Allow images from external sources
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "**",
//       },
//     ],
//   },

//   // Strict mode for better development
//   reactStrictMode: true,

//   // Subdirectory/client routes: accept both /path and /path/ so direct links and refresh work
//   skipTrailingSlashRedirect: true,

//   // Experimental
//   experimental: {
//     // optimizePackageImports: ["react-icons"],
//   },

//   // Enable static export only when building for unified deployment (e.g., Hostinger)
//   ...(process.env.NEXT_STATIC_EXPORT === 'true' ? { output: 'export', distDir: 'out' } : {}),
// };

// export default nextConfig;
