import { defer, fromEvent, merge } from 'rxjs'

import { mapTo } from 'rxjs/operators'

const LOADING_ERROR_URL = '/error.png'
export function preloadImage(src: string) {
  return defer(() => {
    const img = new Image()
    const success = fromEvent(img, 'load').pipe(mapTo(src))
    const failure = fromEvent(img, 'error').pipe(mapTo(LOADING_ERROR_URL))
    img.src = src
    return merge(success, failure)
  })
}
