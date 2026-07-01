import { fetchJson } from "../http";
import { asArray } from "../normalize";
import { jaroWinklerDistance } from "@/hooks/jaro-winkler";

const enc = encodeURIComponent;

const ENV_BASE =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.NEXT_PUBLIC_STREAM_API_URL) ||
  "";

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

const AVOID_DEFAULT =
  /pixeldrain|short\.ink|short\.icu|vidhide|callistanise|bestx|helvid/i;

function proxify(url) {
  const u = String(url || "");
  const px = u.match(/pixeldrain\.com\/u\/([a-zA-Z0-9]+)/i);
  if (px) {
    return `/api/stream?url=${enc(`https://pixeldrain.com/api/file/${px[1]}`)}`;
  }
  return u;
}

function groupAnimasuStreams(streams) {
  const groups = {};
  asArray(streams).forEach((s) => {
    const res = (String(s.name || "").match(/(\d{3,4}p)/) || [])[1] || "Default";
    (groups[res] = groups[res] || []).push({
      name: s.name || res,
      serverId: enc(proxify(s.url)),
    });
  });
  return Object.entries(groups).map(([resolution, servers]) => ({
    resolution,
    servers,
  }));
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

const ANIKOTO = {
  name: "anikoto",
  base: "https://anikotoapi.site",
  reverseEpisodes: false,
  serverPath: null,
  detailPath: (id) => `/series/${id}`,
  customSearch: async (provider, title, norm) => {
    let best = null;
    let score = 0.72;
    for (const page of [1, 2]) {
      const j = await callJson(`${provider.base}/recent-anime?page=${page}`);
      const list = asArray(j?.data);
      if (!list.length) break;
      for (const item of list) {
        const candidates = [item.title, item.alternative, ...asArray(item.titles)]
          .filter(Boolean)
          .map((c) => String(c).toLowerCase());
        for (const c of candidates) {
          const s = jaroWinklerDistance(norm, c);
          if (s > score) {
            score = s;
            best = item;
          }
        }
      }
    }
    return best?.id != null ? String(best.id) : null;
  },
  mapEpisodes: (j) =>
    asArray(j?.data?.episodes).map((e) => ({
      episodeId: enc(e?.embed_url?.sub || e?.embed_url?.dub || ""),
      title: e.title || `Episode ${e.number}`,
    })),
  getEmbed: (id) => ({ embedUrl: decodeURIComponent(id || ""), qualities: [] }),
};

const ANIMASU = {
  name: "animasu",
  base: "https://www.sankavollerei.web.id/anime/animasu",
  searchPath: (q) => `/search/${enc(q)}`,
  detailPath: (s) => `/detail/${s}`,
  episodePath: (s) => `/episode/${s}`,
  serverPath: null,
  mapSearch: (j) =>
    asArray(j?.animes).map((a) => ({ animeId: a.slug, title: a.title })),
  mapEpisodes: (j) =>
    asArray(j?.detail?.episodes).map((e) => ({
      episodeId: e.slug,
      title: e.name,
    })),
  mapEpisode: (j) => {
    const all = asArray(j?.streams);
    const clean = all.find((s) => /pixeldrain\.com\/u\//i.test(String(s.url)));
    const embed = all.find((s) => s.url && !AVOID_DEFAULT.test(s.url));
    const pick = clean || embed || all[0];
    return {
      embedUrl: proxify(pick?.url),
      qualities: groupAnimasuStreams(all),
    };
  },
  resolveServer: (id) => decodeURIComponent(id || ""),
};

const PROVIDERS = ENV_BASE
  ? [{ ...SANKA, name: "custom", base: ENV_BASE.replace(/\/$/, "") }]
  : [ANIMASU, SANKA, WAJIK, ANIKOTO];

function providerByName(name) {
  return PROVIDERS.find((p) => p.name === name) || PROVIDERS[0];
}

function splitTag(tagged) {
  const raw = String(tagged || "");
  const idx = raw.indexOf(":");
  if (idx <= 0) return { provider: providerByName(), id: raw };
  return { provider: providerByName(raw.slice(0, idx)), id: raw.slice(idx + 1) };
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
  if (provider.customSearch) return provider.customSearch(provider, title, norm);
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
  let eps = provider.mapEpisodes(j).filter((e) => e.episodeId);
  if (provider.reverseEpisodes !== false) eps = eps.slice().reverse();
  return eps.map((ep, index) => ({
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
  if (provider.getEmbed) return provider.getEmbed(id);
  const j = await callJson(provider.base + provider.episodePath(id));
  if (!j) return { embedUrl: "", qualities: [] };
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
  if (provider.resolveServer) return provider.resolveServer(id);
  if (!provider.serverPath) return "";
  const j = await callJson(provider.base + provider.serverPath(id));
  return provider.mapServer(j);
}
