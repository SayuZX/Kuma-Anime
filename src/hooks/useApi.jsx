import {
  getAnimeById,
  searchAnime as searchAnimeSource,
  getSchedule,
} from "@/lib/anime";
import {
  getMangaList,
  getMangaDetails,
  getChapterSource,
  searchManga as searchMangaSource,
} from "@/lib/manga";
import * as jikan from "@/lib/sources/jikan";
import { sanitizeQuery } from "@/lib/normalize";
import { logger } from "@/lib/logger";

function toDetailShape(result) {
  if (!result?.detail) return null;
  const d = result.detail;
  const malscore = d.malscore ?? "N/A";
  const color = d.color || "#a78bfa";
  return {
    anime: {
      info: {
        id: d.id,
        anilistId: d.id,
        name: d.name,
        jname: d.jname,
        poster: d.poster,
        description: d.description || "",
        promotionalVideos: result.videos || [],
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
    relatedAnimes: result.related || [],
    recommendedAnimes: result.related || [],
    mostPopularAnimes: [],
  };
}

export const FetchAnimeByAniwatchID = async (id) => {
  const result = await getAnimeById(id);
  return toDetailShape(result) || toDetailShape({ detail: null });
};

export const FetchAnimeByID = async (id) => {
  const result = await getAnimeById(id);
  return {
    cover: result?.detail?.cover || result?.detail?.poster || null,
    characters: result?.characters || [],
    recommendations: result?.related || [],
  };
};

export const FetchEpisodesByMappedID = async (id) => {
  const episodes = await jikan.animeEpisodes(id).catch(() => []);
  return { episodes: episodes || [] };
};

export const FetchEpisodesData = async () => [];
export const FetchEpisodeLinksByMappedID = async () => ({
  sources: [],
  tracks: [],
});

export const SearchAniWatch = async (query) => {
  const q = sanitizeQuery(query);
  if (!q) return [];
  return searchAnimeSource(q);
};

export const AdvancedSearch = async (query, genre) => {
  const q = sanitizeQuery(query) || sanitizeQuery(genre) || "";
  if (!q) return [];
  return searchAnimeSource(q);
};

export const FetchEstimatedSchedule = async (year, month, day) => {
  return getSchedule(year, month, day);
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

logger.debug("useApi: resilient data layer active");
