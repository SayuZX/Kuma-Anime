import { logger, reportError } from "./logger";

const DEFAULT_TIMEOUT = 12000;
const DEFAULT_RETRIES = 2;
const DEFAULT_CACHE_TTL = 60 * 1000;

const cache = new Map();
const inflight = new Map();
const rateGates = new Map();

function throttleGate(key, minInterval) {
  if (!key || !minInterval) return Promise.resolve();
  const g = rateGates.get(key) || { chain: Promise.resolve(), lastAt: 0 };
  const next = g.chain.then(async () => {
    const wait = Math.max(0, minInterval - (Date.now() - g.lastAt));
    if (wait) await sleep(wait);
    g.lastAt = Date.now();
  });
  g.chain = next.catch(() => {});
  rateGates.set(key, g);
  return next;
}

function now() {
  return Date.now();
}

function pruneCache() {
  if (cache.size < 500) return;
  const t = now();
  for (const [k, v] of cache) {
    if (v.expires <= t) cache.delete(k);
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function isTransient(status) {
  return status === 408 || status === 429 || status === 425 || status >= 500;
}

export class HttpError extends Error {
  constructor(message, status, url) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.url = url;
  }
}

export async function fetchJsonOrThrow(url, opts = {}) {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    cacheTtl = DEFAULT_CACHE_TTL,
    init = {},
    validate,
    rateLimitKey,
    minInterval = 0,
  } = opts;

  const method = (init.method || "GET").toUpperCase();
  const cacheKey = method === "GET" ? `${method} ${url}` : null;

  if (cacheKey && cacheTtl > 0) {
    const hit = cache.get(cacheKey);
    if (hit && hit.expires > now()) return hit.value;
    const pending = inflight.get(cacheKey);
    if (pending) return pending;
  }

  const run = (async () => {
    await throttleGate(rateLimitKey, minInterval);
    let lastErr;
    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);
      try {
        const res = await fetch(url, {
          ...init,
          signal: controller.signal,
          headers: { Accept: "application/json", ...(init.headers || {}) },
        });
        clearTimeout(timer);

        if (!res.ok) {
          if (isTransient(res.status) && attempt < retries) {
            lastErr = new HttpError(`HTTP ${res.status}`, res.status, url);
            await sleep(backoff(attempt, res));
            continue;
          }
          throw new HttpError(`HTTP ${res.status}`, res.status, url);
        }

        const data = await res.json();
        if (validate && !validate(data)) {
          throw new HttpError("Response failed validation", 200, url);
        }

        if (cacheKey && cacheTtl > 0) {
          pruneCache();
          cache.set(cacheKey, { expires: now() + cacheTtl, value: data });
        }
        return data;
      } catch (err) {
        clearTimeout(timer);
        lastErr = err;
        const transient =
          err?.name === "AbortError" ||
          err?.name === "TypeError" ||
          (err instanceof HttpError && isTransient(err.status));
        if (transient && attempt < retries) {
          await sleep(backoff(attempt));
          continue;
        }
        throw err;
      }
    }
    throw lastErr;
  })();

  if (cacheKey && cacheTtl > 0) inflight.set(cacheKey, run);
  try {
    return await run;
  } finally {
    if (cacheKey) inflight.delete(cacheKey);
  }
}

function backoff(attempt, res) {
  if (res) {
    const ra = Number(res.headers?.get?.("retry-after"));
    if (Number.isFinite(ra) && ra > 0) return Math.min(ra * 1000, 8000);
  }
  const base = 400 * 2 ** attempt;
  const jitter = base * 0.25 * Math.random();
  return Math.min(base + jitter, 8000);
}

export async function fetchJson(url, opts = {}) {
  const { fallback = null, where = "fetchJson", ...rest } = opts;
  try {
    return await fetchJsonOrThrow(url, rest);
  } catch (err) {
    const status = err instanceof HttpError ? err.status : undefined;
    logger.warn(`${where} failed`, { url, status, message: err?.message });
    if (status === undefined || status >= 500 || status === 429) {
      reportError(err, { where, url, status });
    }
    return fallback;
  }
}

export function clearHttpCache() {
  cache.clear();
  inflight.clear();
}
