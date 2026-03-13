import type { CopyMode, EmojiCopyPayload, EmojiEntry } from '@/lib/types'

export interface ClipboardResult {
  ok: boolean
  method?: 'clipboard-api' | 'exec-command'
  error?: Error
}

export function createEmojiCopyPayload(entry: EmojiEntry, copyMode: CopyMode = 'emoji'): EmojiCopyPayload {
  if (copyMode === 'shortcode' && entry.shortcodes[0]) {
    return {
      copyMode,
      text: `:${entry.shortcodes[0]}:`,
      label: `:${entry.shortcodes[0]}:`,
    }
  }

  return {
    copyMode: 'emoji',
    text: entry.emoji,
    label: `${entry.emoji} ${entry.name}`,
  }
}

function copyWithExecCommand(text: string): ClipboardResult {
  if (typeof document === 'undefined') {
    return {
      ok: false,
      error: new Error('Document is not available.'),
    }
  }

  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.setAttribute('readonly', 'true')
  textArea.style.position = 'fixed'
  textArea.style.opacity = '0'
  textArea.style.pointerEvents = 'none'

  document.body.append(textArea)
  textArea.select()

  try {
    const didCopy = document.execCommand('copy')
    if (!didCopy) {
      throw new Error('Fallback copy command failed.')
    }

    return { ok: true, method: 'exec-command' }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error('Copy failed.'),
    }
  } finally {
    document.body.removeChild(textArea)
  }
}

export async function copyText(text: string): Promise<ClipboardResult> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return { ok: true, method: 'clipboard-api' }
    } catch (error) {
      const fallbackResult = copyWithExecCommand(text)
      if (fallbackResult.ok) {
        return fallbackResult
      }

      return {
        ok: false,
        error: error instanceof Error ? error : new Error('Copy failed.'),
      }
    }
  }

  return copyWithExecCommand(text)
}
