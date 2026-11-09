# SONORA — Design System Specification
> **Status:** Phase 0 — Awaiting Approval  
> **Last updated:** 2026-10-16

---

## Design Philosophy

SONORA should feel like a **curated editorial publication that happens to be a web app** — not a database with search filters, not a Spotify-style music dashboard.

The interface should feel like it was designed by a thoughtful art director who:
- Cares deeply about the music being presented
- Lets artwork and typography speak before UI chrome does
- Uses restraint to create calm, confident spaces
- Understands that negative space is a design element, not wasted screen

The interface should feel **alive but not anxious** — smooth motion, purposeful transitions, no decorative spinning or bouncing.

---

## Anti-Patterns (Things to Actively Avoid)

Memorize this list. Violating these is a design failure.

- A Spotify-style permanent sidebar
- A bottom playback dock or fake music controls
- Generic SaaS dashboard aesthetic (sidebar + top nav + main content grid)
- Neon glow on everything
- Excessive glass cards stacked on cards stacked on cards
- Gradients as a substitute for design decisions
- Every section using identical rounded-rectangle card rows
- Tiny low-contrast metadata text under artwork
- Overcrowded hero sections with too many competing elements
- Pill badges and decorative labels on everything
- AI-generated gradient blobs as background decoration
- Repeating the same layout pattern for every page type
- Modal overuse (prefer inline patterns where possible)
- Fake loading spinners that just spin with no progress indication
- Deep-fried hover effects (scale + shadow + glow all at once)

---

## Color System

### Base Palette

```css
/* Backgrounds — layered depth system */
--color-bg-base:       #0D0D0F;   /* page base: near-black with warm blue undertone */
--color-bg-surface:    #141417;   /* primary surface: card, panel */
--color-bg-elevated:   #1C1C21;   /* elevated surface: modal, dropdown */
--color-bg-overlay:    #22222A;   /* highest surface: tooltip, popover */

/* Glass surfaces — used selectively */
--color-glass-light:   rgba(255, 255, 255, 0.04);   /* subtle glass fill */
--color-glass-medium:  rgba(255, 255, 255, 0.07);   /* standard glass fill */
--color-glass-border:  rgba(255, 255, 255, 0.08);   /* glass border */

/* Accent — champagne gold */
--color-accent:        #C9A96E;   /* primary accent */
--color-accent-dim:    #A07B4A;   /* subdued accent (secondary use) */
--color-accent-subtle: rgba(201, 169, 110, 0.12); /* tinted background */
--color-accent-text:   #E8C98C;   /* accent used on dark backgrounds (text) */

/* Text hierarchy */
--color-text-primary:  #F0EDE8;   /* main content text: warm off-white */
--color-text-secondary:#A8A4A0;   /* supporting text: medium grey-warm */
--color-text-muted:    #6B6764;   /* de-emphasized: labels, timestamps */
--color-text-inverse:  #0D0D0F;   /* text on accent backgrounds */

/* Borders */
--color-border-subtle: rgba(255, 255, 255, 0.06);  /* very quiet dividers */
--color-border-default:rgba(255, 255, 255, 0.10);  /* standard borders */
--color-border-strong: rgba(255, 255, 255, 0.18);  /* emphasis borders */

/* Semantic colors */
--color-success:       #6EAF7C;   /* muted green */
--color-warning:       #C9956E;   /* warm amber */
--color-error:         #C96E6E;   /* muted red */
--color-info:          #6E9AC9;   /* muted blue */

/* Score/rating colors (5 levels) */
--color-score-1:       #C96E6E;   /* 1-3: low */
--color-score-2:       #C9956E;   /* 4-5: below average */
--color-score-3:       #C9BA6E;   /* 6: average */
--color-score-4:       #A0B97A;   /* 7-8: good */
--color-score-5:       #6EAF7C;   /* 9-10: excellent */
```

### When to Use Accent Color

- Active navigation state
- Rating widget selected stars
- Key call-to-action buttons (Sign in, Rate, Save)
- Score display for high-rated albums
- Hover state underlines on links

Do **not** use accent color for:
- Large background fills
- Decorative borders everywhere
- Borders on every card
- Text that doesn't need emphasis

---

## Typography

### Font Families

```css
/* Display — editorial headlines */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');

/* Body — highly readable */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

/* Monospace — tracklist numbers, scores */
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');

--font-display: 'Playfair Display', Georgia, serif;
--font-body:    'Inter', system-ui, -apple-system, sans-serif;
--font-mono:    'DM Mono', 'Fira Code', monospace;
```

**Why Playfair Display?**
It has a strong editorial personality — used by magazines and cultural publications. Its italic variant has genuine character. It contrasts beautifully with Inter's neutrality.

**Why Inter?**
Best in class for screen readability. Consistent letter-spacing, clear distinction between characters (1, I, l), and excellent at small sizes.

### Type Scale

| Token | Size | Line Height | Weight | Font | Usage |
|---|---|---|---|---|---|
| `text-hero` | 56-72px | 1.05 | 700 | Display | Hero album title |
| `text-display` | 40-48px | 1.1 | 600 | Display | Page titles, artist names |
| `text-title-lg` | 28-32px | 1.2 | 600 | Display/Body | Section headlines |
| `text-title` | 22-24px | 1.3 | 600 | Body | Album titles on pages |
| `text-title-sm` | 18-20px | 1.4 | 500 | Body | Card titles |
| `text-body-lg` | 17-18px | 1.6 | 400 | Body | Long-form review text |
| `text-body` | 15-16px | 1.6 | 400 | Body | Standard body text |
| `text-body-sm` | 13-14px | 1.5 | 400 | Body | Supporting metadata |
| `text-caption` | 11-12px | 1.4 | 400 | Body | Labels, timestamps (min size) |
| `text-mono` | 13-14px | 1.4 | 400 | Mono | Track numbers, scores |

**Never go below 12px.**

### Typography Rules

- Album titles on album pages: `font-display`, large, slightly italic for mood
- Artist names on artist pages: `font-display`, bold
- Review body text: `font-body`, 16-18px, generous line-height (1.7)
- Metadata (year, label, genre): `font-body`, small, `color-text-muted`
- Tracklist positions: `font-mono`, `color-text-muted`
- Community scores: `font-mono`, large, colored by score level
- Editorial headlines: `font-display`, can use italic for personality

---

## Spacing Scale

Based on a 4px base unit:

```
4px    (1)   — micro spacing: icon gap, tight padding
8px    (2)   — small: input vertical padding, tight list items
12px   (3)   — default: element padding, compact list items
16px   (4)   — medium: card padding, form fields
20px   (5)   — comfortable: between related items
24px   (6)   — standard section padding
32px   (8)   — between distinct content groups
40px   (10)  — major section separation (mobile)
48px   (12)  — section separation (desktop)
64px   (16)  — large breaks, hero spacing
96px   (24)  — page-level vertical rhythm
128px  (32)  — hero sections
```

### Spacing Rules

- Artwork cards: 12-16px internal padding
- Page-level horizontal padding: 16px mobile, 32px tablet, 48-64px desktop
- Max content width: 1280px centered
- Album page: max reading width for reviews: 680px
- Section headings: 32-40px above, 16-24px below
- Never use arbitrary px values — use scale tokens

---

## Border & Radius Rules

### Border Radii

```
radius-sm:    4px    — small UI elements (badges, tags)
radius-md:    8px    — inputs, buttons, small cards
radius-lg:    12px   — standard cards
radius-xl:    16px   — large cards, modals
radius-2xl:   24px   — hero artwork (when shown large)
radius-full:  9999px — avatars, pill labels (use sparingly)
```

**Radius Philosophy:**
- Artwork images: use `radius-lg` or `radius-xl` depending on context — never `radius-full`
- Main navigation: no border radius (it's a strip, not a card)
- Album hero artwork on album page: `radius-xl` or even `radius-2xl` at large sizes
- Buttons: `radius-md`
- Do not use different radii on the same type of element

### Borders

```
border-subtle:  1px solid rgba(255,255,255,0.06)    — very quiet dividers
border-default: 1px solid rgba(255,255,255,0.10)    — standard card borders
border-strong:  1px solid rgba(255,255,255,0.18)    — focus states, active
border-accent:  1px solid rgba(201,169,110,0.40)    — accent-adjacent elements
```

**Border Rules:**
- Every card does **not** need a border. If it sits on a darker background, skip the border.
- Borders on glass surfaces: always use `border-glass` (very subtle)
- Never use a colored border as pure decoration
- Avoid double borders (border + box-shadow outline on same element)

---

## Glassmorphism Rules

Glassmorphism is a **selective tool**, not a global style.

### When to use it

- Navigation bar on scroll (backdrop-blur + very subtle glass fill)
- Search overlay / modal overlays
- "Floating" panels that appear over artwork (score overlay on hero)
- Tooltip-style popovers

### When NOT to use it

- Every album card (they should sit on dark surfaces, not float)
- Artist discography grid
- Tracklist items
- Review list items
- The page background
- Form inputs (use solid surface fills instead)

### Glass Implementation

```css
/* Standard glass surface */
background: rgba(20, 20, 23, 0.72);
backdrop-filter: blur(16px) saturate(150%);
-webkit-backdrop-filter: blur(16px) saturate(150%);
border: 1px solid rgba(255, 255, 255, 0.08);

/* Light glass (for elements on very dark bg) */
background: rgba(255, 255, 255, 0.04);
backdrop-filter: blur(8px);
border: 1px solid rgba(255, 255, 255, 0.06);
```

**Blur values:**
- Nav bar: `blur(20px)` — needs to be strong to remain readable
- Modal overlay background: `blur(8px)` on the backdrop
- Score card overlapping artwork: `blur(12px)`
- Never go below `blur(8px)` or it doesn't read as glass

---

## Artwork Treatment

Album artwork is the **visual anchor of the entire product**. Treat it with respect.

### Rules

1. Never crop artwork into a circle. Always rectangular with `radius-lg` or `radius-xl`.
2. Always maintain the original square aspect ratio (padding-top: 100%).
3. On album pages, artwork should be large (minimum 280px, target 360-480px on desktop).
4. Artwork on card hover: subtle scale up (`scale(1.03)`) behind rounded container — not the container itself.
5. Fallback for missing artwork: generated placeholder using album title initial + a subtle gradient derived from the album's primary genre color (seeded, consistent per album).
6. Never apply heavy filters (blur, desaturate, oversaturate) to artwork as a background.
7. If using artwork as a background element (hero section), apply a very dark gradient overlay to maintain text readability.
8. Loading state: use a skeleton with the same aspect ratio as the image.

### Artwork Fallback Generator

When Cover Art Archive has no image:
- Background: a 2-stop gradient from two genre-seeded muted colors
- Centered initial: first letter of album title in `font-display`, large, at 40% opacity
- No icons, no music notes

---

## Component Specifications

### Button

Three variants:

```
Primary:   bg-accent, text-inverse, hover:brightness(1.1)
Secondary: bg-surface, border-default, text-primary, hover:bg-elevated
Ghost:     transparent, text-secondary, hover:text-primary, no border
```

Sizes:
- `sm`: h-8, px-3, text-sm
- `md`: h-10, px-4, text-base (default)
- `lg`: h-12, px-6, text-lg

Rules:
- Always `rounded-md`
- Always `font-medium`
- Loading state: spinner replaces text, disabled
- Destructive actions: use ghost or secondary button with `color-error` text — not a red background
- Icon buttons must have `aria-label`

### StarRating (10-point)

- Display as 10 individual stars, or as 5 stars with half-stars
- Decision: **10 individual stars** at smaller size (more granular, honest)
- Interactive: hover fills stars from left; click locks rating
- Selected stars: `color-accent` fill
- Unselected: `color-text-muted` outline
- Non-interactive display: same colors, no hover effect
- Numeric score displayed next to stars in `font-mono`

### AlbumCard

```
Container:     bg-surface, rounded-lg, no border (sits on base bg)
Artwork:       100% width, aspect-square, rounded-lg, overflow-hidden
               hover: scale(1.03) transition
Metadata area: p-3 (tight), below artwork
Title:         text-body, font-medium, text-primary, 2-line clamp
Artist:        text-body-sm, text-secondary
Year:          text-caption, text-muted, monospace
Score:         text-caption, font-mono, color varies by score level
```

AlbumCard must never have:
- A play button overlay
- A "heart" favorite icon in the corner (use explicit save action on album page)
- Heavy shadow on hover
- Neon border on hover

### Skeleton

- Same dimensions as the real component
- Background: gradient animation from `bg-surface` to `bg-elevated` and back
- Duration: 1.5s, ease-in-out, infinite
- No complex patterns — solid rounded blocks

### Toast

- Position: bottom-right (desktop), bottom-center (mobile)
- Variants: success, error, info, neutral
- Auto-dismiss: 4 seconds
- Manual dismiss: close button
- Max width: 340px
- Stacks up to 3 toasts

### Rating Distribution Chart

- Horizontal bar chart (not a pie chart)
- Each bar labeled 1-10 on the left
- Bars: filled with `color-accent-subtle`, accent fill proportional to votes
- Count shown on right of bar
- Compact — fits comfortably beside the review form

---

## Interaction & Motion Principles

### Philosophy

Motion should feel like it **reduces cognitive load**, not adds visual noise. Every animation must have a purpose:
- Guide attention
- Confirm an action
- Communicate state change
- Improve perceived performance

### Timing Tokens

```
duration-instant: 75ms    — toggle states, checkbox
duration-fast:    150ms   — hover effects, color transitions
duration-normal:  250ms   — modal open, panel slide
duration-slow:    400ms   — page transitions, hero reveals
duration-reveal:  600ms   — content entering viewport
```

### Easing

```
ease-default:  cubic-bezier(0.4, 0, 0.2, 1)  — standard
ease-in:       cubic-bezier(0.4, 0, 1, 1)    — elements leaving
ease-out:      cubic-bezier(0, 0, 0.2, 1)    — elements entering
ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1) — playful (use rarely)
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

This must be implemented globally.

### Approved Animations

- **Hover**: color transition (150ms), scale on artwork (150ms, max scale(1.03))
- **Page transition**: fade in (250ms ease-out) — no sliding pages
- **Modal open**: fade + translate-y(8px→0) (250ms ease-out)
- **Skeleton shimmer**: gradient sweep (1.5s infinite)
- **Toast entry**: translate-x + fade (250ms ease-out)
- **Rating selection**: immediate color fill (75ms)
- **Score counter**: no animation — show final value immediately
- **NavBar scroll**: backdrop-blur transition (200ms)

### Prohibited Animations

- Bouncing elements
- Rotating loading spinners on data (use skeleton instead)
- Page slides that move the entire screen left/right
- Parallax scrolling effects
- Staggered card entry animations (they slow down perceived performance)
- Text that types itself
- Counters that count up from 0

---

## Layout System

### Grid

```
Mobile:  1 column, 16px gutters
Tablet:  2-3 columns, 24px gutters
Desktop: 4-6 columns, 32px gutters, max-width 1280px
```

### Album Grid

```
Mobile:   2 columns
Tablet:   3-4 columns
Desktop:  4-6 columns depending on context
```

### Content Width Classes

```
content-narrow:  480px   — single-column reading (reviews, bios)
content-medium:  720px   — article-style content
content-wide:    1024px  — two-column layouts
content-full:    1280px  — maximum page width
```

---

## Page-Specific Design Notes

### Home Page

- Hero section: full-bleed with artwork generating a gentle color gradient to the sides
- Do NOT use a fullscreen-height hero — it should be 50-60vh on desktop
- Featured editorial picks: use an asymmetric layout (one large + two smaller, or two equal)
- Genre grid: Use different sized cells for visual interest — not a uniform 4-column grid
- No "Welcome to SONORA" text — let content speak immediately

### Album Page

- Artwork must be the first thing the eye goes to
- Score should be prominent but not the only thing visible — reviews tell the story
- External links: plain text links with service name, not huge branded buttons
- Tracklist: monospace track numbers, clean typography, no play buttons
- Reviews: given generous space — they are the product's value, not decorative

### Artist Page

- Consider a wide editorial header (not just a circle avatar)
- Discography grid with release year as primary label
- Chronological order is default (oldest to newest or newest to oldest — decide and be consistent)

### Search

- Results appear below the input, not in a dropdown
- Group results by type: "Albums (23 results)" then "Artists (4 results)"
- Never show "No results" without a suggestion for what to try

---

## Tailwind Configuration Approach

Design tokens will be implemented as Tailwind custom values in `tailwind.config.ts`:

```typescript
// tailwind.config.ts (excerpt)
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class', // SONORA is dark-only for MVP
  theme: {
    extend: {
      colors: {
        bg: {
          base:     '#0D0D0F',
          surface:  '#141417',
          elevated: '#1C1C21',
          overlay:  '#22222A',
        },
        accent: {
          DEFAULT: '#C9A96E',
          dim:     '#A07B4A',
          text:    '#E8C98C',
        },
        content: {
          primary:   '#F0EDE8',
          secondary: '#A8A4A0',
          muted:     '#6B6764',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
      },
      transitionDuration: {
        instant: '75ms',
        fast:    '150ms',
        normal:  '250ms',
        slow:    '400ms',
      },
      maxWidth: {
        'content-narrow': '480px',
        'content-medium': '720px',
        'content-wide':   '1024px',
        'content-full':   '1280px',
      },
    },
  },
  plugins: [],
}
```

---

## Design Decisions Still Open

> These can be answered in Phase 1 before building components.

1. **Star rating display:** 10 individual stars (cramped on mobile) vs. 5 stars with half-steps (familiar). Current default: 10 individual stars.

2. **Accent color variant:** Champagne gold (#C9A96E) is specified. An alternative is pale sage (#A3B899). Gold has stronger editorial associations; sage reads as more modern. Current default: gold.

3. **Primary display font:** Playfair Display is specified. If you want something less "classical magazine" and more "contemporary editorial," consider DM Serif Display or Cormorant. Current default: Playfair Display.

4. **Score format:** Display as a decimal (7.4) or as a fraction (7.4/10). Current default: decimal with /10 in smaller text next to it.

These are minor — I will proceed with the defaults unless you have a preference.

---

*This document is updated as the design system is refined in Phase 1.*
