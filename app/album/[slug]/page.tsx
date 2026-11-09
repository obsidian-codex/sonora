import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { albums, getSimilarAlbums } from '@/lib/data'
import { getLiveAlbum } from '@/lib/music-api'
import { AlbumView } from '@/components/sonora/album/album-view'

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const album = await getLiveAlbum(slug)
  if (!album) return { title: 'Album not found' }
  return {
    title: `${album.title} — ${album.artist}`,
    description: album.tagline,
    openGraph: { images: [album.cover] },
  }
}

export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const album = await getLiveAlbum(slug)
  if (!album) notFound()
  return <AlbumView album={album} similar={getSimilarAlbums(album, 4)} />
}
