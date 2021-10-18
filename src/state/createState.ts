import { scan, shareReplay, startWith } from 'rxjs/operators'

import type { Observable } from 'rxjs'

export function createState<T>(commands$: Observable<Partial<T>>, initialState: T): Observable<T> {
  return commands$.pipe(
    startWith(initialState),
    scan((state: T, command: Partial<T>): T => {
      return { ...state, ...command } as T
    }),
    shareReplay(1)
  ) as Observable<T>
}
