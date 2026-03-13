import { For } from 'solid-js'

import { cn } from '@/lib/utils'
import type { ThemeMode } from '@/lib/types'

interface ThemeToggleProps {
  value: ThemeMode
  onChange: (value: ThemeMode) => void
}

const themeOptions: Array<{ value: ThemeMode; label: string; icon: string }> = [
  { value: 'dark', label: 'Dark theme', icon: '🌙' },
  { value: 'light', label: 'Light theme', icon: '☀️' },
  { value: 'system', label: 'System theme', icon: '🖥️' },
]

export function ThemeToggle(props: ThemeToggleProps) {
  return (
    <div
      class="inline-flex items-center rounded-full border border-border/70 bg-panel/80 p-1 shadow-sm shadow-black/10 backdrop-blur"
      role="group"
      aria-label="Theme mode"
    >
      <For each={themeOptions}>
        {(option) => {
          const isActive = () => props.value === option.value

          return (
            <button
              type="button"
              class={cn(
                'inline-flex h-9 items-center gap-2 rounded-full px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                isActive()
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
              aria-label={option.label}
              aria-pressed={isActive()}
              onClick={() => props.onChange(option.value)}
            >
              <span aria-hidden="true">{option.icon}</span>
              <span class="hidden sm:inline">{option.value}</span>
            </button>
          )
        }}
      </For>
    </div>
  )
}
