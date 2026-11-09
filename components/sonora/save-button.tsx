'use client'

import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useLibrary } from '@/lib/library-store'
import { cn } from '@/lib/utils'

interface SaveButtonProps {
  slug: string
  title: string
  variant?: 'pill' | 'icon'
  className?: string
}

export function SaveButton({ slug, title, variant = 'pill', className }: SaveButtonProps) {
  const { isSaved, toggleSave } = useLibrary()
  const saved = isSaved(slug)
  const Icon = saved ? BookmarkCheck : Bookmark

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          toggleSave(slug)
        }}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${title} from library` : `Save ${title} to library`}
        className={cn(
          'glass inline-flex size-10 items-center justify-center rounded-full transition-colors hover:text-champagne',
          saved ? 'text-champagne' : 'text-ivory',
          className,
        )}
      >
        <Icon className="size-4" aria-hidden />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => toggleSave(slug)}
      aria-pressed={saved}
      className={cn(
        'inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-all',
        saved
          ? 'border-champagne/40 bg-champagne/10 text-champagne'
          : 'border-hairline bg-ivory/5 text-ivory hover:border-ivory/25 hover:bg-ivory/10',
        className,
      )}
    >
      <Icon className="size-4" aria-hidden />
      {saved ? 'In your library' : 'Save to library'}
    </button>
  )
}
