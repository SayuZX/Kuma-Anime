import { fetchJsonOrThrow } from "../http";
import { stripHtml, asArray } from "../normalize";

const BASE = "https://api.mangadex.org";
const UPLOADS = "https://uploads.mangadex.org";
const RATING = "contentRating[]=safe&contentRating[]=suggestive";
const COVER_INCLUDE = "includes[]=cover_art&includes[]=author&includes[]=artist";

function mdGet(path) {
  return fetchJsonOrThrow(`${BASE}${path}`, {
    cacheTtl: 5 * 60 * 1000,
    where: "mangadex",
    validate: (d) => d && (d.result === "ok" || Array.isArray(d.data)),
  });
}

function pickTitle(attrs) {
  const t = attrs?.title || {};
  return (
    t.en ||
    t["ja-ro"] ||
    t.ja ||
    Object.values(t)[0] ||
    asArray(attrs?.altTitles)
      .map((a) => a.en)
      .find(Boolean) ||
    "Unknown"
  );
}

function pickDescription(attrs) {
  const d = attrs?.description || {};
  return stripHtml(d.en || Object.values(d)[0] || "");
}

function coverUrl(manga, size = ".512.jpg") {
  const rel = asArray(manga?.relationships).find((r) => r.type === "cover_art");
  const file = rel?.attributes?.fileName;
  return file ? `${UPLOADS}/covers/${manga.id}/${file}${size}` : "";
}

function authorName(manga) {
  const rel = asArray(manga?.relationships).find((r) => r.type === "author");
  return rel?.attributes?.name || "Unknown";
}

function mapMangaCard(manga) {
  const a = manga?.attributes || {};
  return {
    id: manga.id,
    image: coverUrl(manga),
    imageUrl: coverUrl(manga, ""),
    title: pickTitle(a),
    name: pickTitle(a),
    description: pickDescription(a) || "No description available",
    chapter: a.lastChapter ? `Chapter ${a.lastChapter}` : "Ongoing",
    view: a.year ? String(a.year) : "—",
    status: a.status || "ongoing",
    author: authorName(manga),
    genres: asArray(a.tags)
      .map((t) => t.attributes?.name?.en)
      .filter(Boolean),
  };
}

export async function listPopular(limit = 24, offset = 0) {
  const data = await mdGet(
    `/manga?limit=${limit}&offset=${offset}&order[followedCount]=desc&${RATING}&${COVER_INCLUDE}&hasAvailableChapters=true`
  );
  return asArray(data?.data).map(mapMangaCard);
}

export async function listLatest(limit = 24, offset = 0) {
  const data = await mdGet(
    `/manga?limit=${limit}&offset=${offset}&order[latestUploadedChapter]=desc&${RATING}&${COVER_INCLUDE}&hasAvailableChapters=true`
  );
  return asArray(data?.data).map(mapMangaCard);
}

export async function searchManga(query, limit = 24) {
  const data = await mdGet(
    `/manga?title=${encodeURIComponent(query)}&limit=${limit}&${RATING}&${COVER_INCLUDE}`
  );
  return asArray(data?.data).map(mapMangaCard);
}

export async function mangaDetail(id) {
  const data = await mdGet(`/manga/${id}?${COVER_INCLUDE}`);
  const manga = data?.data;
  if (!manga) return null;
  const card = mapMangaCard(manga);
  const a = manga.attributes || {};
  const chapterList = await mangaChapters(id);
  return {
    ...card,
    updated: a.updatedAt ? a.updatedAt.slice(0, 10) : "??",
    chapterList,
  };
}

export async function mangaChapters(id) {
  const data = await mdGet(
    `/manga/${id}/feed?translatedLanguage[]=en&order[chapter]=asc&limit=500&${RATING}&includes[]=scanlation_group`
  );
  const seen = new Set();
  const out = [];
  for (const ch of asArray(data?.data)) {
    const at = ch.attributes || {};
    const key = at.chapter ?? ch.id;
    if (seen.has(key)) continue;
    seen.add(key);
    const vol = at.volume ? `Vol.${at.volume} ` : "";
    const num = at.chapter ? `Chapter ${at.chapter}` : "Oneshot";
    const title = at.title ? ` - ${at.title}` : "";
    out.push({
      id: ch.id,
      name: `${vol}${num}${title}`,
      createdAt: at.publishAt ? at.publishAt.slice(0, 10) : "",
      view: "",
      chapter: at.chapter ?? null,
    });
  }
  return out;
}

export async function chapterPages(chapterId) {
  const data = await mdGet(`/at-home/server/${chapterId}`);
  if (!data?.baseUrl || !data?.chapter) return [];
  const { baseUrl, chapter } = data;
  return asArray(chapter.data).map((file, i) => ({
    image: `${baseUrl}/data/${chapter.hash}/${file}`,
    page: i + 1,
  }));
}
