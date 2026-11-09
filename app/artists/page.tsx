import type { Metadata } from 'next';
import { Sparkles, Mic2 } from 'lucide-react';
import { ArtistsClient, type DirectoryArtist } from './artists-client';

export const metadata: Metadata = {
  title: 'Artists & Sonic Pioneers — SONORA',
  description:
    'Explore discographies, critical retrospectives, and sonic signatures of the defining voices in album culture.',
};

const ARTISTS_DIRECTORY: DirectoryArtist[] = [
  {
    name: 'Radiohead',
    slug: 'radiohead',
    origin: 'Oxford, United Kingdom',
    genre: 'Alternative / Art Rock',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/1000x1000bb.jpg',
    era: '1990s — Present',
    recordsCount: 9,
  },
  {
    name: 'Kendrick Lamar',
    slug: 'kendrick-lamar',
    origin: 'Compton, California, USA',
    genre: 'Hip-Hop/Rap',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/94/28/36/94283609-93bb-db1c-e997-44e82c157e90/00602567261216.rgb.jpg/1000x1000bb.jpg',
    era: '2010s — Present',
    recordsCount: 6,
  },
  {
    name: 'Frank Ocean',
    slug: 'frank-ocean',
    origin: 'New Orleans, Louisiana, USA',
    genre: 'R&B/Soul',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/42/62/50/426250f9-7e39-f907-687c-442caa436636/dj.nhptxziz.jpg/1000x1000bb.jpg',
    era: '2010s — Present',
    recordsCount: 3,
  },
  {
    name: 'Pink Floyd',
    slug: 'pink-floyd',
    origin: 'London, United Kingdom',
    genre: 'Rock / Progressive',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3e/17/ec/3e17ec6d-f980-c64f-19e0-a6fd8bbf0c10/886445635850.jpg/1000x1000bb.jpg',
    era: '1960s — 1990s',
    recordsCount: 15,
  },
  {
    name: 'Daft Punk',
    slug: 'daft-punk',
    origin: 'Paris, France',
    genre: 'Electronic / Dance',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fd/4a/77/fd4a77db-0ebc-d043-41a2-f32fa1bb0fb4/dj.qrikkdwj.jpg/1000x1000bb.jpg',
    era: '1990s — 2021',
    recordsCount: 4,
  },
  {
    name: 'Tyler, The Creator',
    slug: 'tyler-the-creator',
    origin: 'Los Angeles, California, USA',
    genre: 'Hip-Hop/Rap',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/22/fd/10/22fd10a3-881d-2560-64e7-a9df650b9e47/17UM1IM42651.rgb.jpg/1000x1000bb.jpg',
    era: '2010s — Present',
    recordsCount: 7,
  },
  {
    name: 'The Beatles',
    slug: 'the-beatles',
    origin: 'Liverpool, United Kingdom',
    genre: 'Rock / Pop',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/fa/5b/89/fa5b898d-bad6-e053-4195-260e5c74f2bb/00602567725466.rgb.jpg/1000x1000bb.jpg',
    era: '1960s — 1970',
    recordsCount: 13,
  },
  {
    name: 'Björk',
    slug: 'bjork',
    origin: 'Reykjavík, Iceland',
    genre: 'Alternative / Art Pop',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/58/30/6e/58306e6c-deba-df87-423b-07c0a5fca918/075596146869.jpg/1000x1000bb.jpg',
    era: '1990s — Present',
    recordsCount: 10,
  },
  {
    name: 'Lana Del Rey',
    slug: 'lana-del-rey',
    origin: 'New York City, USA',
    genre: 'Alternative / Baroque Pop',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/7a/e0/36/7ae03609-5f83-a8b2-c34f-fd9a2706f615/054391207142.jpg/1000x1000bb.jpg',
    era: '2010s — Present',
    recordsCount: 9,
  },
  {
    name: 'David Bowie',
    slug: 'david-bowie',
    origin: 'London, United Kingdom',
    genre: 'Rock / Glam',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/5f/fa/56/5ffa56c2-ea1f-7a17-6bad-192ff9b6476d/825646124206.jpg/1000x1000bb.jpg',
    era: '1960s — 2016',
    recordsCount: 26,
  },
  {
    name: 'MF DOOM',
    slug: 'mf-doom',
    origin: 'London / New York, USA',
    genre: 'Hip-Hop/Rap',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/23/40/b5/2340b514-8149-da62-3fe5-f6e5bd3ec172/0878390000593_cover.jpg/1000x1000bb.jpg',
    era: '1990s — 2020',
    recordsCount: 6,
  },
  {
    name: 'Fleetwood Mac',
    slug: 'fleetwood-mac',
    origin: 'London, United Kingdom',
    genre: 'Rock / Soft Rock',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/d2/48/f4/d248f4ae-a7e4-a48e-1588-6617de3e8d76/mzi.izeorbmm.jpg/1000x1000bb.jpg',
    era: '1960s — 2000s',
    recordsCount: 17,
  },
  {
    name: 'Stevie Wonder',
    slug: 'stevie-wonder',
    origin: 'Saginaw, Michigan, USA',
    genre: 'R&B/Soul / Funk',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d1/f4/bb/d1f4bbe5-bac3-2cdb-eebb-bb30b0fbde4e/19UMGIM40715.rgb.jpg/1000x1000bb.jpg',
    era: '1960s — Present',
    recordsCount: 23,
  },
  {
    name: 'Miles Davis',
    slug: 'miles-davis',
    origin: 'Alton, Illinois, USA',
    genre: 'Jazz / Modal Jazz',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music/7f/9f/d6/mzi.vtnaewef.jpg/1000x1000bb.jpg',
    era: '1940s — 1991',
    recordsCount: 60,
  },
  {
    name: 'Tame Impala',
    slug: 'tame-impala',
    origin: 'Perth, Australia',
    genre: 'Rock / Psychedelic',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/83/02/3a/83023aa8-63c3-6f54-916a-036e29eb68e4/00602517839182.rgb.jpg/1000x1000bb.jpg',
    era: '2010s — Present',
    recordsCount: 4,
  },
  {
    name: 'Billie Eilish',
    slug: 'billie-eilish',
    origin: 'Los Angeles, California, USA',
    genre: 'Alternative / Electropop',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/92/9f/69/929f69f1-9977-3a44-d674-11f70c852d1b/24UMGIM36186.rgb.jpg/1000x1000bb.jpg',
    era: '2010s — Present',
    recordsCount: 3,
  },
];

export default function ArtistsPage() {
  return (
    <div className="min-h-screen pb-28 pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="eyebrow mb-2 flex items-center gap-1.5 text-champagne">
            <Sparkles className="size-3.5" /> The Pantheon
          </p>
          <h1 className="font-serif text-4xl text-ivory sm:text-5xl lg:text-6xl">
            Artists & Sonic Pioneers
          </h1>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            Explore the visionaries, iconoclasts, and generational storytellers shaping album culture across decades.
          </p>
        </div>

        {/* Directory Client */}
        <ArtistsClient artists={ARTISTS_DIRECTORY} />
      </div>
    </div>
  );
}

