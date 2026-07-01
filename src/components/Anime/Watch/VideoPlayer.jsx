"use client";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider, Poster, Track } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { Skeleton } from "@/components/ui/skeleton";

const VideoPlayer = ({
  episodeSrc,
  episodesData,
  currentEpisode,
  episodeLoading,
  captionsData,
  setProgress,
  setDuration,
}) => {
  const captions = captionsData.filter(
    (caption) => caption.kind === "captions"
  );
  const thumbnails = captionsData.filter(
    (caption) => caption.kind === "thumbnails"
  );

  if (episodeLoading || !episodesData) {
    return (
      <div className="w-[72%] max-md:w-full aspect-video flex flex-col gap-4">
        <Skeleton className="flex flex-row items-end p-5 justify-between relative w-full h-full rounded-md">
          <div className="flex flex-row gap-1">
            <Skeleton className="h-[40px] w-[40px] rounded-full" />
            <Skeleton className="h-[40px] w-[40px] rounded-full" />
          </div>
          <Skeleton className="w-[80%] h-[40px]" />
          <div className="flex flex-row gap-1">
            <Skeleton className="h-[40px] w-[40px] rounded-full" />
            <Skeleton className="h-[40px] w-[40px] rounded-full" />
          </div>
        </Skeleton>
      </div>
    );
  }

  if (!currentEpisode) {
    return (
      <div className="w-[72%] max-md:w-full aspect-video rounded-3xl flex items-center justify-center bg-neutral-800/40 border border-neutral-700/40 p-6 text-center">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">Pilih episode untuk mulai menonton</p>
          <p className="text-sm text-muted-foreground max-w-md">
            Klik salah satu episode di daftar sebelah untuk memuat video. Video
            tidak diputar otomatis.
          </p>
        </div>
      </div>
    );
  }

  if (!episodeSrc) {
    return (
      <div className="w-[72%] max-md:w-full aspect-video rounded-3xl flex items-center justify-center bg-neutral-800/40 border border-neutral-700/40 p-6 text-center">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">Stream tidak tersedia</p>
          <p className="text-sm text-muted-foreground max-w-md">
            Sumber video eksternal belum dikonfigurasi atau episode ini tidak
            tersedia. Kamu tetap bisa melihat info, karakter, dan trailer anime
            ini.
          </p>
        </div>
      </div>
    );
  }

  const isEmbed = episodeSrc && !/\.(m3u8|mp4)(\?|$)/i.test(episodeSrc);
  if (isEmbed) {
    return (
      <div className="w-[72%] max-md:w-full aspect-video rounded-3xl overflow-hidden">
        <iframe
          key={currentEpisode}
          src={episodeSrc}
          title={
            episodesData[currentEpisode - 1]?.title ||
            `Episode ${currentEpisode}`
          }
          className="w-full h-full rounded-3xl border-0"
          allow="autoplay; fullscreen; encrypted-media"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div className="w-[72%] max-md:w-full aspect-video rounded-3xl">
      <MediaPlayer
        key={currentEpisode}
        className="vds-player animated"
        title={
          episodesData[currentEpisode - 1]?.title || `Episode ${currentEpisode}`
        }
        src={episodeSrc || ""}
        crossOrigin
        onTimeUpdate={setProgress}
        onLoadedMetadata={setDuration}
      >
        <MediaProvider>
          <Poster
            className="vds-poster"
            src={episodesData[currentEpisode - 1].image}
          />
          {captions.map((c) => (
            <Track
              key={c?.file}
              src={c?.file}
              label={c?.label}
              kind={c?.kind}
              language="en-us"
              type={"vtt"}
              default={c?.default}
            />
          ))}
        </MediaProvider>
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </div>
  );
};

export default VideoPlayer;
