import { expect, type Locator, type Page, test } from '@playwright/test'

const appPath = '/open-emoji-picker/'

interface ElementRect {
  top: number
  left: number
  right: number
  bottom: number
  width: number
  height: number
}

async function gotoApp(page: Page) {
  await page.goto(appPath)

  await expect(
    page.getByRole('heading', { name: /fast emoji search, polished native feel\./i }),
  ).toBeVisible()
  await expect(page.getByRole('region', { name: /emoji picker/i })).toBeVisible()
}

function getPickerRegion(page: Page) {
  return page.getByRole('region', { name: /emoji picker/i })
}

function getInfoAside(page: Page) {
  return page.getByRole('complementary', { name: /designed for flow/i })
}

async function getRect(locator: Locator): Promise<ElementRect> {
  return locator.evaluate((element) => {
    const { top, left, right, bottom, width, height } = element.getBoundingClientRect()

    return { top, left, right, bottom, width, height }
  })
}

async function searchAndCopyThinkingFace(page: Page, expectedToastText: RegExp) {
  const searchbox = page.getByRole('searchbox', { name: /search emojis/i })

  await searchbox.fill('hmm')
  await expect(page.getByRole('heading', { name: 'Search results' })).toBeVisible()

  await page.getByRole('button', { name: /thinking face\. copy emoji/i }).first().click()

  await expect(page.getByText('🤔 thinking face', { exact: true })).toBeVisible()
  await expect(page.getByText(expectedToastText)).toBeVisible()
}

test('desktop view keeps the picker and supporting panel side by side @desktop', async ({ page }) => {
  await gotoApp(page)

  const pickerRegion = getPickerRegion(page)
  const infoAside = getInfoAside(page)
  const categoryNav = page.getByRole('navigation', { name: /emoji categories/i })

  const [pickerRect, asideRect] = await Promise.all([getRect(pickerRegion), getRect(infoAside)])

  expect(asideRect.left).toBeGreaterThan(pickerRect.left + 100)
  expect(Math.abs(asideRect.top - pickerRect.top)).toBeLessThan(120)

  await expect(categoryNav.getByText('Smileys', { exact: true })).toBeVisible()

  await searchAndCopyThinkingFace(page, /Copied 🤔 Thinking Face/i)
})

test('mobile view stacks the supporting panel and keeps the compact picker behavior @mobile', async ({ page }) => {
  await gotoApp(page)

  const pickerRegion = getPickerRegion(page)
  const infoAside = getInfoAside(page)
  const categoryNav = page.getByRole('navigation', { name: /emoji categories/i })

  const [pickerRect, asideRect] = await Promise.all([getRect(pickerRegion), getRect(infoAside)])

  expect(asideRect.top).toBeGreaterThan(pickerRect.bottom - 4)
  expect(Math.abs(asideRect.left - pickerRect.left)).toBeLessThan(24)

  await expect(categoryNav.getByText('Smileys', { exact: true })).not.toBeVisible()

  await searchAndCopyThinkingFace(page, /^Copied 🤔$/)
})
