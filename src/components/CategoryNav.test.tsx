import { render, screen } from '@solidjs/testing-library'
import { describe, expect, it, vi } from 'vitest'

import { CategoryNav } from '@/components/CategoryNav'

function mockHorizontalOverflow(
  element: HTMLElement,
  {
    clientWidth,
    scrollWidth,
    scrollLeft,
  }: { clientWidth: number; scrollWidth: number; scrollLeft: number },
) {
  let currentScrollLeft = scrollLeft

  Object.defineProperties(element, {
    clientWidth: {
      configurable: true,
      get: () => clientWidth,
    },
    scrollWidth: {
      configurable: true,
      get: () => scrollWidth,
    },
    scrollLeft: {
      configurable: true,
      get: () => currentScrollLeft,
      set: (value: number) => {
        currentScrollLeft = value
      },
    },
  })
}

describe('CategoryNav', () => {
  it('maps wheel input to horizontal scrolling when the row overflows', () => {
    render(() => (
      <CategoryNav activeCategoryId="recent" isSearching={false} onSelect={vi.fn()} />
    ))

    const nav = screen.getByRole('navigation', { name: /emoji categories/i })
    mockHorizontalOverflow(nav, {
      clientWidth: 320,
      scrollWidth: 960,
      scrollLeft: 120,
    })

    const wheelEvent = new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      deltaY: 180,
    })

    nav.dispatchEvent(wheelEvent)

    expect(nav.scrollLeft).toBe(300)
    expect(wheelEvent.defaultPrevented).toBe(true)
  })

  it('leaves wheel input alone when the row does not overflow', () => {
    render(() => (
      <CategoryNav activeCategoryId="recent" isSearching={false} onSelect={vi.fn()} />
    ))

    const nav = screen.getByRole('navigation', { name: /emoji categories/i })
    mockHorizontalOverflow(nav, {
      clientWidth: 320,
      scrollWidth: 320,
      scrollLeft: 0,
    })

    const wheelEvent = new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      deltaY: 180,
    })

    nav.dispatchEvent(wheelEvent)

    expect(nav.scrollLeft).toBe(0)
    expect(wheelEvent.defaultPrevented).toBe(false)
  })
})
