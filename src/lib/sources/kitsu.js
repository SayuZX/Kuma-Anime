import { fetchJsonOrThrow } from "../http";
import { stripHtml, buildOtherInfo, asArray } from "../normalize";

const BASE = "https://kitsu.io/api/edge";

function kitsuGet(path) {
  return fetchJsonOrThrow(`${BASE}${path}`, {
    init: { headers: { Accept: "application/vnd.api+json" } },
    cacheTtl: 5 * 60 * 1000,
    where: "kitsu",
    validate: (d) => d && Array.isArray(d.data),
  });
}

function mapAnimeCard(node, rank) {
  const a = node?.attributes;
  if (!a) return null;
  const poster =
    a.posterImage?.large || a.posterImage?.original || a.posterImage?.medium || "";
  const cover = a.coverImage?.original || poster;
  const date = a.startDate || "??";
  const card = {
    id: `kitsu-${node.id}`,
    name: a.titles?.en || a.canonicalTitle || a.titles?.en_jp || "Unknown",
    jname: a.titles?.ja_jp || a.canonicalTitle || "??",
    poster,
    cover,
    carouselImage: cover,
    description: stripHtml(a.synopsis) || "No description available",
    type: a.showType || "TV",
    duration: a.episodeLength ? `${a.episodeLength}m` : "??",
    episodes: { sub: a.episodeCount ?? "??", dub: 0 },
    otherInfo: buildOtherInfo({
      type: a.showType,
      duration: a.episodeLength ? `${a.episodeLength}m` : "??",
      date,
    }),
    score: a.averageRating ? Math.round(Number(a.averageRating)) : null,
    genres: [],
  };
  if (rank != null) card.rank = rank;
  return card;
}

export async function listPopular(limit = 12) {
  const data = await kitsuGet(`/anime?sort=-userCount&page[limit]=${limit}`);
  return asArray(data?.data).map((n, i) => mapAnimeCard(n, i + 1)).filter(Boolean);
}

export async function listTrending(limit = 12) {
  const data = await kitsuGet(`/trending/anime`);
  return asArray(data?.data)
    .slice(0, limit)
    .map((n, i) => mapAnimeCard(n, i + 1))
    .filter(Boolean);
}

export async function searchAnime(query, limit = 24, page = 1) {
  const offset = (Math.max(1, page) - 1) * limit;
  const data = await kitsuGet(
    `/anime?filter[text]=${encodeURIComponent(query)}&page[limit]=${limit}&page[offset]=${offset}`
  );
  return asArray(data?.data).map((n) => mapAnimeCard(n)).filter(Boolean);
}
