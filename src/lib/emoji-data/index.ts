import { emojiEntries } from '@/lib/emoji-data/dataset'
import { createEmojiSearchIndex } from '@/lib/emoji-data/search-index'

export * from '@/lib/emoji-data/alias-heuristics'
export * from '@/lib/emoji-data/aliases'
export * from '@/lib/emoji-data/categories'
export * from '@/lib/emoji-data/dataset'
export * from '@/lib/emoji-data/normalization'
export * from '@/lib/emoji-data/ranking'
export * from '@/lib/emoji-data/recents'
export * from '@/lib/emoji-data/search-index'
export * from '@/lib/emoji-data/validation'

export const emojiSearchIndex = createEmojiSearchIndex(emojiEntries)
