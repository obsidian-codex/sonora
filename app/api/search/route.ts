import { NextResponse } from 'next/server';
import { searchUnified } from '@/lib/music-api';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query || !query.trim()) {
    return NextResponse.json({ albums: [], artists: [], tracks: [] });
  }

  try {
    const results = await searchUnified(query.trim());
    return NextResponse.json(results);
  } catch (err: any) {
    console.error('Search API error:', err);
    return NextResponse.json({ albums: [], artists: [], tracks: [], error: err.message }, { status: 500 });
  }
}

