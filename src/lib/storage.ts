const isBrowser = typeof window !== 'undefined'

export function readStorageJson<T>(key: string, fallbackValue: T): T {
  if (!isBrowser) {
    return fallbackValue
  }

  const rawValue = window.localStorage.getItem(key)
  if (!rawValue) {
    return fallbackValue
  }

  try {
    return JSON.parse(rawValue) as T
  } catch {
    return fallbackValue
  }
}

export function writeStorageJson<T>(key: string, value: T) {
  if (!isBrowser) {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

export function removeStorageValue(key: string) {
  if (!isBrowser) {
    return
  }

  window.localStorage.removeItem(key)
}
