import { describe, expect, it } from 'vitest'

import { emojiEntries } from '@/lib/emoji-data/dataset'
import { buildAliasCoverageReport } from '@/lib/emoji-data/validation'

function findEmojiByName(name: string) {
  const maybeEntry = emojiEntries.find((entry) => entry.name === name)

  expect(maybeEntry).toBeDefined()

  return maybeEntry!
}

describe('emoji alias coverage', () => {
  it('ensures every emoji has at least two searchable terms', () => {
    const report = buildAliasCoverageReport(emojiEntries)

    expect(report.tooFewSearchTerms).toHaveLength(0)
  })

  it('keeps strong custom alias coverage outside flags and symbols', () => {
    const report = buildAliasCoverageReport(emojiEntries)

    expect(report.customAliasCoverageRatio).toBeGreaterThan(0.75)
  })

  it('includes practical curated aliases for common emojis', () => {
    expect(findEmojiByName('thinking face').aliases).toEqual(
      expect.arrayContaining(['hmm', 'thinking']),
    )
    expect(findEmojiByName('loudly crying face').aliases).toEqual(
      expect.arrayContaining(['cry', 'sad']),
    )
    expect(findEmojiByName('face with tears of joy').aliases).toEqual(
      expect.arrayContaining(['lol', 'laugh']),
    )
    expect(findEmojiByName('thumbs up').aliases).toEqual(
      expect.arrayContaining(['ok', 'approve']),
    )
    expect(findEmojiByName('fire').aliases).toEqual(expect.arrayContaining(['lit', 'hot']))
  })
})
