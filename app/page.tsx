import { featuredAlbum, moods, newReleases, risingAlbums, stories, trendingAlbums } from '@/lib/data'
import { MobileHeader } from '@/components/sonora/mobile-header'
import { FeaturedHero } from '@/components/sonora/home/featured-hero'
import { MoodSection } from '@/components/sonora/home/mood-section'
import { NewReleases } from '@/components/sonora/home/new-releases'
import { TrendingChart } from '@/components/sonora/home/trending-chart'
import { EditorialStories } from '@/components/sonora/home/editorial-stories'
import { CommunityPulse } from '@/components/sonora/home/community-pulse'

export default function HomePage() {
  return (
    <main>
      <MobileHeader />
      <FeaturedHero album={featuredAlbum} />
      <MoodSection moods={moods} />
      <NewReleases albums={newReleases} />
      <TrendingChart albums={trendingAlbums} />
      <EditorialStories stories={stories} />
      <CommunityPulse rising={risingAlbums} />
    </main>
  )
}
