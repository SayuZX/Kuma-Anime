import { getHomePage } from "@/lib/anime";

export const revalidate = 1800;

export async function GET() {
  const data = await getHomePage();
  return Response.json(data);
}
