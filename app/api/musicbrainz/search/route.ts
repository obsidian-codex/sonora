import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ albums: [], artists: [] });
  }

  try {
    const encoded = encodeURIComponent(query.trim());
    // Query MusicBrainz search API
    const res = await fetch(
      `https://musicbrainz.org/ws/2/release-group?query=${encoded}&limit=8&fmt=json`,
      {
        headers: {
          'User-Agent': 'Sonora/0.1.0 (contact@sonora.app)',
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ albums: [] });
    }

    const data = await res.json();
    const releaseGroups = data['release-groups'] || [];

    const albums = releaseGroups.map((rg: any) => {
      const artist = rg['artist-credit']?.[0]?.artist?.name || 'Various Artists';
      const year = rg['first-release-date'] ? parseInt(rg['first-release-date'].slice(0, 4), 10) : null;
      const primaryRelease = rg.releases?.[0]?.id;

      // Cover Art Archive URL
      const cover = primaryRelease
        ? `https://coverartarchive.org/release/${primaryRelease}/front-500`
        : `https://coverartarchive.org/release-group/${rg.id}/front-500`;

      return {
        id: rg.id,
        title: rg.title,
        artist,
        year,
        primaryType: rg['primary-type'] || 'Album',
        cover,
        score: rg.score,
      };
    });

    return NextResponse.json({ albums });
  } catch (err: any) {
    console.error('MusicBrainz search error:', err);
    return NextResponse.json({ albums: [], error: err.message }, { status: 500 });
  }
}

