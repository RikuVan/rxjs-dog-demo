import { Subject, delay, merge, of } from 'rxjs'
import {
  distinctUntilChanged,
  filter,
  ignoreElements,
  map,
  pluck,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators'
import { getImagesFor, imageViewerState$ } from '../state/imagePreviewer'

import type { Observable } from 'rxjs'
import { createState } from './createState'
import { keyboardNavigation } from '../state/keyboard'
import { routeParams } from '../state/router'

const AUTO_SLIDE_DELAY = 8000

type CarouselState = {
  images: string[]
  currentIndex: 0
}

const initialState = { currentIndex: 0, images: [] } as CarouselState

const getNextIndex = (
  change: number,
  { images, currentIndex }: { images: string[]; currentIndex: number }
) => {
  let nextIndex = currentIndex + change
  if (nextIndex <= 0) {
    nextIndex = images.length - 1
  } else if (nextIndex >= images.length - 1) {
    nextIndex = 0
  }
  return nextIndex
}

const createMoveIndexCommands = (
  buttonClicks$: Observable<number>,
  carouselState$: Observable<CarouselState>,
  commandSubject$: Subject<Partial<CarouselState>>
) =>
  buttonClicks$.pipe(
    withLatestFrom(carouselState$, getNextIndex),
    tap((nextIndex) => commandSubject$.next({ currentIndex: nextIndex })),
    ignoreElements()
  )

export function createCarouselState() {
  const commandSubject$ = new Subject<Partial<CarouselState>>()
  const buttonClicks$ = new Subject<number>()

  const images$ = routeParams.pipe(
    filter(Boolean),
    switchMap((breed) => getImagesFor(breed, imageViewerState$))
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

  const autoMove$ = carouselState$.pipe(
    pluck('currentIndex'),
    distinctUntilChanged(),
    switchMap(() => of(1).pipe(delay(AUTO_SLIDE_DELAY)))
  )

  const autoMoveCommand$ = createMoveIndexCommands(autoMove$, carouselState$, commandSubject$)

  const currentImage$ = merge(
    commandButtons$,
    commandFromKeyboard$,
    autoMoveCommand$,
    carouselState$
  ).pipe(map(({ images, currentIndex }) => images[currentIndex]))

  return { currentImage$, buttonClicks$, commandSubject$ }
}
