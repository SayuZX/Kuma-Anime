import { fetchJson } from "../http";
import { asArray } from "../normalize";
import { jaroWinklerDistance } from "@/hooks/jaro-winkler";

const enc = encodeURIComponent;

const ENV_BASE =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.NEXT_PUBLIC_STREAM_API_URL) ||
  "";

function groupQualities(qualities) {
  return asArray(qualities)
    .map((quality) => ({
      resolution: quality.title,
      servers: asArray(quality.serverList).map((server) => ({
        name: server.title,
        serverId: server.serverId,
      })),
    }))
    .filter((group) => group.servers.length);
}

const OTAKU_SHAPE = {
  mapSearch: (j) =>
    asArray(j?.data?.animeList).map((a) => ({
      animeId: a.animeId,
      title: a.title,
    })),
  mapEpisodes: (j) =>
    asArray(j?.data?.episodeList).map((e) => ({
      episodeId: e.episodeId,
      title: e.title,
    })),
  mapEpisode: (j) => ({
    embedUrl: j?.data?.defaultStreamingUrl || "",
    qualities: groupQualities(j?.data?.server?.qualities),
  }),
  mapServer: (j) => j?.data?.url || "",
};

const SANKA = {
  name: "sanka",
  base: "https://www.sankavollerei.web.id/anime",
  searchPath: (q) => `/search/${enc(q)}`,
  detailPath: (s) => `/anime/${s}`,
  episodePath: (s) => `/episode/${s}`,
  serverPath: (id) => `/server/${id}`,
  ...OTAKU_SHAPE,
};

const WAJIK = {
  name: "wajik",
  base: "https://wajik-anime-api.vercel.app",
  searchPath: (q) => `/otakudesu/search?q=${enc(q)}`,
  detailPath: (s) => `/otakudesu/anime/${s}`,
  episodePath: (s) => `/otakudesu/episode/${s}`,
  serverPath: (id) => `/otakudesu/server/${id}`,
  ...OTAKU_SHAPE,
};

const ONEPUNYA = {
  name: "onepunya",
  base: "https://onepunya.qzz.io",
  searchPath: (q) => `/v1/search/${enc(q)}`,
  detailPath: (s) => `/v1/anime/${s}`,
  episodePath: (s) => `/v1/episode/${s}`,
  serverPath: null,
  mapSearch: (j) => {
    const root = j?.data ?? j?.results ?? j;
    const list = Array.isArray(root) ? root : asArray(root?.anime ?? root?.animeList);
    return list.map((a) => ({ animeId: a.slug ?? a.animeId, title: a.title }));
  },
  mapEpisodes: (j) => {
    const d = j?.data ?? j;
    return asArray(d?.episode_lists ?? d?.episodes ?? d?.episodeList).map((e) => ({
      episodeId: e.slug ?? e.episodeId,
      title: e.episode ?? e.title,
    }));
  },
  mapEpisode: (j) => {
    const d = j?.data ?? j;
    return {
      embedUrl: d?.stream_url ?? d?.streaming_url ?? d?.defaultStreamingUrl ?? "",
      qualities: [],
    };
  },
  mapServer: () => "",
};

const PROVIDERS = ENV_BASE
  ? [{ ...SANKA, name: "custom", base: ENV_BASE.replace(/\/$/, "") }]
  : [SANKA, ONEPUNYA, WAJIK];

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
  const j = await fetchJson(url, {
    where: "stream",
    timeout: 15000,
    retries: 1,
    cacheTtl: 5 * 60 * 1000,
  });
  if (!j || (j.statusCode && j.statusCode >= 400)) return null;
  return j;
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
    const j = await callJson(provider.base + provider.searchPath(query));
    const list = provider.mapSearch(j).filter((a) => a.animeId);
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
  const j = await callJson(provider.base + provider.detailPath(animeId));
  const eps = provider.mapEpisodes(j).filter((e) => e.episodeId);
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
  const j = await callJson(provider.base + provider.episodePath(id));
  if (!j) return { embedUrl: "", servers: [] };
  const { embedUrl, qualities } = provider.mapEpisode(j);
  return {
    embedUrl,
    qualities: asArray(qualities).map((group) => ({
      resolution: group.resolution,
      servers: asArray(group.servers).map((s) => ({
        ...s,
        serverId: `${provider.name}:${s.serverId}`,
      })),
    })),
  };
}

export async function getServerEmbed(taggedServerId) {
  const { provider, id } = splitTag(taggedServerId);
  if (!provider.serverPath) return "";
  const j = await callJson(provider.base + provider.serverPath(id));
  return provider.mapServer(j);
}
