import Link from "next/link";
import { Input } from "@/components/ui/input";
import CategoryCards from "@/components/category-cards";
import { Button } from "@/components/ui/button";

export default function Component() {
  return (
    <div className="">
      <main>
        <section className="py-20 md:py-24 lg:py-32 max-md:h-auto h-screen">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1fr_400px]">
              <div className="order-0 max-md:order-1 flex flex-col justify-center space-y-6">
                <div>
                  <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm dark:bg-muted dark:text-muted-foreground">
                    Unggulan
                  </div>
                  <h1 className="mt-2 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                   Menyelam Dunia Anime dan Komik
                  </h1>
                  <p className="mt-4 text-muted-foreground md:text-xl dark:text-muted-foreground">
                   Jelajahi konten anime dan komik terbaru, diperbarui setiap hari.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/pages/Anime"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-primary-foreground"
                    prefetch={false}
                  >
                    Jelajahi Anime
                  </Link>
                  <Link
                    href="/pages/Manga"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 dark:bg-background dark:border-input dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground"
                    prefetch={false}
                  >
                    Jelajahi Komik
                  </Link>
                </div>
              </div>
              <img
                src="/homepage-cover.jpg"
                width={800}
                height={600}
                alt="Anime hero image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm dark:bg-muted dark:text-muted-foreground">
                  Info
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                 Temukan Anime dan Manga di platform kami!
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-muted-foreground">
                 Lihat tambahan terbaru pada update kami, yang diperbarui setiap hari.
                </p>
              </div>
            </div>
            <CategoryCards />
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm dark:bg-muted dark:text-muted-foreground">
                 Rilis Baru
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                 Temukan Anime dan Komik Terbaru
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-muted-foreground">
                Lihat tambahan terbaru pada update kami, yang diperbarui setiap hari.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:gap-12">
              <Link
                href="/pages/Anime/details/attack-on-titan-the-final-season-part-3-18329"
                className="group grid w-full justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-background dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground"
                prefetch={false}
              >
                <img
                  src="/anime_latest.jpg"
                  width={600}
                  height={338}
                  alt="New Release 1"
                  className="aspect-video overflow-hidden rounded-md object-cover"
                />
                <div className="text-sm font-medium leading-none group-hover:underline dark:text-foreground">
                  Attack on Titan: Final Season
                </div>
                <div className="line-clamp-2 text-sm leading-snug text-muted-foreground dark:text-muted-foreground">
                Hanya satu kata, <b>MASTERPIECE</b>.
                </div>
                <Button className="mt-3">Tonton Sekarang {">"}</Button>
              </Link>
              <Link
                href="/pages/Manga/details/manga-dn980422"
                className="group grid w-full justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-background dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground"
                prefetch={false}
              >
                <img
                  src="/manga_latest.jpg"
                  width={600}
                  height={338}
                  alt="New Release 2"
                  className="aspect-video overflow-hidden rounded-md object-cover"
                />
                <div className="mt-1 text-sm font-medium leading-none group-hover:underline dark:text-foreground">
                  Chainsaw Man
                </div>
                <div className="line-clamp-2 text-sm leading-snug text-muted-foreground dark:text-muted-foreground">
                 Salah satu Komik terbaik! Tapi cukup gelap
                </div>
                <Button className="mt-3">Baca Sekarang {">"}</Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm dark:bg-muted dark:text-muted-foreground">
                 Populer Minggu Ini
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                 Anime dan Komik yang Paling Banyak Ditonton
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-muted-foreground">
                 tunggu konten anime dan Komik terpopuler di platform kami minggu ini.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:gap-12">
              <Link
                href="/pages/Anime/details/one-piece-100"
                className="group grid w-full justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-background dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground"
                prefetch={false}
              >
                <img
                  src="/anime_watched.jpg"
                  width={600}
                  height={338}
                  alt="New Release 1"
                  className="aspect-video overflow-hidden rounded-md object-cover"
                />
                <div className="text-sm font-medium leading-none group-hover:underline dark:text-foreground">
                  One Piece
                </div>
                <div className="line-clamp-2 text-sm leading-snug text-muted-foreground dark:text-muted-foreground">
                 Perjalanan Monkey D Luffy Menjadi Raja Bajak Laut.
                </div>
                <Button className="mt-3">Tonton Sekarang {">"}</Button>
              </Link>
              <Link
                href="/pages/Manga/details/manga-to970571"
                className="group grid w-full justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-background dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground"
                prefetch={false}
              >
                <img
                  src="/manga_watched.png"
                  width={600}
                  height={338}
                  alt="New Release 2"
                  className="aspect-video overflow-hidden rounded-md object-cover"
                />
                <div className="mt-1 text-sm font-medium leading-none group-hover:underline dark:text-foreground">
                  Demon Slayer
                </div>
                <div className="line-clamp-2 text-sm leading-snug text-muted-foreground dark:text-muted-foreground">
                 Anime penuh aksi dengan karakter dan animasi yang menakjubkan.
                </div>
                <Button className="mt-3">Baca Sekarang {">"}</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
