'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { initialLibrary, reviews as seedReviews } from './data'
import type { Review } from './types'

interface LibraryState {
  saved: string[]
  albumRatings: Record<string, number>
  trackRatings: Record<string, number>
  followed: string[]
  reviews: Review[]
  likedReviews: string[]
  isSaved: (slug: string) => boolean
  isFollowing: (artistSlug: string) => boolean
  toggleSave: (slug: string) => void
  toggleFollow: (artistSlug: string) => void
  rateAlbum: (slug: string, rating: number | null) => void
  rateTrack: (key: string, rating: number | null) => void
  addReview: (review: Omit<Review, 'id' | 'date' | 'likes'>) => void
  toggleLike: (id: string) => void
}

const LibraryContext = createContext<LibraryState | null>(null)

const toggleIn = (list: string[], value: string) =>
  list.includes(value) ? list.filter((v) => v !== value) : [value, ...list]

const setOrClear = (map: Record<string, number>, key: string, value: number | null) => {
  const next = { ...map }
  if (value === null) delete next[key]
  else next[key] = value
  return next
}

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<string[]>(initialLibrary.saved)
  const [albumRatings, setAlbumRatings] = useState<Record<string, number>>(initialLibrary.albumRatings)
  const [trackRatings, setTrackRatings] = useState<Record<string, number>>({})
  const [followed, setFollowed] = useState<string[]>(initialLibrary.followed)
  const [reviews, setReviews] = useState<Review[]>(seedReviews)
  const [likedReviews, setLikedReviews] = useState<string[]>([])

  const toggleSave = useCallback((slug: string) => setSaved((s) => toggleIn(s, slug)), [])
  const toggleFollow = useCallback((slug: string) => setFollowed((s) => toggleIn(s, slug)), [])
  const rateAlbum = useCallback(
    (slug: string, rating: number | null) => setAlbumRatings((r) => setOrClear(r, slug, rating)),
    [],
  )
  const rateTrack = useCallback(
    (key: string, rating: number | null) => setTrackRatings((r) => setOrClear(r, key, rating)),
    [],
  )
  const addReview = useCallback((review: Omit<Review, 'id' | 'date' | 'likes'>) => {
    setReviews((r) => [{ ...review, id: `u-${Date.now()}`, date: 'Just now', likes: 0 }, ...r])
    setAlbumRatings((r) => ({ ...r, [review.albumSlug]: review.rating }))
  }, [])
  const toggleLike = useCallback((id: string) => setLikedReviews((l) => toggleIn(l, id)), [])

  const value = useMemo<LibraryState>(
    () => ({
      saved,
      albumRatings,
      trackRatings,
      followed,
      reviews,
      likedReviews,
      isSaved: (slug) => saved.includes(slug),
      isFollowing: (slug) => followed.includes(slug),
      toggleSave,
      toggleFollow,
      rateAlbum,
      rateTrack,
      addReview,
      toggleLike,
    }),
    [saved, albumRatings, trackRatings, followed, reviews, likedReviews, toggleSave, toggleFollow, rateAlbum, rateTrack, addReview, toggleLike],
  )

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibrary() {
  const ctx = useContext(LibraryContext)
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider')
  return ctx
}
