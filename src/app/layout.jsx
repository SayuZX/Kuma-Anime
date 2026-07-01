import "./globals.css";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import NextTopLoader from "nextjs-toploader";
import DataProvider from "../provider/database";
import { SITE } from "@/lib/legalContent";

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Kuma Anime — Jelajahi Anime & Manga",
    template: "%s | Kuma Anime",
  },
  description:
    "Kuma Anime adalah platform gratis untuk menjelajahi anime dan manga: sinopsis, karakter, jadwal tayang, dan pelacakan tontonan/bacaan. Data dari Jikan, AniList, Kitsu, dan MangaDex.",
  keywords: [
    "anime",
    "manga",
    "nonton anime",
    "baca manga",
    "jadwal anime",
    "Kuma Anime",
  ],
  applicationName: "Kuma Anime",
  authors: [{ name: "Kuma Anime" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Kuma Anime",
    title: "Kuma Anime — Jelajahi Anime & Manga",
    description:
      "Jelajahi anime dan manga: sinopsis, karakter, jadwal tayang, dan pelacakan tontonan/bacaan.",
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: "Kuma Anime — Jelajahi Anime & Manga",
    description:
      "Jelajahi anime dan manga: sinopsis, karakter, jadwal tayang, dan pelacakan.",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen antialiased bg-custom-body")}>
        <DataProvider>
          <ThemeProvider
            storageKey="theme"
            attribute="class"
            themes={['light', 'dark']}
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextTopLoader
              color="indigo"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={true}
              easing="ease"
              speed={200}
              shadow="0 0 10px #818cf8,0 0 5px #818cf8"
            />
            <Header />
            <div className=" translate-y-[20px] mb-[50px]">{children}</div>
            <Footer />
          </ThemeProvider>
        </DataProvider>
      </body>
    </html>
  );
}
