export type PlatformId =
  | 'spotify'
  | 'apple-music'
  | 'youtube-music'
  | 'amazon-music'
  | 'tidal'
  | 'deezer'
  | 'soundcloud'

export type MoodSlug = 'late-night' | 'heartbreak' | 'euphoria' | 'focus' | 'solitude' | 'slow-sunday'

export interface Track {
  n: number
  title: string
  duration: string
  rating: number
  standout?: boolean
  previewUrl?: string
}

export interface Theme {
  title: string
  body: string
}

export interface Credit {
  role: string
  name: string
}

export interface Album {
  slug: string
  title: string
  artist: string
  artistSlug: string
  artistOrigin: string
  year: number
  releaseDate: string
  genre: string
  subgenres: string[]
  label: string
  cover: string
  moods: MoodSlug[]
  score: number
  ratingsCount: number
  distribution: number[]
  saves: number
  trendDelta: number
  attentionRise: number
  isNew: boolean
  tagline: string
  editorial: string
  analysis: {
    lede: string
    body: string[]
    themes: Theme[]
    context: string
    critic: string
  }
  credits: Credit[]
  tracks: Track[]
  platforms: PlatformId[]
}

export interface Mood {
  slug: MoodSlug
  name: string
  description: string
  image: string
}

export interface Review {
  id: string
  albumSlug: string
  author: string
  handle: string
  rating: number
  title: string
  body: string
  date: string
  likes: number
}

export interface Discussion {
  id: string
  albumSlug: string
  title: string
  author: string
  replies: number
  lastActive: string
}

export interface Story {
  slug: string
  kicker: string
  title: string
  dek: string
  author: string
  readTime: string
  image: string
  albumSlug: string
}
