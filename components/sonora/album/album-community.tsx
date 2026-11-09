'use client'

import { useState } from 'react'
import { Check, MessageSquareText, MessagesSquare, PenLine } from 'lucide-react'
import { currentUser, discussions } from '@/lib/data'
import { useLibrary } from '@/lib/library-store'
import type { Album } from '@/lib/types'
import { cn } from '@/lib/utils'
import { EmptyState } from '../primitives'
import { RatingMeter } from '../rating-meter'
import { ReviewCard } from './review-card'

type Sort = 'top' | 'recent'

function ReviewForm({ album, onDone }: { album: Album; onDone: (didPost: boolean) => void }) {
  const { addReview, albumRatings } = useLibrary()
  const [rating, setRating] = useState<number | null>(albumRatings[album.slug] ?? null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!rating) next.rating = 'Choose a rating from 1 to 10.'
    if (title.trim().length < 3) next.title = 'Give your review a headline.'
    if (body.trim().length < 40) next.body = `A little more, please — at least 40 characters (${body.trim().length}/40).`
    setErrors(next)
    if (Object.keys(next).length) return
    setSubmitting(true)
    setTimeout(() => {
      addReview({ albumSlug: album.slug, author: currentUser.name, handle: currentUser.handle, rating: rating!, title: title.trim(), body: body.trim() })
      setSubmitting(false)
      onDone(true)
    }, 600)
  }

  return (
    <form onSubmit={submit} noValidate className="glass animate-rise rounded-2xl p-5 lg:p-7" aria-label={`Review ${album.title}`}>
      <fieldset>
        <legend className="text-sm text-ivory">Your rating</legend>
        <RatingMeter className="mt-3" value={rating} onChange={setRating} label="Your rating" />
        {errors.rating && <p className="mt-2 text-xs text-destructive">{errors.rating}</p>}
      </fieldset>
      <div className="mt-6">
        <label htmlFor="review-title" className="text-sm text-ivory">
          Headline
        </label>
        <input
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={90}
          placeholder="The record in one line"
          aria-invalid={!!errors.title}
          className="mt-2 h-12 w-full rounded-lg border border-hairline bg-obsidian/50 px-4 font-serif text-lg text-ivory placeholder:text-muted-foreground/60 focus:border-champagne/50 focus:outline-none"
        />
        {errors.title && <p className="mt-2 text-xs text-destructive">{errors.title}</p>}
      </div>
      <div className="mt-5">
        <label htmlFor="review-body" className="text-sm text-ivory">
          Review
        </label>
        <textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          maxLength={1200}
          placeholder="What does it sound like? What does it make you feel? Where does it land?"
          aria-invalid={!!errors.body}
          className="mt-2 w-full resize-y rounded-lg border border-hairline bg-obsidian/50 p-4 text-[15px] leading-relaxed text-ivory placeholder:text-muted-foreground/60 focus:border-champagne/50 focus:outline-none"
        />
        <div className="mt-1 flex justify-between text-xs">
          <span className="text-destructive">{errors.body}</span>
          <span className="text-muted-foreground">{body.length}/1200</span>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={() => onDone(false)} className="h-11 rounded-full px-5 text-sm text-muted-foreground hover:text-ivory">
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-champagne px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-ivory disabled:opacity-60"
        >
          {submitting ? (
            <>
              <span className="size-3.5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" aria-hidden />
              Publishing
            </>
          ) : (
            'Publish review'
          )}
        </button>
      </div>
    </form>
  )
}

export function AlbumCommunity({ album }: { album: Album }) {
  const { reviews } = useLibrary()
  const [writing, setWriting] = useState(false)
  const [posted, setPosted] = useState(false)
  const [sort, setSort] = useState<Sort>('top')

  const albumReviews = reviews.filter((r) => r.albumSlug === album.slug)
  const sorted = sort === 'top' ? [...albumReviews].sort((a, b) => b.likes - a.likes) : albumReviews
  const threads = discussions.filter((d) => d.albumSlug === album.slug)

  return (
    <section id="community" aria-labelledby="community-title" className="scroll-mt-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Community</p>
              <h2 id="community-title" className="mt-3 font-serif text-3xl text-ivory lg:text-5xl">
                Reviews <span className="text-muted-foreground">({albumReviews.length})</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div role="group" aria-label="Sort reviews" className="flex rounded-full border border-hairline p-1">
                {(['top', 'recent'] as Sort[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={sort === s}
                    onClick={() => setSort(s)}
                    className={cn('h-8 rounded-full px-3.5 text-xs capitalize transition-colors', sort === s ? 'bg-ivory/10 text-ivory' : 'text-muted-foreground')}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {!writing && (
                <button
                  type="button"
                  onClick={() => {
                    setWriting(true)
                    setPosted(false)
                  }}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-champagne px-4 text-sm font-medium text-primary-foreground hover:bg-ivory"
                >
                  <PenLine className="size-4" aria-hidden /> Write
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {writing && (
              <ReviewForm
                album={album}
                onDone={(didPost) => {
                  setWriting(false)
                  setPosted(didPost)
                }}
              />
            )}
            {posted && !writing && (
              <p role="status" className="flex items-center gap-2 text-sm text-champagne">
                <Check className="size-4" aria-hidden /> Thanks — your words are now part of the record.
              </p>
            )}
            {sorted.length === 0 && !writing ? (
              <EmptyState
                icon={MessageSquareText}
                title="Be the first voice"
                body={`No one has reviewed ${album.title} yet. Your take could shape how others hear it.`}
                action={
                  <button type="button" onClick={() => setWriting(true)} className="h-10 rounded-full border border-champagne/40 px-5 text-sm text-champagne hover:bg-champagne/10">
                    Write the first review
                  </button>
                }
              />
            ) : (
              sorted.map((r) => <ReviewCard key={r.id} review={r} />)
            )}
          </div>
        </div>

        <aside aria-labelledby="threads-title" className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h3 id="threads-title" className="flex items-center gap-2 font-serif text-2xl text-ivory">
              <MessagesSquare className="size-5 text-champagne" aria-hidden /> Discussions
            </h3>
            {threads.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No threads yet. Conversations open after the first reviews land.</p>
            ) : (
              <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
                {threads.map((d) => (
                  <li key={d.id}>
                    <button type="button" className="block w-full py-4 text-left">
                      <p className="text-[15px] leading-snug text-ivory hover:text-champagne">{d.title}</p>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        @{d.author} · {d.replies} replies · {d.lastActive}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}
