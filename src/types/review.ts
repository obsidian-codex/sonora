/** A user-written album review */
export interface Review {
  id: string;
  userId: string;
  albumId: string;
  body: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  author: ReviewAuthor;
}

/** Lightweight author info embedded in review responses */
export interface ReviewAuthor {
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

/** A helpfulness vote on a review */
export interface ReviewVote {
  id: string;
  reviewId: string;
  voterId: string;
  isHelpful: boolean;
}

/** Paginated review response */
export interface PaginatedReviews {
  reviews: Review[];
  total: number;
  page: number;
  hasMore: boolean;
}
