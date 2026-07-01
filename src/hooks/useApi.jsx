import * as otakudesu from "@/lib/sources/otakudesu";
import {
  getMangaList,
  getMangaDetails,
  getChapterSource,
  searchManga as searchMangaSource,
} from "@/lib/manga";
import { sanitizeQuery } from "@/lib/normalize";

async function apiGet(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function toDetailShape(result) {
  const d = result?.detail || {};
  const malscore = d.malscore ?? "N/A";
  const color = d.color || "#a78bfa";
  return {
    anime: {
      info: {
        id: d.id ?? null,
        anilistId: d.id ?? null,
        name: d.name || "",
        jname: d.jname || "",
        poster: d.poster || "",
        description: d.description || "",
        promotionalVideos: result?.videos || [],
        stats: {
          rating: d.rating || "PG-13",
          type: d.type || "TV",
          duration: d.duration || "??",
          episodes: d.episodes || { sub: "??", dub: 0 },
        },
      },
      moreInfo: {
        synonyms: d.synonyms || "",
        genres: Array.isArray(d.genresList) ? d.genresList : [],
        japanese: d.japanese || "",
        aired: d.aired || "??",
        premiered: d.premiered || "??",
        duration: d.duration || "??",
        status: d.status || "??",
        malscore,
        studios: d.studios || "??",
      },
      color,
      malscore,
    },
    seasons: [],
    relatedAnimes: result?.related || [],
    recommendedAnimes: result?.related || [],
    mostPopularAnimes: [],
  };
}

export const FetchAnimeByAniwatchID = async (id) => {
  const result = await apiGet(`/api/anime/${encodeURIComponent(id)}`);
  return toDetailShape(result);
};

export const FetchAnimeByID = async (id) => {
  const result = await apiGet(`/api/anime/${encodeURIComponent(id)}`);
  return {
    cover: result?.detail?.cover || result?.detail?.poster || null,
    characters: result?.characters || [],
    recommendations: result?.related || [],
  };
};

export const FetchEpisodesByMappedID = async (title) => {
  const animeId = await otakudesu.searchByTitle(title);
  if (!animeId) return { episodes: [] };
  const episodes = await otakudesu.getEpisodes(animeId);
  return { episodes: episodes || [] };
};

export const FetchEpisodesData = async () => [];

export const FetchEpisodeLinksByMappedID = async (episodeId) => {
  const { embedUrl } = await otakudesu.getEpisodeEmbed(episodeId);
  return {
    sources: embedUrl
      ? [{ url: embedUrl, quality: "default", isM3U8: false }]
      : [],
    tracks: [],
  };
};

export const SearchAniWatch = async (query) => {
  const q = sanitizeQuery(query);
  if (!q) return [];
  return (await apiGet(`/api/search?q=${encodeURIComponent(q)}`)) || [];
};

export const AdvancedSearch = async (query, genre, ...filters) => {
  const page = Number(filters[13]) || 1;
  const q = sanitizeQuery(query);
  const g = sanitizeQuery(genre);
  const params = q
    ? `q=${encodeURIComponent(q)}`
    : `genre=${encodeURIComponent(g)}`;
  return (await apiGet(`/api/search?${params}&page=${page}`)) || [];
};

export const FetchEstimatedSchedule = async (year, month, day) => {
  return (
    (await apiGet(`/api/schedule?year=${year}&month=${month}&day=${day}`)) || []
  );
};

export const FetchMangaList = async (page = 1) => getMangaList(page);

export const FetchMangaDetails = async (id) => getMangaDetails(id);

export const FetchMangaChaptersSrc = async (mangaId, chapterId) =>
  getChapterSource(mangaId, chapterId);

export const SearchManga = async (query, page = 1) => {
  const q = sanitizeQuery(query);
  if (!q) return { mangaList: [] };
  return searchMangaSource(q, page);
};

export const GetMangaSearch = async (query, count = 24) => {
  const q = sanitizeQuery(query);
  if (!q) return [];
  const { mangaList } = await searchMangaSource(q);
  return Array.isArray(mangaList) ? mangaList.slice(0, count) : [];
};
