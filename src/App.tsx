import { createEffect, createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import { Toaster } from 'solid-sonner'

import { EmojiPicker } from '@/components/EmojiPicker'
import { ThemeToggle } from '@/components/ThemeToggle'
import {
  applyThemeMode,
  readThemeMode,
  resolveThemeMode,
  watchSystemTheme,
  writeThemeMode,
} from '@/lib/theme'
import type { ThemeMode } from '@/lib/types'

function App() {
  const [themeMode, setThemeMode] = createSignal<ThemeMode>('dark')
  const [lastCopiedLabel, setLastCopiedLabel] = createSignal('Pick an emoji to copy it instantly.')

  const resolvedTheme = createMemo(() => resolveThemeMode(themeMode()))

  onMount(() => {
    setThemeMode(readThemeMode())

    const stopWatchingSystemTheme = watchSystemTheme(() => {
      if (themeMode() === 'system') {
        applyThemeMode('system')
      }
    })

    onCleanup(stopWatchingSystemTheme)
  })

  createEffect(() => {
    const nextThemeMode = themeMode()
    writeThemeMode(nextThemeMode)
    applyThemeMode(nextThemeMode)
  })

  return (
    <>
      <Toaster
        theme={resolvedTheme()}
        position="top-center"
        richColors
        closeButton
        toastOptions={{
          class: 'border border-border/70 bg-panel text-foreground shadow-xl shadow-black/25',
        }}
      />

      <main class="relative min-h-screen overflow-hidden bg-background">
        <div class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.2),transparent_55%),radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(16,185,129,0.1),transparent_22%)]" />

        <div class="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          <header class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div class="max-w-3xl space-y-4">
              <span class="inline-flex items-center gap-2 rounded-full border border-border/70 bg-panel/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground shadow-sm shadow-black/10 backdrop-blur">
                <span aria-hidden="true">✨</span>
                Open Emoji Picker
              </span>

              <div class="space-y-3">
                <h1 class="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Fast emoji search, polished native feel.
                </h1>
                <p class="max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                  Search by name, keyword, category, or colloquial alias. Copy instantly, keep
                  local recents, and browse a sleek dark-first experience tuned for desktop and
                  mobile.
                </p>
              </div>

              <div class="grid gap-2 text-sm text-muted-foreground sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                <span class="inline-flex w-fit rounded-full border border-border/70 bg-panel/70 px-3 py-1.5 max-sm:text-xs">
                  Solid + Vite
                </span>
                <span class="inline-flex w-fit rounded-full border border-border/70 bg-panel/70 px-3 py-1.5 max-sm:text-xs">
                  Native emoji rendering
                </span>
                <span class="inline-flex w-fit rounded-full border border-border/70 bg-panel/70 px-3 py-1.5 max-sm:text-xs">
                  Local recents only
                </span>
              </div>
            </div>

            <div class="flex flex-col items-start gap-3 lg:items-end">
              <ThemeToggle value={themeMode()} onChange={setThemeMode} />
              <div class="rounded-[1.5rem] border border-border/70 bg-panel/80 px-4 py-3 text-sm text-muted-foreground shadow-sm shadow-black/10 backdrop-blur">
                <div class="font-medium text-foreground">Last copied</div>
                <div aria-live="polite">{lastCopiedLabel()}</div>
              </div>
            </div>
          </header>

          <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <EmojiPicker
              onCopy={({ entry }) => setLastCopiedLabel(`${entry.emoji} ${entry.name}`)}
            />

            <aside
              aria-labelledby="picker-flow-heading"
              class="flex flex-col gap-4 rounded-[2rem] border border-border/70 bg-panel/80 p-5 text-sm shadow-xl shadow-black/15 backdrop-blur"
            >
              <div class="space-y-1">
                <h2 id="picker-flow-heading" class="text-lg font-semibold text-foreground">
                  Designed for flow
                </h2>
                <p class="text-muted-foreground">
                  Sticky search, sticky categories, fast ranking, and a smooth browsing rhythm.
                </p>
              </div>

              <dl class="grid gap-4">
                <div class="rounded-2xl border border-border/60 bg-background/60 p-4">
                  <dt class="font-medium text-foreground">Alias-aware</dt>
                  <dd class="mt-1 text-muted-foreground">
                    Try searches like <span class="font-medium text-foreground">hmm</span>,{' '}
                    <span class="font-medium text-foreground">lol</span>,{' '}
                    <span class="font-medium text-foreground">thumbsup</span>, or{' '}
                    <span class="font-medium text-foreground">+1</span>.
                  </dd>
                </div>
                <div class="rounded-2xl border border-border/60 bg-background/60 p-4">
                  <dt class="font-medium text-foreground">Private by default</dt>
                  <dd class="mt-1 text-muted-foreground">
                    No accounts, no analytics, no backend. Your recent emojis stay in local
                    storage on this device.
                  </dd>
                </div>
                <div class="rounded-2xl border border-border/60 bg-background/60 p-4">
                  <dt class="font-medium text-foreground">Reusable component</dt>
                  <dd class="mt-1 text-muted-foreground">
                    The picker is modular, typed, and ready to embed in other Solid apps.
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </main>
    </>
  )
}

export default App
