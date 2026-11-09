import { supabase } from './supabase';
import { getAlbum as mbGetAlbum, getReleaseTracks as mbGetReleaseTracks } from './musicbrainz';
import type {
  Album,
  AlbumScore,
  AlbumPageData,
  AlbumWithScore,
  Track,
  AIAnalysis,
  AIAnalysisRequest,
} from '../types/album';
import type { Review, PaginatedReviews } from '../types/review';

// ─── Album Page Data ─────────────────────────────────────────────────────────

export async function fetchAlbumPage(mbid: string): Promise<AlbumPageData> {
  // 1. Fetch album record from Supabase if cached
  const { data: dbAlbum } = await supabase
    .from('albums')
    .select(`
      *,
      artist:artists(*),
      genres:album_genres(genre:genres(*)),
      scores:album_scores(*),
      editorial:editorial_notes(*),
      external_links(*)
    `)
    .eq('mbid', mbid)
    .maybeSingle();

  let albumData: Album;
  let tracks: Track[] = [];

  if (dbAlbum) {
    const genres = (dbAlbum.genres || []).map((g: any) => g.genre?.name).filter(Boolean);

    albumData = {
      id: dbAlbum.id,
      mbid: dbAlbum.mbid,
      releaseMbid: dbAlbum.release_mbid || undefined,
      title: dbAlbum.title,
      artistId: dbAlbum.artist_id || undefined,
      artistName: dbAlbum.artist?.name || 'Unknown Artist',
      releaseDate: dbAlbum.release_date || undefined,
      releaseYear: dbAlbum.release_year || undefined,
      label: dbAlbum.label || undefined,
      albumType: dbAlbum.album_type as any,
      totalTracks: dbAlbum.total_tracks || undefined,
      artworkUrl: dbAlbum.artwork_url || undefined,
      genres,
    };

    // Fetch tracks from DB
    const { data: dbTracks } = await supabase
      .from('tracks')
      .select('*')
      .eq('album_id', dbAlbum.id)
      .order('position', { ascending: true });

    if (dbTracks && dbTracks.length > 0) {
      tracks = dbTracks.map((t: any) => ({
        id: t.id,
        albumId: t.album_id,
        mbid: t.mbid || undefined,
        title: t.title,
        position: t.position,
        durationMs: t.duration_ms || undefined,
        discNumber: t.disc_number,
      }));
    }
  } else {
    // Fetch live from MusicBrainz via Edge Function
    const mbData = await mbGetAlbum(mbid);
    const primaryRelease = mbData.releases[0];

    albumData = {
      id: mbid, // temporary fallback until inserted
      mbid: mbData.mbid,
      releaseMbid: primaryRelease?.mbid,
      title: mbData.title,
      artistName: mbData.artists.map((a) => a.name).join(', '),
      releaseDate: mbData.releaseDate || undefined,
      releaseYear: mbData.releaseDate ? parseInt(mbData.releaseDate.slice(0, 4), 10) : undefined,
      genres: mbData.genres || [],
    };

    if (primaryRelease) {
      try {
        const mbTracks = await mbGetReleaseTracks(primaryRelease.mbid);
        tracks = mbTracks.map((t: any, idx: number) => ({
          id: t.mbid || `${idx + 1}`,
          albumId: mbid,
          mbid: t.mbid,
          title: t.title,
          position: t.position,
          durationMs: t.length || undefined,
          discNumber: t.discNumber,
        }));
      } catch {
        // Fallback gracefully if track listing cannot be loaded
      }
    }
  }

  // 3. Scores
  const score: AlbumScore | null = dbAlbum?.scores
    ? {
        albumId: albumData.id,
        communityScore: (dbAlbum.scores as any).community_score,
        rawAverage: (dbAlbum.scores as any).raw_average,
        ratingCount: (dbAlbum.scores as any).rating_count || 0,
        reviewCount: (dbAlbum.scores as any).review_count || 0,
      }
    : null;

  return {
    album: albumData,
    score,
    tracks,
    editorialNote: dbAlbum?.editorial
      ? {
          id: (dbAlbum.editorial as any).id,
          albumId: albumData.id,
          body: (dbAlbum.editorial as any).body,
          authoredBy: (dbAlbum.editorial as any).authored_by,
          publishedAt: (dbAlbum.editorial as any).published_at,
        }
      : null,
    externalLinks: dbAlbum?.external_links || [],
    aiAnalysis: null,
  };
}

// ─── Ratings ─────────────────────────────────────────────────────────────────

export async function rateAlbum(albumId: string, score: number): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be signed in to rate an album');

  const { error } = await supabase.from('ratings').upsert(
    {
      user_id: user.id,
      album_id: albumId,
      score,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,album_id' }
  );

  if (error) throw error;
}

export async function removeRating(albumId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be signed in to remove rating');

  const { error } = await supabase
    .from('ratings')
    .delete()
    .eq('user_id', user.id)
    .eq('album_id', albumId);

  if (error) throw error;
}

export async function getUserRating(albumId: string): Promise<number | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('ratings')
    .select('score')
    .eq('user_id', user.id)
    .eq('album_id', albumId)
    .maybeSingle();

  return data?.score ?? null;
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export async function submitReview(albumId: string, body: string): Promise<Review> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be signed in to write a review');

  if (body.trim().length < 50) {
    throw new Error('Review must be at least 50 characters');
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      user_id: user.id,
      album_id: albumId,
      body: body.trim(),
    })
    .select('*, profile:profiles(*)')
    .single();

  if (error) throw error;

  return {
    id: data.id,
    userId: data.user_id,
    albumId: data.album_id,
    body: data.body,
    isEdited: data.is_edited,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    author: {
      username: (data as any).profile?.username || 'anonymous',
      displayName: (data as any).profile?.display_name,
      avatarUrl: (data as any).profile?.avatar_url,
    },
  };
}

export async function getAlbumReviews(
  albumId: string,
  sort: 'newest' | 'helpful' = 'newest',
  page = 1,
  pageSize = 10
): Promise<PaginatedReviews> {
  let query = supabase
    .from('reviews')
    .select('*, profile:profiles(*)', { count: 'exact' })
    .eq('album_id', albumId);

  if (sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, count, error } = await query.range(from, to);

  if (error) throw error;

  const reviews: Review[] = (data || []).map((r: any) => ({
    id: r.id,
    userId: r.user_id,
    albumId: r.album_id,
    body: r.body,
    isEdited: r.is_edited,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    author: {
      username: r.profile?.username || 'anonymous',
      displayName: r.profile?.display_name,
      avatarUrl: r.profile?.avatar_url,
    },
  }));

  return {
    reviews,
    total: count || 0,
    page,
    hasMore: (count || 0) > to + 1,
  };
}

// ─── Collections ─────────────────────────────────────────────────────────────

export async function saveAlbum(albumId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be signed in to save an album');

  const { error } = await supabase
    .from('saved_albums')
    .insert({ user_id: user.id, album_id: albumId });

  if (error && error.code !== '23505') throw error; // ignore duplicate key
}

export async function unsaveAlbum(albumId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be signed in');

  const { error } = await supabase
    .from('saved_albums')
    .delete()
    .eq('user_id', user.id)
    .eq('album_id', albumId);

  if (error) throw error;
}

export async function isAlbumSaved(albumId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('saved_albums')
    .select('album_id')
    .eq('user_id', user.id)
    .eq('album_id', albumId)
    .maybeSingle();

  return Boolean(data);
}

// ─── Discovery ───────────────────────────────────────────────────────────────

export async function getTrendingAlbums(limit = 10): Promise<AlbumWithScore[]> {
  const { data } = await supabase
    .from('album_scores')
    .select('*, album:albums(*, artist:artists(*))')
    .order('rating_count', { ascending: false })
    .limit(limit);

  if (!data) return [];

  return data.map((item: any) => ({
    id: item.album.id,
    mbid: item.album.mbid,
    title: item.album.title,
    artistName: item.album.artist?.name || 'Unknown',
    releaseYear: item.album.release_year,
    artworkUrl: item.album.artwork_url,
    genres: [],
    score: item.community_score ? {
      albumId: item.album.id,
      communityScore: item.community_score,
      rawAverage: item.raw_average,
      ratingCount: item.rating_count,
      reviewCount: item.review_count,
    } : null,
  }));
}

// ─── Gemini AI Analysis ──────────────────────────────────────────────────────

export async function getAIAnalysis(albumId: string): Promise<AIAnalysis | null> {
  const { data } = await supabase
    .from('ai_analyses')
    .select('*')
    .eq('album_id', albumId)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    albumId: data.album_id,
    summary: data.summary,
    themes: data.themes || [],
    soundDescription: data.sound_description,
    influences: data.influences,
    significance: data.significance,
    generatedAt: data.generated_at,
    modelVersion: data.model_version,
  };
}

export async function requestAIAnalysis(request: AIAnalysisRequest): Promise<AIAnalysis> {
  const { data, error } = await supabase.functions.invoke<AIAnalysis>('ai-analysis', {
    body: request,
  });

  if (error) {
    throw new Error(`AI analysis failed: ${error.message}`);
  }

  if (!data) {
    throw new Error('Empty response from AI analysis function');
  }

  return data;
}
