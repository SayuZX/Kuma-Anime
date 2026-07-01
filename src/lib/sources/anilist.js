import { fetchJsonOrThrow } from "../http";
import { stripHtml, buildOtherInfo, asArray } from "../normalize";

const ENDPOINT = "https://graphql.anilist.co";

async function gql(query, variables) {
  const res = await fetchJsonOrThrow(ENDPOINT, {
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    },
    cacheTtl: 5 * 60 * 1000,
    where: "anilist",
    validate: (d) => d && d.data && !d.errors,
  });
  return res.data;
}

const MEDIA_FIELDS = `
  id idMal
  title { romaji english native }
  description(asHtml: false)
  coverImage { extraLarge large color }
  bannerImage
  episodes duration format status season seasonYear averageScore genres
  startDate { year month day }
  studios(isMain: true) { nodes { name } }
`;

export function mapAnimeCard(m, rank) {
  if (!m) return null;
  const poster = m.coverImage?.extraLarge || m.coverImage?.large || "";
  const cover = m.bannerImage || poster;
  const date = m.startDate?.year
    ? `${m.startDate.year}-${String(m.startDate.month || 1).padStart(2, "0")}`
    : "??";
  const card = {
    id: String(m.idMal || m.id),
    anilistId: String(m.id),
    name: m.title?.english || m.title?.romaji || "Unknown",
    jname: m.title?.native || m.title?.romaji || "??",
    poster,
    cover,
    carouselImage: cover,
    description: stripHtml(m.description) || "No description available",
    type: m.format || "TV",
    duration: m.duration ? `${m.duration}m` : "??",
    episodes: { sub: m.episodes ?? "??", dub: 0 },
    otherInfo: buildOtherInfo({
      type: m.format,
      duration: m.duration ? `${m.duration}m` : "??",
      date,
    }),
    color: m.coverImage?.color || null,
    score: m.averageScore ?? null,
    genres: asArray(m.genres),
  };
  if (rank != null) card.rank = rank;
  return card;
}

export async function listBySort(sort = "TRENDING_DESC", perPage = 12, page = 1) {
  const data = await gql(
    `query ($sort: [MediaSort], $perPage: Int, $page: Int) {
      Page(perPage: $perPage, page: $page) {
        media(type: ANIME, sort: $sort, isAdult: false) { ${MEDIA_FIELDS} }
      }
    }`,
    { sort: [sort], perPage, page }
  );
  return asArray(data?.Page?.media).map((m, i) => mapAnimeCard(m, i + 1));
}

export async function searchAnime(query, perPage = 24, page = 1) {
  const data = await gql(
    `query ($search: String, $perPage: Int, $page: Int) {
      Page(perPage: $perPage, page: $page) {
        media(type: ANIME, search: $search, sort: SEARCH_MATCH, isAdult: false) { ${MEDIA_FIELDS} }
      }
    }`,
    { search: query, perPage, page }
  );
  return asArray(data?.Page?.media).map((m) => mapAnimeCard(m));
}

export async function animeByMalId(malId) {
  const data = await gql(
    `query ($idMal: Int) {
      Media(idMal: $idMal, type: ANIME) {
        ${MEDIA_FIELDS}
        characters(sort: ROLE, perPage: 24) {
          edges {
            role
            node { name { full } image { large } }
            voiceActors(language: JAPANESE) { name { full } image { large } languageV2 }
          }
        }
      }
    }`,
    { idMal: Number(malId) }
  );
  const m = data?.Media;
  if (!m) return null;
  return { detail: mapAnimeDetail(m), characters: mapCharacters(m) };
}

function mapAnimeDetail(m) {
  const card = mapAnimeCard(m);
  return {
    ...card,
    synonyms: m.title?.native || "",
    japanese: m.title?.native || "",
    aired: m.startDate?.year ? String(m.startDate.year) : "??",
    premiered:
      m.season && m.seasonYear ? `${m.season} ${m.seasonYear}` : "??",
    status: m.status || "??",
    malscore: m.averageScore ? (m.averageScore / 10).toFixed(1) : "N/A",
    studios: asArray(m.studios?.nodes).map((s) => s.name).join(", ") || "??",
    genresList: asArray(m.genres),
    color: m.coverImage?.color || null,
    trailer: null,
  };
}

function mapCharacters(m) {
  return asArray(m.characters?.edges).map((e) => ({
    name: { full: e.node?.name?.full || "Unknown" },
    image: e.node?.image?.large || "",
    role: e.role || "",
    voiceActors: asArray(e.voiceActors).map((v) => ({
      language: v.languageV2 || "Japanese",
      name: { full: v.name?.full || "Unknown" },
      image: v.image?.large || "",
    })),
  }));
}
