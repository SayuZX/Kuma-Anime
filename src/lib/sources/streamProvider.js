import { fetchJson } from "../http";
import { asArray } from "../normalize";

const BASE =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.NEXT_PUBLIC_STREAM_API_URL) ||
  "";

export function isStreamProviderConfigured() {
  return Boolean(BASE);
}

function normalize(data) {
  if (!data) return { sources: [], tracks: [] };
  const rawSources = data.sources || data.source || [];
  const rawTracks = data.tracks || data.subtitles || data.captions || [];

  const sources = asArray(rawSources)
    .map((s) => {
      const url = s.url || s.file || s.src || "";
      return {
        url,
        quality: s.quality || s.label || "default",
        isM3U8: s.isM3U8 ?? /\.m3u8(\?|$)/i.test(url),
      };
    })
    .filter((s) => s.url);

  const tracks = asArray(rawTracks)
    .map((t) => ({
      file: t.file || t.url || "",
      label: t.label || t.lang || t.language || "Unknown",
      kind: t.kind || "captions",
      default: !!t.default,
    }))
    .filter((t) => t.file);

  return { sources, tracks };
}

export async function getEpisodeSources(episodeId, server = "vidstream", category = "sub") {
  if (!BASE) return { sources: [], tracks: [] };
  const base = BASE.replace(/\/$/, "");
  const url = `${base}/watch?episodeId=${encodeURIComponent(
    episodeId
  )}&server=${encodeURIComponent(server)}&category=${encodeURIComponent(category)}`;
  const data = await fetchJson(url, {
    where: "streamProvider",
    timeout: 12000,
    retries: 2,
    cacheTtl: 60 * 1000,
  });
  return normalize(data);
}
