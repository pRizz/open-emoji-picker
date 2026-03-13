import { Show } from 'solid-js'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  query: string
  isSearching: boolean
  resultCount: number
  onQueryChange: (value: string) => void
  onClear: () => void
}

export function SearchBar(props: SearchBarProps) {
  return (
    <div class="flex flex-col gap-3">
      <div class="flex items-center gap-3">
        <label class="sr-only" for="emoji-search">
          Search emojis
        </label>
        <div class="relative flex-1">
          <span
            aria-hidden="true"
            class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted-foreground"
          >
            <svg viewBox="0 0 24 24" class="size-5 fill-none stroke-current stroke-2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
          <Input
            id="emoji-search"
            type="search"
            inputMode="search"
            autocomplete="off"
            autocapitalize="none"
            spellcheck={false}
            value={props.query}
            onInput={(event) => props.onQueryChange(event.currentTarget.value)}
            placeholder="Search emojis, aliases, keywords, or categories"
            aria-label="Search emojis"
            class="pl-12 pr-12"
          />
          <Show when={props.query}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={props.onClear}
              class="absolute right-1 top-1 size-10 rounded-xl text-muted-foreground"
              aria-label="Clear search"
            >
              <svg viewBox="0 0 24 24" class="size-4 fill-none stroke-current stroke-2">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </Button>
          </Show>
        </div>
      </div>

      <div class="flex min-h-6 items-center justify-between px-1 text-xs text-muted-foreground">
        <span>{props.isSearching ? 'Smart ranked results' : 'Browse every category'}</span>
        <span aria-live="polite">
          {props.isSearching ? `${props.resultCount} result${props.resultCount === 1 ? '' : 's'}` : ''}
        </span>
      </div>
    </div>
  )
}
