import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpenIcon, PlayCircleIcon } from "lucide-react";
import Link from "next/link";

export default function Component() {
  return (
    <div className="container mx-auto px-4 max-md:px-0 py-8">
      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6">
        <Card className="w-full mx-auto">
          <CardHeader className="flex flex-row items-center gap-4">
            <PlayCircleIcon className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Anime</CardTitle>
              <p className="text-sm text-muted-foreground">
                Jelajahi koleksi anime kami yang luas
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <img
              src="/anime_catalog.jpg"
              alt="Anime collection"
              className="w-full h-[300px] object-cover rounded-md max-md:h-[200px]"
            />
            <p className="text-sm text-muted-foreground hidden md:block">
              Terjun ke dalam dunia cerita yang memikat, animasi yang menakjubkan, 
              dan karakter yang tak terlupakan. Bagian anime kami menawarkan beragam
              berbagai genre, dari shonen penuh aksi hingga yang mengharukan
              seri slice-of-life. Apakah Kamu seorang otaku berpengalaman atau baru mengenal
              anime, Kamu akan menemukan sesuatu yang Kamu sukai di koleksi kami yang dikurasi dengan cermat
              koleksi.
            </p>
            <p className="text-sm text-muted-foreground block md:hidden">
              Nikmati kisah-kisah yang mendebarkan dan animasi yang memukau di berbagai genre. 
              Baik Anda penggemar berat atau pendatang baru, 
              koleksi kami memiliki sesuatu untuk semua orang.
            </p>
          </CardContent>
          <CardFooter>
            <Link className="w-full" href={"/pages/Anime"}>
              <Button className="w-full">Jelajahi Anime</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="flex flex-row items-center gap-4">
            <BookOpenIcon className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Komik</CardTitle>
              <p className="text-sm text-muted-foreground">
                Temukan perpustakaan komik kami yang luas
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <img
              src="/manga_catalog.jpg"
              alt="Manga collection"
              className="w-full h-[300px] object-cover rounded-md max-md:h-[200px]"
            />
            <p className="text-sm text-muted-foreground hidden md:block">
              Benamkan diri Kamu dalam dunia komik Jepang yang kaya. 
              Bagian manga kami menampilkan karya-karya dari komik terkenal di berbagai genre. 
              Dari kisah epik yang mencakup ratusan bab hingga cerita pendek yang berdampak, 
              koleksi kami memenuhi semua preferensi bacaan.
            </p>
            <p className="text-sm text-muted-foreground block md:hidden">
              Nikmati kisah-kisah menarik dari kreator-kreator top Jepang. 
              Koleksi manga kami menawarkan campuran seri yang panjang 
              dan narasi pendek yang kuat yang menarik minat semua pembaca.
            </p>
          </CardContent>
          <CardFooter>
            <Link className="w-full" href={"/pages/Manga"}>
              <Button className="w-full">Jelajahi Komik</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
