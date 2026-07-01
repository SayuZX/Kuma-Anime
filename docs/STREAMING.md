# Anime Streaming (Otakudesu — Sub Indo)

Metadata (titles, images, characters, schedules) comes from official free APIs
(Jikan, AniList, Kitsu). Those APIs do **not** serve video. For playback with
Indonesian subtitles, the watch page uses an Otakudesu-scraper API.

It defaults to the public **Sanka Vollerei** instance
(`https://www.sankavollerei.web.id/anime`), so streaming works out of the box.

## How it works

On the watch page:

1. The anime's romaji title (from Jikan/AniList) is searched
   (`/search/{query}`), with punctuation stripped and progressively shorter
   fallbacks, best-matched with Jaro–Winkler.
2. Its episode list is fetched (`/anime/{animeId}`).
3. When you pick an episode, its embed is fetched (`/episode/{episodeId}` →
   `defaultStreamingUrl`) and rendered in an iframe (Indonesian hard-sub).

Adapter: `src/lib/sources/otakudesu.js`. It is the only integration point.

## Configuration

Override the provider with any API that exposes the same paths:

```
NEXT_PUBLIC_STREAM_API_URL=https://your-instance.example.com/anime
```

Expected paths (base already includes the `/anime` segment):

- `GET {BASE}/search/{query}` → `data.animeList[]` (each has `animeId`, `title`)
- `GET {BASE}/anime/{animeId}` → `data.episodeList[]` (each has `episodeId`, `title`)
- `GET {BASE}/episode/{episodeId}` → `data.defaultStreamingUrl` (embed) + `data.server.qualities[]`

A wajik-anime-api instance is compatible after adjusting the base/paths.

## ⚠️ Legal note

These APIs scrape Indonesian fansub sites (Otakudesu). It is a legal grey area
and the scraper can break when the source site changes. This project ships no
such server and hosts no video. Enabling a provider is the operator's decision.

## Graceful fallback

If the provider returns nothing (down, rate-limited, or no match), the player
shows a clear "Stream tidak tersedia" notice and the rest of the page keeps
working.
