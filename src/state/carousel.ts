import { Subject, merge } from 'rxjs'
import { filter, ignoreElements, map, switchMap, tap, withLatestFrom } from 'rxjs/operators'
import { getImagesFor, imageViewerState$ } from '../state/imagePreviewer'

import type { Observable } from 'rxjs'
import { createState } from './createState'
import { keyboardNavigation } from '../state/keyboard'
import { routeParams } from '../state/router'

type CarouselState = {
  images: string[]
  currentIndex: 0
}

const initialState = { currentIndex: 0, images: [] } as CarouselState

const createMoveIndexCommands = (
  buttonClicks$: Observable<number>,
  carouselState$: Observable<CarouselState>,
  commandSubject$: Subject<Partial<CarouselState>>
) =>
  buttonClicks$.pipe(
    withLatestFrom(carouselState$, (change: number, { images, currentIndex }) => ({
      canUpdate: currentIndex + change >= 0 && currentIndex + change <= images.length - 1,
      currentIndex,
      change,
    })),
    tap(
      ({ canUpdate, currentIndex, change }) =>
        canUpdate && commandSubject$.next({ currentIndex: currentIndex + change })
    ),
    ignoreElements()
  )

export function createCarouselState() {
  const commandSubject$ = new Subject<Partial<CarouselState>>()
  const buttonClicks$ = new Subject<number>()

  const images$ = routeParams.pipe(
    filter(Boolean),
    switchMap((breed) => {
      return getImagesFor(breed, imageViewerState$)
    })
  )
  const commands$ = merge(
    images$.pipe(map((images) => ({ images, currentIndex: 0 } as CarouselState))),
    commandSubject$.asObservable()
  )
  const carouselState$: Observable<CarouselState> = createState<CarouselState>(
    commands$,
    initialState
  )
  const commandButtons$ = createMoveIndexCommands(buttonClicks$, carouselState$, commandSubject$)
  const keyboardEvent$: Observable<number> = keyboardNavigation().pipe(
    filter(() => window.location.pathname !== '/')
  )
  const commandFromKeyboard$ = createMoveIndexCommands(
    keyboardEvent$,
    carouselState$,
    commandSubject$
  )
  const currentImage$ = merge(commandButtons$, commandFromKeyboard$, carouselState$).pipe(
    map(({ images, currentIndex }) => images[currentIndex])
  )

  return { currentImage$, buttonClicks$, commandSubject$ }
}
