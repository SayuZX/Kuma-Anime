export async function fetchHomePage() {
  try {
    const res = await fetch("/api/home");
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

export function extractData(items) {
  return Array.isArray(items) ? items : [];
}
