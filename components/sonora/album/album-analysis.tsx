'use client'

import { useState } from 'react'
import { Sparkles, RefreshCw, Check } from 'lucide-react'
import type { Album } from '@/lib/types'

export function AlbumCredits({ album }: { album: Album }) {
  return (
    <section aria-labelledby={`credits-${album.slug}`}>
      <h2 id={`credits-${album.slug}`} className="eyebrow">
        Album credits
      </h2>
      <dl className="mt-4 divide-y divide-hairline">
        {album.credits.map((c) => (
          <div key={`${c.role}-${c.name}`} className="flex items-baseline justify-between gap-4 py-3">
            <dt className="text-xs text-muted-foreground">{c.role}</dt>
            <dd className="text-right text-sm text-ivory">{c.name}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function AlbumAnalysis({ album }: { album: Album }) {
  const [currentAnalysis, setCurrentAnalysis] = useState(album.analysis)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAiGenerated, setIsAiGenerated] = useState(false)

  const handleGenerateAI = async () => {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: album.title,
          artist: album.artist,
          genre: album.genre,
          year: album.year,
          tracks: album.tracks.map((t) => t.title),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setCurrentAnalysis(data)
        setIsAiGenerated(true)
      }
    } catch (err) {
      console.error('Failed to generate AI analysis:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section id="analysis" aria-labelledby="analysis-title" className="scroll-mt-28">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p className="eyebrow">
            {isAiGenerated ? 'Gemini 2.0 Critical Intelligence' : 'Editorial analysis'}
          </p>
          <h2 id="analysis-title" className="mt-3 font-serif text-4xl leading-[1] text-ivory lg:text-6xl">
            Inside <span className="italic">the record</span>
          </h2>
          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            By {currentAnalysis.critic}
          </p>

          {/* Interactive Gemini AI Action Button */}
          <div className="mt-6">
            <button
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-champagne/10 px-4 py-2 text-xs font-medium text-champagne hover:bg-champagne/20 transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="size-3.5 animate-spin" />
                  Generating with Gemini AI...
                </>
              ) : isAiGenerated ? (
                <>
                  <Check className="size-3.5" />
                  Regenerate with Gemini AI
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" />
                  Analyze with Gemini AI
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-8">
          <p className="font-serif text-2xl leading-snug text-ivory text-pretty lg:text-[2rem] lg:leading-[1.25]">
            {currentAnalysis.lede}
          </p>
          <div className="mt-8 space-y-5 text-[16px] leading-[1.75] text-ivory/75 lg:columns-2 lg:gap-12 lg:space-y-0 [&>p]:break-inside-avoid lg:[&>p+p]:mt-5">
            {currentAnalysis.body.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-champagne'
                    : undefined
                }
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-14 lg:mt-20">
        <p className="eyebrow mb-6">Thematic Pillars</p>
        <ol className="grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline md:grid-cols-3">
          {currentAnalysis.themes.map((t, i) => (
            <li key={t.title} className="bg-obsidian p-6 lg:p-8">
              <span className="font-serif text-sm text-champagne">
                {['I', 'II', 'III', 'IV', 'V'][i] || `${i + 1}`}
              </span>
              <h3 className="mt-3 font-serif text-2xl text-ivory">{t.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <aside className="mt-10 grid gap-4 border-l-2 border-champagne/60 pl-6 lg:mt-14 lg:w-2/3">
        <p className="eyebrow">Musical context</p>
        <p className="text-[15px] leading-relaxed text-ivory/80">{currentAnalysis.context}</p>
      </aside>
    </section>
  )
}
