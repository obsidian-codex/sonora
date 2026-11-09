import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SONORA — Album Culture & Music Criticism',
    short_name: 'SONORA',
    description:
      'An editorial sanctuary for album culture, deep listening, critical discourse, and music community.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#0A0A0C',
    theme_color: '#0A0A0C',
    categories: ['music', 'entertainment', 'magazines'],
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/favicon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  };
}

