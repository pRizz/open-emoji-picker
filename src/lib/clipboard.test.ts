import { afterEach, describe, expect, it, vi } from 'vitest'

import { copyText } from '@/lib/clipboard'

describe('clipboard helper', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('uses the modern clipboard API when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    const result = await copyText('🤔')

    expect(writeText).toHaveBeenCalledWith('🤔')
    expect(result).toEqual({ ok: true, method: 'clipboard-api' })
  })

  it('falls back to execCommand when clipboard API is unavailable', async () => {
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    })

    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: vi.fn().mockReturnValue(true),
    })

    const result = await copyText('🔥')

    expect(document.execCommand).toHaveBeenCalledWith('copy')
    expect(result).toEqual({ ok: true, method: 'exec-command' })
  })
})
