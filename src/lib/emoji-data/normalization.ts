import { dedupeStrings } from '@/lib/utils'

const punctuationPattern = /[’'".,!?/\\:;()[\]{}]+/g
const punctuationExceptPlusPattern = /[’'".,!?/\\:;()[\]{}]+/g
const separatorPattern = /[_-]+/g
const whitespacePattern = /\s+/g

export function normalizeSearchTerm(term: string) {
  return term
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(separatorPattern, ' ')
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(punctuationPattern, ' ')
    .replace(whitespacePattern, ' ')
    .trim()
}

function preserveSymbolsTerm(term: string) {
  return term
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(separatorPattern, ' ')
    .replace(/&/g, ' and ')
    .replace(punctuationExceptPlusPattern, ' ')
    .replace(whitespacePattern, ' ')
    .trim()
}

export function compactSearchTerm(term: string) {
  return normalizeSearchTerm(term).replace(/\s+/g, '')
}

function toSingular(term: string) {
  if (term.endsWith('ies')) {
    return `${term.slice(0, -3)}y`
  }

  if (term.endsWith('es')) {
    return term.slice(0, -2)
  }

  if (term.endsWith('s') && term.length > 3) {
    return term.slice(0, -1)
  }

  return term
}

function toPlural(term: string) {
  if (term.endsWith('y') && term.length > 2) {
    return `${term.slice(0, -1)}ies`
  }

  if (term.endsWith('s')) {
    return term
  }

  return `${term}s`
}

export function getSearchVariants(term: string) {
  const normalized = normalizeSearchTerm(term)
  const symbolFriendly = preserveSymbolsTerm(term)
  if (!normalized) {
    return []
  }

  const compact = compactSearchTerm(normalized)
  const tokens = normalized.split(' ').filter(Boolean)
  const singleWordVariants =
    tokens.length === 1 ? [toSingular(normalized), toPlural(normalized)] : []
  const variants = dedupeStrings([
    symbolFriendly,
    symbolFriendly.replace(/\s+/g, ''),
    normalized,
    compact,
    normalized.replace(/\bplus\b/g, '+').trim(),
    tokens.join(' '),
    tokens.join(''),
    ...singleWordVariants,
  ])

  return variants
}

export function getPhraseSearchVariants(term: string) {
  const normalized = normalizeSearchTerm(term)
  const symbolFriendly = preserveSymbolsTerm(term)
  if (!normalized) {
    return []
  }

  return dedupeStrings([
    symbolFriendly,
    symbolFriendly.replace(/\s+/g, ''),
    normalized,
    compactSearchTerm(normalized),
    normalized.replace(/\bplus\b/g, '+').trim(),
  ])
}

export function tokenizeQuery(query: string) {
  return normalizeSearchTerm(query).split(' ').filter(Boolean)
}

export function isSubsequenceMatch(query: string, target: string) {
  if (!query || !target) {
    return false
  }

  let queryIndex = 0

  for (const character of target) {
    if (character === query[queryIndex]) {
      queryIndex += 1
    }

    if (queryIndex === query.length) {
      return true
    }
  }

  return false
}
