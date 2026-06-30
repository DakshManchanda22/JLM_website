/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
    // The Bigen logo is an SVG served from Sanity. next/image refuses to serve
    // remote SVGs unless explicitly allowed; the CSP sandboxes it so it can't
    // execute scripts. Only our trusted Sanity CDN is in remotePatterns.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default nextConfig
