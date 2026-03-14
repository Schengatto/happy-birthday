import { inject, provide, type Ref, ref, computed } from 'vue'
import type { CardLocale } from '../../types/card'
import { t } from '~/utils/i18n'

const LOCALE_KEY = Symbol('locale')

/** Call once in a root component (EditorWizard, CardViewer) to provide locale to children. */
export function provideLocale(locale: Ref<CardLocale>) {
  provide(LOCALE_KEY, locale)
}

/** Returns the current locale ref (defaults to 'it' if not provided). */
export function useLocale() {
  const locale = inject<Ref<CardLocale>>(LOCALE_KEY, ref('it'))

  /** Shorthand translate function bound to the current locale. */
  const $t = (key: string, params?: Record<string, string | number>) =>
    t(locale.value, key, params)

  return { locale, $t }
}
