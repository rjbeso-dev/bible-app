# Bible Study

A calm, editorial Bible reading and study web app. Land on a home dashboard,
read any chapter of the 66-book Protestant canon, switch between grouped English
translations (including optional ESV and NLT via server-side API keys), compare
two side by side, and mark up the text with highlights and personal notes.
Everything you create is stored privately in your own browser — there are no
accounts and your notes never leave your device.

Free scripture text comes from [bible-api.com](https://bible-api.com). ESV and
NLT are fetched through a server-side proxy that injects an API key from an
environment variable — the key is never exposed to the browser and readers are
never asked for one. Book introductions and the daily-verse list are bundled
locally. Cross-references come from [OpenBible.info](https://www.openbible.info/labs/cross-references/)
(CC BY), processed into one compact, lazily-loaded file per book.

## The home dashboard

Opening the app (`/`) shows a quiet study desk, not a redirect:

- **Time-aware masthead** — a greeting and today's date in a display serif.
- **Continue reading** — your last-read reference with a cached snippet of its
  opening verses and a prominent **Resume →** button (first run defaults to
  John 1).
- **Verse of the day** — a deterministic pick from a bundled, public-domain
  (WEB) list, keyed to the calendar day, linking into the reader.
- **At-a-glance stats** — chapters read, notes, highlights.
- **Jump back in** — your recent chapters as compact rows.
- **Recent notes & highlights** — the latest few, each deep-linking to its verse.
- **Browse the Bible** — the book/chapter picker, right on the dashboard.

## Features

- **Read by book → chapter → verse** with a comfortable reading column, a serif
  drop cap opening each chapter, small-caps chapter references, and
  serif/sans/comfort/mono typefaces plus a 7-step text-size control. ("Comfort"
  is a genuinely legible stack — Atkinson Hyperlegible / Verdana — not a novelty
  font.)
- **Book & chapter picker** grouped by Old/New Testament, then a chapter grid.
- **Chapter paging** with previous/next that rolls across book boundaries.
  Arrow keys (← / →) also flip chapters.
- **Grouped translations** presented by reading level:
  - _Easy to read_ — Bible in Basic English.
  - _Modern English_ — World English Bible (default), WEB British, Open English
    Bible.
  - _Classic_ — King James Version, American Standard Version.
  - _Study translations_ — English Standard Version, New Living Translation
    (require server-side keys — see below).
- **Parallel view**: read two translations verse-aligned in two columns.
- **Highlights**: tap a verse and pick from five theme-aware colors (or clear).
- **Notes**: attach one or more notes to any verse; a dot marks verses that
  have notes. A dedicated Notes page lists everything grouped by book with
  links straight back to the verse.
- **Verse context**: view a verse with the surrounding verses (crossing chapter
  boundaries when needed) in a focused popover.
- **Book introductions** shown at the top of chapter 1 or via the info button.
- **Light / dark theme** that initializes from your system preference and is
  remembered.
- **Reading progress**: the app tracks which chapters you've opened to power the
  dashboard stats and "Jump back in" list.
- **Offline-friendly**: opened chapters are cached (LRU, ~150 chapters) so they
  keep working without a connection; an offline banner appears when you drop off
  the network.

## Enabling ESV & NLT

The ESV and NLT are copyrighted. They're fetched through a server-side proxy
that injects an API key from an **environment variable**, so the key stays on
the server and readers are never asked for one. Get free keys once:

- **ESV** — <https://api.esv.org/>
- **NLT** — <https://api.nlt.to/>

**Local development.** Copy `.env.example` to `.env.local` and paste your keys:

```bash
cp .env.example .env.local
# then edit .env.local:
#   ESV_API_KEY=your-esv-key
#   NLT_API_KEY=your-nlt-key
```

Restart `npm run dev`. Vite's dev proxy (in `vite.config.ts`) reads these vars
and forwards `/api/esv` and `/api/nlt` to `api.esv.org` / `api.nlt.to` with the
key attached. `.env.local` is gitignored — your keys are never committed.

**Deploying to Vercel.** The `api/esv/[...path].ts` and `api/nlt/[...path].ts`
serverless functions do the same job in production. Add the keys once in the
Vercel dashboard → **Settings → Environment Variables**:

- `ESV_API_KEY`
- `NLT_API_KEY`

Redeploy, and ESV/NLT work for every visitor with no key prompt. Leave a key
unset and that translation simply shows a short "not set up for this site"
message; the free public-domain translations always work. When an ESV or NLT
chapter is shown, the required copyright line appears beneath it (ESV® ©
Crossway; NLT © Tyndale House Foundation).

## Getting started

Requires Node 20+ (built and tested on Node 24).

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:5173
npm run build    # type-check (tsc -b) and produce a production build in dist/
npm run preview  # preview the production build locally
```

### Testing

Tooling (Vitest + React Testing Library + jsdom + MSW) is configured and ready:

```bash
npm test          # run the test suite once
npm run test:watch
npm run coverage
```

## Where your data is stored

All user data lives in the browser's `localStorage` under the `bsa.` prefix —
no accounts, no backend, nothing leaves your device:

| Key | Contents |
| --- | --- |
| `bsa.settings` | Theme, translations, parallel toggle, font family & size |
| `bsa.lastRead` | Last chapter/verse you were reading |
| `bsa.notes` | Your notes |
| `bsa.highlights` | Your highlights (keyed by verse) |
| `bsa.readChapters` | The set of chapters you've opened (for stats) |
| `bsa.recentChapters` | Recent chapters, most-recent-first (for the dashboard) |
| `bsa.cache.chapter.*` | Cached chapter text (with an LRU index for eviction) |

Clearing your browser storage for this site will remove all of the above.

## Project structure

```
src/
  api/            Bible sources: bibleApiSource (free), esvSource, nltSource,
                  and index.ts (a router that dispatches by translation id)
  components/     layout, navigation, reader, study, notes, settings, ui (icons)
  context/        Settings provider (theme, fonts, translations)
  data/           books.ts (the 66 books) and dailyVerses.ts (verse of the day)
  hooks/          useChapter, useNotes, useHighlights, useLastRead,
                  useReadingProgress
  lib/            storage, keys, chapter cache (LRU), reference helpers
  pages/          DashboardPage, ReaderPage, NotesPage
  styles/         globals.css (tokens/theming), reader.css, dashboard.css
  types/          Shared types
```

`src/api/index.ts` routes `getChapter` by translation id (ESV → `esvSource`,
NLT → `nltSource`, everything else → `bibleApiSource`) and exposes the full
grouped translation list. To add another free provider, implement the
`BibleSource` interface and wire it into the router. All new UI glyphs come from
the single inline-SVG set in `src/components/ui/Icon.tsx`.

## Tech stack

Vite + React + TypeScript, React Router, plain CSS with custom properties
driven by `data-theme` / `data-font` attributes.
