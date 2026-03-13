import { For, onCleanup, onMount } from 'solid-js'
import { createSignal } from 'solid-js'

import { EmojiButton } from '@/components/EmojiButton'
import { clamp } from '@/lib/utils'
import type { EmojiEntry } from '@/lib/types'

interface EmojiGridProps {
  ariaLabel: string
  entries: EmojiEntry[]
  copiedEmojiId?: string
  onSelect: (entry: EmojiEntry) => void
}

export function EmojiGrid(props: EmojiGridProps) {
  let gridRef: HTMLDivElement | undefined

  const [columnCount, setColumnCount] = createSignal(6)

  const updateColumnCount = () => {
    const width = gridRef?.clientWidth ?? 0
    if (!width) {
      return
    }

    const minimumTileWidth = 56
    const gap = 8
    const nextColumnCount = Math.max(4, Math.floor((width + gap) / (minimumTileWidth + gap)))
    setColumnCount(nextColumnCount)
  }

  const focusIndex = (targetIndex: number) => {
    const buttons = gridRef?.querySelectorAll<HTMLButtonElement>('[data-emoji-button="true"]')
    if (!buttons?.length) {
      return
    }

    const nextIndex = clamp(targetIndex, 0, buttons.length - 1)
    buttons[nextIndex]?.focus()
  }

  onMount(() => {
    updateColumnCount()

    if (!gridRef || typeof ResizeObserver === 'undefined') {
      return
    }

    const observer = new ResizeObserver(() => updateColumnCount())
    observer.observe(gridRef)
    onCleanup(() => observer.disconnect())
  })

  return (
    <div
      ref={gridRef}
      class="grid grid-cols-[repeat(auto-fill,minmax(3.25rem,1fr))] gap-2"
      aria-label={props.ariaLabel}
    >
      <For each={props.entries}>
        {(entry, index) => (
          <EmojiButton
            entry={entry}
            index={index()}
            isCopied={props.copiedEmojiId === entry.id}
            onClick={() => props.onSelect(entry)}
            onBoundary={(direction) => focusIndex(direction === 'start' ? 0 : props.entries.length - 1)}
            onMove={(direction) => {
              const currentIndex = index()
              const delta =
                direction === 'left'
                  ? -1
                  : direction === 'right'
                    ? 1
                    : direction === 'up'
                      ? -columnCount()
                      : columnCount()

              focusIndex(currentIndex + delta)
            }}
          />
        )}
      </For>
    </div>
  )
}
