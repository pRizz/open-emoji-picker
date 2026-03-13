# Open Emoji Picker

A polished, dark-first, web-based emoji picker built with **SolidJS + Vite**.

It ships as both:

1. a responsive full-page website focused on fast emoji picking, and
2. a reusable `EmojiPicker` component with a modular data/search architecture.

The picker uses native system emoji rendering, smart alias-aware search, sticky search and category navigation, local recent emojis, and GitHub Pages deployment via GitHub Actions.

## Features

- **Responsive full-page UI** with an app-like feel on mobile and desktop
- **Sticky search bar** at the top and **sticky category nav** at the bottom
- **Category browsing** when idle, **unified ranked results** while searching
- **Smart search** across:
  - official names
  - aliases
  - keywords/tags
  - categories
- **Curated aliases** for practical queries like:
  - `hmm` → thinking face
  - `lol` / `laugh` → face with tears of joy
  - `cry` / `sad` → loudly crying face
  - `thumbsup` / `+1` → thumbs up
  - `lit` / `hot` → fire
- **Copy-to-clipboard** with `solid-sonner` toast feedback
- **Recent emojis** persisted in `localStorage`
- **Dark by default**, with light and system theme support
- **Keyboard-accessible** emoji navigation and focus states
- **GitHub Pages-ready** static deployment under `/open-emoji-picker/`

## Tech stack

- [SolidJS](https://www.solidjs.com/)
- [Vite](https://vite.dev/)
- TypeScript
- Tailwind CSS
- shadcn-solid-style component patterns (`cva`, `clsx`, `tailwind-merge`, reusable `ui/` primitives)
- [`solid-sonner`](https://www.npmjs.com/package/solid-sonner)
- [`Emojibase`](https://emojibase.dev/)
- Vitest + `@solidjs/testing-library` + `@testing-library/user-event` + `jsdom`

## Local development

### Install

```bash
npm install
```

### Start the app

```bash
npm run dev
```

Vite will serve the app locally for development.

### Run tests

```bash
npm test
```

### Run the production build

```bash
npm run build
```

### Preview the production build locally

```bash
npm run preview
```

## Reusable `EmojiPicker` component

The app’s main picker lives in `src/components/EmojiPicker.tsx`.

Current props:

```ts
interface EmojiPickerProps {
  onCopy?: (context: EmojiCopyContext) => void
  initialCategory?: EmojiCategoryId
  showSearch?: boolean
  showRecents?: boolean
  copyMode?: 'emoji' | 'shortcode'
}
```

Example usage:

```tsx
import { EmojiPicker } from '@/components/EmojiPicker'

<EmojiPicker
  showRecents
  onCopy={({ entry, payload }) => {
    console.log('Copied', entry.name, payload.text)
  }}
/>
```

## Screenshots / GIFs

This repository is ready for screenshots or demo GIFs, but does not commit binary media by default.

Suggested assets to add later:

- `docs/media/home-dark.png`
- `docs/media/mobile-search.png`
- `docs/media/copy-flow.gif`

Suggested README snippet once you add them:

```md
![Desktop dark theme picker](docs/media/home-dark.png)
![Mobile search results](docs/media/mobile-search.png)
![Copy flow demo](docs/media/copy-flow.gif)
```

## Architecture overview

```text
src/
  components/
    EmojiPicker.tsx
    SearchBar.tsx
    CategoryNav.tsx
    EmojiGrid.tsx
    EmojiSection.tsx
    EmojiButton.tsx
    ThemeToggle.tsx
    ui/
      button.tsx
      input.tsx
  lib/
    clipboard.ts
    storage.ts
    theme.ts
    types.ts
    emoji-data/
      dataset.ts
      categories.ts
      aliases.ts
      alias-heuristics.ts
      normalization.ts
      ranking.ts
      search-index.ts
      recents.ts
      validation.ts
```

### Data flow

1. **Dataset adapter** loads a maintained emoji dataset from Emojibase.
2. **Category normalization** maps dataset groups into the picker’s UX categories.
3. **Alias layering** merges:
   - Emojibase shortcodes
   - heuristic aliases
   - curated overrides
4. **Search indexing** precomputes normalized searchable fields.
5. **Ranking** scores official-name matches first, then aliases, then keywords, then categories.
6. **Clipboard + recents** run in isolated helpers so future favorites or shortcode copy modes can be added cleanly.

## How emoji aliases work

The alias system uses a hybrid approach:

### 1. Maintained source data

The picker starts from:

- `emojibase-data/en/compact.json`
- `emojibase-data/en/shortcodes/emojibase.json`

That provides official names, groups, keywords/tags, ordering, and shortcodes.

### 2. Heuristic aliases

`src/lib/emoji-data/alias-heuristics.ts` generates lightweight aliases from:

- compacted official names
- shortcode variations
- selected safe keyword-derived terms
- singular/plural variants where they improve discoverability

### 3. Curated overrides

`src/lib/emoji-data/aliases.ts` adds practical colloquial search terms for common emojis and edge cases, such as:

- thinking face → `hmm`, `ponder`
- thumbs up → `ok`, `approve`
- fire → `lit`, `hot`

### 4. Validation

`src/lib/emoji-data/validation.ts` and `src/lib/emoji-data/validation.test.ts` verify that:

- every emoji has at least two searchable terms overall
- custom alias coverage remains strong outside obvious exception categories
- key curated aliases are present

## How to extend aliases

### Add curated aliases

Edit:

- `src/lib/emoji-data/aliases.ts`

Use clear, practical terms only. Avoid misleading or overly obscure slang.

### Adjust heuristic alias generation

Edit:

- `src/lib/emoji-data/alias-heuristics.ts`

This is the right place to tune broad discoverability rules without creating a giant hand-authored alias blob.

### Re-run validation

```bash
npm test
```

## How recents are stored

Recent emojis are stored locally in:

- `localStorage`
- key: `open-emoji-picker:recents:v1`

Behavior:

- maximum of **30**
- deduplicated
- most recent first
- updated immediately when an emoji is clicked

The recents logic is intentionally separated so a future **favorites** feature can share the same storage patterns.

## Testing

The test suite includes:

- search/indexing tests
- ranking behavior tests
- alias validation tests
- clipboard helper tests
- recents persistence tests
- a component-level picker interaction test

Current command:

```bash
npm test
```

## GitHub Pages deployment

This repository is configured as a **Vite project-page deployment**.

### Important base-path detail

Because the repository name is `open-emoji-picker`, Vite is configured with:

```ts
base: '/open-emoji-picker/'
```

That is required for GitHub Pages project deployments at:

```text
https://<username>.github.io/open-emoji-picker/
```

### Automatic deployment workflow

The workflow lives at:

- `.github/workflows/deploy.yml`

It automatically:

1. checks out the repo
2. installs dependencies with `npm ci`
3. runs `npm run build`
4. uploads `dist/` as the Pages artifact
5. deploys to GitHub Pages

It runs on every push to `main`.

### First-time GitHub Pages setup in repo settings

If this is the first time enabling Pages for the repository:

1. Open the GitHub repository.
2. Go to **Settings**.
3. Open **Pages** in the sidebar.
4. Under **Build and deployment**, set the **Source** to **GitHub Actions**.

After that, any push to `main` will trigger the workflow and publish the site.

## Notes for project-page deployment

- The app is static-only: no backend, no server rendering, no external runtime backend dependency.
- Native emoji glyphs come from the user’s OS/browser.
- Recents are local to the device/browser through `localStorage`.

## Future ideas

- lightweight skin-tone picker UI
- favorites alongside recents
- optional shortcode copy mode in the visible UI
- lightweight virtualization for even larger browsing views
- richer manual screenshot assets in `docs/media/`