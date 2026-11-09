/** User profile stored in Supabase */
export interface Profile {
  id: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  isPrivate: boolean;
  createdAt: string;
}

/** Extended profile with aggregate stats for public profile pages */
export interface UserProfile extends Profile {
  ratingCount: number;
  reviewCount: number;
  savedCount: number;
  averageRating: number | null;
}
