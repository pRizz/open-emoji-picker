import { describe, expect, it } from 'vitest'

import { emojiEntries } from '@/lib/emoji-data/dataset'
import { createEmojiSearchIndex } from '@/lib/emoji-data/search-index'

describe('emoji search index', () => {
  const searchIndex = createEmojiSearchIndex(emojiEntries)

  it('returns the same cached array for repeated queries', () => {
    const firstResults = searchIndex.search('thumbsup')
    const secondResults = searchIndex.search('thumbsup')

    expect(secondResults).toBe(firstResults)
  })

  it('finds thumbs up for spacing and punctuation variants', () => {
    const thumbsupNames = ['thumbs up', 'thumbs up']

    expect(searchIndex.search('thumbsup')[0]?.name).toBe('thumbs up')
    expect(searchIndex.search('thumbs up')[0]?.name).toBe('thumbs up')
    expect(searchIndex.search('+1')[0]?.name).toBe('thumbs up')
    expect(thumbsupNames).toContain(searchIndex.search('thumbsup')[0]?.name)
  })

  it('finds thinking face for colloquial hmm search', () => {
    const thinkingResults = searchIndex.search('hmm').slice(0, 5).map((entry) => entry.name)

    expect(thinkingResults).toContain('thinking face')
  })

  it('finds food results through category terms', () => {
    const foodResults = searchIndex.search('food').slice(0, 12)

    expect(foodResults.some((entry) => entry.categoryId === 'food-drink')).toBe(true)
  })
})
