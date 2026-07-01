import { getHomePage } from "@/lib/anime";

export async function fetchHomePage() {
  return getHomePage();
}

export function extractData(items) {
  return Array.isArray(items) ? items : [];
}
