import { describe, expect, it } from 'vitest'

import { createQueryDescriptor, scoreIndexedEntry, type IndexedEmojiEntry } from '@/lib/emoji-data/ranking'
import type { EmojiEntry } from '@/lib/types'

function createEntry(overrides: Partial<EmojiEntry>): EmojiEntry {
  return {
    id: overrides.id ?? '1F600',
    emoji: overrides.emoji ?? '😀',
    name: overrides.name ?? 'grinning face',
    categoryId: overrides.categoryId ?? 'smileys-emotion',
    categoryLabel: overrides.categoryLabel ?? 'Smileys & Emotion',
    categoryOrder: overrides.categoryOrder ?? 1,
    order: overrides.order ?? 1,
    keywords: overrides.keywords ?? [],
    shortcodes: overrides.shortcodes ?? [],
    aliases: overrides.aliases ?? [],
    searchTerms: overrides.searchTerms ?? [],
    maybeSkins: overrides.maybeSkins ?? [],
  }
}

function createIndexedEntry(overrides: Partial<EmojiEntry>): IndexedEmojiEntry {
  const entry = createEntry(overrides)

  return {
    entry,
    nameTerms: [entry.name],
    aliasTerms: entry.aliases,
    keywordTerms: entry.keywords,
    categoryTerms: [entry.categoryLabel.toLowerCase()],
  }
}

describe('emoji ranking', () => {
  it('prefers official name matches over alias-only matches', () => {
    const query = createQueryDescriptor('thinking')
    const officialNameMatch = createIndexedEntry({ name: 'thinking face' })
    const aliasOnlyMatch = createIndexedEntry({ name: 'pondering bubble', aliases: ['thinking'] })

    expect(scoreIndexedEntry(officialNameMatch, query)).toBeGreaterThan(
      scoreIndexedEntry(aliasOnlyMatch, query),
    )
  })

  it('prefers alias matches over keyword-only matches', () => {
    const query = createQueryDescriptor('approve')
    const aliasMatch = createIndexedEntry({ aliases: ['approve'] })
    const keywordMatch = createIndexedEntry({ keywords: ['approve'] })

    expect(scoreIndexedEntry(aliasMatch, query)).toBeGreaterThan(scoreIndexedEntry(keywordMatch, query))
  })

  it('prefers keyword matches over category-only matches', () => {
    const query = createQueryDescriptor('food')
    const keywordMatch = createIndexedEntry({ keywords: ['food'] })
    const categoryOnlyMatch = createIndexedEntry({
      categoryId: 'food-drink',
      categoryLabel: 'food drink',
    })

    expect(scoreIndexedEntry(keywordMatch, query)).toBeGreaterThan(
      scoreIndexedEntry(categoryOnlyMatch, query),
    )
  })
})
