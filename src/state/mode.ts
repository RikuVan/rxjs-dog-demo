import { Subject, fromEvent, map, merge, startWith, tap } from 'rxjs'

import type { Observable } from 'rxjs'

const SCHEME = '(prefers-color-scheme: dark)'
export enum Theme {
  Dark = 'dark',
  Light = 'light',
}

export let key = '__mode'
export let theme: Theme = Theme.Light

const validTheme = (t: Theme) => Object.values(Theme).includes(t as Theme)

export function createModeState() {
  const mediaQuery = window.matchMedia(SCHEME)
  const buttonClicks$ = new Subject()

  const themeFromQuery$ = fromEvent(mediaQuery, 'change').pipe(
    startWith(mediaQuery),
    map((list: MediaQueryList) => list.matches),
    map((isDark) => {
      const persistedTheme = localStorage[key]
      if (validTheme(persistedTheme)) {
        return persistedTheme
      }
      return isDark ? Theme.Dark : Theme.Light
    })
  )

  const modeState$: Observable<Theme> = merge(themeFromQuery$, buttonClicks$).pipe(
    tap((theme) => {
      document.body.className = theme
      localStorage[key] = theme
    })
  )

  return { modeState$, buttonClicks$ }
}
