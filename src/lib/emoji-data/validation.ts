import { aliasCoverageExceptionCategories } from '@/lib/emoji-data/aliases'
import { normalizeSearchTerm } from '@/lib/emoji-data/normalization'
import { dedupeStrings } from '@/lib/utils'
import type { EmojiEntry } from '@/lib/types'

export interface AliasCoverageReport {
  tooFewSearchTerms: EmojiEntry[]
  missingCustomAliases: EmojiEntry[]
  customAliasCoverageRatio: number
}

function getUniqueSearchTerms(entry: EmojiEntry) {
  return dedupeStrings([entry.name, ...entry.aliases, ...entry.keywords]).map(normalizeSearchTerm)
}

function getCustomAliases(entry: EmojiEntry) {
  const shortcodeTerms = new Set(entry.shortcodes.map(normalizeSearchTerm))
  const nameTerm = normalizeSearchTerm(entry.name)

  return entry.aliases
    .map(normalizeSearchTerm)
    .filter((alias) => alias && alias !== nameTerm && !shortcodeTerms.has(alias))
}

export function buildAliasCoverageReport(entries: EmojiEntry[]): AliasCoverageReport {
  const tooFewSearchTerms = entries.filter((entry) => getUniqueSearchTerms(entry).length < 2)
  const candidates = entries.filter(
    (entry) => !aliasCoverageExceptionCategories.has(entry.categoryId),
  )
  const missingCustomAliases = candidates.filter((entry) => getCustomAliases(entry).length === 0)
  const customAliasCoverageRatio =
    candidates.length === 0 ? 1 : (candidates.length - missingCustomAliases.length) / candidates.length

  return {
    tooFewSearchTerms,
    missingCustomAliases,
    customAliasCoverageRatio,
  }
}
