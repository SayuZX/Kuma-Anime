export function readCache(key, maxAgeMs = 30 * 60 * 1000) {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { t, v } = JSON.parse(raw);
    if (!t || Date.now() - t > maxAgeMs) return null;
    return v;
  } catch {
    return null;
  }
}

export function writeCache(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify({ t: Date.now(), v: value }));
  } catch {
    return;
  }
}
