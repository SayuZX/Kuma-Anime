import * as mangadex from "./sources/mangadex";
import { mangaData, moreMangaData } from "./fallbackData";
import { logger } from "./logger";
import { asArray } from "./normalize";

async function safe(fn, fallback) {
  try {
    const v = await fn();
    return v ?? fallback;
  } catch (err) {
    logger.warn("manga source error", err?.message);
    return fallback;
  }
}

function staticList() {
  return asArray(mangaData?.mangaList).concat(asArray(moreMangaData?.mangaList));
}

export async function getMangaList(page = 1) {
  const limit = 24;
  const offset = (Math.max(1, Number(page) || 1) - 1) * limit;
  const list = await safe(() => mangadex.listPopular(limit, offset), []);
  if (list.length) return { mangaList: list };
  logger.warn("manga list: MangaDex empty → static fallback");
  const fb = staticList();
  return { mangaList: fb.length ? fb : [] };
}

export async function getMangaLatest(page = 1) {
  const limit = 24;
  const offset = (Math.max(1, Number(page) || 1) - 1) * limit;
  const list = await safe(() => mangadex.listLatest(limit, offset), []);
  return { mangaList: list.length ? list : staticList() };
}

export async function getMangaDetails(id) {
  const detail = await safe(() => mangadex.mangaDetail(id), null);
  if (detail) return detail;
  const fb = staticList().find((m) => m.id === id) || staticList()[0] || null;
  return fb ? { ...fb, chapterList: [] } : null;
}

export async function searchManga(query, page = 1) {
  const list = await safe(() => mangadex.searchManga(query), []);
  return { mangaList: list };
}

export async function getChapterSource(mangaId, chapterId) {
  const [pages, chapters, detail] = await Promise.all([
    safe(() => mangadex.chapterPages(chapterId), []),
    safe(() => mangadex.mangaChapters(mangaId), []),
    safe(() => mangadex.mangaDetail(mangaId), null),
  ]);
  const current = chapters.find((c) => c.id === chapterId);
  return {
    title: detail?.title || "Manga",
    currentChapter: current?.name || "Chapter",
    chapterListIds: chapters.map((c) => ({ id: c.id, name: c.name })),
    images: pages,
  };
}
