import { Show } from 'solid-js'

import { EmojiGrid } from '@/components/EmojiGrid'
import type { EmojiEntry } from '@/lib/types'

interface EmojiSectionProps {
  title: string
  entries: EmojiEntry[]
  copiedEmojiId?: string
  isRecentSection?: boolean
  onSelect: (entry: EmojiEntry) => void
}

export function EmojiSection(props: EmojiSectionProps) {
  return (
    <section class="space-y-4" aria-label={props.title}>
      <div class="space-y-1">
        <h2 class="text-sm font-semibold tracking-wide text-foreground/90">{props.title}</h2>
        <Show when={props.isRecentSection && props.entries.length === 0}>
          <p class="text-sm text-muted-foreground">
            Pick emojis to build your recent list. Try favorites like happy, food, or hmm.
          </p>
        </Show>
      </div>

      <Show when={props.entries.length > 0}>
        <EmojiGrid
          ariaLabel={props.title}
          entries={props.entries}
          copiedEmojiId={props.copiedEmojiId}
          onSelect={props.onSelect}
        />
      </Show>
    </section>
  )
}
