import { normalizeSearchTerm } from '@/lib/emoji-data/normalization'
import { dedupeStrings } from '@/lib/utils'

interface AliasHeuristicInput {
  name: string
  shortcodes: string[]
  keywords: string[]
}

const aliasStopwords = new Set([
  'and',
  'with',
  'face',
  'hand',
  'body',
  'button',
  'flag',
  'symbol',
  'up',
  'down',
  'left',
  'right',
  'index',
  'finger',
  'thumb',
  'one',
  'thing',
  'object',
])

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
  const isSingleWordName = !normalizedName.includes(' ')
  const singleWordVariants = isSingleWordName
    ? dedupeStrings([`${normalizedName}s`, normalizedName.endsWith('s') ? normalizedName.slice(0, -1) : ''])
    : []

  return dedupeStrings([
    normalizedName.replace(/\s+/g, ''),
    withoutFillers,
    withoutFillers.replace(/\s+/g, ''),
    ...singleWordVariants,
  ]).filter((alias) => alias && alias !== normalizedName)
}

function buildKeywordAliases(keywords: string[]) {
  return dedupeStrings(
    keywords
      .map(normalizeSearchTerm)
      .filter((keyword) => keyword && !aliasStopwords.has(keyword))
      .filter((keyword) => keyword.length >= 3)
      .filter((keyword) => keyword.split(' ').length <= 2),
  )
}

export function buildHeuristicAliases({ name, shortcodes, keywords }: AliasHeuristicInput) {
  return dedupeStrings([
    ...buildNameAliases(name),
    ...shortcodes.flatMap(expandShortcode),
    ...buildKeywordAliases(keywords),
  ]).filter((alias) => alias !== normalizeSearchTerm(name))
}
