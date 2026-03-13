import { getSearchVariants, normalizeSearchTerm } from '@/lib/emoji-data/normalization'
import { dedupeStrings } from '@/lib/utils'

interface AliasHeuristicInput {
  name: string
  shortcodes: string[]
  keywords: string[]
}

function expandShortcode(shortcode: string) {
  const normalized = normalizeSearchTerm(shortcode)
  const withoutWords = normalized.replace(/\b(face|button|symbol|flag)\b/g, '').trim()

  return dedupeStrings([
    shortcode,
    normalized,
    normalized.replace(/\s+/g, ''),
    withoutWords,
    withoutWords.replace(/\s+/g, ''),
  ])
}

function buildNameAliases(name: string) {
  const normalizedName = normalizeSearchTerm(name)
  const withoutFillers = normalizedName
    .replace(/\b(face|button|flag|symbol|with|and)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return dedupeStrings([
    ...getSearchVariants(name),
    withoutFillers,
    withoutFillers.replace(/\s+/g, ''),
  ])
}

export function buildHeuristicAliases({ name, shortcodes, keywords }: AliasHeuristicInput) {
  return dedupeStrings([
    ...buildNameAliases(name),
    ...shortcodes.flatMap(expandShortcode),
    ...keywords.flatMap(getSearchVariants),
  ]).filter((alias) => alias !== normalizeSearchTerm(name))
}
