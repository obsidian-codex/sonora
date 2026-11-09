# SONORA — The Obsidian Album Archive & Editorial Criticism Platform

> *"Where albums are treated not as background noise, but as singular architectural works."*

**SONORA** is a fullstack web and mobile-first progressive web application (PWA) designed for deep listening, album culture, critical discourse, and unified music discovery.

---

## ✨ Features

- 🎧 **Playable High-Fidelity Audio Previews**: Integrated 30-second AAC/M4A streams with interactive progress scrubbing and global bottom floating player.
- 🖼️ **Lossless High-Resolution Artwork**: 1000×1000 Apple CDN-backed cover art across all curated albums, singles, and artist portraits.
- 🖋️ **Editorial AI Criticism via Google Gemini**: Dynamic, nuanced track-by-track and album critical analyses powered by `gemini-3.5-flash` with smart in-memory caching and iconic fallback wisdom.
- 🏛️ **Artist Portfolios & Discographies**: Dedicated `/artists` directory and dynamic `/artist/[slug]` pages with complete release catalogs, essential tracks, and historical context.
- 🔍 **Unified Live Search**: Fast global search across albums, tracks, and artists powered by MusicBrainz & Apple Music APIs.
- 🌌 **Atmospheric Mood Rooms**: Curated listening atmospheres tailored for *Late Night Contemplation*, *Deep Focus*, *Euphoric Catharsis*, and *Melancholia*.
- 📊 **Listener Archive & Rating Meter**: Personal vault tracking ratings (1–10 scale), saved records, and listening history.
- 📱 **Installable Progressive Web App (PWA)**: Standalone desktop and mobile experience with custom icons and splash theme.
- 🔗 **Deep Platform Linking**: One-click direct redirection to Spotify, Apple Music, YouTube Music, Tidal, Deezer, Amazon Music, and SoundCloud.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server & Client Components)
- **Language**: TypeScript 5.7+
- **Styling**: Tailwind CSS v4 + bespoke serif editorial design system
- **State Management**: [Zustand 5](https://github.com/pmndrs/zustand) (Audio playback, user archive, persistent ratings)
- **AI Engine**: [Google Gemini API](https://ai.google.dev/) (`gemini-3.5-flash`)
- **Metadata Engines**: MusicBrainz API + Apple Music Unified Engine
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18.18.0 or newer recommended)
- `npm` or `pnpm`

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/<your-username>/sonora.git
cd sonora
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Gemini API Key (Required for live editorial critiques)
GEMINI_API_KEY="your-gemini-api-key"

# Optional: Supabase & MusicBrainz
# VITE_SUPABASE_URL=""
# VITE_SUPABASE_ANON_KEY=""
```

### 4. Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience Sonora.

### 5. Production Build

```bash
npm run build
npm run start
```

---

## 📂 Architecture Overview

```
sonora/
├── app/
│   ├── artist/[slug]/      # Dedicated artist profiles & discography
│   ├── artists/            # Curated artist directory
│   ├── mood/[slug]/        # Atmospheric listening rooms
│   ├── moods/              # Mood directory
│   ├── profile/            # User archive, ratings & saved albums
│   ├── record/[slug]/      # Deep album editorial review page
│   ├── search/             # Global live unified search
│   ├── track/[id]/         # Track critique with Gemini analysis & player
│   ├── layout.tsx          # Root layout & global audio bar
│   ├── manifest.ts         # PWA Manifest
│   └── page.tsx            # Editorial landing page & curated records
├── components/
│   ├── sonora/             # Bespoke UI (Floating player, nav, cards)
│   └── ui/                 # Reusable Base UI & Radix primitives
├── lib/
│   ├── data.ts             # Curated foundational album & track records
│   ├── gemini.ts           # Gemini 3.5-flash critic engine & caches
│   ├── music-api.ts        # Unified MusicBrainz & Apple Music APIs
│   ├── player-store.ts     # Global audio player state
│   └── library-store.tsx   # Local user archive & ratings store
└── public/                 # High-res assets, icons, platform SVGs
```

---

## 📄 License

MIT © [Kartikey](https://github.com/)
