import { searchAnime, discoverAnime } from "@/lib/anime";

export const revalidate = 600;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  const genre = (searchParams.get("genre") || "").trim();
  const page = Number(searchParams.get("page")) || 1;
  const data = q ? await searchAnime(q, page) : await discoverAnime(genre, page);
  return Response.json(data || []);
}
