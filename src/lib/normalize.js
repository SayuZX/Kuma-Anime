const ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

export function stripHtml(input) {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<br\s*\/?>(\n)?/gi, "\n")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/&[a-z]+;|&#\d+;/gi, (m) => ENTITIES[m] ?? "")
    .replace(/\u00a0/g, " ")
    .trim();
}

export function sanitizeText(input, max = 0) {
  let s = stripHtml(input);
  s = s.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/javascript:/gi, "");
  if (max > 0 && s.length > max) s = s.slice(0, max).trimEnd() + "…";
  return s;
}

export function sanitizeQuery(q) {
  if (!q || typeof q !== "string") return "";
  return q.replace(/[<>"'`]/g, "").trim().slice(0, 100);
}

export function preferRomaji() {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem("isRomaji") === "true";
  } catch {
    return false;
  }
}

export function pickName(titles, romaji = preferRomaji()) {
  const { english, romaji: rj, native, userPreferred } = titles || {};
  if (romaji) return rj || english || userPreferred || native || "Unknown";
  return english || rj || userPreferred || native || "Unknown";
}

function clean(v, fallback = "??") {
  if (v === null || v === undefined || v === "") return fallback;
  return v;
}

export function buildOtherInfo({ type, duration, date } = {}) {
  return [
    String(clean(type)),
    String(clean(duration)),
    String(clean(date)),
    "HD",
  ];
}

export function numberOr(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function compactNumber(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "0";
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return String(num);
}

export function asArray(v) {
  return Array.isArray(v) ? v : [];
}
