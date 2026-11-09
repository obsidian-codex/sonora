/**
 * Gemini AI Integration for SONORA
 * Generates editorial album descriptions, themes, and sound profiles.
 */

export interface GeminiAlbumAnalysis {
  lede: string;
  body: string[];
  themes: { title: string; body: string }[];
  context: string;
  critic: string;
}

export async function generateAIAlbumAnalysis(params: {
  title: string;
  artist: string;
  genre: string;
  year: number;
  tracks?: string[];
}): Promise<GeminiAlbumAnalysis> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    '';

  const prompt = `You are a legendary music critic and editorial writer for SONORA, an album culture publication.
Analyze the following album:
Title: "${params.title}"
Artist: "${params.artist}"
Genre: "${params.genre}"
Year: ${params.year}
${params.tracks ? `Key Tracks: ${params.tracks.join(', ')}` : ''}

Respond ONLY with a valid JSON object with the following structure:
{
  "lede": "A compelling, 1-2 sentence thesis on why this record matters emotionally and culturally.",
  "body": [
    "First paragraph dissecting the sonic architecture, production, and musical atmosphere.",
    "Second paragraph exploring the lyrical themes, narrative arc, and cultural resonance."
  ],
  "themes": [
    {"title": "Core Theme 1", "body": "2 sentences explaining this thematic pillar."},
    {"title": "Core Theme 2", "body": "2 sentences explaining this thematic pillar."},
    {"title": "Core Theme 3", "body": "2 sentences explaining this thematic pillar."}
  ],
  "context": "A short paragraph placing this record in music history and the artist's discography.",
  "critic": "Sonora Intelligence & Curation"
}`;

  if (!apiKey) {
    // Fallback if key is not yet provided
    return {
      lede: `A monumental statement in ${params.genre}, ${params.title} captures ${params.artist} at a creative zenith.`,
      body: [
        `Recorded with meticulous attention to sonic timbre and dynamic restraint, the album bridges intimate confession and expansive arrangements.`,
        `Lyrically, the record excavates modern alienation, love, and spiritual longing, resulting in an enduring cultural touchstone.`,
      ],
      themes: [
        { title: 'Sonic Architecture', body: 'Intricate interplay of acoustic textures and contemporary production.' },
        { title: 'Catharsis & Grief', body: 'An emotional journey confronting vulnerability without melodrama.' },
        { title: 'Cultural Legacy', body: 'A release that helped redefine its genre for a new generation of listeners.' },
      ],
      context: `Released in ${params.year}, this milestone release solidified ${params.artist}'s status as one of modern music's most vital voices.`,
      critic: 'Sonora Intelligence',
    };
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!res.ok) {
      console.warn('Gemini API error, using editorial fallback');
      throw new Error(`Gemini status ${res.status}`);
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawText) {
      return JSON.parse(rawText) as GeminiAlbumAnalysis;
    }
  } catch (err) {
    console.warn('Falling back to default analysis:', err);
  }

  return {
    lede: `A pivotal chapter in modern music, ${params.title} stands as one of ${params.artist}'s most ambitious statements.`,
    body: [
      `From its earliest moments, the album establishes a dense, atmospheric soundstage combining raw emotional immediacy with intricate technical mastery.`,
      `The record remains a benchmark for how cohesive, long-form album storytelling can elevate personal reflection into universal art.`,
    ],
    themes: [
      { title: 'Identity & Evolution', body: 'A profound examination of personal and artistic transition.' },
      { title: 'Atmospheric Tension', body: 'Deliberate pacing and dynamic contrasts that reward repeated listens.' },
      { title: 'Timeless Resonances', body: 'Themes that continue to reverberate decades after initial release.' },
    ],
    context: `Anchored in the cultural landscape of ${params.year}, ${params.title} remains essential listening for dedicated music archivists.`,
    critic: 'Sonora Editorial Staff',
  };
}

export interface GeminiArtistAnalysis {
  biography: string;
  legacy: string;
  sonicSignature: string[];
  recommendedListen: string;
}

export async function generateAIArtistAnalysis(params: {
  artist: string;
  origin?: string;
  genre?: string;
  keyWorks?: string[];
}): Promise<GeminiArtistAnalysis> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    '';

  const prompt = `You are a chief music critic and historian for SONORA.
Provide a comprehensive critical evaluation of the musical artist: "${params.artist}".
Origin: ${params.origin || 'International'}
Genre: ${params.genre || 'Contemporary'}
${params.keyWorks ? `Key Works: ${params.keyWorks.join(', ')}` : ''}

Respond ONLY with a JSON object of this structure:
{
  "biography": "A compelling 2-paragraph critical biography examining their artistic evolution and distinct musical voice.",
  "legacy": "A paragraph placing their influence and impact on modern culture and fellow musicians.",
  "sonicSignature": [
    "Characteristic 1 (e.g. Intricate polyrhythmic drumming)",
    "Characteristic 2 (e.g. Unfiltered confessional lyricism)",
    "Characteristic 3 (e.g. Genre-blurring analog and digital synthesis)"
  ],
  "recommendedListen": "The single album or track to start with and why in 1 sentence."
}`;

  if (apiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          return JSON.parse(rawText) as GeminiArtistAnalysis;
        }
      }
    } catch (err) {
      console.warn('Gemini artist analysis fallback:', err);
    }
  }

  return {
    biography: `${params.artist} stands as one of the most compelling voices in contemporary music, continually reshaping genre boundaries with uncompromising creative vision and emotional depth.`,
    legacy: `Their discography has left an indelible imprint on modern album culture, inspiring a new generation of musicians to prioritize cohesive artistic narrative over fleeting singles.`,
    sonicSignature: [
      'Expansive dynamic restraint and meticulous sonic textures',
      'Vulnerable, narrative-driven songwriting',
      'Seamless fusion of organic instruments and modern digital production'
    ],
    recommendedListen: `Explore their signature landmark recordings to experience the full scope of their compositional genius.`
  };
}

export interface GeminiTrackAnalysis {
  lede: string;
  sonicArchitecture: string;
  lyricalThemes: { title: string; body: string }[];
  culturalContext: string;
  standoutMoment: string;
}

export async function generateAITrackAnalysis(params: {
  title: string;
  artist: string;
  album?: string;
  year?: number;
  genre?: string;
}): Promise<GeminiTrackAnalysis> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    '';

  const prompt = `You are a legendary musicologist and track reviewer for SONORA.
Provide a deep critical breakdown of the song:
Title: "${params.title}"
Artist: "${params.artist}"
${params.album ? `Album: "${params.album}"` : ''}
${params.year ? `Year: ${params.year}` : ''}
${params.genre ? `Genre: ${params.genre}` : ''}

Respond ONLY with a valid JSON object of this structure:
{
  "lede": "A sharp, evocative 1-2 sentence thesis capturing the emotional core and aesthetic triumph of this track.",
  "sonicArchitecture": "A comprehensive paragraph analyzing the instrumentation, melodic phrasing, rhythmic tension, chords, and mixing decisions that define this recording.",
  "lyricalThemes": [
    {"title": "Core Theme 1", "body": "1-2 sentences on what this theme reveals about the track's emotional arc."},
    {"title": "Core Theme 2", "body": "1-2 sentences on what this theme reveals about the track's emotional arc."}
  ],
  "culturalContext": "A paragraph explaining the song's critical legacy, impact on fans, and place within the artist's discography.",
  "standoutMoment": "A specific description of the track's pinnacle moment (e.g. the bridge, beat switch, vocal crescendo, or outro)."
}`;

  if (apiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          return JSON.parse(rawText) as GeminiTrackAnalysis;
        }
      }
    } catch (err) {
      console.warn('Gemini track analysis fallback:', err);
    }
  }

  return {
    lede: `"${params.title}" is a masterclass in dynamic tension and melodic vulnerability, capturing ${params.artist} at their most evocative.`,
    sonicArchitecture: `Constructed with immaculate attention to tonal balance, the arrangement pairs intricate rhythmic pulses with atmospheric harmonic layers that breathe and expand across the track's progression.`,
    lyricalThemes: [
      {
        title: 'Emotional Exposure',
        body: 'Confronting uncertainty and raw intimacy without retreating into conventional songwriting clichés.'
      },
      {
        title: 'Temporal Longing',
        body: 'A poignant reflection on fleeting moments and the quiet gravity of memory.'
      }
    ],
    culturalContext: `Regarded as an essential centerpiece of ${params.album || 'their catalog'}, the track continues to resonate deeply with dedicated listeners and critics alike.`,
    standoutMoment: `The breathtaking climax where the instrumentation swells into cathartic emotional release.`
  };
}

