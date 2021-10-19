import { distinctUntilChanged, share, shareReplay } from 'rxjs/operators'

import { Observable } from 'rxjs'
import navaid from 'navaid'

export const router = navaid()

export const routeParams = new Observable<string>((subscriber) => {
  router
    .on('/:breed', (params) => {
      subscriber.next(params?.breed)
    })
    .listen()
  return () => {
    router.unlisten()
  }
}).pipe(shareReplay(1))
