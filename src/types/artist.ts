import type { Album } from './album';

/** Core artist entity stored in Supabase */
export interface Artist {
  id: string;
  mbid: string;
  name: string;
  sortName: string;
  bio: string | null;
  country: string | null;
  formedYear: number | null;
  artistType: ArtistType;
  imageUrl: string | null;
}

export type ArtistType =
  | 'person'
  | 'group'
  | 'orchestra'
  | 'choir'
  | 'character'
  | 'other';

/** Artist with their discography attached */
export interface ArtistWithAlbums extends Artist {
  albums: Album[];
}
