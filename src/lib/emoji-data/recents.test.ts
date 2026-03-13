import { beforeEach, describe, expect, it } from 'vitest'

import {
  MAX_RECENT_EMOJIS,
  pushRecentEmoji,
  readRecents,
  RECENTS_STORAGE_KEY,
  writeRecents,
} from '@/lib/emoji-data/recents'

describe('recent emoji persistence', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('deduplicates emojis and keeps the most recent first', () => {
    writeRecents(['😀', '🔥'])

    const nextRecents = pushRecentEmoji('😀')

    expect(nextRecents).toEqual(['😀', '🔥'])
    expect(readRecents()).toEqual(['😀', '🔥'])
  })

  it('caps recents to thirty items', () => {
    for (let index = 0; index < MAX_RECENT_EMOJIS + 5; index += 1) {
      pushRecentEmoji(`emoji-${index}`)
    }

    expect(readRecents()).toHaveLength(MAX_RECENT_EMOJIS)
    expect(readRecents()[0]).toBe(`emoji-${MAX_RECENT_EMOJIS + 4}`)
  })

  it('safely handles malformed stored data', () => {
    window.localStorage.setItem(RECENTS_STORAGE_KEY, '{bad json')

    expect(readRecents()).toEqual([])
  })
})
