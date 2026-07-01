import { getSchedule } from "@/lib/anime";

export const revalidate = 3600;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const day = searchParams.get("day");
  const data = await getSchedule(year, month, day);
  return Response.json(data || []);
}
