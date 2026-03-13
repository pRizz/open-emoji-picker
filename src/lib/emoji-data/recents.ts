import { readStorageJson, writeStorageJson } from '@/lib/storage'
import { dedupeStrings } from '@/lib/utils'

export const RECENTS_STORAGE_KEY = 'open-emoji-picker:recents:v1'
export const MAX_RECENT_EMOJIS = 30

function sanitizeRecentEmojis(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return dedupeStrings(value.filter((item): item is string => typeof item === 'string')).slice(
    0,
    MAX_RECENT_EMOJIS,
  )
}

export function readRecents() {
  return sanitizeRecentEmojis(readStorageJson<unknown>(RECENTS_STORAGE_KEY, []))
}

export function writeRecents(emojis: string[]) {
  const nextEmojis = sanitizeRecentEmojis(emojis)
  writeStorageJson(RECENTS_STORAGE_KEY, nextEmojis)
  return nextEmojis
}

export function pushRecentEmoji(emoji: string) {
  const nextEmojis = [emoji, ...readRecents().filter((item) => item !== emoji)].slice(
    0,
    MAX_RECENT_EMOJIS,
  )

  return writeRecents(nextEmojis)
}
