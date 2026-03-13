import {
  getPhraseSearchVariants,
  getSearchVariants,
  normalizeSearchTerm,
} from '@/lib/emoji-data/normalization'
import { createQueryDescriptor, scoreIndexedEntry, type IndexedEmojiEntry } from '@/lib/emoji-data/ranking'
import { dedupeStrings } from '@/lib/utils'
import type { EmojiEntry } from '@/lib/types'

function normalizeTerms(terms: string[]) {
  return dedupeStrings(terms.flatMap((term) => getSearchVariants(term)))
}

function normalizePhraseTerms(terms: string[]) {
  return dedupeStrings(terms.flatMap((term) => getPhraseSearchVariants(term)))
}

function indexEmojiEntry(entry: EmojiEntry): IndexedEmojiEntry {
  return {
    entry,
    nameTerms: normalizePhraseTerms([entry.name]),
    aliasTerms: normalizePhraseTerms([...entry.shortcodes, ...entry.aliases]),
    keywordTerms: normalizeTerms(entry.keywords),
    categoryTerms: normalizePhraseTerms([entry.categoryLabel]),
  }
}

export function createEmojiSearchIndex(entries: EmojiEntry[]) {
  const indexedEntries = entries.map(indexEmojiEntry)
  const cache = new Map<string, EmojiEntry[]>()

  function search(query: string) {
    const normalizedQuery = normalizeSearchTerm(query)

    if (!normalizedQuery) {
      return entries
    }

    const cachedResults = cache.get(normalizedQuery)
    if (cachedResults) {
      return cachedResults
    }

    const queryDescriptor = createQueryDescriptor(normalizedQuery)
    const rankedEntries = indexedEntries
      .map((item) => ({
        entry: item.entry,
        score: scoreIndexedEntry(item, queryDescriptor),
      }))
      .filter((item) => item.score > 0)
      .sort((left, right) => right.score - left.score || left.entry.order - right.entry.order)
      .map((item) => item.entry)

    cache.set(normalizedQuery, rankedEntries)

    return rankedEntries
  }

  return {
    search,
    indexedEntries,
  }
}
