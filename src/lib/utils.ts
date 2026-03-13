import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dedupeStrings(values: Iterable<string>) {
  return [...new Set([...values].map((value) => value.trim()).filter(Boolean))]
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function titleCase(value: string) {
  return value.replace(/\b\w/g, (character) => character.toUpperCase())
}
