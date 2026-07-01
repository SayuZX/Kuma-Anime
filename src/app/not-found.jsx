import Link from "next/link";

export const metadata = {
  title: "404 — Halaman tidak ditemukan",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-7xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-semibold">Halaman tidak ditemukan</h1>
      <p className="max-w-md text-muted-foreground">
        Halaman yang kamu cari tidak ada, sudah dipindahkan, atau tautannya
        salah.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Beranda
        </Link>
        <Link
          href="/pages/Anime"
          className="rounded-md border border-input px-6 py-2 font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Jelajahi Anime
        </Link>
        <Link
          href="/pages/Manga"
          className="rounded-md border border-input px-6 py-2 font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Jelajahi Manga
        </Link>
      </div>
    </div>
  );
}
