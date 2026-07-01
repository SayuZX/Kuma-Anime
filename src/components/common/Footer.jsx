import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InstagramIcon } from "lucide-react";
import { LEGAL_LINKS } from "@/lib/legalContent";

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t mx-10 max-md:mx-3 rounded-md">
      <div className="container px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Kuma Anime</h2>
            <p className="text-sm text-muted-foreground">
              Tujuan utama Kami untuk hiburan anime dan komik.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pages/Anime" className="hover:underline">
                  Anime
                </Link>
              </li>
              <li>
                <Link href="/pages/Manga" className="hover:underline">
                  Manga
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Schedule
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  News
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {LEGAL_LINKS.map((link) => (
                <li key={link.slug}>
                  <Link
                    href={`/legal/${link.slug}`}
                    className="hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">Stay Updated</h3>
            <form className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="max-w-[180px] w-[300px] bg-muted/30 rounded-lg"
              />
              <Button type="submit" variant="secondary">
                Kirim
              </Button>
            </form>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <InstagramIcon className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Kuma Anime. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
