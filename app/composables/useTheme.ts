import type { CardTheme } from '../../types/card'

export function useTheme() {
  function applyTheme(theme: CardTheme) {
    if (import.meta.server) return
    document.documentElement.setAttribute('data-theme', theme)
  }

  return { applyTheme }
}
