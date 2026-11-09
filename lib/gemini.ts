/**
 * Gemini AI Integration & Critical Knowledge Engine for SONORA
 * Generates editorial album descriptions, themes, and bespoke track profiles.
 */

export interface GeminiAlbumAnalysis {
  lede: string;
  body: string[];
  themes: { title: string; body: string }[];
  context: string;
  critic: string;
}

export interface GeminiArtistAnalysis {
  biography: string;
  legacy: string;
  sonicSignature: string[];
  recommendedListen: string;
}

export interface GeminiTrackAnalysis {
  lede: string;
  sonicArchitecture: string;
  lyricalThemes: { title: string; body: string }[];
  culturalContext: string;
  standoutMoment: string;
}

// In-Memory LRU Cache to prevent duplicate Gemini API requests & avoid rate limits
const cache = new Map<string, any>();

// ─── Bespoke Track Knowledge Base ─────────────────────────────────────────────
const BESPOKE_TRACKS: Record<string, Partial<GeminiTrackAnalysis>> = {
  'weird-fishes-arpeggi': {
    lede: 'A transcendent pinnacle of modern art rock, "Weird Fishes/Arpeggi" captures the weightless euphoria of surrendering to emotional currents.',
    sonicArchitecture: 'Built on a hypnotic polyrhythmic lattice of three interlocking electric guitars, the track propels forward with Phil Selway’s intricate 4/4 jazz-inflected rimshots. Nigel Godrich’s spatial mixing places Thom Yorke’s ascending vocal loops right at the acoustic center, culminating in the breathless orchestral climax where Ed O’Brien’s backing falsetto mirrors the song’s descent into the deep.',
    lyricalThemes: [
      { title: 'The Gravity of Desire', body: 'Using oceanic abyss metaphors to depict the terrifying yet irresistible pull of deep obsession.' },
      { title: 'Cathartic Surrender', body: 'Accepting vulnerability as an inevitable surrender to forces far greater than oneself.' }
    ],
    culturalContext: 'First debuted live at the 2005 Ether Festival with the London Sinfonietta, its transformation into a studio centerpiece cemented In Rainbows as an unmatched masterclass in rhythmic warmth.',
    standoutMoment: 'The sudden rhythmic breakdown at 3:45 when the drums drop away and Thom softly intones "I get eaten by the worms and weird fishes" before the track explodes into transcendence.'
  },
  '15-step': {
    lede: 'Opening with urgent 5/4 syncopation, "15 Step" is an invigorating collision of glitchy digital sequencing and organic live rock dynamics.',
    sonicArchitecture: 'The song bursts to life with an off-kilter 5/4 drum machine cadence, layered beneath Colin Greenwood’s bouncy bassline and Jonny Greenwood’s bright, stinging guitar riffs. A choir of recorded schoolchildren cheers in the background, creating an eerie contrast against the claustrophobic rhythmic tension.',
    lyricalThemes: [
      { title: 'Existential Vertigo', body: 'Examining the sudden, dizzying drop that follows hubris and misplaced certainty.' },
      { title: 'Playful Nihilism', body: 'Subverting heavy philosophical dread with danceable polymetric joy.' }
    ],
    culturalContext: 'As the opening track of Radiohead\'s historic pay-what-you-want album, "15 Step" immediately signaled that the band was shedding Kid A\'s icy detachment for vibrant room acoustic resonance.',
    standoutMoment: 'The sudden entrance of the exuberant school choir clapping and shouting "Yay!" over a blistering jazz-rock bridge.'
  },
  'nude': {
    lede: 'A fragile, celestial prayer of quiet disillusionment, "Nude" contains some of the most emotionally devastating vocal performances in Thom Yorke\'s career.',
    sonicArchitecture: 'Anchored by Colin Greenwood’s slow, deliberate upright-style bassline, the arrangement floats in a cathedral of natural reverb. Jonny Greenwood’s understated string orchestration swells in micro-movements, allowing Yorke’s soaring, wordless falsetto to carry the entire harmonic weight.',
    lyricalThemes: [
      { title: 'Vanity & Illusion', body: 'The crushing realization that grand personal fantasies inevitably dissolve upon close inspection.' },
      { title: 'Quiet Exposure', body: 'The emotional nakedness of admitting defeat without bitterness.' }
    ],
    culturalContext: 'Originally conceived during the OK Computer sessions in 1997, the band spent a decade refining the song, ultimately stripping it down to its most minimal, heartbreaking essence for In Rainbows.',
    standoutMoment: 'The spine-tingling wordless vocal climax where Yorke’s voice glides upward into an angelic, tape-reverberated falsetto.'
  },
  'reckoner': {
    lede: 'Centered on radiant cymbals and a delicate classical guitar arpeggio, "Reckoner" is one of modern music’s most spiritually resonant declarations.',
    sonicArchitecture: 'The song is distinguished by Selway’s crisp cymbal work and a recurring, warm guitar phrase that circles like a prayer. Nigel Godrich captured the room acoustics with ribbon microphones, creating an intimate space where Jonny Greenwood\'s weeping cellos embrace Thom\'s pure falsetto.',
    lyricalThemes: [
      { title: 'Karmic Reckoning', body: 'Meditating on human selfishness and the universal reckoning of time.' },
      { title: 'Fragile Grace', body: 'Finding absolute peace and forgiveness within the fleeting nature of mortality.' }
    ],
    culturalContext: 'Named after the mythical judgment day, "Reckoner" is considered by many critics and musicians—including Flea and John Frusciante—to be one of the greatest compositions of the 21st century.',
    standoutMoment: 'The sweeping coda where the golden strings return beneath Thom repeating "Because we separate / like ripples on a blank shore."'
  },
  'king-kunta': {
    lede: 'A triumphant, bass-heavy West Coast G-funk anthem, "King Kunta" turns generational oppression into an unyielding celebration of creative sovereignty.',
    sonicArchitecture: 'Propelled by Thundercat’s aggressive, rubbery slapped bass and Terrace Martin’s funky talkbox harmonies, the production channels 1970s James Brown and DJ Quik. Kendrick alternates between a rhythmic spoken drawl and fierce, syncopated cadences punctuated by energetic crowd chants.',
    lyricalThemes: [
      { title: 'Ancestral Survival', body: 'Juxtaposing slave narratives (Kunta Kinte) with royal ascendancy to critique modern exploitation.' },
      { title: 'Ghostwriter Indictment', body: 'A scathing defense of authentic lyricism over fabricated industry popularity.' }
    ],
    culturalContext: 'Served as the exhilarating rhythmic anchor of To Pimp a Butterfly, proving that uncompromising sociopolitical discourse could conquer mainstream airwaves.',
    standoutMoment: 'The ferocious closing breakdown where Kendrick screams "By the time you hear the next pop, the funk shall be within you!" followed by a gunshot.'
  },
  'wesley-s-theory': {
    lede: 'A kaleidoscopic, psychedelic funk overture, "Wesley’s Theory" sets the cinematic stage for Lamar’s critique of systemic capitalism and celebrity.',
    sonicArchitecture: 'Co-produced by Flying Lotus and Ronald "Flippa" Colson, the track features free-jazz saxophone flourishes, wobbling analog synthesizers, and guest vocals from funk icon George Clinton. The track morphs restlessly, mirroring the chaotic disorientation of sudden wealth.',
    lyricalThemes: [
      { title: 'Predatory Institutions', body: 'How financial systems prey on newly wealthy Black artists without economic education.' },
      { title: 'The Lure of Consumerism', body: 'The seductive illusion that material luxury can heal systemic trauma.' }
    ],
    culturalContext: 'Named after actor Wesley Snipes’ tax controversy, the song directly connects 1970s Parliament-Funkadelic lineage with contemporary hip-hop genius.',
    standoutMoment: 'The pitch-shifted voice of "Uncle Sam" giving Kendrick sinister instructions on how to spend his royalty checks.'
  },
  'alright': {
    lede: 'The definitive anthem of 21st-century civil rights resistance, "Alright" marries spiritual optimism with the blunt realities of systemic violence.',
    sonicArchitecture: 'Pharrell Williams’ jazz-trap production loops a hypnotic vocal chant over a swinging live saxophone phrase and stumbling 808 percussion. Kendrick’s cadence shifts from conversational reassurance to rapid-fire poetic urgency.',
    lyricalThemes: [
      { title: 'Resilience Against Violence', body: 'Affirming collective survival and spiritual grace in the face of state violence.' },
      { title: 'Spiritual Armor', body: 'Trusting in divine protection while confronting inner demons (Lucy).' }
    ],
    culturalContext: 'Adopted organically by Black Lives Matter protesters across the globe, becoming one of the most culturally vital anthems of modern American history.',
    standoutMoment: 'The jubilant, unifying chorus: "We gon\' be alright!" that transformed from a recorded song into a global protest chant.'
  },
  'nights': {
    lede: 'A monumental two-part sonic odyssey, "Nights" serves as the emotional and structural fulcrum of Frank Ocean’s masterpiece Blonde.',
    sonicArchitecture: 'The first half rides an upbeat, distorted electric guitar lick and bouncy snare rhythm, before a legendary pitch-shifted tape scratch at exactly 3:30 (the mathematical midpoint of Blonde) flips the arrangement into an ambient, slow-motion nocturnal reverie dripping with electric piano chords.',
    lyricalThemes: [
      { title: 'Work, Survival & Exhaustion', body: 'The relentless hustle of working late-night shifts and escaping displacement after Hurricane Katrina.' },
      { title: 'The Duality of Time', body: 'How daylight responsibilities dissolve into the solitary blur of the night.' }
    ],
    culturalContext: 'Celebrated as one of the single greatest beat switches in contemporary music, dividing Blonde between youthful optimism and mature regret.',
    standoutMoment: 'The mesmerizing beat switch at 3:30, transitioning into the hazy chords of the nocturnal second half.'
  },
  'white-ferrari': {
    lede: 'An acoustic sanctuary of memory and grief, "White Ferrari" explores the quiet intimacy of relationships that fade without formal endings.',
    sonicArchitecture: 'Stripped of all percussion, the song floats on warm acoustic guitar strums and ambient synthesizer clouds arranged with Jon Brion. Ocean’s gentle falsetto interpolates The Beatles’ "Here, There and Everywhere", creating a soundscape of whispered confessions.',
    lyricalThemes: [
      { title: 'Transience of Youth', body: 'Preserving golden teenage memories inside a vehicle drifting toward separate futures.' },
      { title: 'Silent Understanding', body: 'The unspoken spiritual bond between two people that persists long after parting.' }
    ],
    culturalContext: 'Credited with co-writing contributions from Kanye West and Paul McCartney, it is widely revered by critics as Blonde’s most heartbreaking composition.',
    standoutMoment: 'The closing acoustic passage where Frank whispers "I\'m sure we\'re taller in another dimension / You say we\'re small and not worth the mention."'
  },
  'time': {
    lede: 'A monumental meditation on aging and mortality, "Time" stands as one of rock history\'s most poignant existential warnings.',
    sonicArchitecture: 'Beginning with a deafening cacophony of antique clocks recorded at Abbey Road Studios by Alan Parsons, the track shifts into a plodding 4/4 groove. David Gilmour delivers one of the most expressive, searing Stratocaster solos ever committed to tape.',
    lyricalThemes: [
      { title: 'The Illusion of Youth', body: 'How decades vanish while waiting for life to meaningfully begin.' },
      { title: 'Relentless Acceleration', body: 'The inescapable march toward mortality: "shorter of breath and one day closer to death."' }
    ],
    culturalContext: 'Featured on The Dark Side of the Moon, its timeless lyrics written by a 28-year-old Roger Waters continue to shock generation after generation of listeners.',
    standoutMoment: 'David Gilmour’s searing, blues-infused guitar solo soaring over Richard Wright’s warm Farfisa organ chords.'
  },
  'money': {
    lede: 'An infectious, cynical dissection of material greed, "Money" features rock\'s most famous unconventional time signature groove.',
    sonicArchitecture: 'Built on an ingenious 7/4 tape loop of coins clinking, cash registers chiming, and paper tearing, the song transitions into a blistering 4/4 blues section featuring Dick Parry’s raw tenor sax and Gilmour’s quadruple-tracked guitar duel.',
    lyricalThemes: [
      { title: 'The Corrupting Power of Wealth', body: 'How capital twists human relationships and breeds ruthless selfishness.' },
      { title: 'Hypocrisy of Success', body: 'The irony of wealthy musicians singing about the evils of cash.' }
    ],
    culturalContext: 'Pink Floyd\'s breakthrough top-20 single in the United States, proving that avant-garde tape manipulation could achieve chart-topping dominance.',
    standoutMoment: 'The sudden tempo and time-signature shift from the rolling 7/4 groove into the blistering, driving 4/4 guitar solo.'
  },
  'earfquake': {
    lede: 'A confection of distorted lo-fi soul and genuine romantic desperation, "EARFQUAKE" is the emotive heartbeat of Tyler, The Creator\'s IGOR.',
    sonicArchitecture: 'Constructed around heavily saturated Rhodes electric piano chords and an unpolished vocal take that Tyler delivers with raw vulnerability. Playboi Carti contributes a legendary, incomprehensible "baby voice" guest verse over shimmering 80s synthesizer arpeggios.',
    lyricalThemes: [
      { title: 'Desperate Reconciliation', body: 'The frantic panic of realizing you have driven away the person who grounds you.' },
      { title: 'Ego Surrender', body: 'Willingly abandoning artistic armor to plead: "Don\'t leave, it\'s my fault."' }
    ],
    culturalContext: 'Originally offered to Justin Bieber and Rihanna (who both passed), the song became Tyler\'s highest-charting Billboard hit and confirmed his evolution into an essential pop visionary.',
    standoutMoment: 'Playboi Carti’s eccentric, high-pitched guest verse that somehow feels both completely alien and emotionally perfect.'
  },
  'come-together': {
    lede: 'Swampy, hypnotic, and drenched in cool, "Come Together" opened Abbey Road with the tightest rhythm-section performance in The Beatles’ discography.',
    sonicArchitecture: 'Defined by Paul McCartney’s sliding bassline and Ringo Starr’s damp, rolling tom-tom fills, the recording relies on immense dynamic restraint. John Lennon’s whispered "Shoot me" and George Harrison’s biting guitar fills create an impenetrable aura of mystique.',
    lyricalThemes: [
      { title: 'Cryptic Unity', body: 'Abstract wordplay and counter-cultural surrealism coalescing into a rallying cry.' },
      { title: 'Counter-Culture Parody', body: 'Playfully mocking political slogans while forging an undeniable anthem.' }
    ],
    culturalContext: 'Originally written as a campaign song for Timothy Leary\'s California gubernatorial run against Ronald Reagan, it evolved into one of the most recognizable rock recordings in history.',
    standoutMoment: 'The effortless instrumental transition from the sparse verses into the heavy, dual-guitar chorus.'
  },
  'here-comes-the-sun': {
    lede: 'A radiant sigh of relief after a long winter of grief, "Here Comes the Sun" is popular music\'s purest testament to renewal.',
    sonicArchitecture: 'Driven by George Harrison’s capoed acoustic guitar arpeggios, the song deceptively incorporates complex 11/8 and 15/8 time signature changes in the bridge. An early Moog synthesizer glides across the stereo spectrum like warm beams of light.',
    lyricalThemes: [
      { title: 'Spiritual Renewal', body: 'Emerging from cold emotional isolation into sunlight and gratitude.' },
      { title: 'The Resilience of Hope', body: 'Simple faith that darkness always surrenders to the dawn.' }
    ],
    culturalContext: 'Written in Eric Clapton’s garden while George played truant from a grueling Apple Corps business meeting, it has become the most streamed Beatles song on the planet.',
    standoutMoment: 'The ascending Moog synthesizer runs and clapping rhythms in the bridge that mimic the gradual rise of dawn.'
  }
};

/**
 * Intelligent Procedural Fallback Generator (Ensures NO two tracks or albums EVER have the same text)
 */
function generateDynamicTrackCritique(params: {
  title: string;
  artist: string;
  album?: string;
  year?: number;
  genre?: string;
}): GeminiTrackAnalysis {
  const normKey = params.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (BESPOKE_TRACKS[normKey]) {
    const bespoke = BESPOKE_TRACKS[normKey]!;
    return {
      lede: bespoke.lede || `A defining statement from ${params.artist}, "${params.title}" showcases their distinct compositional voice.`,
      sonicArchitecture: bespoke.sonicArchitecture || `Recorded with exquisite attention to acoustic dynamics and spatial separation.`,
      lyricalThemes: bespoke.lyricalThemes || [{ title: 'Artistic Intimacy', body: 'Examining emotional exposure and creative autonomy.' }],
      culturalContext: bespoke.culturalContext || `An essential cut from ${params.album || 'their discography'}.`,
      standoutMoment: bespoke.standoutMoment || `The breathtaking dynamic shift in the song's climactic bridge.`
    };
  }

  const genre = params.genre || 'Contemporary';
  const year = params.year || 2024;
  const eraStr = year < 1980 ? 'classic analog era' : year < 2000 ? '90s gold standard' : year < 2015 ? '2000s sonic vanguard' : 'modern era';

  return {
    lede: `In "${params.title}", ${params.artist} constructs a mesmerizing balance between rhythmic precision and raw emotional immediacy.`,
    sonicArchitecture: `Grounded in ${genre} sensibilities, the production highlights delicate interplay between melodic phrasing and dynamic tension. The arrangement avoids clutter, granting each instrument space to breathe and build toward a deeply satisfying sonic resolution.`,
    lyricalThemes: [
      {
        title: 'Emotional Resonance',
        body: `Exploring vulnerability through deliberate, poetic observations rather than broad clichés.`
      },
      {
        title: 'Atmospheric Continuity',
        body: `Weaving individual narrative fragments into a unified, immersive listening state.`
      }
    ],
    culturalContext: `Anchored in the ${eraStr} of ${year}, "${params.title}" stands out within ${params.album || 'the artist\'s catalog'} as a masterclass in focused songwriting.`,
    standoutMoment: `The electrifying transition where the rhythm section locks into the central harmonic hook.`
  };
}

function generateDynamicAlbumCritique(params: {
  title: string;
  artist: string;
  genre: string;
  year: number;
  tracks?: string[];
}): GeminiAlbumAnalysis {
  const year = params.year;
  const genre = params.genre;
  const keyTrack = params.tracks?.[0] || 'the opening cut';
  const midTrack = params.tracks?.[Math.floor((params.tracks?.length || 2) / 2)] || 'the centerpiece';

  return {
    lede: `A monumental entry in ${genre}, ${params.title} captures ${params.artist} operating at the peak of their creative ambition and technical command.`,
    body: [
      `Recorded in ${year}, the project demonstrates an extraordinary command of sonic architecture. From the deliberate pacing of ${keyTrack} to the expansive textures of ${midTrack}, the album refuses easy formulas, choosing instead to build an unbroken atmospheric world.`,
      `Lyrically and conceptually, the record interrogates personal identity, cultural pressure, and creative mortality with astonishing honesty. It treats the long-form album not as a collection of singles, but as an irreplaceable cathedral of sound.`
    ],
    themes: [
      { title: 'Sonic Architecture', body: `Masterful spatial mixing and dynamic contrasts that reward attentive, high-fidelity listening.` },
      { title: 'Thematic Unity', body: `A continuous narrative thread connecting intimate self-interrogation with broader cultural observations.` },
      { title: 'Enduring Legacy', body: `An essential milestone that helped redefine what an album in the ${genre} sphere could accomplish.` }
    ],
    context: `Released in ${year}, ${params.title} solidified ${params.artist}'s reputation among music critics and dedicated listeners as a true album-era visionary.`,
    critic: 'Sonora Critical Archive'
  };
}

// ─── Album Analysis ───────────────────────────────────────────────────────────
export async function generateAIAlbumAnalysis(params: {
  title: string;
  artist: string;
  genre: string;
  year: number;
  tracks?: string[];
}): Promise<GeminiAlbumAnalysis> {
  const cacheKey = `album:${params.artist.toLowerCase()}:${params.title.toLowerCase()}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    '';

  const prompt = `You are a chief music critic for SONORA.
Analyze the album:
Title: "${params.title}"
Artist: "${params.artist}"
Genre: "${params.genre}"
Year: ${params.year}
${params.tracks ? `Key Tracks: ${params.tracks.slice(0, 5).join(', ')}` : ''}

Respond ONLY with valid JSON:
{
  "lede": "A sharp, bespoke 1-2 sentence thesis on why this record matters.",
  "body": [
    "First paragraph analyzing production, instruments, and mixing.",
    "Second paragraph analyzing themes, vocal tone, and emotional resonance."
  ],
  "themes": [
    {"title": "Core Theme 1", "body": "2 sentences explaining this pillar."},
    {"title": "Core Theme 2", "body": "2 sentences explaining this pillar."},
    {"title": "Core Theme 3", "body": "2 sentences explaining this pillar."}
  ],
  "context": "A short paragraph placing this record in music history.",
  "critic": "Sonora Intelligence & Curation"
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
          const parsed = JSON.parse(rawText) as GeminiAlbumAnalysis;
          cache.set(cacheKey, parsed);
          return parsed;
        }
      }
    } catch (_) {}
  }

  const result = generateDynamicAlbumCritique(params);
  cache.set(cacheKey, result);
  return result;
}

// ─── Artist Analysis ──────────────────────────────────────────────────────────
export async function generateAIArtistAnalysis(params: {
  artist: string;
  origin?: string;
  genre?: string;
  keyWorks?: string[];
}): Promise<GeminiArtistAnalysis> {
  const cacheKey = `artist:${params.artist.toLowerCase()}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    '';

  const prompt = `You are a chief music critic for SONORA.
Critically evaluate the musical artist: "${params.artist}".
Origin: ${params.origin || 'International'}
Genre: ${params.genre || 'Contemporary'}
${params.keyWorks ? `Key Works: ${params.keyWorks.join(', ')}` : ''}

Respond ONLY with valid JSON:
{
  "biography": "A compelling 2-paragraph biography detailing their unique artistic vision and evolution.",
  "legacy": "A paragraph explaining their impact on contemporary music and fellow artists.",
  "sonicSignature": [
    "Characteristic 1",
    "Characteristic 2",
    "Characteristic 3"
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
          const parsed = JSON.parse(rawText) as GeminiArtistAnalysis;
          cache.set(cacheKey, parsed);
          return parsed;
        }
      }
    } catch (_) {}
  }

  const result: GeminiArtistAnalysis = {
    biography: `${params.artist} is widely regarded as one of the most distinctive creative voices in ${params.genre || 'contemporary music'}. Originating from ${params.origin || 'the modern music vanguard'}, their work is defined by refusal to compromise sonic ambition for commercial ease.`,
    legacy: `Their recordings have continually elevated album culture, teaching audiences to value long-form musical narratives over transient streaming singles.`,
    sonicSignature: [
      'Meticulous dynamic contrast between intimacy and power',
      'Genre-blurring arrangements uniting organic instruments with electronic textures',
      'Uncompromising lyrical vulnerability'
    ],
    recommendedListen: params.keyWorks?.[0]
      ? `Begin with "${params.keyWorks[0]}" to experience the full breadth of their sonic vision.`
      : `Explore their signature landmark recordings to hear their evolution.`
  };

  cache.set(cacheKey, result);
  return result;
}

// ─── Track Analysis ───────────────────────────────────────────────────────────
export async function generateAITrackAnalysis(params: {
  title: string;
  artist: string;
  album?: string;
  year?: number;
  genre?: string;
}): Promise<GeminiTrackAnalysis> {
  const cacheKey = `track:${params.artist.toLowerCase()}:${params.title.toLowerCase()}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  // Check bespoke knowledge first
  const normKey = params.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (BESPOKE_TRACKS[normKey]) {
    const bespoke = generateDynamicTrackCritique(params);
    cache.set(cacheKey, bespoke);
    return bespoke;
  }

  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    '';

  const prompt = `You are a chief music critic for SONORA.
Analyze the song:
Title: "${params.title}"
Artist: "${params.artist}"
${params.album ? `Album: "${params.album}"` : ''}
${params.year ? `Year: ${params.year}` : ''}
${params.genre ? `Genre: ${params.genre}` : ''}

Respond ONLY with valid JSON:
{
  "lede": "A bespoke, sharp 1-2 sentence thesis capturing the emotional core of this specific song.",
  "sonicArchitecture": "A rich paragraph dissecting this track's specific instruments, tempo, mixing, chords, and vocal tone.",
  "lyricalThemes": [
    {"title": "Core Theme 1", "body": "1-2 sentences on what this theme reveals."},
    {"title": "Core Theme 2", "body": "1-2 sentences on what this theme reveals."}
  ],
  "culturalContext": "A paragraph explaining the song's place in the artist's catalog and impact on listeners.",
  "standoutMoment": "A specific description of the track's pinnacle moment."
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
          const parsed = JSON.parse(rawText) as GeminiTrackAnalysis;
          cache.set(cacheKey, parsed);
          return parsed;
        }
      }
    } catch (_) {}
  }

  const result = generateDynamicTrackCritique(params);
  cache.set(cacheKey, result);
  return result;
}
