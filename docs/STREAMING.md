# Anime Streaming (Otakudesu — Sub Indo)

Metadata (titles, images, characters, schedules) comes from official free APIs
(Jikan, AniList, Kitsu). Those APIs do **not** serve video. For actual playback
with Indonesian subtitles, the watch page uses a
[wajik-anime-api](https://github.com/wajik45/wajik-anime-api) compatible
instance that scrapes **Otakudesu**.

## How it works

On the watch page:

1. The anime title (from Jikan/AniList) is searched on Otakudesu
   (`/otakudesu/search?q=`), best-matched with Jaro–Winkler.
2. Its episode list is fetched (`/otakudesu/anime/{animeId}`).
3. When you pick an episode, its embed is fetched
   (`/otakudesu/episode/{episodeId}` → `defaultStreamingUrl`) and rendered in an
   iframe. Otakudesu streams are Indonesian hard-sub embeds.

Adapter: `src/lib/sources/otakudesu.js`. It is the only integration point — if
your instance differs, edit that one file.

## Configuration

It defaults to the public demo `https://wajik-anime-api.vercel.app`, so it works
out of the box. Public demos are shared and can be rate-limited or go offline.
For reliability, deploy your own instance and point to it:

```
NEXT_PUBLIC_STREAM_API_URL=https://your-wajik-anime-api.example.com
```

`wajik-anime-api` has a one-click deploy on its repository (Vercel/Render) — no
server administration or coding required, just set the env var above to the URL
you get.

## ⚠️ Legal note

Otakudesu is an Indonesian fansub site. Scraping it is a legal grey area and the
scraper can break whenever the source site changes. This project ships no such
server and does not host any video. Enabling and hosting a provider is the
operator's decision and responsibility.

## Graceful fallback

If the provider returns nothing (down, rate-limited, or no match), the player
shows a clear "Stream tidak tersedia" notice and the rest of the page (info,
characters, trailer, schedule) keeps working.
