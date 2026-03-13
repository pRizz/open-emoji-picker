import { readStorageJson, writeStorageJson } from '@/lib/storage'
import type { ThemeMode } from '@/lib/types'

export const THEME_STORAGE_KEY = 'open-emoji-picker:theme:v1'

export function getSystemTheme() {
  if (typeof window === 'undefined') {
    return 'dark' as const
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function resolveThemeMode(mode: ThemeMode) {
  return mode === 'system' ? getSystemTheme() : mode
}

export function readThemeMode() {
  return readStorageJson<ThemeMode>(THEME_STORAGE_KEY, 'dark')
}

export function writeThemeMode(mode: ThemeMode) {
  writeStorageJson(THEME_STORAGE_KEY, mode)
}

export function applyThemeMode(mode: ThemeMode) {
  if (typeof document === 'undefined') {
    return
  }

  const resolvedMode = resolveThemeMode(mode)
  const root = document.documentElement

  root.classList.toggle('dark', resolvedMode === 'dark')
  root.dataset.theme = resolvedMode
  root.style.colorScheme = resolvedMode
}

export function watchSystemTheme(onChange: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', onChange)

  return () => mediaQuery.removeEventListener('change', onChange)
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
