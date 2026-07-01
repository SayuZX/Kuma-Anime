/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.myanimelist.net" },
      { protocol: "https", hostname: "s4.anilist.co" },
      { protocol: "https", hostname: "media.kitsu.app" },
      { protocol: "https", hostname: "media.kitsu.io" },
      { protocol: "https", hostname: "uploads.mangadex.org" },
      { protocol: "https", hostname: "cdn.noitatnemucod.net" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/privacy", destination: "/legal/privacy-policy", permanent: true },
      { source: "/terms", destination: "/legal/terms-of-service", permanent: true },
      { source: "/copyright", destination: "/legal/copyright", permanent: true },
      { source: "/dmca", destination: "/legal/dmca", permanent: true },
      { source: "/disclaimer", destination: "/legal/disclaimer", permanent: true },
      { source: "/about", destination: "/legal/about", permanent: true },
      { source: "/contact", destination: "/legal/contact", permanent: true },
    ];
  },
};

export default nextConfig;
