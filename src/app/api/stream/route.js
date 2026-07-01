export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ALLOWED = ["pixeldrain.com"];

function isAllowed(target) {
  try {
    const url = new URL(target);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    const host = url.hostname.replace(/^www\./, "");
    return ALLOWED.some((a) => host === a || host.endsWith("." + a));
  } catch {
    return false;
  }
}

async function proxy(request, method) {
  const target = new URL(request.url).searchParams.get("url");
  if (!target || !isAllowed(target)) {
    return new Response("Forbidden", { status: 403 });
  }
  const range = request.headers.get("range");
  let upstream;
  try {
    upstream = await fetch(target, {
      method,
      headers: {
        ...(range ? { Range: range } : {}),
        "User-Agent": "Mozilla/5.0",
        Accept: "*/*",
      },
      redirect: "follow",
    });
  } catch {
    return new Response("Upstream fetch failed", { status: 502 });
  }
  const headers = new Headers();
  ["content-type", "content-length", "content-range", "accept-ranges"].forEach(
    (h) => {
      const v = upstream.headers.get(h);
      if (v) headers.set(h, v);
    }
  );
  if (!headers.has("accept-ranges")) headers.set("accept-ranges", "bytes");
  headers.set("cache-control", "public, max-age=3600");
  return new Response(method === "HEAD" ? null : upstream.body, {
    status: upstream.status,
    headers,
  });
}

export async function GET(request) {
  return proxy(request, "GET");
}

export async function HEAD(request) {
  return proxy(request, "HEAD");
}
