import { createMemo, createSignal, For, onCleanup, onMount, Show } from 'solid-js'
import { toast } from 'solid-sonner'

import { CategoryNav } from '@/components/CategoryNav'
import { EmojiGrid } from '@/components/EmojiGrid'
import { EmojiSection } from '@/components/EmojiSection'
import { SearchBar } from '@/components/SearchBar'
import { createEmojiCopyPayload, copyText } from '@/lib/clipboard'
import {
  emojiByGlyph,
  emojiCategories,
  emojiEntries,
  emojiSearchIndex,
  pushRecentEmoji,
  readRecents,
} from '@/lib/emoji-data'
import { prefersReducedMotion } from '@/lib/theme'
import { titleCase } from '@/lib/utils'
import type { CopyMode, EmojiCategoryId, EmojiCopyContext, EmojiEntry } from '@/lib/types'

export interface EmojiPickerProps {
  onCopy?: (context: EmojiCopyContext) => void
  initialCategory?: EmojiCategoryId
  showSearch?: boolean
  showRecents?: boolean
  copyMode?: CopyMode
}

interface EmojiSectionData {
  categoryId: EmojiCategoryId
  title: string
  entries: EmojiEntry[]
  isRecentSection?: boolean
}

const groupedEntriesByCategory = new Map(
  emojiCategories
    .filter((category) => category.id !== 'recent')
    .map((category) => [
      category.id,
      emojiEntries.filter((entry) => entry.categoryId === category.id),
    ]),
)

export function EmojiPicker(props: EmojiPickerProps) {
  const showSearch = () => props.showSearch ?? true
  const showRecents = () => props.showRecents ?? true
  const copyMode = () => props.copyMode ?? 'emoji'
  const initialCategory = () =>
    props.initialCategory ?? (showRecents() ? 'recent' : 'smileys-emotion')

  let scrollViewportRef: HTMLDivElement | undefined
  let copyResetTimer: number | undefined

  const sectionRefs = new Map<EmojiCategoryId, HTMLDivElement>()
  const [query, setQuery] = createSignal('')
  const [recentGlyphs, setRecentGlyphs] = createSignal<string[]>([])
  const [activeCategoryId, setActiveCategoryId] = createSignal<EmojiCategoryId>(initialCategory())
  const [copiedEmojiId, setCopiedEmojiId] = createSignal<string>()

  const isSearching = createMemo(() => query().trim().length > 0)
  const searchResults = createMemo(() => emojiSearchIndex.search(query()))
  const recentEntries = createMemo(() =>
    recentGlyphs()
      .map((glyph) => emojiByGlyph.get(glyph))
      .filter((entry): entry is EmojiEntry => Boolean(entry)),
  )
  const browsingSections = createMemo<EmojiSectionData[]>(() => {
    const sections: EmojiSectionData[] = []

    if (showRecents()) {
      sections.push({
        categoryId: 'recent',
        title: 'Recent',
        entries: recentEntries(),
        isRecentSection: true,
      })
    }

    for (const category of emojiCategories) {
      if (category.id === 'recent') {
        continue
      }

      sections.push({
        categoryId: category.id,
        title: category.label,
        entries: groupedEntriesByCategory.get(category.id) ?? [],
      })
    }

    return sections
  })

  const updateActiveCategoryFromScroll = () => {
    if (!scrollViewportRef || isSearching()) {
      return
    }

    const currentTop = scrollViewportRef.scrollTop + 36
    let nextCategoryId = activeCategoryId()

    for (const section of browsingSections()) {
      const sectionRef = sectionRefs.get(section.categoryId)
      if (!sectionRef) {
        continue
      }

      if (sectionRef.offsetTop <= currentTop) {
        nextCategoryId = section.categoryId
      }
    }

    setActiveCategoryId(nextCategoryId)
  }

  const scrollToCategory = (categoryId: EmojiCategoryId) => {
    const target = sectionRefs.get(categoryId)
    if (!target || !scrollViewportRef) {
      return
    }

    scrollViewportRef.scrollTo({
      top: Math.max(0, target.offsetTop - 16),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  const handleCategorySelect = (categoryId: EmojiCategoryId) => {
    setActiveCategoryId(categoryId)

    if (isSearching()) {
      setQuery('')
      queueMicrotask(() => scrollToCategory(categoryId))
      return
    }

    scrollToCategory(categoryId)
  }

  const handleEmojiSelect = async (entry: EmojiEntry) => {
    setRecentGlyphs(pushRecentEmoji(entry.emoji))

    const payload = createEmojiCopyPayload(entry, copyMode())
    const result = await copyText(payload.text)

    if (!result.ok) {
      toast.error('Could not copy that emoji. Please try again.')
      return
    }

    if (copyResetTimer) {
      window.clearTimeout(copyResetTimer)
    }

    setCopiedEmojiId(entry.id)
    copyResetTimer = window.setTimeout(() => setCopiedEmojiId(undefined), 900)

    const compactMessage =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(max-width: 640px)').matches
    const successMessage = compactMessage
      ? `Copied ${entry.emoji}`
      : `Copied ${entry.emoji} ${titleCase(entry.name)}`

    toast.success(successMessage)
    props.onCopy?.({
      entry,
      payload,
      query: query(),
    })
  }

  onMount(() => {
    setRecentGlyphs(readRecents())
    setActiveCategoryId(initialCategory())
    queueMicrotask(updateActiveCategoryFromScroll)
  })

  onCleanup(() => {
    if (copyResetTimer) {
      window.clearTimeout(copyResetTimer)
    }
  })

  return (
    <section class="grid h-[min(78svh,52rem)] min-h-[32rem] grid-rows-[auto,1fr,auto] overflow-hidden rounded-[2rem] border border-border/70 bg-panel/90 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <Show when={showSearch()}>
        <div class="border-b border-border/70 bg-panel/95 px-4 py-4 sm:px-5">
          <SearchBar
            query={query()}
            isSearching={isSearching()}
            resultCount={searchResults().length}
            onQueryChange={setQuery}
            onClear={() => setQuery('')}
          />
        </div>
      </Show>

      <div
        ref={scrollViewportRef}
        class="scroll-smooth overflow-y-auto px-4 py-4 sm:px-5"
        onScroll={updateActiveCategoryFromScroll}
      >
        <Show
          when={isSearching()}
          fallback={
            <div class="space-y-8 pb-6">
              <For each={browsingSections()}>
                {(section) => (
                  <div ref={(element) => sectionRefs.set(section.categoryId, element)}>
                    <EmojiSection
                      title={section.title}
                      entries={section.entries}
                      copiedEmojiId={copiedEmojiId()}
                      isRecentSection={section.isRecentSection}
                      onSelect={handleEmojiSelect}
                    />
                  </div>
                )}
              </For>
            </div>
          }
        >
          <Show
            when={searchResults().length > 0}
            fallback={
              <div class="flex h-full min-h-72 flex-col items-center justify-center gap-4 rounded-[1.75rem] border border-dashed border-border/80 bg-background/40 px-8 text-center">
                <div class="text-4xl">🔎</div>
                <div class="space-y-2">
                  <h2 class="text-lg font-semibold text-foreground">No results</h2>
                  <p class="max-w-sm text-sm text-muted-foreground">
                    Try searches like <span class="font-medium text-foreground">happy</span>,{' '}
                    <span class="font-medium text-foreground">food</span>, or{' '}
                    <span class="font-medium text-foreground">hmm</span>.
                  </p>
                </div>
              </div>
            }
          >
            <div class="space-y-4 pb-6">
              <div class="space-y-1">
                <h2 class="text-sm font-semibold tracking-wide text-foreground/90">Search results</h2>
                <p class="text-sm text-muted-foreground">
                  Ranked across names, aliases, keywords, and categories.
                </p>
              </div>

              <EmojiGrid
                ariaLabel="Emoji search results"
                entries={searchResults()}
                copiedEmojiId={copiedEmojiId()}
                onSelect={handleEmojiSelect}
              />
            </div>
          </Show>
        </Show>
      </div>

      <div class="border-t border-border/70 bg-panel/95">
        <CategoryNav
          activeCategoryId={activeCategoryId()}
          isSearching={isSearching()}
          onSelect={handleCategorySelect}
        />
      </div>
    </section>
  )
}
