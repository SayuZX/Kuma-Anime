"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUserData } from "@/provider/database";

export default function ContinueReading() {
  const { currentlyReading } = useUserData();

  if (!currentlyReading || currentlyReading.length < 1) {
    return null;
  }

  return (
    <div className="">
      <h2 className="text-3xl max-md:text-2xl font-semibold border-l-8 border-ring px-5 mb-6">
        Continue Reading
      </h2>
      <Carousel opts={{ align: "center" }} className="w-full px-5 max-md:px-10">
        <CarouselContent>
          {currentlyReading.map((manga) => {
            const current = manga.currentChapter ?? 1;
            const total = manga.totalChapters ?? 1;

            return (
              <CarouselItem
                key={manga.mangaId}
                className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="p-1">
                  <Card className="overflow-hidden transition-shadow hover:shadow-lg bg-background/30">
                    <CardContent className="p-0">
                      <div className="relative">
                        <Image
                          src={manga.mangaImage || "/manga-carousel.png"}
                          alt={manga.mangaTitle || "cover"}
                          width={320}
                          height={180}
                          className="w-full aspect-video object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Link
                            href={`/pages/Manga/read/${manga.mangaId}/${manga.chapterId}`}
                          >
                            <Button size="lg" variant="ghost" className="text-white">
                              <BookOpen className="mr-2 h-6 w-6" />
                              Resume
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1 truncate">
                          {manga.mangaTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2 truncate">
                          {manga.chapterName}
                        </p>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Chapter {current}</span>
                          <span className="text-muted-foreground">
                            {total} chapters
                          </span>
                        </div>
                        <Progress
                          value={total ? (current / total) * 100 : 0}
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselNext className="max-md:mr-4" />
        <CarouselPrevious className="max-md:ml-4" />
      </Carousel>
    </div>
  );
}
