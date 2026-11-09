export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          is_private: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          is_private?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          is_private?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      artists: {
        Row: {
          id: string;
          mbid: string;
          name: string;
          sort_name: string | null;
          bio: string | null;
          country: string | null;
          formed_year: number | null;
          artist_type: string | null;
          image_url: string | null;
          cached_at: string;
        };
        Insert: {
          id?: string;
          mbid: string;
          name: string;
          sort_name?: string | null;
          bio?: string | null;
          country?: string | null;
          formed_year?: number | null;
          artist_type?: string | null;
          image_url?: string | null;
          cached_at?: string;
        };
        Update: {
          id?: string;
          mbid?: string;
          name?: string;
          sort_name?: string | null;
          bio?: string | null;
          country?: string | null;
          formed_year?: number | null;
          artist_type?: string | null;
          image_url?: string | null;
          cached_at?: string;
        };
      };
      albums: {
        Row: {
          id: string;
          mbid: string;
          release_mbid: string | null;
          title: string;
          artist_id: string | null;
          release_date: string | null;
          release_year: number | null;
          label: string | null;
          album_type: string | null;
          total_tracks: number | null;
          artwork_url: string | null;
          cached_at: string;
        };
        Insert: {
          id?: string;
          mbid: string;
          release_mbid?: string | null;
          title: string;
          artist_id?: string | null;
          release_date?: string | null;
          label?: string | null;
          album_type?: string | null;
          total_tracks?: number | null;
          artwork_url?: string | null;
          cached_at?: string;
        };
        Update: {
          id?: string;
          mbid?: string;
          release_mbid?: string | null;
          title?: string;
          artist_id?: string | null;
          release_date?: string | null;
          label?: string | null;
          album_type?: string | null;
          total_tracks?: number | null;
          artwork_url?: string | null;
          cached_at?: string;
        };
      };
      tracks: {
        Row: {
          id: string;
          album_id: string;
          mbid: string | null;
          title: string;
          position: number;
          duration_ms: number | null;
          disc_number: number;
        };
        Insert: {
          id?: string;
          album_id: string;
          mbid?: string | null;
          title: string;
          position: number;
          duration_ms?: number | null;
          disc_number?: number;
        };
        Update: {
          id?: string;
          album_id?: string;
          mbid?: string | null;
          title?: string;
          position?: number;
          duration_ms?: number | null;
          disc_number?: number;
        };
      };
      genres: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          cover_image_url: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          cover_image_url?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          cover_image_url?: string | null;
        };
      };
      album_genres: {
        Row: {
          album_id: string;
          genre_id: string;
        };
        Insert: {
          album_id: string;
          genre_id: string;
        };
        Update: {
          album_id?: string;
          genre_id?: string;
        };
      };
      ratings: {
        Row: {
          id: string;
          user_id: string;
          album_id: string;
          score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          album_id: string;
          score: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          album_id?: string;
          score?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          album_id: string;
          body: string;
          is_edited: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          album_id: string;
          body: string;
          is_edited?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          album_id?: string;
          body?: string;
          is_edited?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      review_votes: {
        Row: {
          id: string;
          reviewer_id: string;
          voter_id: string;
          review_id: string;
          is_helpful: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          reviewer_id: string;
          voter_id: string;
          review_id: string;
          is_helpful: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          reviewer_id?: string;
          voter_id?: string;
          review_id?: string;
          is_helpful?: boolean;
          created_at?: string;
        };
      };
      saved_albums: {
        Row: {
          user_id: string;
          album_id: string;
          saved_at: string;
        };
        Insert: {
          user_id: string;
          album_id: string;
          saved_at?: string;
        };
        Update: {
          user_id?: string;
          album_id?: string;
          saved_at?: string;
        };
      };
      follows_artists: {
        Row: {
          follower_id: string;
          artist_id: string;
          followed_at: string;
        };
        Insert: {
          follower_id: string;
          artist_id: string;
          followed_at?: string;
        };
        Update: {
          follower_id?: string;
          artist_id?: string;
          followed_at?: string;
        };
      };
      user_lists: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_list_items: {
        Row: {
          list_id: string;
          album_id: string;
          position: number;
          note: string | null;
          added_at: string;
        };
        Insert: {
          list_id: string;
          album_id: string;
          position: number;
          note?: string | null;
          added_at?: string;
        };
        Update: {
          list_id?: string;
          album_id?: string;
          position?: number;
          note?: string | null;
          added_at?: string;
        };
      };
      external_links: {
        Row: {
          id: string;
          album_id: string;
          service: string;
          url: string;
          verified: boolean;
          added_by: string | null;
          added_at: string;
        };
        Insert: {
          id?: string;
          album_id: string;
          service: string;
          url: string;
          verified?: boolean;
          added_by?: string | null;
          added_at?: string;
        };
        Update: {
          id?: string;
          album_id?: string;
          service?: string;
          url?: string;
          verified?: boolean;
          added_by?: string | null;
          added_at?: string;
        };
      };
      album_scores: {
        Row: {
          album_id: string;
          community_score: number | null;
          raw_average: number | null;
          rating_count: number;
          review_count: number;
          score_updated_at: string;
        };
        Insert: {
          album_id: string;
          community_score?: number | null;
          raw_average?: number | null;
          rating_count?: number;
          review_count?: number;
          score_updated_at?: string;
        };
        Update: {
          album_id?: string;
          community_score?: number | null;
          raw_average?: number | null;
          rating_count?: number;
          review_count?: number;
          score_updated_at?: string;
        };
      };
      editorial_notes: {
        Row: {
          id: string;
          album_id: string;
          body: string | null;
          authored_by: string | null;
          published_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          album_id: string;
          body?: string | null;
          authored_by?: string | null;
          published_at?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          album_id?: string;
          body?: string | null;
          authored_by?: string | null;
          published_at?: string | null;
          updated_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          review_id: string;
          reason: string;
          resolved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          review_id: string;
          reason: string;
          resolved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          reporter_id?: string;
          review_id?: string;
          reason?: string;
          resolved?: boolean;
          created_at?: string;
        };
      };
      ai_analyses: {
        Row: {
          id: string;
          album_id: string;
          summary: string;
          themes: string[];
          sound_description: string;
          influences: string;
          significance: string;
          generated_at: string;
          model_version: string;
          token_count: number | null;
        };
        Insert: {
          id?: string;
          album_id: string;
          summary: string;
          themes: string[];
          sound_description: string;
          influences: string;
          significance: string;
          generated_at?: string;
          model_version: string;
          token_count?: number | null;
        };
        Update: {
          id?: string;
          album_id?: string;
          summary?: string;
          themes?: string[];
          sound_description?: string;
          influences?: string;
          significance?: string;
          generated_at?: string;
          model_version?: string;
          token_count?: number | null;
        };
      };
      api_quotas: {
        Row: {
          id: string;
          used: number;
          max_allowed: number;
          reset_at: string;
        };
        Insert: {
          id: string;
          used?: number;
          max_allowed?: number;
          reset_at: string;
        };
        Update: {
          id?: string;
          used?: number;
          max_allowed?: number;
          reset_at?: string;
        };
      };
    };
  };
}

