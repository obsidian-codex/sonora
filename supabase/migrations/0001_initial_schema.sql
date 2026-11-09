-- ============================================================================
-- SONORA — Album Culture Platform
-- Initial Database Schema Migration
-- ============================================================================
-- This migration creates the complete database schema including:
--   • 17 tables with proper constraints and relationships
--   • Indexes for query performance
--   • Trigger functions (updated_at, profile auto-creation, Bayesian scoring)
--   • Row Level Security policies for every table
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Auto-update updated_at timestamp on row modification
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- TABLE DEFINITIONS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. profiles — extends auth.users with public profile data
-- ----------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    text UNIQUE NOT NULL
              CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]{3,30}$'),
  display_name text,
  bio         text,
  avatar_url  text,
  is_private  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Public user profiles, one per auth.users row.';
COMMENT ON COLUMN public.profiles.username IS 'Unique handle — alphanumeric + underscores, 3-30 chars.';

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 2. artists — cached artist data sourced from MusicBrainz
-- ----------------------------------------------------------------------------
CREATE TABLE public.artists (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mbid        text UNIQUE NOT NULL,
  name        text NOT NULL,
  sort_name   text,
  bio         text,
  country     text,
  formed_year integer,
  artist_type text,
  image_url   text,
  cached_at   timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.artists IS 'Artist records cached from MusicBrainz.';
COMMENT ON COLUMN public.artists.mbid IS 'MusicBrainz artist ID — canonical external identifier.';

-- ----------------------------------------------------------------------------
-- 3. albums — cached album (release-group) data from MusicBrainz
-- ----------------------------------------------------------------------------
CREATE TABLE public.albums (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mbid          text UNIQUE NOT NULL,
  release_mbid  text,
  title         text NOT NULL,
  artist_id     uuid REFERENCES public.artists(id) ON DELETE SET NULL,
  release_date  date,
  release_year  integer GENERATED ALWAYS AS (EXTRACT(YEAR FROM release_date)::int) STORED,
  label         text,
  album_type    text,
  total_tracks  integer,
  artwork_url   text,
  cached_at     timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.albums IS 'Album records (release-groups) cached from MusicBrainz.';
COMMENT ON COLUMN public.albums.mbid IS 'MusicBrainz release-group MBID.';
COMMENT ON COLUMN public.albums.release_year IS 'Auto-derived from release_date for fast filtering.';

-- ----------------------------------------------------------------------------
-- 4. tracks — individual tracks belonging to an album
-- ----------------------------------------------------------------------------
CREATE TABLE public.tracks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id    uuid NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  mbid        text UNIQUE,
  title       text NOT NULL,
  position    integer NOT NULL,
  duration_ms integer,
  disc_number integer NOT NULL DEFAULT 1
);

COMMENT ON TABLE public.tracks IS 'Track listing for albums.';

-- ----------------------------------------------------------------------------
-- 5. genres — canonical genre list
-- ----------------------------------------------------------------------------
CREATE TABLE public.genres (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text UNIQUE NOT NULL,
  slug            text UNIQUE NOT NULL,
  description     text,
  cover_image_url text
);

COMMENT ON TABLE public.genres IS 'Canonical genre taxonomy.';

-- ----------------------------------------------------------------------------
-- 6. album_genres — many-to-many junction between albums and genres
-- ----------------------------------------------------------------------------
CREATE TABLE public.album_genres (
  album_id uuid REFERENCES public.albums(id) ON DELETE CASCADE,
  genre_id uuid REFERENCES public.genres(id) ON DELETE CASCADE,
  PRIMARY KEY (album_id, genre_id)
);

COMMENT ON TABLE public.album_genres IS 'Junction table linking albums to genres.';

-- ----------------------------------------------------------------------------
-- 7. ratings — user ratings for albums (1–10 scale)
-- ----------------------------------------------------------------------------
CREATE TABLE public.ratings (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  album_id   uuid NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  score      integer NOT NULL CONSTRAINT score_range CHECK (score >= 1 AND score <= 10),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, album_id)
);

COMMENT ON TABLE public.ratings IS 'One rating per user per album, scored 1-10.';

CREATE TRIGGER trg_ratings_updated_at
  BEFORE UPDATE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 8. reviews — long-form user reviews for albums
-- ----------------------------------------------------------------------------
CREATE TABLE public.reviews (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  album_id   uuid NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  body       text NOT NULL CONSTRAINT review_min_length CHECK (char_length(body) >= 50),
  is_edited  boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, album_id)
);

COMMENT ON TABLE public.reviews IS 'One review per user per album. Body must be ≥ 50 characters.';

CREATE TRIGGER trg_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 9. review_votes — helpful / not-helpful votes on reviews
-- ----------------------------------------------------------------------------
CREATE TABLE public.review_votes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  voter_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  review_id   uuid NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  is_helpful  boolean NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (voter_id, review_id),
  CONSTRAINT no_self_vote CHECK (reviewer_id != voter_id)
);

COMMENT ON TABLE public.review_votes IS 'Helpful/unhelpful votes on reviews. Users cannot vote on their own reviews.';

-- ----------------------------------------------------------------------------
-- 10. saved_albums — user's personal saved/bookmarked albums
-- ----------------------------------------------------------------------------
CREATE TABLE public.saved_albums (
  user_id  uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  album_id uuid REFERENCES public.albums(id) ON DELETE CASCADE,
  saved_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, album_id)
);

COMMENT ON TABLE public.saved_albums IS 'Albums saved/bookmarked by users.';

-- ----------------------------------------------------------------------------
-- 11. follows_artists — users following artists
-- ----------------------------------------------------------------------------
CREATE TABLE public.follows_artists (
  follower_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  artist_id   uuid REFERENCES public.artists(id) ON DELETE CASCADE,
  followed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, artist_id)
);

COMMENT ON TABLE public.follows_artists IS 'Users following artists for updates.';

-- ----------------------------------------------------------------------------
-- 12. user_lists — custom curated album lists
-- ----------------------------------------------------------------------------
CREATE TABLE public.user_lists (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text,
  is_public   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.user_lists IS 'User-curated album lists.';

CREATE TRIGGER trg_user_lists_updated_at
  BEFORE UPDATE ON public.user_lists
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 13. user_list_items — albums within a user list
-- ----------------------------------------------------------------------------
CREATE TABLE public.user_list_items (
  list_id  uuid REFERENCES public.user_lists(id) ON DELETE CASCADE,
  album_id uuid REFERENCES public.albums(id) ON DELETE CASCADE,
  position integer NOT NULL,
  note     text,
  added_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (list_id, album_id)
);

COMMENT ON TABLE public.user_list_items IS 'Albums within a user list, ordered by position.';

-- ----------------------------------------------------------------------------
-- 14. external_links — streaming / purchase links for albums
-- ----------------------------------------------------------------------------
CREATE TABLE public.external_links (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  service  text NOT NULL,
  url      text NOT NULL,
  verified boolean NOT NULL DEFAULT false,
  added_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  added_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.external_links IS 'Streaming/purchase links (Spotify, Apple Music, etc.) for albums.';
COMMENT ON COLUMN public.external_links.service IS 'Service slug: spotify, apple_music, youtube, tidal, etc.';

-- ----------------------------------------------------------------------------
-- 15. album_scores — pre-computed aggregate scores (updated by trigger)
-- ----------------------------------------------------------------------------
CREATE TABLE public.album_scores (
  album_id         uuid PRIMARY KEY REFERENCES public.albums(id) ON DELETE CASCADE,
  community_score  numeric(4,2),
  raw_average      numeric(4,2),
  rating_count     integer NOT NULL DEFAULT 0,
  review_count     integer NOT NULL DEFAULT 0,
  score_updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.album_scores IS 'Pre-computed Bayesian community scores. Updated automatically by trigger on ratings.';

-- ----------------------------------------------------------------------------
-- 16. editorial_notes — staff-written editorial content for albums
-- ----------------------------------------------------------------------------
CREATE TABLE public.editorial_notes (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id     uuid UNIQUE NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  body         text NOT NULL,
  authored_by  text,
  published_at timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.editorial_notes IS 'Staff/editorial markdown notes for albums. One per album.';

CREATE TRIGGER trg_editorial_notes_updated_at
  BEFORE UPDATE ON public.editorial_notes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 17. reports — user reports on reviews (moderation)
-- ----------------------------------------------------------------------------
CREATE TABLE public.reports (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  review_id   uuid NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  reason      text NOT NULL,
  resolved    boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.reports IS 'User-submitted reports on reviews for moderation.';


-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_albums_artist_id      ON public.albums (artist_id);
CREATE INDEX idx_albums_release_year   ON public.albums (release_year);
CREATE INDEX idx_albums_album_type     ON public.albums (album_type);
CREATE INDEX idx_tracks_album_id       ON public.tracks (album_id);
CREATE INDEX idx_ratings_album_id      ON public.ratings (album_id);
CREATE INDEX idx_ratings_user_id       ON public.ratings (user_id);
CREATE INDEX idx_reviews_album_id      ON public.reviews (album_id);
CREATE INDEX idx_reviews_user_id       ON public.reviews (user_id);
CREATE INDEX idx_saved_albums_user_id  ON public.saved_albums (user_id);
CREATE INDEX idx_follows_follower_id   ON public.follows_artists (follower_id);
CREATE INDEX idx_user_lists_user_id    ON public.user_lists (user_id);
CREATE INDEX idx_external_links_album  ON public.external_links (album_id);
CREATE INDEX idx_reports_review_id     ON public.reports (review_id);


-- ============================================================================
-- TRIGGER FUNCTIONS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Bayesian Community Score Calculation
-- Formula: score = (C × m + sum_of_ratings) / (C + n)
--   n = rating count for this album
--   C = 25 (confidence parameter — minimum ratings before converging)
--   m = global mean rating across ALL albums
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.recalculate_album_score(album_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER          -- runs with table owner privileges to bypass RLS
SET search_path = public  -- prevent search_path injection
AS $$
DECLARE
  v_count       integer;
  v_raw_avg     numeric(4,2);
  v_sum         numeric;
  v_global_mean numeric;
  v_community   numeric(4,2);
  v_review_count integer;
  C CONSTANT    integer := 25;  -- confidence parameter
BEGIN
  -- 1. Count ratings and sum scores for this album
  SELECT count(*), coalesce(sum(score), 0), coalesce(avg(score), 0)
    INTO v_count, v_sum, v_raw_avg
    FROM public.ratings
   WHERE album_id = album_uuid;

  -- 2. Compute global mean across ALL rated albums
  SELECT coalesce(avg(score), 5.0)
    INTO v_global_mean
    FROM public.ratings;

  -- 3. Apply Bayesian weighted average
  IF v_count = 0 THEN
    v_community := NULL;  -- no ratings yet
  ELSE
    v_community := round(
      (C * v_global_mean + v_sum) / (C + v_count),
      2
    );
  END IF;

  -- 4. Count reviews for this album
  SELECT count(*)
    INTO v_review_count
    FROM public.reviews
   WHERE album_id = album_uuid;

  -- 5. Upsert into album_scores
  INSERT INTO public.album_scores (
    album_id, community_score, raw_average, rating_count, review_count, score_updated_at
  ) VALUES (
    album_uuid, v_community, v_raw_avg, v_count, v_review_count, now()
  )
  ON CONFLICT (album_id) DO UPDATE SET
    community_score  = EXCLUDED.community_score,
    raw_average      = EXCLUDED.raw_average,
    rating_count     = EXCLUDED.rating_count,
    review_count     = EXCLUDED.review_count,
    score_updated_at = EXCLUDED.score_updated_at;
END;
$$;

COMMENT ON FUNCTION public.recalculate_album_score IS
  'Recomputes Bayesian community score for an album after rating changes.';

-- ----------------------------------------------------------------------------
-- Trigger wrapper: fires recalculate_album_score after rating changes
-- Handles INSERT, UPDATE, and DELETE — uses OLD.album_id for deletes
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.trg_rating_score_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.recalculate_album_score(OLD.album_id);
  ELSIF TG_OP = 'UPDATE' THEN
    -- If the album_id changed (unlikely but safe), recalc both
    PERFORM public.recalculate_album_score(NEW.album_id);
    IF OLD.album_id IS DISTINCT FROM NEW.album_id THEN
      PERFORM public.recalculate_album_score(OLD.album_id);
    END IF;
  ELSE
    -- INSERT
    PERFORM public.recalculate_album_score(NEW.album_id);
  END IF;
  RETURN NULL;  -- AFTER trigger, return value ignored
END;
$$;

CREATE TRIGGER trg_ratings_recalculate_score
  AFTER INSERT OR UPDATE OR DELETE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.trg_rating_score_update();

-- ----------------------------------------------------------------------------
-- Auto-create profile on signup
-- Generates a default username from the user's email (part before @).
-- If that username is taken, appends a random 4-digit suffix.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_username text;
  final_username text;
  suffix text;
BEGIN
  -- Extract the part before @ from email, strip non-alphanumeric chars
  base_username := regexp_replace(
    split_part(NEW.email, '@', 1),
    '[^a-zA-Z0-9_]', '', 'g'
  );

  -- Ensure minimum length of 3
  IF char_length(base_username) < 3 THEN
    base_username := base_username || 'user';
  END IF;

  -- Truncate to 25 chars to leave room for suffix
  base_username := left(base_username, 25);

  -- Try the base username first
  final_username := base_username;

  -- If taken, append a random 4-digit suffix (loop to handle collisions)
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    suffix := lpad(floor(random() * 10000)::text, 4, '0');
    final_username := left(base_username, 25) || '_' || suffix;
  END LOOP;

  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    final_username,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1))
  );

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user IS
  'Auto-creates a profile row when a new user signs up via Supabase Auth.';

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on every table
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albums          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_genres    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_votes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_albums    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lists      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_links  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_scores    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports         ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES — profiles
-- ============================================================================

-- Anyone can read profiles
CREATE POLICY profiles_select ON public.profiles
  FOR SELECT USING (true);

-- Authenticated users can insert their own profile
CREATE POLICY profiles_insert ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update only their own profile
CREATE POLICY profiles_update ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can delete only their own profile
CREATE POLICY profiles_delete ON public.profiles
  FOR DELETE USING (auth.uid() = id);

-- ============================================================================
-- RLS POLICIES — artists (public read, service-role write)
-- ============================================================================

CREATE POLICY artists_select ON public.artists
  FOR SELECT USING (true);

-- Service role bypasses RLS, so no explicit insert/update policies needed.
-- No rows insertable/updatable via the API by normal users.

-- ============================================================================
-- RLS POLICIES — albums (public read, service-role write)
-- ============================================================================

CREATE POLICY albums_select ON public.albums
  FOR SELECT USING (true);

-- ============================================================================
-- RLS POLICIES — tracks (public read, service-role write)
-- ============================================================================

CREATE POLICY tracks_select ON public.tracks
  FOR SELECT USING (true);

-- ============================================================================
-- RLS POLICIES — genres (public read, service-role write)
-- ============================================================================

CREATE POLICY genres_select ON public.genres
  FOR SELECT USING (true);

-- ============================================================================
-- RLS POLICIES — album_genres (public read, service-role write)
-- ============================================================================

CREATE POLICY album_genres_select ON public.album_genres
  FOR SELECT USING (true);

-- ============================================================================
-- RLS POLICIES — ratings
-- ============================================================================

-- Anyone can read ratings
CREATE POLICY ratings_select ON public.ratings
  FOR SELECT USING (true);

-- Authenticated users can insert ratings (user_id must match)
CREATE POLICY ratings_insert ON public.ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update only their own ratings
CREATE POLICY ratings_update ON public.ratings
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete only their own ratings
CREATE POLICY ratings_delete ON public.ratings
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES — reviews
-- ============================================================================

CREATE POLICY reviews_select ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY reviews_insert ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY reviews_update ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY reviews_delete ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES — review_votes
-- ============================================================================

-- Anyone can read votes (for aggregation)
CREATE POLICY review_votes_select ON public.review_votes
  FOR SELECT USING (true);

-- Authenticated users can vote on reviews that are NOT their own
-- (reviewer_id != voter_id is enforced by CHECK constraint; RLS ensures voter_id ownership)
CREATE POLICY review_votes_insert ON public.review_votes
  FOR INSERT WITH CHECK (auth.uid() = voter_id AND auth.uid() != reviewer_id);

-- Users can delete only their own votes
CREATE POLICY review_votes_delete ON public.review_votes
  FOR DELETE USING (auth.uid() = voter_id);

-- ============================================================================
-- RLS POLICIES — saved_albums (private to owner)
-- ============================================================================

-- Users can only see their own saved albums
CREATE POLICY saved_albums_select ON public.saved_albums
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY saved_albums_insert ON public.saved_albums
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY saved_albums_delete ON public.saved_albums
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES — follows_artists
-- ============================================================================

-- Anyone can see who follows artists (for counts, etc.)
CREATE POLICY follows_artists_select ON public.follows_artists
  FOR SELECT USING (true);

CREATE POLICY follows_artists_insert ON public.follows_artists
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY follows_artists_delete ON public.follows_artists
  FOR DELETE USING (auth.uid() = follower_id);

-- ============================================================================
-- RLS POLICIES — user_lists
-- ============================================================================

-- Public lists are visible to all; private lists only to owner
CREATE POLICY user_lists_select ON public.user_lists
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY user_lists_insert ON public.user_lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_lists_update ON public.user_lists
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_lists_delete ON public.user_lists
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES — user_list_items (inherits access from parent list)
-- ============================================================================

-- Readable if the parent list is public or owned by the requesting user
CREATE POLICY user_list_items_select ON public.user_list_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_lists
       WHERE id = list_id
         AND (is_public = true OR user_id = auth.uid())
    )
  );

-- Insertable only into lists the user owns
CREATE POLICY user_list_items_insert ON public.user_list_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_lists
       WHERE id = list_id AND user_id = auth.uid()
    )
  );

-- Updatable only in lists the user owns
CREATE POLICY user_list_items_update ON public.user_list_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_lists
       WHERE id = list_id AND user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_lists
       WHERE id = list_id AND user_id = auth.uid()
    )
  );

-- Deletable only from lists the user owns
CREATE POLICY user_list_items_delete ON public.user_list_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_lists
       WHERE id = list_id AND user_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS POLICIES — external_links
-- ============================================================================

CREATE POLICY external_links_select ON public.external_links
  FOR SELECT USING (true);

-- Authenticated users can submit links (added_by must match)
CREATE POLICY external_links_insert ON public.external_links
  FOR INSERT WITH CHECK (auth.uid() = added_by);

-- Only service role can update (verify links, etc.) — no explicit policy needed

-- ============================================================================
-- RLS POLICIES — album_scores (public read, trigger/service-role write)
-- ============================================================================

CREATE POLICY album_scores_select ON public.album_scores
  FOR SELECT USING (true);

-- ============================================================================
-- RLS POLICIES — editorial_notes (public read, service-role write)
-- ============================================================================

CREATE POLICY editorial_notes_select ON public.editorial_notes
  FOR SELECT USING (true);

-- ============================================================================
-- RLS POLICIES — reports (authenticated insert only, no read via API)
-- ============================================================================

-- Users can only see their own reports
CREATE POLICY reports_insert ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- No SELECT policy — reports are only accessible to service role (admin dashboard)
