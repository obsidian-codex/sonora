import type { Album, PlatformId } from './types'

interface PlatformMeta {
  id: PlatformId
  name: string
  logo: string
  /** Brand surface colour used as a subtle tint behind the mark. */
  tint: string
  url: (query: string) => string
}

export const platforms: Record<PlatformId, PlatformMeta> = {
  spotify: {
    id: 'spotify',
    name: 'Spotify',
    logo: '/platforms/spotify.svg',
    tint: '#1ED760',
    url: (q) => `https://open.spotify.com/search/${encodeURIComponent(q)}`,
  },
  'apple-music': {
    id: 'apple-music',
    name: 'Apple Music',
    logo: '/platforms/apple-music.svg',
    tint: '#FA2D48',
    url: (q) => `https://music.apple.com/us/search?term=${encodeURIComponent(q)}`,
  },
  'youtube-music': {
    id: 'youtube-music',
    name: 'YouTube Music',
    logo: '/platforms/youtube-music.svg',
    tint: '#FF0000',
    url: (q) => `https://music.youtube.com/search?q=${encodeURIComponent(q)}`,
  },
  'amazon-music': {
    id: 'amazon-music',
    name: 'Amazon Music',
    logo: '/platforms/amazon-music.svg',
    tint: '#25D1DA',
    url: (q) => `https://music.amazon.com/search/${encodeURIComponent(q)}`,
  },
  tidal: {
    id: 'tidal',
    name: 'TIDAL',
    logo: '/platforms/tidal.svg',
    tint: '#FFFFFF',
    url: (q) => `https://listen.tidal.com/search?q=${encodeURIComponent(q)}`,
  },
  deezer: {
    id: 'deezer',
    name: 'Deezer',
    logo: '/platforms/deezer.svg',
    tint: '#A238FF',
    url: (q) => `https://www.deezer.com/search/${encodeURIComponent(q)}`,
  },
  soundcloud: {
    id: 'soundcloud',
    name: 'SoundCloud',
    logo: '/platforms/soundcloud.svg',
    tint: '#FF5500',
    url: (q) => `https://soundcloud.com/search?q=${encodeURIComponent(q)}`,
  },
}

export const platformOrder: PlatformId[] = [
  'spotify',
  'apple-music',
  'youtube-music',
  'amazon-music',
  'tidal',
  'deezer',
  'soundcloud',
]

export function getAlbumPlatforms(album: Album) {
  const query = `${album.artist} ${album.title}`
  return platformOrder
    .filter((id) => album.platforms.includes(id))
    .map((id) => ({ ...platforms[id], href: platforms[id].url(query) }))
}
