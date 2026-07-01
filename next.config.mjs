/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Hosts for every data source the app pulls images from.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.myanimelist.net" }, // Jikan / MAL
      { protocol: "https", hostname: "s4.anilist.co" }, // AniList
      { protocol: "https", hostname: "media.kitsu.app" }, // Kitsu
      { protocol: "https", hostname: "media.kitsu.io" }, // Kitsu (legacy)
      { protocol: "https", hostname: "uploads.mangadex.org" }, // MangaDex covers + pages
      { protocol: "https", hostname: "cdn.noitatnemucod.net" }, // bundled fallback posters
      { protocol: "https", hostname: "img.youtube.com" }, // trailer thumbnails
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
