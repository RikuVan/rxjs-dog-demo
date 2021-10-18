import { Observable, filter, fromEvent, map, mapTo } from 'rxjs'

export enum NavKeyCode {
  ArrowRight = 'ArrowRight',
  ArrowUp = 'ArrowUp',
  ArrowLeft = 'ArrowLeft',
  ArrowDown = 'ArrowDown',
}

export const keyboardNavigation = (): Observable<number> => {
  return fromEvent<KeyboardEvent>(document, 'keydown').pipe(
    filter(({ code }) => Object.values(NavKeyCode).includes(code as NavKeyCode)),
    map(({ code }) =>
      [NavKeyCode.ArrowLeft, NavKeyCode.ArrowDown].includes(code as NavKeyCode) ? -1 : 1
    )
  )
}
