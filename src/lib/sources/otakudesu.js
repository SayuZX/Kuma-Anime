import { fetchJson } from "../http";
import { asArray } from "../normalize";
import { jaroWinklerDistance } from "@/hooks/jaro-winkler";

const BASE = (
  (typeof process !== "undefined" &&
    process.env &&
    process.env.NEXT_PUBLIC_STREAM_API_URL) ||
  "https://wajik-anime-api.vercel.app"
).replace(/\/$/, "");

async function get(path) {
  const data = await fetchJson(`${BASE}/otakudesu${path}`, {
    where: "otakudesu",
    timeout: 15000,
    retries: 2,
    cacheTtl: 5 * 60 * 1000,
  });
  if (!data || (data.statusCode && data.statusCode >= 400)) return null;
  return data.data ?? null;
}

export async function searchByTitle(title) {
  if (!title) return null;
  const data = await get(`/search?q=${encodeURIComponent(title)}`);
  const list = asArray(data?.animeList);
  if (!list.length) return null;
  const norm = title.trim().toLowerCase();
  let best = list[0];
  let score = -1;
  for (const item of list) {
    const s = jaroWinklerDistance(norm, String(item.title || "").toLowerCase());
    if (s > score) {
      score = s;
      best = item;
    }
  }
  return best?.animeId || null;
}

export async function getEpisodes(animeId, poster = "") {
  const data = await get(`/anime/${animeId}`);
  const eps = asArray(data?.episodeList);
  return eps
    .slice()
    .reverse()
    .map((ep, index) => ({
      episodeId: ep.episodeId,
      number: index + 1,
      title: ep.title || `Episode ${index + 1}`,
      image: poster,
    }));
}

export async function getEpisodeEmbed(episodeId) {
  const data = await get(`/episode/${episodeId}`);
  if (!data) return { embedUrl: "", servers: [] };
  const servers = [];
  asArray(data.server?.qualities).forEach((quality) => {
    asArray(quality.serverList).forEach((server) => {
      servers.push({
        quality: quality.title,
        name: server.title,
        serverId: server.serverId,
      });
    });
  });
  return { embedUrl: data.defaultStreamingUrl || "", servers };
}

export async function getServerEmbed(serverId) {
  const data = await get(`/server/${serverId}`);
  return data?.url || "";
}
