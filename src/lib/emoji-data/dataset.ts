import emojiData from 'emojibase-data/en/compact.json'
import shortcodeData from 'emojibase-data/en/shortcodes/emojibase.json'

import { buildHeuristicAliases } from '@/lib/emoji-data/alias-heuristics'
import { getCuratedAliases } from '@/lib/emoji-data/aliases'
import { getCategoryById, normalizeCategoryId } from '@/lib/emoji-data/categories'
import { dedupeStrings } from '@/lib/utils'
import type { EmojiEntry, EmojiSkinEntry } from '@/lib/types'

interface RawEmojiSkin {
  unicode?: string
  hexcode: string
  label: string
  tone?: number | number[]
}

interface RawEmojiEntry {
  unicode?: string
  hexcode: string
  label: string
  order?: number
  group: number
  tags?: string[]
  skins?: RawEmojiSkin[]
}

type RawShortcodeValue = string | string[]

function normalizeShortcodes(shortcodes: RawShortcodeValue | undefined) {
  if (!shortcodes) {
    return []
  }

  return Array.isArray(shortcodes) ? shortcodes : [shortcodes]
}

function mapSkins(maybeSkins: RawEmojiSkin[] | undefined): EmojiSkinEntry[] {
  if (!maybeSkins?.length) {
    return []
  }

  return maybeSkins
    .filter((skin) => skin.unicode)
    .map((skin) => ({
      emoji: skin.unicode ?? '',
      hexcode: skin.hexcode,
      name: skin.label,
      maybeTone: skin.tone,
    }))
}

function toEmojiEntry(item: RawEmojiEntry): EmojiEntry | null {
  if (!item.unicode || item.order === undefined) {
    return null
  }

  const categoryId = normalizeCategoryId(item.group)
  if (!categoryId) {
    return null
  }

  const category = getCategoryById(categoryId)
  const shortcodes = normalizeShortcodes(
    (shortcodeData as Record<string, RawShortcodeValue>)[item.hexcode],
  )
  const keywords = dedupeStrings(item.tags ?? [])
  const heuristicAliases = buildHeuristicAliases({
    name: item.label,
    shortcodes,
    keywords,
  })
  const curatedAliases = getCuratedAliases(item.label)
  const aliases = dedupeStrings([...shortcodes, ...curatedAliases, ...heuristicAliases])
  const searchTerms = dedupeStrings([
    item.label,
    category.label,
    category.shortLabel,
    ...keywords,
    ...aliases,
  ])

  return {
    id: item.hexcode,
    emoji: item.unicode,
    name: item.label,
    categoryId,
    categoryLabel: category.label,
    categoryOrder: category.order,
    order: item.order,
    keywords,
    shortcodes,
    aliases,
    searchTerms,
    maybeSkins: mapSkins(item.skins),
  }
}

export const emojiEntries = (emojiData as RawEmojiEntry[])
  .map(toEmojiEntry)
  .filter((entry): entry is EmojiEntry => Boolean(entry))

export const emojiById = new Map(emojiEntries.map((entry) => [entry.id, entry]))
export const emojiByGlyph = new Map(emojiEntries.map((entry) => [entry.emoji, entry]))
