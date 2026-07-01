import { fetchJsonOrThrow } from "../http";
import {
  stripHtml,
  buildOtherInfo,
  asArray,
  numberOr,
} from "../normalize";

const BASE = "https://api.jikan.moe/v4";
const MIN_INTERVAL = 550;

function jikanGet(path, opts = {}) {
  return fetchJsonOrThrow(`${BASE}${path}`, {
    cacheTtl: 10 * 60 * 1000,
    rateLimitKey: "jikan",
    minInterval: MIN_INTERVAL,
    validate: (d) => d && (d.data !== undefined || Array.isArray(d)),
    where: "jikan",
    ...opts,
  });
}

function shortDuration(d) {
  if (!d || typeof d !== "string") return "??";
  const m = d.match(/(\d+)\s*min/);
  if (m) return `${m[1]}m`;
  const h = d.match(/(\d+)\s*hr/);
  if (h) return `${h[1]}h`;
  return d.replace("per ep", "").trim() || "??";
}

export function mapAnimeCard(a, rank) {
  if (!a) return null;
  const poster =
    a.images?.webp?.large_image_url ||
    a.images?.jpg?.large_image_url ||
    a.images?.jpg?.image_url ||
    "";
  const date = a.aired?.string || a.aired?.from?.slice?.(0, 10) || "??";
  const card = {
    id: String(a.mal_id),
    name: a.title_english || a.title || "Unknown",
    jname: a.title_japanese || a.title || "??",
    poster,
    cover: poster,
    carouselImage: poster,
    description: stripHtml(a.synopsis) || "No description available",
    type: a.type || "TV",
    duration: shortDuration(a.duration),
    episodes: { sub: a.episodes ?? "??", dub: 0 },
    otherInfo: buildOtherInfo({
      type: a.type,
      duration: shortDuration(a.duration),
      date,
    }),
    rating: a.rating || null,
    score: a.score ?? null,
    genres: asArray(a.genres).map((g) => g.name),
  };
  if (rank != null) card.rank = rank;
  return card;
}

function mapList(payload, withRank = false) {
  return asArray(payload?.data)
    .map((a, i) => mapAnimeCard(a, withRank ? i + 1 : undefined))
    .filter(Boolean);
}

export async function topAnime(filter = "bypopularity", limit = 12) {
  const data = await jikanGet(`/top/anime?filter=${filter}&limit=${limit}`);
  return mapList(data, true);
}

export async function seasonNow(limit = 20) {
  const data = await jikanGet(`/seasons/now?limit=${limit}&sfw=true`);
  return mapList(data);
}

export async function seasonUpcoming(limit = 16) {
  const data = await jikanGet(`/seasons/upcoming?limit=${limit}&sfw=true`);
  return mapList(data);
}

export async function searchAnime(query, page = 1) {
  const data = await jikanGet(
    `/anime?q=${encodeURIComponent(query)}&limit=24&page=${page}&sfw=true&order_by=members&sort=desc`
  );
  return mapList(data);
}

export async function genres() {
  const data = await jikanGet(`/genres/anime`, { cacheTtl: 24 * 3600 * 1000 });
  return asArray(data?.data)
    .map((g) => g.name)
    .filter(Boolean);
}

let genreMapPromise = null;

async function genreMap() {
  if (!genreMapPromise) {
    genreMapPromise = jikanGet(`/genres/anime`, { cacheTtl: 24 * 3600 * 1000 })
      .then((data) => {
        const map = {};
        asArray(data?.data).forEach((g) => {
          if (g.name) map[g.name.toLowerCase()] = g.mal_id;
        });
        return map;
      })
      .catch(() => ({}));
  }
  return genreMapPromise;
}

export async function discover(genre, page = 1) {
  const map = await genreMap();
  const id = genre ? map[String(genre).toLowerCase()] : null;
  const path = id
    ? `/anime?genres=${id}&page=${page}&limit=24&order_by=members&sort=desc&sfw=true`
    : `/top/anime?filter=bypopularity&page=${page}&limit=24`;
  const data = await jikanGet(path);
  return mapList(data);
}

export async function animeFull(id) {
  const data = await jikanGet(`/anime/${id}/full`);
  return data?.data ? mapAnimeDetail(data.data) : null;
}

export function mapAnimeDetail(a) {
  const card = mapAnimeCard(a);
  return {
    ...card,
    synonyms: asArray(a.titles).map((t) => t.title).join(", "),
    japanese: a.title_japanese || "",
    aired: a.aired?.string || "??",
    premiered:
      a.season && a.year
        ? `${a.season[0].toUpperCase()}${a.season.slice(1)} ${a.year}`
        : "??",
    status: a.status || "??",
    malscore: a.score ?? "N/A",
    studios: asArray(a.studios).map((s) => s.name).join(", ") || "??",
    genresList: asArray(a.genres).map((g) => g.name),
    color: null,
    anilistId: null,
    trailer: a.trailer?.embed_url || a.trailer?.url || null,
  };
}

export async function animeCharacters(id) {
  const data = await jikanGet(`/anime/${id}/characters`);
  return asArray(data?.data)
    .slice(0, 24)
    .map((entry) => ({
      name: { full: entry.character?.name || "Unknown" },
      image: entry.character?.images?.jpg?.image_url || "",
      role: entry.role || "",
      voiceActors: asArray(entry.voice_actors).map((v) => ({
        language: v.language || "Unknown",
        name: { full: v.person?.name || "Unknown" },
        image: v.person?.images?.jpg?.image_url || "",
      })),
    }));
}

export async function animeEpisodes(id, posterFallback = "") {
  const data = await jikanGet(`/anime/${id}/episodes`);
  return asArray(data?.data).map((ep) => ({
    episodeId: `${id}?ep=${ep.mal_id}`,
    number: ep.mal_id,
    title: ep.title || ep.title_romanji || `Episode ${ep.mal_id}`,
    image: posterFallback,
    isFiller: !!ep.filler,
  }));
}

export async function animeVideos(id) {
  const data = await jikanGet(`/anime/${id}/videos`);
  return asArray(data?.data?.promo).map((p) => ({
    title: p.title || "Promotional Video",
    source: p.trailer?.embed_url || p.trailer?.url || "",
    thumbnail: p.trailer?.images?.maximum_image_url || p.trailer?.images?.image_url || "",
  }));
}

export async function schedule(weekday) {
  const data = await jikanGet(
    `/schedules?filter=${weekday}&limit=25&sfw=true&kids=false`
  );
  return asArray(data?.data).map((a) => {
    const card = mapAnimeCard(a);
    return {
      ...card,
      time: a.broadcast?.time || "??",
      episode: a.episodes ?? "?",
    };
  });
}

export async function relatedAnime(id) {
  const data = await jikanGet(`/anime/${id}/recommendations`);
  return asArray(data?.data)
    .slice(0, 20)
    .map((r) => mapAnimeCard(r.entry))
    .filter(Boolean);
}

export { numberOr };
