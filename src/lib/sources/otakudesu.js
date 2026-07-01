import { fetchJson } from "../http";
import { asArray } from "../normalize";
import { jaroWinklerDistance } from "@/hooks/jaro-winkler";

const ENV_BASE =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.NEXT_PUBLIC_STREAM_API_URL) ||
  "";

const PROVIDERS = ENV_BASE
  ? [
      {
        name: "custom",
        base: ENV_BASE.replace(/\/$/, ""),
        search: (q) => `/search/${encodeURIComponent(q)}`,
        detail: (id) => `/anime/${id}`,
        episode: (id) => `/episode/${id}`,
        server: (id) => `/server/${id}`,
      },
    ]
  : [
      {
        name: "sanka",
        base: "https://www.sankavollerei.web.id/anime",
        search: (q) => `/search/${encodeURIComponent(q)}`,
        detail: (id) => `/anime/${id}`,
        episode: (id) => `/episode/${id}`,
        server: (id) => `/server/${id}`,
      },
      {
        name: "wajik",
        base: "https://wajik-anime-api.vercel.app",
        search: (q) => `/otakudesu/search?q=${encodeURIComponent(q)}`,
        detail: (id) => `/otakudesu/anime/${id}`,
        episode: (id) => `/otakudesu/episode/${id}`,
        server: (id) => `/otakudesu/server/${id}`,
      },
    ];

function providerByName(name) {
  return PROVIDERS.find((p) => p.name === name) || PROVIDERS[0];
}

function splitTag(tagged) {
  const raw = String(tagged || "");
  const idx = raw.indexOf(":");
  if (idx <= 0) return { provider: providerByName(), id: raw };
  return { provider: providerByName(raw.slice(0, idx)), id: raw.slice(idx + 1) };
}

async function callJson(url) {
  const data = await fetchJson(url, {
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

async function searchOne(provider, title, norm) {
  for (const query of queryVariants(title)) {
    const data = await callJson(provider.base + provider.search(query));
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

async function episodesOne(provider, animeId, poster) {
  const data = await callJson(provider.base + provider.detail(animeId));
  const eps = asArray(data?.episodeList);
  return eps
    .slice()
    .reverse()
    .map((ep, index) => ({
      episodeId: `${provider.name}:${ep.episodeId}`,
      number: index + 1,
      title: ep.title || `Episode ${index + 1}`,
      image: poster,
    }));
}

export async function getAnimeEpisodes(title, poster = "") {
  if (!title) return { episodes: [] };
  const norm = title.trim().toLowerCase();
  for (const provider of PROVIDERS) {
    const animeId = await searchOne(provider, title, norm);
    if (!animeId) continue;
    const episodes = await episodesOne(provider, animeId, poster);
    if (episodes.length) return { episodes };
  }
  return { episodes: [] };
}

export async function getEpisodeEmbed(taggedEpisodeId) {
  const { provider, id } = splitTag(taggedEpisodeId);
  const data = await callJson(provider.base + provider.episode(id));
  if (!data) return { embedUrl: "", servers: [] };
  const servers = [];
  asArray(data.server?.qualities).forEach((quality) => {
    asArray(quality.serverList).forEach((server) => {
      servers.push({
        quality: quality.title,
        name: server.title,
        serverId: `${provider.name}:${server.serverId}`,
      });
    });
  });
  return { embedUrl: data.defaultStreamingUrl || "", servers };
}

export async function getServerEmbed(taggedServerId) {
  const { provider, id } = splitTag(taggedServerId);
  const data = await callJson(provider.base + provider.server(id));
  return data?.url || "";
}
