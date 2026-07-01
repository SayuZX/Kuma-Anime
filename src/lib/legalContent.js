export const SITE = {
  name: "Kuma Anime",
  url: "https://kuma-anime.vercel.app",
  email: "pixelraihan77@gmail.com",
  updated: "1 July 2026",
};

export const LEGAL_LINKS = [
  { slug: "about", label: "About Us" },
  { slug: "contact", label: "Contact Us" },
  { slug: "privacy-policy", label: "Privacy Policy" },
  { slug: "terms-of-service", label: "Terms of Service" },
  { slug: "disclaimer", label: "Disclaimer" },
  { slug: "dmca", label: "DMCA Policy" },
  { slug: "copyright", label: "Copyright Policy" },
  { slug: "cookie-policy", label: "Cookie Policy" },
  { slug: "community-guidelines", label: "Community Guidelines" },
  { slug: "content-removal", label: "Content Removal Request" },
];

export const LEGAL = {
  about: {
    title: "About Us",
    description:
      "Kuma Anime is a free anime and manga discovery platform that aggregates public metadata from open APIs.",
    sections: [
      {
        heading: "Who we are",
        body: [
          "Kuma Anime is a fan-made discovery platform for anime and manga. We help you browse titles, read synopses, view characters, check airing schedules and track what you are watching or reading.",
          "The project is open, non-commercial and built for the community.",
        ],
      },
      {
        heading: "Where our data comes from",
        body: [
          "All catalogue information is fetched in real time from public, third-party APIs: Jikan (MyAnimeList), AniList, Kitsu and MangaDex. We do not own this data and we do not modify it beyond formatting it for display.",
          "We do not host, upload, store or stream any anime episodes, video files or copyrighted media on our servers.",
        ],
      },
      {
        heading: "Contact",
        body: [
          "Questions, suggestions or corrections are welcome. Reach us at " +
            SITE.email +
            ".",
        ],
      },
    ],
  },
  contact: {
    title: "Contact Us",
    description: "How to reach the Kuma Anime team for support, legal or press.",
    sections: [
      {
        heading: "Get in touch",
        body: [
          "For general questions, bug reports, feature requests, business or legal matters, email us at " +
            SITE.email +
            ".",
          "We aim to respond to legitimate requests within a reasonable time.",
        ],
      },
      {
        heading: "Reporting content or copyright",
        body: [
          "If you are a rights holder, please use our DMCA Policy and Content Removal Request pages so we can route your notice correctly and act quickly.",
        ],
      },
    ],
  },
  "privacy-policy": {
    title: "Privacy Policy",
    description:
      "How Kuma Anime handles data. In short: we do not run accounts and we do not sell your data.",
    sections: [
      {
        heading: "Information we collect",
        body: [
          "Kuma Anime does not require registration and does not ask for personal information. We do not operate user accounts.",
          "Your watch history, reading history and preferences (such as subtitle/title language) are stored only in your own browser via localStorage. This data never leaves your device and is not transmitted to us.",
        ],
      },
      {
        heading: "Third-party services",
        body: [
          "Pages load images and metadata directly from third-party providers (MyAnimeList/Jikan, AniList, Kitsu, MangaDex). Those providers may receive your IP address as part of serving the request, governed by their own privacy policies.",
          "If the site is hosted on a platform such as Vercel, standard server and CDN logs may be collected by that host.",
        ],
      },
      {
        heading: "Cookies and local storage",
        body: [
          "We do not use tracking or advertising cookies. See our Cookie Policy for details on the local storage keys we use for your preferences.",
        ],
      },
      {
        heading: "Your control",
        body: [
          "You can clear all locally stored data at any time by clearing your browser storage for this site. Doing so removes your history and preferences.",
        ],
      },
    ],
  },
  "terms-of-service": {
    title: "Terms of Service",
    description:
      "The terms that govern your use of Kuma Anime, a free metadata discovery service.",
    sections: [
      {
        heading: "Acceptance",
        body: [
          "By accessing Kuma Anime you agree to these Terms. If you do not agree, please do not use the service.",
        ],
      },
      {
        heading: "The service",
        body: [
          "Kuma Anime provides an interface for discovering anime and manga using publicly available metadata from third-party APIs. The service is provided free of charge, on an 'as is' and 'as available' basis, without warranties of any kind.",
          "We do not host or stream copyrighted video content. Availability and accuracy of third-party data are outside our control.",
        ],
      },
      {
        heading: "Acceptable use",
        body: [
          "You agree not to abuse, overload, scrape at scale, or attempt to disrupt the service or the upstream providers it relies on, and not to use it for any unlawful purpose.",
        ],
      },
      {
        heading: "Changes and termination",
        body: [
          "We may modify or discontinue the service, or update these Terms, at any time. Continued use after changes constitutes acceptance.",
        ],
      },
    ],
  },
  disclaimer: {
    title: "Disclaimer",
    description:
      "Kuma Anime is an unofficial metadata aggregator and hosts no copyrighted media.",
    sections: [
      {
        heading: "No hosted content",
        body: [
          "Kuma Anime does not host, upload, store or stream any videos, episodes or copyrighted files. We display metadata (titles, images, descriptions, schedules) sourced from public third-party APIs.",
        ],
      },
      {
        heading: "No affiliation",
        body: [
          "Kuma Anime is not affiliated with, endorsed by, or sponsored by MyAnimeList, AniList, Kitsu, MangaDex, or any anime studio, publisher or distributor. All trademarks and copyrights belong to their respective owners.",
        ],
      },
      {
        heading: "Accuracy",
        body: [
          "Information is provided for general reference and may be incomplete, outdated or incorrect because it originates from third parties. We make no guarantees regarding accuracy or availability.",
        ],
      },
    ],
  },
  dmca: {
    title: "DMCA Policy",
    description:
      "How to submit a Digital Millennium Copyright Act notice to Kuma Anime.",
    sections: [
      {
        heading: "Our position",
        body: [
          "Kuma Anime respects intellectual property rights and hosts no copyrighted media. We only display metadata retrieved from third-party APIs. Where a valid notice concerns material we control (for example a thumbnail cached by our display layer), we will act promptly.",
        ],
      },
      {
        heading: "Filing a notice",
        body: [
          "Send a written notice to " +
            SITE.email +
            " including: (1) your contact details; (2) identification of the copyrighted work; (3) the exact URL(s) on this site; (4) a statement of good-faith belief that the use is unauthorised; (5) a statement, under penalty of perjury, that the information is accurate and you are authorised to act; and (6) your physical or electronic signature.",
        ],
      },
      {
        heading: "Counter-notice",
        body: [
          "If content you posted was removed and you believe this was a mistake, you may submit a counter-notice with equivalent detail to the same address.",
        ],
      },
    ],
  },
  copyright: {
    title: "Copyright Policy",
    description:
      "Ownership of content shown on Kuma Anime and how we handle copyright.",
    sections: [
      {
        heading: "Ownership",
        body: [
          "All anime, manga, artwork, titles, characters and related media referenced on Kuma Anime are the property of their respective copyright holders. Metadata and images are fetched from third-party providers and remain the property of those owners.",
        ],
      },
      {
        heading: "Fair use and reference",
        body: [
          "Kuma Anime uses limited metadata and imagery solely to help users discover and reference titles. We do not claim ownership of any third-party content.",
        ],
      },
      {
        heading: "Requests",
        body: [
          "Copyright holders may request removal or correction of any reference via our DMCA Policy or Content Removal Request page.",
        ],
      },
    ],
  },
  "cookie-policy": {
    title: "Cookie Policy",
    description:
      "Kuma Anime uses no tracking cookies; only local storage for your preferences.",
    sections: [
      {
        heading: "No tracking cookies",
        body: [
          "We do not use advertising or analytics tracking cookies.",
        ],
      },
      {
        heading: "Local storage we use",
        body: [
          "To make the app work we store small values in your browser's localStorage: your theme, title language preference (Romaji/English), watch history, reading history and cached home data for faster loading. These stay on your device.",
        ],
      },
      {
        heading: "Managing storage",
        body: [
          "You can delete this data any time by clearing site data in your browser settings.",
        ],
      },
    ],
  },
  "community-guidelines": {
    title: "Community Guidelines",
    description: "Expectations for respectful use of Kuma Anime.",
    sections: [
      {
        heading: "Be respectful",
        body: [
          "Treat others with respect. Harassment, hate speech, and abusive behaviour are not tolerated in any community space associated with Kuma Anime.",
        ],
      },
      {
        heading: "Keep it lawful",
        body: [
          "Do not use Kuma Anime to share, request or promote pirated content or any illegal material. Respect the rights of creators and publishers.",
        ],
      },
      {
        heading: "Help us improve",
        body: [
          "Report bugs, broken data or inappropriate references so we can keep the platform useful and clean.",
        ],
      },
    ],
  },
  "content-removal": {
    title: "Content Removal Request",
    description:
      "Request removal of a title, image or reference from Kuma Anime.",
    sections: [
      {
        heading: "What we can remove",
        body: [
          "Because our catalogue is generated from third-party APIs, we can hide specific titles or references from our interface on request, even though the underlying data lives on external providers.",
        ],
      },
      {
        heading: "How to request",
        body: [
          "Email " +
            SITE.email +
            " with the exact URL(s), the title in question, and the reason for removal (copyright, privacy, inaccuracy, or other). Rights-holder requests are prioritised.",
          "We will review and respond to valid requests as quickly as we reasonably can.",
        ],
      },
    ],
  },
};
