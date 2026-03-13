import { compactSearchTerm, getSearchVariants, isSubsequenceMatch, tokenizeQuery } from '@/lib/emoji-data/normalization'
import type { EmojiEntry } from '@/lib/types'

export interface IndexedEmojiEntry {
  entry: EmojiEntry
  nameTerms: string[]
  aliasTerms: string[]
  keywordTerms: string[]
  categoryTerms: string[]
}

export interface QueryDescriptor {
  raw: string
  variants: string[]
  compact: string
  tokens: string[]
}

interface ScoreWeights {
  exact: number
  prefix: number
  substring: number
  tokenMatch: number
  subsequence: number
}

const nameWeights: ScoreWeights = {
  exact: 1200,
  prefix: 980,
  substring: 760,
  tokenMatch: 640,
  subsequence: 180,
}

const aliasWeights: ScoreWeights = {
  exact: 860,
  prefix: 720,
  substring: 560,
  tokenMatch: 460,
  subsequence: 130,
}

const keywordWeights: ScoreWeights = {
  exact: 540,
  prefix: 420,
  substring: 300,
  tokenMatch: 220,
  subsequence: 70,
}

const categoryWeights: ScoreWeights = {
  exact: 220,
  prefix: 160,
  substring: 120,
  tokenMatch: 90,
  subsequence: 30,
}

function rankTerm(term: string, query: QueryDescriptor, weights: ScoreWeights) {
  let bestScore = 0
  const compactTerm = compactSearchTerm(term)

  for (const variant of query.variants) {
    if (!variant) {
      continue
    }

    if (term === variant || compactTerm === compactSearchTerm(variant)) {
      bestScore = Math.max(bestScore, weights.exact)
      continue
    }

    if (term.startsWith(variant) || compactTerm.startsWith(compactSearchTerm(variant))) {
      bestScore = Math.max(bestScore, weights.prefix)
      continue
    }

    if (term.includes(variant) || compactTerm.includes(compactSearchTerm(variant))) {
      bestScore = Math.max(bestScore, weights.substring)
    }
  }

  if (query.tokens.length > 1 && query.tokens.every((token) => term.includes(token))) {
    bestScore = Math.max(bestScore, weights.tokenMatch)
  }

  if (!bestScore && isSubsequenceMatch(query.compact, compactTerm)) {
    bestScore = Math.max(bestScore, weights.subsequence)
  }

  return bestScore
}

function rankTerms(terms: string[], query: QueryDescriptor, weights: ScoreWeights) {
  return terms.reduce((bestScore, term) => Math.max(bestScore, rankTerm(term, query, weights)), 0)
}

export function createQueryDescriptor(query: string): QueryDescriptor {
  return {
    raw: query,
    variants: getSearchVariants(query),
    compact: compactSearchTerm(query),
    tokens: tokenizeQuery(query),
  }
}

export function scoreIndexedEntry(item: IndexedEmojiEntry, query: QueryDescriptor) {
  const nameScore = rankTerms(item.nameTerms, query, nameWeights)
  const aliasScore = rankTerms(item.aliasTerms, query, aliasWeights)
  const keywordScore = rankTerms(item.keywordTerms, query, keywordWeights)
  const categoryScore = rankTerms(item.categoryTerms, query, categoryWeights)
  const score = nameScore + aliasScore + keywordScore + categoryScore

  return score > 0 ? score - item.entry.order / 10_000 : 0
}
