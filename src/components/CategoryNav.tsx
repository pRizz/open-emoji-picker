import { For } from 'solid-js'
import type { JSX } from 'solid-js'

import { emojiCategories } from '@/lib/emoji-data'
import { cn } from '@/lib/utils'
import type { EmojiCategoryId } from '@/lib/types'

interface CategoryNavProps {
  activeCategoryId: EmojiCategoryId
  isSearching: boolean
  onSelect: (categoryId: EmojiCategoryId) => void
}

export function CategoryNav(props: CategoryNavProps) {
  const handleWheel: JSX.EventHandlerUnion<HTMLElement, WheelEvent> = (event) => {
    const nav = event.currentTarget

    if (nav.scrollWidth <= nav.clientWidth) {
      return
    }

    const scrollDelta =
      Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY

    if (scrollDelta === 0) {
      return
    }

    const maxScrollLeft = nav.scrollWidth - nav.clientWidth
    const nextScrollLeft = Math.min(Math.max(nav.scrollLeft + scrollDelta, 0), maxScrollLeft)

    if (nextScrollLeft === nav.scrollLeft) {
      return
    }

    event.preventDefault()
    nav.scrollLeft = nextScrollLeft
  }

  return (
    <nav
      aria-label="Emoji categories"
      class="overflow-x-auto overflow-y-hidden px-2 py-2 scrollbar-none"
      onWheel={handleWheel}
    >
      <ul class="flex min-w-max items-center gap-2">
        <For each={emojiCategories}>
          {(category) => {
            const isActive = () => category.id === props.activeCategoryId

            return (
              <li>
                <button
                  type="button"
                  aria-label={category.label}
                  aria-pressed={isActive()}
                  class={cn(
                    'inline-flex h-12 items-center gap-2 rounded-full border px-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-panel',
                    isActive()
                      ? 'border-primary/40 bg-primary/15 text-foreground shadow-sm shadow-primary/20'
                      : 'border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-secondary/80 hover:text-foreground',
                    props.isSearching && 'border-border/70 bg-panel/60',
                  )}
                  onClick={() => props.onSelect(category.id)}
                >
                  <span aria-hidden="true" class="text-base">
                    {category.icon}
                  </span>
                  <span class="hidden md:inline">{category.shortLabel}</span>
                </button>
              </li>
            )
          }}
        </For>
      </ul>
    </nav>
  )
}
