'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const verdicts = ['Unlistenable', 'Poor', 'Weak', 'Uneven', 'Decent', 'Good', 'Great', 'Excellent', 'Essential', 'Masterpiece']

export function verdictFor(score: number) {
  return verdicts[Math.min(9, Math.max(0, Math.round(score) - 1))]
}

interface RatingMeterProps {
  value: number | null | undefined
  onChange: (value: number | null) => void
  label: string
  size?: 'sm' | 'md'
  showVerdict?: boolean
  className?: string
}

/** A ten-segment level meter used as SONORA's rating input. Clicking the current value clears it. */
export function RatingMeter({ value, onChange, label, size = 'md', showVerdict = true, className }: RatingMeterProps) {
  const [hover, setHover] = useState<number | null>(null)
  const display = hover ?? value ?? 0

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        role="radiogroup"
        aria-label={label}
        className={cn('flex items-end', size === 'sm' ? 'gap-[3px]' : 'gap-1')}
        onMouseLeave={() => setHover(null)}
      >
        {Array.from({ length: 10 }, (_, i) => {
          const n = i + 1
          const active = n <= display
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={value === n}
              aria-label={`${n} out of 10`}
              onMouseEnter={() => setHover(n)}
              onFocus={() => setHover(n)}
              onBlur={() => setHover(null)}
              onClick={() => onChange(value === n ? null : n)}
              className={cn(
                'relative flex items-end justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring',
                size === 'sm' ? 'h-6 w-2.5' : 'h-10 w-4',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'block w-full rounded-full transition-all duration-200',
                  size === 'sm' ? 'max-w-[4px]' : 'max-w-[6px]',
                  active ? 'bg-champagne' : 'bg-ivory/15',
                  hover !== null && active && 'bg-champagne/80',
                )}
                style={{ height: `${(size === 'sm' ? 40 : 35) + n * (size === 'sm' ? 6 : 6.5)}%` }}
              />
            </button>
          )
        })}
      </div>
      {showVerdict && (
        <div className="min-w-[5.5rem] leading-tight" aria-live="polite">
          {display ? (
            <>
              <span className={cn('font-serif text-ivory', size === 'sm' ? 'text-base' : 'text-2xl')}>{display}</span>
              <span className="text-xs text-muted-foreground"> / 10</span>
              {size === 'md' && <p className="text-xs text-champagne">{verdictFor(display)}</p>}
            </>
          ) : (
            <span className="text-xs text-muted-foreground">Not rated</span>
          )}
        </div>
      )}
    </div>
  )
}
