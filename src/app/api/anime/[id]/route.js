import { getAnimeById } from "@/lib/anime";

export const revalidate = 3600;

export async function GET(request, { params }) {
  const data = await getAnimeById(params.id);
  return Response.json(data || null);
}
