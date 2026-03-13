import { cn } from '@/lib/utils'
import type { EmojiEntry } from '@/lib/types'

interface EmojiButtonProps {
  entry: EmojiEntry
  isCopied: boolean
  onClick: () => void
  onMove: (direction: 'left' | 'right' | 'up' | 'down') => void
  onBoundary: (direction: 'start' | 'end') => void
  index: number
}

export function EmojiButton(props: EmojiButtonProps) {
  return (
    <button
      type="button"
      data-emoji-button="true"
      data-emoji-index={props.index}
      aria-label={`${props.entry.name}. Copy emoji`}
      class={cn(
        'group relative flex aspect-square min-h-14 items-center justify-center rounded-2xl border border-transparent bg-transparent text-[1.625rem] leading-none transition duration-150 ease-out hover:border-border hover:bg-secondary/70 hover:shadow-sm hover:shadow-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97]',
        props.isCopied && 'border-primary/40 bg-primary/10 shadow-sm shadow-primary/20',
      )}
      onClick={props.onClick}
      onKeyDown={(event) => {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault()
            props.onMove('left')
            break
          case 'ArrowRight':
            event.preventDefault()
            props.onMove('right')
            break
          case 'ArrowUp':
            event.preventDefault()
            props.onMove('up')
            break
          case 'ArrowDown':
            event.preventDefault()
            props.onMove('down')
            break
          case 'Home':
            event.preventDefault()
            props.onBoundary('start')
            break
          case 'End':
            event.preventDefault()
            props.onBoundary('end')
            break
        }
      }}
    >
      <span aria-hidden="true">{props.entry.emoji}</span>
      <span class="pointer-events-none absolute inset-x-1 bottom-1 truncate text-[0.55rem] font-medium text-transparent transition-colors group-hover:text-muted-foreground/70">
        {props.entry.name}
      </span>
    </button>
  )
}
