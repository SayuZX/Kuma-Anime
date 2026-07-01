# External Streaming Provider (optional)

Kuma Anime is **metadata-first**. The public APIs it uses (Jikan, AniList,
Kitsu, MangaDex) provide titles, images, descriptions, characters, episodes and
schedules — but **no video**. The watch page therefore shows an "unavailable"
notice unless you connect an external streaming provider.

This document describes the optional "provider slot". It is **off by default**
and the app runs perfectly without it.

## ⚠️ Legal warning

There is **no official, free API that streams anime with Indonesian
subtitles**. The only sources are unofficial scrapers of fansub/piracy sites
(Otakudesu, Samehadaku, Kuramanime, and similar) or community APIs that wrap
them. Using them:

- may be **illegal** in your jurisdiction (copyright infringement),
- is **fragile** — it breaks whenever the source site changes,
- must be **self-hosted by you** — this project ships no such server,
- is done **entirely at your own risk and responsibility**.

Kuma Anime does not host, bundle, endorse or provide any such API. Enabling this
slot is your decision as the operator.

## How to enable

1. Deploy your own streaming API (for example one of the open-source
   `*-anime-api` projects) somewhere you control.
2. Set the base URL in `.env.local`:

   ```
   NEXT_PUBLIC_STREAM_API_URL=https://your-stream-api.example.com
   ```

3. Restart / redeploy. The watch page will now request sources from it.

## Request contract

The adapter (`src/lib/sources/streamProvider.js`) calls:

```
GET {NEXT_PUBLIC_STREAM_API_URL}/watch?episodeId={id}&server={server}&category={sub|dub}
```

If your API uses different paths or parameters, edit that one file — it is the
only integration point.

## Expected response

JSON in (or close to) this shape. The adapter is defensive and also accepts
`file`/`src` for source urls and `subtitles`/`captions` for tracks.

```json
{
  "sources": [
    { "url": "https://.../master.m3u8", "quality": "auto", "isM3U8": true }
  ],
  "tracks": [
    { "file": "https://.../id.vtt", "label": "Indonesian", "kind": "captions" },
    { "file": "https://.../en.vtt", "label": "English", "kind": "captions" }
  ]
}
```

## Subtitle priority (Sub Indo first)

Tracks are reordered automatically to **Indonesian → English → other**, and the
top one is marked as the default caption, so an Indonesian subtitle is
auto-selected when present. Users can still switch subtitle, server and category
in the player / server selector; their choice is saved in `localStorage`
(`streamPrefs`).
