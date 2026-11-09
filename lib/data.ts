import type { Album, Discussion, Mood, MoodSlug, Review, Story, Track } from './types'

type TrackTuple = [title: string, duration: string, rating: number, standout?: boolean, previewUrl?: string]

const tracks = (list: TrackTuple[]): Track[] =>
  list.map(([title, duration, rating, standout, previewUrl], i) => ({ n: i + 1, title, duration, rating, standout, previewUrl }))

/** Bell-shaped distribution of community ratings (percent per point, 1–10). */
const distribution = (score: number, spread = 1.35): number[] => {
  const raw = Array.from({ length: 10 }, (_, i) => Math.exp(-((i + 1 - score) ** 2) / (2 * spread ** 2)))
  const total = raw.reduce((a, b) => a + b, 0)
  return raw.map((v) => Math.round((v / total) * 1000) / 10)
}

export const albums: Album[] = [
  {
    slug: 'in-rainbows',
    title: 'In Rainbows',
    artist: 'Radiohead',
    artistSlug: 'radiohead',
    artistOrigin: 'Oxford, United Kingdom',
    year: 2007,
    releaseDate: 'October 10, 2007',
    genre: 'Art Rock',
    subgenres: ['Alternative Rock', 'Electronic', 'Post-Rock'],
    label: 'XL Recordings / self-released',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/dd/50/c7/dd50c790-99ac-d3d0-5ab8-e3891fb8fd52/634904032463.png/1000x1000bb.jpg',
    moods: ['late-night', 'solitude', 'focus'],
    score: 9.4,
    ratingsCount: 84320,
    distribution: distribution(9.4, 0.9),
    saves: 142100,
    trendDelta: 5,
    attentionRise: 38,
    isNew: false,
    tagline: 'A warm, hypnotic masterpiece of human vulnerability and rhythmic precision.',
    editorial:
      'After the icy dystopia of Kid A and OK Computer, Radiohead stripped down to their most organic, warm, and intimate sonic landscape. A landmark record of dynamic restraint, orchestral flourishes, and emotional directness.',
    analysis: {
      lede: 'In Rainbows is Radiohead at their most emotionally generous — trading apocalyptic paranoia for deeply human intimacy and sonic warmth.',
      body: [
        'Tracked in atmospheric spaces like Tottenham House, the production by Nigel Godrich captures raw room acoustics alongside meticulous digital sequencing. From the urgent 5/4 syncopation of "15 Step" to the shimmering arpeggios of "Weird Fishes", the arrangements breathe with natural room resonance.',
        'Thom Yorke\'s vocals abandon veiled cynicism for heartbreaking vulnerability. On "Nude" and "Reckoner", his soaring falsetto floats over Jonny Greenwood\'s lush string arrangements, creating moments of transcendent beauty that remain unmatched in contemporary rock.',
      ],
      themes: [
        { title: 'Romantic Vulnerability', body: 'Confronting desire, emotional fragility, and the terrifying exposure of intimacy.' },
        { title: 'Mortality & Surrender', body: 'Finding peace and quiet catharsis in transience, epitomized by "Videotape".' },
        { title: 'Rhythmic Duality', body: 'Complex polymetric percussion grounding weightless, cinematic melodies.' },
      ],
      context:
        'Famous for its historic pay-what-you-want digital release, In Rainbows disrupted the music industry while delivering what many critics consider Radiohead\'s crowning artistic achievement.',
      critic: 'Sonora Editorial Staff',
    },
    credits: [
      { role: 'Produced by', name: 'Nigel Godrich, Radiohead' },
      { role: 'Engineered by', name: 'Nigel Godrich, Richard Woodcraft' },
      { role: 'Mastered by', name: 'Bob Ludwig at Gateway Mastering' },
      { role: 'Artwork by', name: 'Stanley Donwood' },
      { role: 'Strings arranged by', name: 'Jonny Greenwood' },
    ],
    tracks: tracks([
      ['15 Step', '3:57', 9.3, true, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a5/79/90/a579906e-5bc2-24a8-43b6-81d2a042eb18/mzaf_14665977354765177718.plus.aac.p.m4a'],
      ['Bodysnatchers', '4:02', 9.1, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e4/2a/01/e42a018f-ec7b-e7fa-5034-6050d339a5ef/mzaf_5464120641250363278.plus.aac.p.m4a'],
      ['Nude', '4:15', 9.8, true, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b0/d6/9d/b0d69d33-0683-8f06-b768-95f0056af16f/mzaf_17403465269284578717.plus.aac.p.m4a'],
      ['Weird Fishes/Arpeggi', '5:18', 9.9, true, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/3a/12/eb/3a12ebaf-89c1-1ac9-6821-3a1de510ef51/mzaf_14543910941982290973.plus.aac.p.m4a'],
      ['All I Need', '3:48', 9.4, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8e/c3/d5/8ec3d546-17d7-3322-662d-e09a89fbefd8/mzaf_7126755987197906481.plus.aac.p.m4a'],
      ['Faust Arp', '2:09', 8.7, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/9c/82/92/9c82920e-c90a-1e0a-1e60-bf604bae80d9/mzaf_3298592383350408547.plus.aac.p.m4a'],
      ['Reckoner', '4:50', 9.8, true, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d9/84/2b/d9842b3d-350e-3c36-3681-df31588ab202/mzaf_1179366535087719219.plus.aac.p.m4a'],
      ['House of Cards', '5:28', 9.0, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e7/7f/49/e77f4904-d37a-deed-9237-6fd6f88615e3/mzaf_9468509769421853320.plus.aac.p.m4a'],
      ['Jigsaw Falling Into Place', '4:09', 9.7, true, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/76/0b/04/760b0415-ed76-cc02-b688-1a49789dbc34/mzaf_10830186063789872228.plus.aac.p.m4a'],
      ['Videotape', '4:40', 9.2, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/8f/04/26/8f0426ef-4d1b-c1e7-dcde-dfb868f2c52a/mzaf_6071995543397747319.plus.aac.p.m4a'],
    ]),
    platforms: ['spotify', 'apple-music', 'youtube-music', 'amazon-music', 'tidal', 'deezer'],
  },
  {
    slug: 'to-pimp-a-butterfly',
    title: 'To Pimp a Butterfly',
    artist: 'Kendrick Lamar',
    artistSlug: 'kendrick-lamar',
    artistOrigin: 'Compton, California, USA',
    year: 2015,
    releaseDate: 'March 15, 2015',
    genre: 'Conscious Hip-Hop',
    subgenres: ['Jazz Rap', 'Funk', 'Neo-Soul', 'Spoken Word'],
    label: 'Top Dawg Entertainment / Aftermath / Interscope',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/b5/a6/91/b5a69171-5232-3d5b-9c15-8963802f83dd/15UMGIM15814.rgb.jpg/1000x1000bb.jpg',
    moods: ['late-night', 'focus', 'solitude'],
    score: 9.7,
    ratingsCount: 112450,
    distribution: distribution(9.7, 0.8),
    saves: 198000,
    trendDelta: 8,
    attentionRise: 55,
    isNew: false,
    tagline: 'A monumental cultural opus that reshaped modern American music.',
    editorial:
      'An uncompromising, multi-layered masterpiece that fuses free jazz, G-funk, spoken word, and social critique to confront institutional oppression, personal grief, and survivor\'s guilt.',
    analysis: {
      lede: 'To Pimp a Butterfly is a modern epic of Black American art — an expansive, uncompromising synthesis of jazz, funk, and unflinching self-interrogation.',
      body: [
        'Enlisting jazz luminaries Kamasi Washington, Robert Glasper, Thundercat, and Terrace Martin, Kendrick transformed the hip-hop sonic palette into a live, improvisational soundstage rooted in 1970s funk and West Coast lineage.',
        'Lyrically, the album functions as a novel. The spoken-word poem gradually revealed across the tracklist culminates in an imaginary conversation with Tupac Shakur, wrestling with fame, colorism, mental health, and the burden of community representation.',
      ],
      themes: [
        { title: 'Survivor\'s Guilt & Trauma', body: 'The devastating emotional toll of escaping poverty while peers remain trapped.' },
        { title: 'Systemic Exploitation', body: 'Critiquing institutional racism and the commodification of Black cultural genius.' },
        { title: 'Self-Love & Healing', body: 'Discovering inner resilience and spiritual peace amidst violent societal chaos.' },
      ],
      context:
        'Acclaimed as one of the greatest albums of the 21st century, it became an indelible anthem for the Black Lives Matter movement and cemented Lamar as a generational poet.',
      critic: 'Sonora Critical Archive',
    },
    credits: [
      { role: 'Executive Producers', name: 'Dr. Dre, Anthony "Top Dawg" Tiffith' },
      { role: 'Producers', name: 'Terrace Martin, Thundercat, Flying Lotus, Pharrell, Boi-1da' },
      { role: 'Bass & Vocals', name: 'Thundercat' },
      { role: 'Tenor Saxophone', name: 'Kamasi Washington' },
      { role: 'Keys', name: 'Robert Glasper' },
    ],
    tracks: tracks([
      ['Wesley\'s Theory', '4:47', 9.5, true],
      ['For Free? (Interlude)', '2:10', 8.9, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c3/14/15/c3141583-a962-3fe3-ff64-666159a4f62c/mzaf_12836212771564987383.plus.aac.p.m4a'],
      ['King Kunta', '3:54', 9.7, true, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/28/14/64/281464e2-0033-0ba3-303f-f74215f21fb0/mzaf_14773791895724654194.plus.aac.p.m4a'],
      ['Institutionalized', '4:31', 9.2],
      ['These Walls', '5:00', 9.4, true],
      ['u', '4:28', 9.8, true, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d3/73/29/d3732923-5ce0-24e2-6fec-2020b36dbfaa/mzaf_8427601245739033955.plus.aac.p.m4a'],
      ['Alright', '3:39', 9.9, true, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/3b/27/4e/3b274eab-c2de-84c5-a68d-4f78f3269bac/mzaf_16117050990489545534.plus.aac.p.m4a'],
      ['For Sale? (Interlude)', '4:51', 9.0, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/bc/57/53/bc57531e-4ea5-4b78-99d2-776bca44a5b6/mzaf_14431945323158707972.plus.aac.p.m4a'],
      ['Momma', '4:43', 9.3, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1a/21/b9/1a21b950-152c-ff19-8000-63d37a174f6e/mzaf_7854064311215508345.plus.aac.p.m4a'],
      ['Hood Politics', '4:52', 9.2, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/52/ce/f4/52cef468-fc78-9d1b-8689-10f0baa97f05/mzaf_17278079660011529082.plus.aac.p.m4a'],
      ['How Much a Dollar Cost', '4:21', 9.8, true],
      ['Complexion (A Zulu Love)', '4:23', 9.3],
      ['The Blacker the Berry', '5:28', 9.8, true, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/bf/0f/24/bf0f2411-cacf-2de6-8d2c-c07165f8532c/mzaf_2306287090479330243.plus.aac.p.m4a'],
      ['You Ain\'t Gotta Lie (Momma Said)', '4:01', 9.0],
      ['i', '5:36', 9.5, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/44/1b/66/441b66ea-fbec-f5d7-e572-995a8e0fc387/mzaf_10266399530288430977.plus.aac.p.m4a'],
      ['Mortal Man', '12:07', 9.7, true, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/87/b7/66/87b7665d-00d6-e17c-cb52-66cc30343388/mzaf_11343155989364841174.plus.aac.p.m4a'],
    ]),
    platforms: ['spotify', 'apple-music', 'youtube-music', 'amazon-music', 'tidal', 'deezer'],
  },
  {
    slug: 'blonde',
    title: 'Blonde',
    artist: 'Frank Ocean',
    artistSlug: 'frank-ocean',
    artistOrigin: 'New Orleans, Louisiana, USA',
    year: 2016,
    releaseDate: 'August 20, 2016',
    genre: 'R&B / Soul',
    subgenres: ['Art Pop', 'Neo-Soul', 'Ambient Pop', 'Psychedelic Soul'],
    label: 'Boys Don\'t Cry',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/42/62/50/426250f9-7e39-f907-687c-442caa436636/dj.nhptxziz.jpg/1000x1000bb.jpg',
    moods: ['late-night', 'heartbreak', 'solitude'],
    score: 9.5,
    ratingsCount: 96800,
    distribution: distribution(9.5, 0.85),
    saves: 165000,
    trendDelta: 4,
    attentionRise: 44,
    isNew: false,
    tagline: 'An impressionistic cathedral of memory, youth, love, and quiet longing.',
    editorial:
      'Abandoning conventional pop songcraft for fragmentary, avant-garde arrangements, Blonde is a masterclass in modern minimalism. Guitars drift in reverbs, pitched vocals bend time, and memories unravel in real time.',
    analysis: {
      lede: 'Blonde is a landmark of introspective modern soul — capturing the ephemeral blur of adolescence, romantic devotion, and bittersweet nostalgia.',
      body: [
        'By stripping away traditional percussion on much of the record, Ocean forces listeners to lean closely into electric guitars, tape hum, and ambient synthesizer pads. The legendary beat switch on "Nights" acts as the emotional pivot of the entire project.',
        'Ocean navigates queerness, isolation, and luxury with understated grace. Collaborations with Beyoncé, André 3000, and James Blake are folded seamlessly into his solitary emotional orbit.',
      ],
      themes: [
        { title: 'The Duality of Youth', body: 'Juxtaposing youthful innocence and reckless abandon with inevitable maturation.' },
        { title: 'Fragmented Memory', body: 'Sonic snapshots and voicemails preserving relationships that have dissolved.' },
        { title: 'Fluid Identity', body: 'Exploring sexuality, creative independence, and personal autonomy.' },
      ],
      context:
        'Self-released independently after famously fulfilling his label obligations, Blonde proved that uncompromising avant-garde art could achieve monumental global resonance.',
      critic: 'Sonora Critical Archive',
    },
    credits: [
      { role: 'Produced by', name: 'Frank Ocean, Malay, Om\'Mas Keith, Pharrell, Rostam' },
      { role: 'Featured Vocals', name: 'André 3000, Beyoncé, Kim Burrell' },
      { role: 'Guitar', name: 'Alex G, Spaceman, Buddy Ross' },
      { role: 'Mastered by', name: 'Dave Kutch' },
    ],
    tracks: tracks([
      ['Nikes', '5:14', 9.2, true],
      ['Ivy', '4:09', 9.7, true],
      ['Pink + White', '3:04', 9.8, true],
      ['Be Yourself', '1:26', 8.5],
      ['Solo', '4:17', 9.4, true],
      ['Skyline To', '3:04', 9.0],
      ['Self Control', '4:09', 9.9, true],
      ['Good Guy', '1:06', 8.7],
      ['Nights', '5:07', 9.9, true],
      ['Solo (Reprise)', '1:18', 9.5],
      ['Pretty Sweet', '2:38', 8.8],
      ['Facebook Story', '1:08', 8.2],
      ['Close to You', '1:25', 9.1],
      ['White Ferrari', '4:08', 9.8, true],
      ['Seigfried', '5:34', 9.7, true],
      ['Godspeed', '2:57', 9.4],
      ['Futura Free', '9:24', 9.0],
    ]),
    platforms: ['spotify', 'apple-music', 'youtube-music', 'amazon-music', 'tidal', 'deezer'],
  },
  {
    slug: 'dark-side-of-the-moon',
    title: 'The Dark Side of the Moon',
    artist: 'Pink Floyd',
    artistSlug: 'pink-floyd',
    artistOrigin: 'London, United Kingdom',
    year: 1973,
    releaseDate: 'March 1, 1973',
    genre: 'Progressive Rock',
    subgenres: ['Psychedelic Rock', 'Art Rock', 'Space Rock'],
    label: 'Harvest / EMI / Capitol',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/aa/e0/ab/aae0ab6a-d906-a189-81bf-70b56aa43f7a/886445635843.jpg/1000x1000bb.jpg',
    moods: ['late-night', 'solitude', 'focus'],
    score: 9.6,
    ratingsCount: 154000,
    distribution: distribution(9.6, 0.75),
    saves: 240000,
    trendDelta: 2,
    attentionRise: 28,
    isNew: false,
    tagline: 'The universal benchmark for high-concept studio album storytelling.',
    editorial:
      'Engineered with unprecedented fidelity by Alan Parsons at Abbey Road, this conceptual masterpiece meditates on greed, time, mortality, and madness with timeless cinematic majesty.',
    analysis: {
      lede: 'The Dark Side of the Moon remains the defining statement of album-as-artform — an unbroken suite exploring the psychological pressures of modern existence.',
      body: [
        'Utilizing cutting-edge VCS3 synthesizers, analog tape loops (the rhythmic cash register on "Money"), and quadraphonic panning, Pink Floyd expanded the boundaries of recorded sound.',
        'David Gilmour\'s soaring guitar solos and Clare Torry\'s improvised vocal tour-de-force on "The Great Gig in the Sky" ground Roger Waters\' philosophical lyrics in profound emotional reality.',
      ],
      themes: [
        { title: 'The Tyranny of Time', body: 'The terrifying brevity of human life and the insidious trap of procrastination.' },
        { title: 'Material Greed & Commerce', body: 'The corrupting influence of capital on human empathy.' },
        { title: 'Mental Fragility', body: 'An homage to Syd Barrett reflecting on sanity in an irrational world.' },
      ],
      context:
        'Spent an unprecedented 900+ weeks on the Billboard charts, defining high-fidelity stereo production and album art iconography for over half a century.',
      critic: 'Sonora Historical Archive',
    },
    credits: [
      { role: 'Produced by', name: 'Pink Floyd' },
      { role: 'Engineer', name: 'Alan Parsons at Abbey Road Studios' },
      { role: 'Mixing Supervisor', name: 'Chris Thomas' },
      { role: 'Cover Design', name: 'Hipgnosis / George Hardie' },
      { role: 'Guest Vocals', name: 'Clare Torry (The Great Gig in the Sky)' },
    ],
    tracks: tracks([
      ['Speak to Me', '1:05', 8.8],
      ['Breathe (In the Air)', '2:49', 9.5, true],
      ['On the Run', '3:45', 8.9],
      ['Time', '6:53', 9.9, true],
      ['The Great Gig in the Sky', '4:44', 9.8, true],
      ['Money', '6:22', 9.6, true],
      ['Us and Them', '7:49', 9.7, true],
      ['Any Colour You Like', '3:26', 9.2],
      ['Brain Damage', '3:46', 9.6, true],
      ['Eclipse', '2:12', 9.7, true],
    ]),
    platforms: ['spotify', 'apple-music', 'youtube-music', 'amazon-music', 'tidal', 'deezer'],
  },
  {
    slug: 'discovery',
    title: 'Discovery',
    artist: 'Daft Punk',
    artistSlug: 'daft-punk',
    artistOrigin: 'Paris, France',
    year: 2001,
    releaseDate: 'March 12, 2001',
    genre: 'Electronic / French House',
    subgenres: ['Nu-Disco', 'Synthpop', 'Eurodance'],
    label: 'Virgin Records',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fd/4a/77/fd4a77db-0ebc-d043-41a2-f32fa1bb0fb4/dj.qrikkdwj.jpg/1000x1000bb.jpg',
    moods: ['euphoria', 'late-night', 'focus'],
    score: 9.3,
    ratingsCount: 88500,
    distribution: distribution(9.3, 0.9),
    saves: 135000,
    trendDelta: 6,
    attentionRise: 41,
    isNew: false,
    tagline: 'An infectious, futuristic love letter to the wonder of childhood imagination.',
    editorial:
      'Fusing 1970s disco and 80s arena pop through compressed French touch filters and vocoders, Discovery is pure musical joy engineered with unmatched technical brilliance.',
    analysis: {
      lede: 'Discovery is the euphoric apex of dance music — celebrating innocence, nostalgia, and science fiction through timeless groove-craft.',
      body: [
        'Guy-Manuel and Thomas Bangalter radically reworked vintage vinyl samples into gleaming cybernetic dance anthems. "One More Time" and "Harder Better Faster Stronger" codified the golden age of vocoder pop.',
        'Beyond the energetic club tracks, ballads like "Something About Us" demonstrate delicate melodic tenderness, providing the soundtrack to the anime companion film Interstella 5555.',
      ],
      themes: [
        { title: 'Childhood Nostalgia', body: 'Reconnecting with the uninhibited musical joy felt as a child.' },
        { title: 'Humanity Inside Machinery', body: 'Using synthetic vocoders to express deeply human longing and affection.' },
        { title: 'Interstellar Romance', body: 'Transcending planetary boundaries through universal musical harmony.' },
      ],
      context:
        'A transformative crossover moment that catapulted European dance music into global stadiums and influenced two decades of modern pop production.',
      critic: 'Sonora Critical Archive',
    },
    credits: [
      { role: 'Produced by', name: 'Thomas Bangalter, Guy-Manuel de Homem-Christo' },
      { role: 'Guest Vocals', name: 'Romanthony, Todd Edwards' },
      { role: 'Visuals & Animation', name: 'Leiji Matsumoto, Toei Animation' },
    ],
    tracks: tracks([
      ['One More Time', '5:20', 9.9, true, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/5d/93/d8/5d93d83f-ad1e-da4d-1d79-9937bdff24ec/mzaf_14396932211949300852.plus.aac.p.m4a'],
      ['Aerodynamic', '3:27', 9.4, true, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/0e/ab/8f/0eab8f87-87db-9501-110a-ad681b23ca0f/mzaf_16233060439128880755.plus.aac.p.m4a'],
      ['Digital Love', '4:58', 9.8, true, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/df/43/5b/df435bbf-129a-ec94-cebb-8c83e3a261e2/mzaf_13417326183095861767.plus.aac.p.m4a'],
      ['Harder, Better, Faster, Stronger', '3:45', 9.7, true],
      ['Crescendolls', '3:31', 9.0, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e5/23/e9/e523e9ba-033e-b879-da3d-461d9b8b78bc/mzaf_8375481395149044603.plus.aac.p.m4a'],
      ['Nightvision', '1:44', 8.8, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/8d/00/b2/8d00b2e1-0672-03f0-df9f-cc011626fe06/mzaf_18422326861735268875.plus.aac.p.m4a'],
      ['Superheroes', '3:57', 9.1, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ae/88/90/ae88903e-3f28-527f-1df2-f80a20b9adff/mzaf_9476856611102807301.plus.aac.p.m4a'],
      ['High Life', '3:22', 8.9, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/20/60/bc/2060bcff-569f-9f03-b5ab-d000d235896f/mzaf_152906689635921771.plus.aac.p.m4a'],
      ['Something About Us', '3:51', 9.8, true, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e5/6e/07/e56e0775-d44c-fc79-a8d8-78b46a825738/mzaf_9538225478116277548.plus.aac.p.m4a'],
      ['Voyager', '3:47', 9.5, true, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/60/d3/cf/60d3cf87-d9ac-03e5-a057-032b94cfd59e/mzaf_11149912225012968836.plus.aac.p.m4a'],
      ['Veridis Quo', '5:44', 9.7, true, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e0/cc/c4/e0ccc4af-ad90-59fe-9a7c-9c32d1a3c380/mzaf_2643765405421046671.plus.aac.p.m4a'],
      ['Short Circuit', '3:26', 8.7, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/85/a1/84/85a18405-2694-c9e2-c4eb-aa696b33d170/mzaf_11653878276245735503.plus.aac.p.m4a'],
      ['Face to Face', '4:00', 9.6, true, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ab/7e/7e/ab7e7e17-1803-4bb9-ff55-e3e8409925ca/mzaf_13376909038790853248.plus.aac.p.m4a'],
      ['Too Long', '10:00', 9.0, 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/cb/b5/06/cbb506be-6759-9384-04a5-51fd5295cd9c/mzaf_13436507164328567604.plus.aac.p.m4a'],
    ]),
    platforms: ['spotify', 'apple-music', 'youtube-music', 'amazon-music', 'tidal', 'deezer'],
  },
  {
    slug: 'igor',
    title: 'IGOR',
    artist: 'Tyler, The Creator',
    artistSlug: 'tyler-the-creator',
    artistOrigin: 'Los Angeles, California, USA',
    year: 2019,
    releaseDate: 'May 17, 2019',
    genre: 'Neo-Soul / Hip-Hop',
    subgenres: ['Funk', 'Experimental Hip-Hop', 'Synthpop'],
    label: 'Columbia Records',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/22/fd/10/22fd10a3-881d-2560-64e7-a9df650b9e47/17UM1IM42651.rgb.jpg/1000x1000bb.jpg',
    moods: ['heartbreak', 'late-night', 'euphoria'],
    score: 9.3,
    ratingsCount: 78900,
    distribution: distribution(9.3, 0.9),
    saves: 122000,
    trendDelta: 5,
    attentionRise: 48,
    isNew: false,
    tagline: 'A thrilling, genre-bending heartbreak opera dressed in blown-out synthesizers.',
    editorial:
      'Written, produced, and arranged entirely by Tyler, IGOR trades aggressive rap bravado for blown-out 808s, Motown bridges, and heartbreaking vulnerability.',
    analysis: {
      lede: 'IGOR is Tyler, The Creator\'s auteur achievement — a visceral, distortion-drenched narrative documenting the stages of unrequited love and romantic dissolution.',
      body: [
        'Drawing sonic inspiration from Stevie Wonder, The Neptunes, and dirty funk, the production intentionally redlines audio levels to create raw emotional immediacy. "EARFQUAKE" and "A BOY IS A GUN*" fuse sweet soul progressions with harsh distortion.',
        'Adopting a blond-wigged alter-ego, Tyler candidly narrates a fraught love triangle. The progression from obsessive infatuation on "NEW MAGIC WAND" to mature acceptance on "ARE WE STILL FRIENDS?" is exceptionally executed.',
      ],
      themes: [
        { title: 'Obsessive Infatuation', body: 'The destabilizing madness of loving someone who cannot fully commit.' },
        { title: 'Rebirth Through Heartbreak', body: 'Shedding emotional ego to discover authentic self-worth.' },
        { title: 'Aesthetic reinvention', body: 'Using distorted lo-fi soul to redefine modern hip-hop masculinity.' },
      ],
      context:
        'Won the Grammy for Best Rap Album while defying rap categorization, cementing Tyler as one of the preeminent musical polymaths of his era.',
      critic: 'Sonora Critical Archive',
    },
    credits: [
      { role: 'Written, Produced & Arranged by', name: 'Tyler, The Creator' },
      { role: 'Featured Vocals', name: 'Playboi Carti, Solange, Santigold, Kanye West' },
      { role: 'Narration by', name: 'Jerrod Carmichael' },
    ],
    tracks: tracks([
      ['IGOR\'S THEME', '3:20', 9.1],
      ['EARFQUAKE', '3:10', 9.8, true],
      ['I THINK', '3:32', 9.4, true],
      ['RUNNING OUT OF TIME', '2:57', 9.0],
      ['NEW MAGIC WAND', '3:15', 9.9, true],
      ['A BOY IS A GUN*', '3:30', 9.6, true],
      ['PUPPET', '2:59', 9.2],
      ['WHAT\'S GOOD', '3:25', 9.3],
      ['GONE, GONE / THANK YOU', '6:15', 9.8, true],
      ['I DON\'T LOVE YOU ANYMORE', '2:41', 8.9],
      ['ARE WE STILL FRIENDS?', '4:25', 9.7, true],
    ]),
    platforms: ['spotify', 'apple-music', 'youtube-music', 'amazon-music', 'tidal', 'deezer'],
  },
  {
    slug: 'abbey-road',
    title: 'Abbey Road',
    artist: 'The Beatles',
    artistSlug: 'the-beatles',
    artistOrigin: 'Liverpool, United Kingdom',
    year: 1969,
    releaseDate: 'September 26, 1969',
    genre: 'Classic Rock',
    subgenres: ['Pop Rock', 'Psychedelic Rock', 'Art Rock'],
    label: 'Apple Records / EMI',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/48/53/43/485343e3-dd6a-0034-faec-f4b6403f8108/13UMGIM63890.rgb.jpg/1000x1000bb.jpg',
    moods: ['focus', 'solitude', 'euphoria'],
    score: 9.6,
    ratingsCount: 168000,
    distribution: distribution(9.6, 0.75),
    saves: 260000,
    trendDelta: 3,
    attentionRise: 25,
    isNew: false,
    tagline: 'The timeless swansong of popular music\'s most influential quartet.',
    editorial:
      'Recorded as the four members knew the band was ending, Abbey Road is a triumph of collective songwriting, featuring George Harrison\'s finest compositions and the legendary Side Two medley.',
    analysis: {
      lede: 'Abbey Road is the quintessential parting gift in rock history — four masters harmonizing through tension to create eternal pop architecture.',
      body: [
        'Side A contains individual tour-de-forces: Harrison\'s radiant "Something" and "Here Comes the Sun", alongside Lennon\'s swampy "Come Together". On Side B, Paul McCartney and George Martin orchestrate the celebrated 16-minute medley seamlessly moving from "Golden Slumbers" to "The End".',
        'Featuring the pioneering use of the Moog synthesizer and solid-state mixing desks, the record has an unmatched audio warmth that remains the gold standard of analog production.',
      ],
      themes: [
        { title: 'The Power of Collective Art', body: 'Overcoming bitter interpersonal conflicts to serve musical greatness.' },
        { title: 'Renewal & Optimism', body: 'Finding light at the end of emotional and cultural upheaval.' },
        { title: 'The Final Curtain', body: '"And in the end, the love you take is equal to the love you make."' },
      ],
      context:
        'The final album The Beatles recorded together, its cover image at the zebra crossing outside EMI studios remains the single most iconic photograph in rock lore.',
      critic: 'Sonora Historical Archive',
    },
    credits: [
      { role: 'Produced by', name: 'George Martin' },
      { role: 'Engineered by', name: 'Geoff Emerick, Phil McDonald' },
      { role: 'Cover Photography', name: 'Iain Macmillan' },
    ],
    tracks: tracks([
      ['Come Together', '4:20', 9.7, true],
      ['Something', '3:03', 9.9, true],
      ['Maxwell\'s Silver Hammer', '3:27', 8.2],
      ['Oh! Darling', '3:26', 9.4, true],
      ['Octopus\'s Garden', '2:51', 8.7],
      ['I Want You (She\'s So Heavy)', '7:47', 9.8, true],
      ['Here Comes the Sun', '3:05', 9.9, true],
      ['Because', '2:45', 9.5, true],
      ['You Never Give Me Your Money', '4:02', 9.6, true],
      ['Sun King', '2:26', 8.8],
      ['Mean Mr. Mustard', '1:06', 8.7],
      ['Polythene Pam', '1:12', 8.7],
      ['She Came In Through the Bathroom Window', '1:57', 9.1],
      ['Golden Slumbers', '1:31', 9.8, true],
      ['Carry That Weight', '1:36', 9.4],
      ['The End', '2:19', 9.8, true],
      ['Her Majesty', '0:23', 8.5],
    ]),
    platforms: ['spotify', 'apple-music', 'youtube-music', 'amazon-music', 'tidal', 'deezer'],
  },
]

export const getAlbum = (slug: string): Album | undefined =>
  albums.find((a) => a.slug === slug)

export const getSimilarAlbums = (album: Album, count = 4): Album[] =>
  albums
    .filter((a) => a.slug !== album.slug && (a.genre === album.genre || a.moods.some((m) => album.moods.includes(m))))
    .slice(0, count)

export const getArtists = () => {
  const map = new Map<string, { name: string; slug: string; origin: string; count: number; image?: string; cover?: string; albumSlug: string }>()
  for (const a of albums) {
    const existing = map.get(a.artistSlug)
    if (existing) {
      existing.count++
    } else {
      map.set(a.artistSlug, {
        name: a.artist,
        slug: a.artistSlug,
        origin: a.artistOrigin,
        count: 1,
        image: a.cover,
        cover: a.cover,
        albumSlug: a.slug,
      })
    }
  }
  return Array.from(map.values())
}

export const getGenres = () => {
  const set = new Set<string>()
  for (const a of albums) {
    set.add(a.genre)
    a.subgenres.forEach((sg) => set.add(sg))
  }
  return Array.from(set).sort()
}

export const moods: Mood[] = [
  {
    slug: 'late-night',
    name: 'Late Night',
    description: 'Music that exists in the quiet solitude between 1 AM and the sunrise.',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/dd/50/c7/dd50c790-99ac-d3d0-5ab8-e3891fb8fd52/634904032463.png/1000x1000bb.jpg',
  },
  {
    slug: 'heartbreak',
    name: 'Heartbreak',
    description: 'Cathartic, confessional records that confront grief and romantic loss head-on.',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/42/62/50/426250f9-7e39-f907-687c-442caa436636/dj.nhptxziz.jpg/1000x1000bb.jpg',
  },
  {
    slug: 'euphoria',
    name: 'Euphoria',
    description: 'Ecstatic release, rhythmic vitality, and transcendent musical joy.',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fd/4a/77/fd4a77db-0ebc-d043-41a2-f32fa1bb0fb4/dj.qrikkdwj.jpg/1000x1000bb.jpg',
  },
  {
    slug: 'focus',
    name: 'Deep Focus',
    description: 'Immersive sonic architecture, intricate loops, and contemplative flow.',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/aa/e0/ab/aae0ab6a-d906-a189-81bf-70b56aa43f7a/886445635843.jpg/1000x1000bb.jpg',
  },
  {
    slug: 'solitude',
    name: 'Solitude',
    description: 'Bare, intimate recordings that make space for quiet contemplation.',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/22/fd/10/22fd10a3-881d-2560-64e7-a9df650b9e47/17UM1IM42651.rgb.jpg/1000x1000bb.jpg',
  },
  {
    slug: 'slow-sunday',
    name: 'Slow Sunday',
    description: 'Warm analog morning warmth, soulful arrangements, and unhurried pacing.',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/48/53/43/485343e3-dd6a-0034-faec-f4b6403f8108/13UMGIM63890.rgb.jpg/1000x1000bb.jpg',
  },
]

export const stories: Story[] = [
  {
    slug: 'the-making-of-in-rainbows',
    kicker: 'Deep Dive',
    title: 'How Radiohead Left the Industry Behind and Built a Warm Sanctuary',
    dek: 'Twenty years after OK Computer, the band found freedom not by retreating, but by singing directly into the room.',
    author: 'Sonora Editorial',
    readTime: '7 min read',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/dd/50/c7/dd50c790-99ac-d3d0-5ab8-e3891fb8fd52/634904032463.png/1000x1000bb.jpg',
    albumSlug: 'in-rainbows',
  },
  {
    slug: 'jazz-in-modern-rap',
    kicker: 'Cultural History',
    title: 'The Jazz Lineage of To Pimp a Butterfly',
    dek: 'How Thundercat, Kamasi Washington, and Kendrick Lamar fused West Coast hip-hop with four decades of African American musical tradition.',
    author: 'Sonora Editorial',
    readTime: '9 min read',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/b5/a6/91/b5a69171-5232-3d5b-9c15-8963802f83dd/15UMGIM15814.rgb.jpg/1000x1000bb.jpg',
    albumSlug: 'to-pimp-a-butterfly',
  },
  {
    slug: 'frank-ocean-blonde-minimalism',
    kicker: 'Sonic Architecture',
    title: 'The Art of Empty Space in Frank Ocean\'s Blonde',
    dek: 'Why the beat switch on Nights and the silence between guitar chords created modern music\'s most intimate cathedral.',
    author: 'Sonora Editorial',
    readTime: '6 min read',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/42/62/50/426250f9-7e39-f907-687c-442caa436636/dj.nhptxziz.jpg/1000x1000bb.jpg',
    albumSlug: 'blonde',
  },
]

export const discussions: Discussion[] = [
  {
    id: 'disc-1',
    albumSlug: 'in-rainbows',
    title: 'Is "Weird Fishes/Arpeggi" the greatest rhythm track of the 2000s?',
    author: 'thom_watcher',
    replies: 42,
    lastActive: '12m ago',
  },
  {
    id: 'disc-2',
    albumSlug: 'to-pimp-a-butterfly',
    title: 'The dual meaning of the Tupac interview on "Mortal Man"',
    author: 'jazz_rap_scholar',
    replies: 88,
    lastActive: '24m ago',
  },
  {
    id: 'disc-3',
    albumSlug: 'blonde',
    title: 'Why "Self Control" hits harder on tape than digital streaming',
    author: 'analog_nostalgia',
    replies: 61,
    lastActive: '1h ago',
  },
]

export const reviews: Review[] = [
  {
    id: 'rev-1',
    albumSlug: 'in-rainbows',
    author: 'Evelyn Reed',
    handle: '@evelynreed',
    rating: 10,
    title: 'The album that restored my faith in human music.',
    body: 'In Rainbows does not show off; it opens its arms. The drum rhythms are astonishingly complex if you count them, but effortless to feel in your chest. "Nude" and "Reckoner" belong to the small handful of recordings that transcend their era entirely.',
    date: '3 days ago',
    likes: 420,
  },
  {
    id: 'rev-2',
    albumSlug: 'to-pimp-a-butterfly',
    author: 'Marcus Vance',
    handle: '@marcusvance',
    rating: 10,
    title: 'A cultural monument that will be studied for centuries.',
    body: 'Every bar, every saxophone trill, and every spoken reflection is weighted with generational weight. It is demanding, challenging, exhilarating, and deeply healing.',
    date: '1 week ago',
    likes: 612,
  },
  {
    id: 'rev-3',
    albumSlug: 'blonde',
    author: 'Clara Chen',
    handle: '@clarac',
    rating: 10,
    title: 'A private memory box made of sound.',
    body: 'There are no filler tracks here. Just pure emotional honesty, pitched-up vocal experiments, and chords that feel like watching summer sunsets fade into autumn.',
    date: '2 weeks ago',
    likes: 389,
  },
]

// ─── Exported Helpers and Collections for Components ──────────────────────────

export const featuredAlbum: Album = albums[0]!

export const trendingAlbums: Album[] = [...albums].sort((a, b) => b.ratingsCount - a.ratingsCount)

export const risingAlbums: Album[] = [...albums].sort((a, b) => b.attentionRise - a.attentionRise)

export const newReleases: Album[] = albums.slice(0, 4)

export const getAlbumsByMood = (slug: MoodSlug): Album[] =>
  albums.filter((a) => a.moods.includes(slug))

export const formatCount = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

export const totalRuntime = (input: Album | Track[]): string => {
  const trackList = Array.isArray(input) ? input : input?.tracks || []
  let totalSec = 0
  for (const t of trackList) {
    if (t?.duration) {
      const parts = t.duration.split(':').map(Number)
      const m = parts[0] || 0
      const s = parts[1] || 0
      totalSec += m * 60 + s
    }
  }
  const mins = Math.floor(totalSec / 60)
  return `${mins} min`
}

export const currentUser = {
  name: 'Kartikey',
  handle: '@kartikey',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  savedCount: 28,
  ratedCount: 64,
}

export const initialLibrary = {
  saved: ['in-rainbows', 'to-pimp-a-butterfly', 'blonde', 'dark-side-of-the-moon'],
  albumRatings: {
    'in-rainbows': 10,
    'to-pimp-a-butterfly': 10,
    'blonde': 10,
    'dark-side-of-the-moon': 9.5,
  } as Record<string, number>,
  followed: ['radiohead', 'kendrick-lamar', 'frank-ocean', 'pink-floyd'],
}
