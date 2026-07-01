import { SITE, LEGAL_LINKS } from "@/lib/legalContent";

export default function sitemap() {
  const now = new Date();
  const main = [
    { path: "", priority: 1, changeFrequency: "daily" },
    { path: "/pages/Anime", priority: 0.9, changeFrequency: "daily" },
    { path: "/pages/Manga", priority: 0.9, changeFrequency: "daily" },
    { path: "/pages/settings", priority: 0.4, changeFrequency: "monthly" },
  ].map((route) => ({
    url: `${SITE.url}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const legal = LEGAL_LINKS.map((link) => ({
    url: `${SITE.url}/legal/${link.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [...main, ...legal];
}
