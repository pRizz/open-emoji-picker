import { normalizeSearchTerm } from '@/lib/emoji-data/normalization'
import { dedupeStrings } from '@/lib/utils'

const curatedAliasesByName: Record<string, string[]> = {
  'thinking face': ['hmm', 'ponder', 'thinking'],
  'loudly crying face': ['cry', 'sad', 'sobbing'],
  'face with tears of joy': ['lol', 'laugh', 'lmao'],
  'thumbs up': ['ok', 'approve', 'looks good'],
  'thumbs down': ['disapprove', 'nope'],
  fire: ['lit', 'hot', 'on fire'],
  'folded hands': ['please', 'pray', 'thanks'],
  'sparkles': ['magic', 'shiny'],
  'red heart': ['love', 'heart'],
  'smiling face with heart-eyes': ['in love', 'love eyes'],
  'face blowing a kiss': ['kiss', 'xoxo'],
  'rolling on the floor laughing': ['rofl', 'floor laugh'],
  'smiling face with sunglasses': ['cool', 'chill'],
  'party popper': ['celebrate', 'congrats'],
  'pile of poo': ['poop', 'shit'],
  'see-no-evil monkey': ['oops', 'embarrassed'],
  'raising hands': ['hooray', 'celebration'],
  'clapping hands': ['applause', 'clap'],
  'hundred points': ['100', 'keep it 100'],
  'check mark button': ['done', 'confirmed'],
  'cross mark': ['incorrect', 'wrong'],
  'warning': ['alert', 'caution'],
  rocket: ['launch', 'ship it'],
  eyes: ['look', 'watching'],
  'winking face': ['jk', 'playful'],
  'pleading face': ['beg', 'please'],
  'sleeping face': ['sleepy', 'tired'],
  'weary face': ['exhausted', 'over it'],
  'skull': ['dead', 'i am dead'],
  'hot beverage': ['coffee', 'tea'],
  'waving hand': ['hello', 'hi', 'bye'],
}

export const aliasCoverageExceptionCategories = new Set(['flags', 'symbols'])

export function getCuratedAliases(name: string) {
  const normalizedName = normalizeSearchTerm(name)
  return dedupeStrings(curatedAliasesByName[normalizedName] ?? [])
}
