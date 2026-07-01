import * as jikan from "./sources/jikan";
import * as anilist from "./sources/anilist";
import * as kitsu from "./sources/kitsu";
import { animeData } from "./fallbackData";
import { logger } from "./logger";
import { asArray } from "./normalize";

async function tryChain(label, fns, fallback = []) {
  for (const { name, fn } of fns) {
    try {
      const out = await fn();
      if (Array.isArray(out) && out.length) {
        logger.debug(`${label} served by ${name} (${out.length})`);
        return out;
      }
    } catch (err) {
      logger.warn(`${label}: ${name} threw`, err?.message);
    }
  }
  logger.warn(`${label}: all sources empty → static fallback`);
  return fallback;
}

export async function getHomePage() {
  const [airing, popular, favorite, upcoming, genres] = await Promise.all([
    tryChain(
      "airing",
      [
        { name: "jikan", fn: () => jikan.topAnime("airing", 24) },
        { name: "anilist", fn: () => anilist.listBySort("TRENDING_DESC", 24) },
        { name: "kitsu", fn: () => kitsu.listTrending(24) },
      ],
      animeData.topAiringAnimes
    ),
    tryChain(
      "popular",
      [
        { name: "jikan", fn: () => jikan.topAnime("bypopularity", 12) },
        { name: "anilist", fn: () => anilist.listBySort("POPULARITY_DESC", 12) },
        { name: "kitsu", fn: () => kitsu.listPopular(12) },
      ],
      animeData.mostPopularAnimes
    ),
    tryChain(
      "favorite",
      [
        { name: "jikan", fn: () => jikan.topAnime("favorite", 10) },
        { name: "anilist", fn: () => anilist.listBySort("FAVOURITES_DESC", 10) },
      ],
      animeData.top10Animes.month
    ),
    tryChain(
      "upcoming",
      [
        { name: "jikan", fn: () => jikan.seasonUpcoming(16) },
        { name: "anilist", fn: () => anilist.listBySort("POPULARITY_DESC", 16, 2) },
      ],
      animeData.topUpcomingAnimes
    ),
    tryChain(
      "genres",
      [{ name: "jikan", fn: () => jikan.genres() }],
      animeData.genres
    ),
  ]);

  const spotlight = withRanks(airing.slice(0, 10));
  const today = withRanks(airing.slice(0, 10));
  const week = withRanks(popular.slice(0, 10));
  const month = withRanks(favorite.slice(0, 10));

  return {
    spotlightAnimes: spotlight,
    trendingAnimes: today,
    latestEpisodeAnimes: airing.slice(10, 24).length ? airing.slice(10, 24) : airing,
    topUpcomingAnimes: upcoming,
    topAiringAnimes: airing,
    mostPopularAnimes: popular,
    mostFavoriteAnimes: month,
    latestCompletedAnimes: popular,
    top10Animes: { today, week, month },
    genres,
  };
}

function withRanks(list) {
  return asArray(list).map((item, i) => ({ ...item, rank: i + 1 }));
}

export async function getAnimeById(id) {
  const detail = await safe(() => jikan.animeFull(id));
  if (detail) {
    const [characters, episodes, videos, related] = await Promise.all([
      safe(() => jikan.animeCharacters(id), []),
      safe(() => jikan.animeEpisodes(id, detail.poster), []),
      safe(() => jikan.animeVideos(id), []),
      safe(() => jikan.relatedAnime(id), []),
    ]);
    return { detail, characters, episodes, videos, related, source: "jikan" };
  }
  const al = await safe(() => anilist.animeByMalId(id));
  if (al?.detail) {
    return {
      detail: al.detail,
      characters: al.characters || [],
      episodes: [],
      videos: [],
      related: [],
      source: "anilist",
    };
  }
  return null;
}

export async function searchAnime(query) {
  return tryChain("search", [
    { name: "jikan", fn: () => jikan.searchAnime(query) },
    { name: "anilist", fn: () => anilist.searchAnime(query) },
    { name: "kitsu", fn: () => kitsu.searchAnime(query) },
  ]);
}

const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export async function getSchedule(year, month, day) {
  let weekday = "monday";
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  if (!Number.isNaN(d.getTime())) weekday = WEEKDAYS[d.getDay()];
  return tryChain("schedule", [
    { name: "jikan", fn: () => jikan.schedule(weekday) },
  ]);
}

async function safe(fn, fallback = null) {
  try {
    const v = await fn();
    return v ?? fallback;
  } catch (err) {
    logger.warn("anime source error", err?.message);
    return fallback;
  }
}

export { asArray };
