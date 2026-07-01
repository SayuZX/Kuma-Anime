import { fetchJson } from "../http";
import { asArray } from "../normalize";
import { jaroWinklerDistance } from "@/hooks/jaro-winkler";

const BASE = (
  (typeof process !== "undefined" &&
    process.env &&
    process.env.NEXT_PUBLIC_STREAM_API_URL) ||
  "https://www.sankavollerei.web.id/anime"
).replace(/\/$/, "");

async function get(path) {
  const data = await fetchJson(`${BASE}${path}`, {
    where: "stream",
    timeout: 15000,
    retries: 1,
    cacheTtl: 5 * 60 * 1000,
  });
  if (!data || (data.statusCode && data.statusCode >= 400)) return null;
  return data.data ?? null;
}

function sanitizeQuery(title) {
  return String(title || "")
    .replace(/\((?:tv|movie|ova|ona|special)\)/gi, "")
    .replace(
      /\b(?:\d+(?:st|nd|rd|th)\s+season|season\s*\d+|part\s*\d+|cour\s*\d+)\b/gi,
      ""
    )
    .replace(/[:\-–—_.,!?"'’]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function queryVariants(title) {
  const base = sanitizeQuery(title);
  const words = base.split(/\s+/).filter(Boolean);
  return [base, words.slice(0, 4).join(" "), words.slice(0, 2).join(" ")].filter(
    (value, index, arr) => value && arr.indexOf(value) === index
  );
}

export async function searchByTitle(title) {
  if (!title) return null;
  const norm = title.trim().toLowerCase();
  for (const query of queryVariants(title)) {
    const data = await get(`/search/${encodeURIComponent(query)}`);
    const list = asArray(data?.animeList);
    if (!list.length) continue;
    let best = list[0];
    let score = -1;
    for (const item of list) {
      const s = jaroWinklerDistance(
        norm,
        String(item.title || "").toLowerCase()
      );
      if (s > score) {
        score = s;
        best = item;
      }
    }
    if (best?.animeId) return best.animeId;
  }
  return null;
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
