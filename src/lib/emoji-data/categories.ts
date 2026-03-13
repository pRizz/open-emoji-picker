import type { EmojiCategory, EmojiCategoryId } from '@/lib/types'

export const emojiCategories: EmojiCategory[] = [
  { id: 'recent', label: 'Recent', shortLabel: 'Recent', icon: '🕘', order: 0 },
  {
    id: 'smileys-emotion',
    label: 'Smileys & Emotion',
    shortLabel: 'Smileys',
    icon: '😀',
    order: 1,
  },
  {
    id: 'people-body',
    label: 'People & Body',
    shortLabel: 'People',
    icon: '🙌',
    order: 2,
  },
  {
    id: 'animals-nature',
    label: 'Animals & Nature',
    shortLabel: 'Nature',
    icon: '🌿',
    order: 3,
  },
  {
    id: 'food-drink',
    label: 'Food & Drink',
    shortLabel: 'Food',
    icon: '🍜',
    order: 4,
  },
  {
    id: 'travel-places',
    label: 'Travel & Places',
    shortLabel: 'Travel',
    icon: '✈️',
    order: 5,
  },
  {
    id: 'activities',
    label: 'Activities',
    shortLabel: 'Play',
    icon: '⚽',
    order: 6,
  },
  {
    id: 'objects',
    label: 'Objects',
    shortLabel: 'Things',
    icon: '💡',
    order: 7,
  },
  {
    id: 'symbols',
    label: 'Symbols',
    shortLabel: 'Symbols',
    icon: '♾️',
    order: 8,
  },
  {
    id: 'flags',
    label: 'Flags',
    shortLabel: 'Flags',
    icon: '🏁',
    order: 9,
  },
]

const groupToCategoryId: Record<number, EmojiCategoryId | undefined> = {
  0: 'smileys-emotion',
  1: 'people-body',
  3: 'animals-nature',
  4: 'food-drink',
  5: 'travel-places',
  6: 'activities',
  7: 'objects',
  8: 'symbols',
  9: 'flags',
}

const categoryById = new Map(emojiCategories.map((category) => [category.id, category]))

export function getCategoryById(categoryId: EmojiCategoryId) {
  return categoryById.get(categoryId) ?? emojiCategories[0]
}

export function normalizeCategoryId(group: number): EmojiCategoryId | null {
  return groupToCategoryId[group] ?? null
}
