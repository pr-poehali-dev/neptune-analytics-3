import { useState } from "react"

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : initial
    } catch (_e) {
      return initial
    }
  })

  const set = (next: T | ((prev: T) => T)) => {
    setValue(prev => {
      const result = typeof next === "function" ? (next as (p: T) => T)(prev) : next
      try { localStorage.setItem(key, JSON.stringify(result)) } catch (_e) { void _e }
      return result
    })
  }

  return [value, set] as const
}
