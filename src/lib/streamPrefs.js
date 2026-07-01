const KEY = "streamPrefs";

const DEFAULTS = {
  server: "vidstream",
  category: "sub",
  quality: "auto",
};

export function getStreamPrefs() {
  if (typeof window === "undefined") return { ...DEFAULTS };
  try {
    return { ...DEFAULTS, ...(JSON.parse(localStorage.getItem(KEY)) || {}) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function setStreamPrefs(patch) {
  if (typeof window === "undefined") return;
  try {
    const next = { ...getStreamPrefs(), ...patch };
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    return;
  }
}

function subtitleRank(label) {
  const l = String(label || "").toLowerCase();
  if (l.includes("indonesia") || l === "id" || l === "ind") return 0;
  if (l.includes("english") || l === "en" || l === "eng") return 1;
  return 2;
}

export function orderTracks(tracks) {
  const captions = (tracks || []).filter((t) => t.kind === "captions");
  const others = (tracks || []).filter((t) => t.kind !== "captions");
  const sorted = [...captions].sort(
    (a, b) => subtitleRank(a.label) - subtitleRank(b.label)
  );
  return [
    ...sorted.map((track, index) => ({ ...track, default: index === 0 })),
    ...others,
  ];
}
