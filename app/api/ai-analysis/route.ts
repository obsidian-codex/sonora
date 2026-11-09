import { NextResponse } from 'next/server';
import { generateAIAlbumAnalysis } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, artist, genre, year, tracks } = body;

    if (!title || !artist) {
      return NextResponse.json({ error: 'Title and artist are required' }, { status: 400 });
    }

    const analysis = await generateAIAlbumAnalysis({
      title,
      artist,
      genre: genre || 'Music',
      year: year || 2024,
      tracks: tracks || [],
    });

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Error generating AI analysis:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI analysis', details: error.message },
      { status: 500 }
    );
  }
}

