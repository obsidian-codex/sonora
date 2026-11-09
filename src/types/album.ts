export interface Album {
  id: string;
  mbid: string;
  releaseMbid?: string;
  title: string;
  artistId?: string;
  artistName: string;
  releaseDate?: string;
  releaseYear?: number;
  label?: string;
  albumType?: AlbumType;
  totalTracks?: number;
  artworkUrl?: string;
  genres: string[];
  cachedAt?: string;
}

export type AlbumType = 'album' | 'ep' | 'single' | 'compilation' | 'live' | 'soundtrack' | 'other';

export interface Track {
  id: string;
  albumId: string;
  mbid?: string;
  title: string;
  position: number;
  durationMs?: number;
  discNumber: number;
}

export interface AlbumScore {
  albumId: string;
  communityScore: number | null;
  rawAverage: number | null;
  ratingCount: number;
  reviewCount: number;
}

export interface ExternalLink {
  id: string;
  albumId: string;
  service: ExternalService;
  url: string;
  verified: boolean;
}

export type ExternalService = 'spotify' | 'apple_music' | 'youtube' | 'tidal' | 'bandcamp' | 'soundcloud' | 'deezer' | 'amazon_music';

export interface EditorialNote {
  id: string;
  albumId: string;
  body: string;
  authoredBy: string;
  publishedAt: string;
}

/** Album combined with its community score */
export interface AlbumWithScore extends Album {
  score?: AlbumScore | null;
}

/** Paginated album list response */
export interface PaginatedAlbums {
  albums: Album[];
  total: number;
  page: number;
  hasMore: boolean;
}

/** AI-generated album analysis */
export interface AIAnalysis {
  id: string;
  albumId: string;
  summary: string;
  themes: string[];
  soundDescription?: string;
  influences?: string;
  significance?: string;
  generatedAt?: string;
  modelVersion?: string;
  tokenCount?: number | null;
}

/** Request body for generating a new AI analysis */
export interface AIAnalysisRequest {
  albumId: string;
  mbid?: string;
  title: string;
  artistName: string;
  genres: string[];
  tracks?: Array<{ title: string; position: number }> | string[];
  releaseYear?: number;
  forceRefresh?: boolean;
}

/** Full data needed to render an album detail page */
export interface AlbumPageData {
  album: Album;
  score: AlbumScore | null;
  tracks: Track[];
  externalLinks: ExternalLink[];
  editorialNote: EditorialNote | null;
  aiAnalysis: AIAnalysis | null;
}

/** User's personal rating of an album */
export interface UserRating {
  id: string;
  userId: string;
  albumId: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

/** Saved album (user's collection) */
export interface SavedAlbum {
  id: string;
  userId: string;
  albumId: string;
  savedAt: string;
  album?: Album;
}
