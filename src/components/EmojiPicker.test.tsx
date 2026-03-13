import { render, screen, waitFor } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EmojiPicker } from '@/components/EmojiPicker'

describe('EmojiPicker', () => {
  beforeEach(() => {
    window.localStorage.clear()
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
  })

  it('switches to a unified search results grid and copies emojis', async () => {
    const user = userEvent.setup()
    const onCopy = vi.fn()

    render(() => <EmojiPicker onCopy={onCopy} />)

    await user.type(screen.getByRole('searchbox', { name: /search emojis/i }), 'hmm')

    expect(screen.getByText('Search results')).toBeInTheDocument()
    expect(screen.queryByText('Smileys & Emotion')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /thinking face/i }))

    await waitFor(() => {
      expect(onCopy).toHaveBeenCalledTimes(1)
    })

    expect(onCopy.mock.calls[0]?.[0].entry.name).toBe('thinking face')
  })
})
