export type ThemeMode = 'dark' | 'light' | 'system'

export type CopyMode = 'emoji' | 'shortcode'

export type EmojiCategoryId =
  | 'recent'
  | 'smileys-emotion'
  | 'people-body'
  | 'animals-nature'
  | 'food-drink'
  | 'travel-places'
  | 'activities'
  | 'objects'
  | 'symbols'
  | 'flags'

export interface EmojiSkinEntry {
  emoji: string
  hexcode: string
  name: string
  maybeTone?: number | number[]
}

export interface EmojiEntry {
  id: string
  emoji: string
  name: string
  categoryId: EmojiCategoryId
  categoryLabel: string
  categoryOrder: number
  order: number
  keywords: string[]
  shortcodes: string[]
  aliases: string[]
  searchTerms: string[]
  maybeSkins: EmojiSkinEntry[]
}

export interface EmojiCategory {
  id: EmojiCategoryId
  label: string
  shortLabel: string
  icon: string
  order: number
}

export interface EmojiCopyPayload {
  copyMode: CopyMode
  text: string
  label: string
}

export interface EmojiCopyContext {
  entry: EmojiEntry
  payload: EmojiCopyPayload
  query: string
}
