import { albums, getArtists, getGenres } from './data'

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

export function searchCatalog(rawQuery: string) {
  const q = normalize(rawQuery)
  if (!q) return { albums: [], artists: [], genres: [], total: 0 }

  const matchedAlbums = albums.filter((a) =>
    [a.title, a.artist, a.genre, ...a.subgenres, a.label].some((f) => normalize(f).includes(q)),
  )
  const matchedArtists = getArtists().filter((a) => normalize(a.name).includes(q) || normalize(a.origin).includes(q))
  const matchedGenres = getGenres().filter((g) => normalize(g).includes(q))

  return {
    albums: matchedAlbums,
    artists: matchedArtists,
    genres: matchedGenres,
    total: matchedAlbums.length + matchedArtists.length + matchedGenres.length,
  }
}

export function albumsByGenre(genre: string) {
  const g = normalize(genre)
  return albums.filter((a) => [a.genre, ...a.subgenres].some((x) => normalize(x) === g))
}

export const popularSearches = ['Radiohead', 'Kendrick Lamar', 'Frank Ocean', 'Pink Floyd', 'Daft Punk', 'Tyler, The Creator', 'The Beatles']
