# SONORA — Master Project Plan
> **Status:** Phase 0 — Awaiting Approval  
> **Last updated:** 2026-10-16  
> **Author:** Antigravity (Planning Agent)

---

## Table of Contents

1. [Product Requirements Document (PRD)](#1-product-requirements-document)
2. [UX & Information Architecture](#2-ux--information-architecture)
3. [Technical Architecture](#3-technical-architecture)
4. [Implementation Plan](#4-implementation-plan)
5. [Cost & API Assessment](#5-cost--api-assessment)
6. [Repository Plan](#6-repository-plan)

---

## 1. Product Requirements Document

### 1.1 Target Users

| Persona | Description |
|---|---|
| **The Archivist** | Catalogues every album they've heard. Loves completeness, ratings, tracklists, and genre metadata. |
| **The Discoverer** | Actively seeks new music but doesn't know where to start. Values curated entry points and mood/theme navigation. |
| **The Critic** | Writes thoughtful, long-form reviews. Wants to be read by people who care, not buried under star-spam. |
| **The Casual Fan** | Follows a few artists. Wants to know what's new and whether an album is worth their time. |
| **The Deep-Diver** | Wants to understand *why* an album sounds the way it does — influences, production, context, themes. |

Primary audience for MVP: Archivist + Discoverer. Critic features in Phase 4. Deep-Diver (Album Intelligence) in Phase 7.

---

### 1.2 Main User Problems

1. **Streaming services bury context.** Spotify/Apple Music tell you *what* to listen to but nothing about *why* it matters.
2. **Review sites feel like databases.** Rate Your Music and Album of the Year are useful but visually sparse and community-hostile for newcomers.
3. **Discovery is algorithmic and opaque.** Users cannot understand or trust recommendations.
4. **Album culture is fragmented.** Ratings, reviews, context, and listening links live on separate sites.
5. **Music taste has no home.** There is no beautiful, personal space to display what you love and why.

---

### 1.3 Product Positioning

> SONORA is the album culture platform for people who love music deeply — not just people who stream it.

We are not a music player. We are the place where albums mean something.

- vs. Rate Your Music: More beautiful, more welcoming, mobile-first.
- vs. Album of the Year: More editorial depth, personal taste profiles, better discovery.
- vs. Spotify: We help you *understand* music, not just consume it.
- vs. Pitchfork: Community voice matters as much as editorial voice.

---

### 1.4 Core User Journeys (MVP)

**Journey 1 — Discovery**
Arrive at home → See featured/trending albums → Click album card →
Read reviews + community score → Follow links to listening service → Saved to collection

**Journey 2 — Search**
Type artist or album name → See debounced results → Select result →
Land on album/artist page → Explore tracklist and metadata → Rate or review

**Journey 3 — Rate & Review**
Visit album page → Sign in (if not) → Submit star rating (1-10) →
Optionally write review → Review published → Score updates

**Journey 4 — Collection**
Save album to collection → Visit profile → See personal ratings, saved albums, reviews →
Public profile shows music taste at a glance

**Journey 5 — Artist Exploration**
Click artist name on any page → Artist page → Browse discography →
See timeline of releases → Follow artist → Get new release visibility

---

### 1.5 MVP Features (Phase 1-5)

| Feature | Priority |
|---|---|
| Home/Discovery page with featured + trending sections | P0 |
| Album search (MusicBrainz-powered, debounced) | P0 |
| Album page (artwork, metadata, tracklist, external links) | P0 |
| Artist page (bio, discography) | P0 |
| Genre browsing | P1 |
| User authentication (email/password + Google OAuth) | P0 |
| Album ratings (1-10, one per user per album) | P0 |
| Written reviews (create, edit, delete) | P0 |
| Review voting (helpful/not helpful) | P1 |
| Personal collections (saved albums, lists) | P1 |
| Public user profile with taste summary | P1 |
| Follow artists | P1 |
| SONORA community score (Bayesian weighted average) | P0 |
| Rating distribution visualization | P1 |
| Similar album recommendations (metadata-based) | P1 |
| New releases section | P1 |
| Mobile-first responsive design | P0 |

---

### 1.6 Features Explicitly Excluded from MVP

- Music playback of any kind
- AI album analysis / Album Intelligence (Phase 7)
- Personalized ML-based recommendations (Phase 6)
- Real-time notifications
- Direct messaging between users
- Podcast support
- Label pages
- Concert/event listings
- Live lyrics
- User-uploaded profile pictures stored in Supabase Storage (use initials fallback)
- Verified artist badges
- Affiliate/monetization features

---

### 1.7 Success Metrics (MVP)

| Metric | Target at 3 months |
|---|---|
| Albums with at least one community rating | >500 |
| Written reviews submitted | >200 |
| Return visit rate (D7) | >20% |
| Search success rate | >80% (result clicked) |
| Mobile usability score (Lighthouse) | >85 |
| Core Web Vitals pass rate | >90% |
| Accessibility score | >90 (axe-core) |

---

## 2. UX & Information Architecture

### 2.1 Sitemap

```
/                         Home (Discovery feed + editorial)
/search                   Search (artists, albums, tracks)
/discover                 Discover (genre grid, mood, new releases, trending)
/album/:mbid              Album page
/artist/:mbid             Artist page
/genre/:slug              Genre page (list of albums)
/user/:username           Public user profile
/collection               My Collection (auth required)
/collection/:listId       Specific user list
/settings                 Account settings (auth required)
/login                    Sign in
/register                 Create account
/404                      Not found
/error                    Error boundary page
```

---

### 2.2 Desktop Navigation

A **minimal top navigation bar** — not a sidebar, not a streaming dock.

```
[SONORA logo]    [Discover]  [Search]      [username or Sign in]
```

- Logo left-aligned, Discover and Search center, auth right
- Search opens a full-screen overlay (not a sidebar drawer)
- Sticky on scroll with backdrop-blur transition
- No hamburger menus on desktop
- No persistent sidebar
- No playback controls anywhere on the page

---

### 2.3 Mobile Navigation

Bottom navigation bar with 5 tabs:

```
[Home]  [Discover]  [Search]  [Collection]  [Profile]
```

- Icons with text labels
- Active state: accent color underline
- Search tab opens a full-screen search page
- Top area: page title only, back arrow where needed
- No floating action buttons

---

### 2.4 Important Page Layouts

**Home Page:**
- Hero: Full-bleed featured album (large artwork, editorial headline, score, links)
- Editorial Picks: 2-3 curated cards, asymmetric layout
- New Releases: Compact grid (4-6 items), horizontal scroll on mobile
- Trending This Week: Numbered list or card row
- Browse by Genre: Asymmetric mosaic grid

**Album Page:**
- Left column: Large artwork, external links, similar albums
- Right column: Title, artist, year, score, rating widget, genre tags
- Full-width: Tracklist, editorial notes, community reviews
- Mobile: All stacked, artwork at top

**Artist Page:**
- Full-bleed header with artist name
- Bio text
- Discography: Chronological grid, filterable by type (Album / EP / Single)
- Related artists row

**Search Page:**
- Persistent search input at top
- Segmented results: Albums | Artists | Tracks
- Keyboard-navigable result list
- Empty state, loading skeleton, error state

---

### 2.5 Key Interaction Flows

**Rating Flow:**
1. User visits album page
2. Not logged in: rating widget shows "Sign in to rate"
3. Logged in: 10-star selector shown
4. On selection: optimistic UI update, POST to Supabase
5. Community score recalculates via DB trigger
6. Confirm via toast notification

**Review Flow:**
1. "Write a review" expands textarea below rating
2. Minimum 50 characters enforced client-side and server-side
3. Submit: review appears at top of community list
4. Edit / delete available via author's own review card
5. Report button available to other users

**External Link Flow:**
- "Listen on" section shows service buttons
- Each button is a plain `<a>` link with rel="noopener noreferrer"
- Links sourced from `external_links` table (community-contributed, admin-verified)
- If no links: "No listening links available yet" message

---

### 2.6 Accessibility Requirements

- WCAG 2.1 AA minimum
- Semantic HTML: nav, main, article, section, aside, header, footer
- Single h1 per page
- All images have meaningful alt text (or alt="" for decorative)
- Keyboard-navigable interactive elements with visible :focus-visible states
- Sufficient color contrast (4.5:1 normal, 3:1 large text)
- prefers-reduced-motion: all animations disabled/simplified
- ARIA labels on icon-only buttons
- Form labels associated with inputs
- Loading states announced via aria-live regions
- Skip-to-content link at top of page

---

## 3. Technical Architecture

### 3.1 Frontend Structure

**Stack:**
- React 18 + TypeScript (strict)
- Vite
- Tailwind CSS v3 with custom design tokens
- Lucide React icons
- React Router v6
- Zustand (global auth/UI state)
- TanStack Query v5 (server state, caching)
- React Hook Form + Zod (forms + validation)

```
src/
├── assets/
├── components/
│   ├── ui/               (Button, Card, Input, StarRating, Badge, Avatar, Skeleton, Toast)
│   ├── layout/           (NavBar, Footer, MobileNav, PageWrapper)
│   └── features/
│       ├── album/        (AlbumCard, AlbumHeader, Tracklist, ReviewList)
│       ├── artist/       (ArtistCard, Discography)
│       ├── discovery/    (HeroFeature, GenreGrid, TrendingRow)
│       ├── search/       (SearchBar, SearchResults)
│       ├── review/       (ReviewForm, ReviewCard, RatingWidget)
│       └── user/         (UserProfile, CollectionGrid)
├── hooks/                (useDebounce, useAlbum, useArtist, useAuth, useRating)
├── lib/
│   ├── supabase.ts
│   ├── musicbrainz.ts
│   ├── coverart.ts
│   └── queryClient.ts
├── pages/                (Home, Discover, Search, Album, Artist, Genre, UserProfile,
│                          Collection, Settings, Login, Register, NotFound)
├── stores/               (authStore.ts, uiStore.ts)
├── types/                (album.ts, artist.ts, review.ts, user.ts, musicbrainz.ts)
├── utils/                (format.ts, score.ts, image.ts)
├── App.tsx
└── main.tsx
```

---

### 3.2 Backend Responsibilities (Supabase)

| Responsibility | Solution |
|---|---|
| Authentication | Supabase Auth (email + Google OAuth) |
| Database | PostgreSQL via Supabase |
| Authorization | Supabase RLS policies |
| User data API | Supabase auto-generated REST API |
| MusicBrainz proxy + rate limiting | Supabase Edge Function |
| Community score calculation | DB trigger + PostgreSQL function |
| Metadata caching | cached_metadata table + Edge Function |

No separate Node.js backend needed at MVP scale. Edge Functions handle the complexity that cannot be safely done client-side.

---

### 3.3 Database Design

#### Core Tables

```sql
-- Extends Supabase auth.users
profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id),
  username        text UNIQUE NOT NULL,
  display_name    text,
  bio             text,
  avatar_url      text,
  is_private      boolean DEFAULT false,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
)

artists (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mbid            text UNIQUE NOT NULL,      -- MusicBrainz ID
  name            text NOT NULL,
  sort_name       text,
  bio             text,
  country         text,
  formed_year     integer,
  artist_type     text,
  image_url       text,
  cached_at       timestamptz DEFAULT now()
)

albums (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mbid            text UNIQUE NOT NULL,      -- release-group MBID (canonical)
  release_mbid    text,                      -- specific release MBID
  title           text NOT NULL,
  artist_id       uuid REFERENCES artists(id),
  release_date    date,
  release_year    integer GENERATED ALWAYS AS (EXTRACT(YEAR FROM release_date)::int) STORED,
  label           text,
  album_type      text,
  total_tracks    integer,
  artwork_url     text,
  cached_at       timestamptz DEFAULT now()
)

tracks (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id        uuid NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  mbid            text UNIQUE,
  title           text NOT NULL,
  position        integer NOT NULL,
  duration_ms     integer,
  disc_number     integer DEFAULT 1
)

genres (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text UNIQUE NOT NULL,
  slug            text UNIQUE NOT NULL,
  description     text,
  cover_image_url text
)

album_genres (
  album_id        uuid REFERENCES albums(id) ON DELETE CASCADE,
  genre_id        uuid REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (album_id, genre_id)
)
```

#### User Interaction Tables

```sql
ratings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  album_id        uuid NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  score           integer NOT NULL CHECK (score BETWEEN 1 AND 10),
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),
  UNIQUE (user_id, album_id)
)

reviews (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  album_id        uuid NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  body            text NOT NULL CHECK (char_length(body) >= 50),
  is_edited       boolean DEFAULT false,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),
  UNIQUE (user_id, album_id)
)

review_votes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id     uuid NOT NULL REFERENCES profiles(id),
  voter_id        uuid NOT NULL REFERENCES profiles(id),
  review_id       uuid NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  is_helpful      boolean NOT NULL,
  created_at      timestamptz DEFAULT now(),
  UNIQUE (voter_id, review_id),
  CHECK (reviewer_id != voter_id)
)

saved_albums (
  user_id         uuid REFERENCES profiles(id) ON DELETE CASCADE,
  album_id        uuid REFERENCES albums(id) ON DELETE CASCADE,
  saved_at        timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, album_id)
)

follows_artists (
  follower_id     uuid REFERENCES profiles(id) ON DELETE CASCADE,
  artist_id       uuid REFERENCES artists(id) ON DELETE CASCADE,
  followed_at     timestamptz DEFAULT now(),
  PRIMARY KEY (follower_id, artist_id)
)

user_lists (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title           text NOT NULL,
  description     text,
  is_public       boolean DEFAULT true,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
)

user_list_items (
  list_id         uuid REFERENCES user_lists(id) ON DELETE CASCADE,
  album_id        uuid REFERENCES albums(id) ON DELETE CASCADE,
  position        integer NOT NULL,
  note            text,
  added_at        timestamptz DEFAULT now(),
  PRIMARY KEY (list_id, album_id)
)
```

#### Supporting Tables

```sql
external_links (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id        uuid REFERENCES albums(id) ON DELETE CASCADE,
  service         text NOT NULL,   -- 'spotify' | 'apple_music' | 'youtube' | 'tidal' etc.
  url             text NOT NULL,
  verified        boolean DEFAULT false,
  added_by        uuid REFERENCES profiles(id),
  added_at        timestamptz DEFAULT now()
)

-- Pre-computed scores updated by trigger
album_scores (
  album_id        uuid PRIMARY KEY REFERENCES albums(id) ON DELETE CASCADE,
  community_score numeric(4,2),     -- Bayesian weighted, 0-10
  raw_average     numeric(4,2),
  rating_count    integer DEFAULT 0,
  review_count    integer DEFAULT 0,
  score_updated_at timestamptz DEFAULT now()
)

editorial_notes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id        uuid UNIQUE REFERENCES albums(id) ON DELETE CASCADE,
  body            text,             -- Markdown
  authored_by     text,
  published_at    timestamptz,
  updated_at      timestamptz DEFAULT now()
)

reports (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id     uuid REFERENCES profiles(id),
  review_id       uuid REFERENCES reviews(id) ON DELETE CASCADE,
  reason          text NOT NULL,
  resolved        boolean DEFAULT false,
  created_at      timestamptz DEFAULT now()
)
```

#### Community Score Algorithm (Bayesian Average)

```
score = (C x m + sum_of_ratings) / (C + n)

Where:
  n = number of ratings for this album
  C = confidence threshold (default: 25, tunable)
  m = global mean rating across all albums
  sum_of_ratings = sum of all scores for this album
```

Computed by a PostgreSQL function triggered after INSERT / UPDATE / DELETE on `ratings`. The result is stored in `album_scores` to avoid recalculating on every page load.

---

### 3.4 External Integrations

#### MusicBrainz API (Verified)
- Base URL: `https://musicbrainz.org/ws/2/`
- Format: JSON (add `fmt=json` to all requests)
- Auth: None for read-only. Must set `User-Agent` header identifying the app.
- Rate limit: **1 request/second per IP** — strictly enforced (503 on violation, potential IP ban)
- License: CC0 for data facts. Non-commercial use is free. Commercial use requires a license from MetaBrainz.
- Attribution: Should credit MusicBrainz where metadata is displayed.
- Strategy: All calls routed through Supabase Edge Function which queues requests at 1/s, sets the User-Agent, and caches responses.

Key endpoints:
```
GET /ws/2/release-group/:mbid?inc=artists+genres+releases&fmt=json
GET /ws/2/artist/:mbid?inc=release-groups&type=album&fmt=json
GET /ws/2/release-group?query=:term&limit=10&fmt=json
GET /ws/2/artist?query=:term&limit=10&fmt=json
```

#### Cover Art Archive (Verified)
- Base URL: `https://coverartarchive.org/release/:release-mbid/`
- Auth: None
- Important: Images are **copyrighted by their respective owners**. Display for reference only — do not redistribute or modify.
- Fallback: Generated placeholder (album initial + gradient) when artwork unavailable.
- Attribution: Link to Cover Art Archive source.

#### Supabase Auth (Verified)
- Providers: Email/password, Google OAuth
- JWT managed automatically; sessions stored by Supabase SDK
- Rate limiting: Configurable in Supabase dashboard

#### Gemini API (Phase 7 only — optional, not yet verified for exact current pricing)
- Called server-side only via Edge Function
- API key never exposed to frontend
- Free tier: Approximately 15 RPM, ~1M tokens/day on Flash model (verify current limits before implementing)
- Data policy: Free tier prompts may be used for training — use paid tier if handling sensitive user content
- Hard quota tracked in DB to prevent cost overrun

---

### 3.5 Authentication & Authorization

**RLS Policy Summary:**

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| profiles | Public | Auth (own) | Own row | Own row |
| albums / artists | Public | Service role | Service role | — |
| ratings | Public | Authenticated | Own row | Own row |
| reviews | Public | Authenticated | Own row | Own row |
| review_votes | Public | Auth (not own review) | — | Own row |
| saved_albums | Own only | Authenticated | — | Own row |
| follows_artists | Public | Authenticated | — | Own row |
| user_lists | Public (if public) | Authenticated | Own row | Own row |
| external_links | Public | Authenticated | Service role | — |
| editorial_notes | Public | Service role | Service role | — |
| reports | — | Authenticated | — | — |
| album_scores | Public | Service role (trigger) | Service role (trigger) | — |

---

### 3.6 Caching Strategy

| Data | Cache Location | TTL |
|---|---|---|
| MusicBrainz metadata | DB table (cached_metadata) | 7 days |
| Cover Art images | Browser cache | 30 days |
| Album community scores | album_scores table (real-time trigger) | Real-time |
| Search results | TanStack Query | 5 minutes |
| User profile | TanStack Query | 2 minutes |
| Genre list | TanStack Query | 1 hour |

No Redis, no external cache service needed at MVP scale.

---

### 3.7 Error Handling

- Global React error boundary
- Page-level error boundaries for album/artist pages
- All async states modeled: loading (skeleton) | error (message + retry) | empty (suggestions) | not_found (404)
- MusicBrainz 503: Retry with exponential backoff in Edge Function
- MusicBrainz 404: Return null, show "not found" state
- Timeout (>5s): Use cached data if available

---

### 3.8 Security Considerations

- No API keys in frontend code (MusicBrainz needs none; Gemini key in Edge Function env only)
- Supabase anon key is safe to expose (RLS is the authorization layer)
- Zod validation on all user inputs (client + server)
- Review body: min 50 chars, max 10,000 chars enforced in form and DB CHECK
- XSS: React auto-escapes; markdown rendering must use a sanitizing library
- Content Security Policy headers set in vercel.json
- No raw SQL on the client — all queries via Supabase JS client (parameterized)
- Secrets never committed — .env.example only

---

## 4. Implementation Plan

### Phase 0 — Product Specification & Planning
**Status: In Progress**
- Deliverables: PLAN.md, DESIGN.md
- Acceptance: Plan approved, open questions answered

### Phase 1 — Design System & Frontend Foundation
**Estimated effort: 3-5 days**
- Vite + React + TypeScript + Tailwind initialized
- Design tokens in Tailwind config
- Core UI components (Button, Card, Input, Avatar, Skeleton, Badge, Toast, StarRating)
- Layout components (NavBar, MobileNav, Footer, PageWrapper)
- React Router with all routes (pages as stubs)
- Google Fonts loaded, prefers-reduced-motion applied
- Acceptance: npm run dev runs clean, tsc --noEmit passes, Lighthouse a11y >90

### Phase 2 — Core Pages with Demo Data
**Estimated effort: 4-6 days | Depends on: Phase 1**
- Home, Album, Artist, Genre, Search, Profile, 404, Error pages
- All demo data clearly labeled (DEMO DATA badge)
- Full mobile + desktop layout at 375px / 768px / 1280px
- Acceptance: All pages navigate, no broken layouts, skeletons shown

### Phase 3 — Music Metadata Integration & Search
**Estimated effort: 5-7 days | Depends on: Phase 2**
- Supabase Edge Function: MusicBrainz proxy (1-req/s queue, User-Agent, caching)
- Album + Artist pages pull real data via MBID
- Cover Art Archive integration with fallback
- Debounced search (300ms) with loading/empty/error states
- Acceptance: Real Radiohead search works, data cached in DB, rate limit respected

### Phase 4 — Auth, Ratings, Reviews & Collections
**Estimated effort: 6-8 days | Depends on: Phase 3**
- Supabase Auth (email + Google OAuth)
- Login / Register pages functional
- Rating widget (1-10, one per user per album, optimistic UI)
- Review form (create/edit/delete, 50-char minimum)
- Community score display (Bayesian, DB trigger)
- Rating distribution chart
- Review list (paginated, sortable: Newest / Most Helpful)
- Review voting
- Save album / Follow artist
- My Collection page (auth-required)
- Public user profile
- All RLS policies implemented
- Acceptance: Cannot rate twice, review 50+ chars enforced, unauthorized mutations rejected

### Phase 5 — Artist Pages, Editorial Content & External Links
**Estimated effort: 3-5 days | Depends on: Phase 4**
- Complete artist discography (paginated, type-filtered)
- Release timeline visualization
- Related artists (from MusicBrainz)
- Editorial notes (admin-inserted via Supabase dashboard)
- External listening links (community-contributed, admin-verified)
- New releases section (real MusicBrainz data, past 60 days)
- Acceptance: Discography chronological, links open correctly, new releases real

### Phase 6 — Personalized Discovery & Recommendation Baseline
**Estimated effort: 4-6 days | Depends on: Phase 5**
- Content-based similarity (genre + era overlap)
- "Similar albums" on album page
- "You might like" on home page for logged-in users (based on saved/rated)
- Cold-start: logged-out users see editorial curation
- Trending: albums with most ratings in past 7 days (no fake stats)
- Genre exploration with real data
- Acceptance: Similar albums genuinely similar, trending clearly labeled, personalized differs from trending for 5+ ratings

### Phase 7 — Optional AI Album Analysis
**Estimated effort: 5-8 days | Depends on: Phase 5 | Requires: API key decision**
- Edge Function: Gemini API analysis endpoint
- AI-generated album summary (themes, sound, influences)
- Clearly labeled "AI Analysis" — not editorial fact
- Graceful degradation when quota exceeded
- Hard quota tracked in DB
- Response cached to avoid repeated API calls
- Acceptance: AI content clearly labeled, no invented facts, quota enforced, key never in browser

### Phase 8 — Security, Testing, Performance & Deployment
**Estimated effort: 5-7 days | Depends on: All previous**
- Full Lighthouse audit (Performance >80, Accessibility >90, SEO >90)
- Core Web Vitals measurement
- Vitest unit tests for score calculation, formatting
- React Testing Library tests for rating and review flows
- RLS audit: unauthorized mutations verified rejected
- CSP headers in vercel.json
- robots.txt, sitemap.xml
- README with full setup guide
- Vercel deployment
- Acceptance: Builds clean, deployed at public URL, README sufficient for fresh setup

---

### Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| MusicBrainz data gaps (missing artwork) | High | Medium | Fallback UI for all missing fields |
| Cover Art copyright restrictions | Medium | Medium | Display only; link to source; no redistribution |
| Supabase free tier project pause (1-week inactivity) | Medium | High | Scheduled ping or upgrade to Pro ($25/mo) |
| MusicBrainz rate limit violations | Medium | Medium | Edge Function queue + aggressive caching |
| Gemini API cost overrun (Phase 7) | Low | High | Hard quota in DB; show "unavailable" instead |
| Duplicate MusicBrainz release records | High | Low | Use release-group MBID as canonical identifier |
| Vercel Hobby plan non-commercial clause | Low | High | Platform is student/non-commercial project |
| TypeScript strict mode friction | Medium | Low | Treat as quality gate; enforce from day one |

---

## 5. Cost & API Assessment

### 5.1 Required Services (MVP)

| Service | Purpose | Cost | Credentials |
|---|---|---|---|
| MusicBrainz API | Music metadata, search | Free (non-commercial) | None (User-Agent required) |
| Cover Art Archive | Album artwork | Free | None |
| Supabase | DB, Auth, Edge Functions | Free tier (500MB DB, 50K MAUs, 2 projects) | Create account at supabase.com |
| Vercel | Frontend hosting | Free (Hobby, non-commercial) | Create account at vercel.com |

### 5.2 Optional Services

| Service | Purpose | Cost | Credentials |
|---|---|---|---|
| Gemini API | AI album analysis (Phase 7) | Free tier (~15 RPM, review data policy); paid beyond | Google AI Studio API key |
| Google OAuth | Social login | Free | Google Cloud Console OAuth app |
| Sentry | Error monitoring | Free tier (5K errors/month) | Sentry account |

### 5.3 Credentials Needed Per Phase

| Phase | Service | Action |
|---|---|---|
| Phase 1-2 | None | — |
| Phase 3 | Supabase | Create project, get SUPABASE_URL and SUPABASE_ANON_KEY |
| Phase 4 | Supabase Auth | Enable Email provider in dashboard |
| Phase 4 | Google OAuth (optional) | Register OAuth app in Google Cloud Console |
| Phase 7 | Gemini API | Get key from Google AI Studio; decide free vs. paid |

### 5.4 Licensing & Legal Assessment

> ASSUMPTION: These assessments are based on publicly available information. Verify before commercial deployment.

| Question | Assessment |
|---|---|
| MusicBrainz non-commercial use | Permitted. CC0 for facts. Must not imply endorsement. |
| Cover Art Archive images | Display for reference only. Images copyrighted by original owners. We do not store, redistribute, or modify them. |
| MusicBrainz commercial use | Requires commercial license from MetaBrainz. As student/MVP, non-commercial applies. |
| Gemini free tier data policy | User data may be used for training. Use paid tier for user-sensitive content in production. |
| External listening links | Plain links are fine. We do not use Spotify/Apple Music APIs in MVP — no their TOS to worry about. |

### 5.5 Scaling Cost Reference

| Event | Cost |
|---|---|
| >50K MAU | Supabase Pro: $25/mo |
| >500MB database | Supabase Pro: $25/mo |
| Commercial launch | MusicBrainz commercial license required (contact MetaBrainz) |
| >15 RPM AI analysis | Gemini Pay-as-you-go |
| Heavy traffic | Vercel Pro: $20/mo |

---

## 6. Repository Plan

### 6.1 Folder Structure

```
d:\sonora\
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── og-image.png
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── features/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── stores/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   ├── migrations/
│   │   └── 0001_initial_schema.sql
│   ├── functions/
│   │   ├── musicbrainz-proxy/
│   │   │   └── index.ts
│   │   └── score-recalculate/
│   │       └── index.ts
│   └── seed.sql
├── .env.example
├── .gitignore
├── eslint.config.ts
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
├── vite.config.ts
├── PLAN.md
├── DESIGN.md
└── README.md
```

### 6.2 Environment Variables

```bash
# .env.example — safe to commit, no real values

# Supabase (safe in frontend — RLS is the authorization layer)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase (server-side only — NEVER use VITE_ prefix)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# MusicBrainz User-Agent (no API key needed, used by Edge Function)
MUSICBRAINZ_APP_NAME=Sonora
MUSICBRAINZ_APP_VERSION=0.1
MUSICBRAINZ_APP_CONTACT=your-email@example.com

# Gemini API (server-side Edge Function only — Phase 7)
# NEVER prefix with VITE_ — must not appear in browser
GEMINI_API_KEY=your-gemini-key-here
```

### 6.3 Testing Setup

- Vitest: unit tests for utilities
- React Testing Library: component + integration tests
- Playwright: E2E tests (Phase 8)
- axe-core/react: accessibility in development

Test locations:
```
src/utils/__tests__/score.test.ts
src/utils/__tests__/format.test.ts
src/components/__tests__/StarRating.test.tsx
src/components/__tests__/ReviewForm.test.tsx
```

### 6.4 Documentation Files

| File | Purpose |
|---|---|
| PLAN.md | Master project plan (this file) |
| DESIGN.md | Design system specification |
| README.md | Setup guide, env vars, development workflow |
| supabase/migrations/ | SQL migration history (reproducible schema) |
| supabase/seed.sql | Labeled demo data for development |

---

## Open Questions

These are the only decisions that would materially change the architecture. I have made sensible defaults for everything else.

1. **Commercial intent:** Is SONORA intended as a student portfolio project, or do you plan to monetize or launch publicly? This affects MusicBrainz licensing and Vercel/Supabase plan choices. (Default assumed: non-commercial student project.)

2. **Username permanence:** Should usernames be permanent after registration, or changeable? This affects URL stability for public profiles. (Default assumed: permanent, with a display name that can change.)

3. **AI analysis (Phase 7):** Do you want to proceed with Gemini integration? If yes, are you willing to use a paid key for data privacy? (Default assumed: optional, free tier, clearly labeled.)

These can be answered when we reach the relevant phase.

---

*This document is updated as each phase completes.*
