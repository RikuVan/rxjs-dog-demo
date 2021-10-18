import { Observable, Subject, from, merge, pipe } from 'rxjs'
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  ignoreElements,
  map,
  mergeMap,
  pluck,
  scan,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators'
import { fetchBreeds, fetchImagesForBreed } from './api'

import type { UnaryFunction } from 'rxjs'
import { createState } from './createState'
import { keyboardNavigation } from './keyboard'

interface ViewerState {
  breeds: Map<string, string[]>
  previews: Map<string, string[]>
  images: Map<string, string[]>
  currentIndex: number
  letters: string[]
  pending: boolean
}

const initialState = {
  breeds: new Map(),
  previews: new Map(),
  images: new Map(),
  currentIndex: 1,
  letters: [],
  pending: true,
}

const CONCURRENCY = 6
export const fetchImagesForLetter = (
  viewerState$: Observable<ViewerState>,
  commandSubject: Subject<Partial<ViewerState>>
) =>
  viewerState$.pipe(
    filter(
      ({ letters, breeds, currentIndex, previews }) =>
        breeds.has(letters[currentIndex]) && !previews.has(letters[currentIndex])
    ),
    map(({ breeds, letters, currentIndex }) => breeds.get(letters[currentIndex])),
    distinctUntilChanged(),
    debounceTime(200),
    switchMap((urls: string[]) => {
      return from(urls).pipe(
        mergeMap(fetchImagesForBreed, CONCURRENCY),
        withLatestFrom(
          viewerState$,
          (
            { breed, imagesForBreed }: { breed: string; imagesForBreed: string[] },
            { images, previews }
          ) => ({
            breed,
            imagesForBreed,
            images,
            previews,
          })
        ),
        tap(({ breed, imagesForBreed, images, previews }) => {
          commandSubject.next({
            images: images.set(breed, imagesForBreed),
            previews: previews.has(breed[0])
              ? previews.set(breed[0], [...previews.get(breed[0]), [breed, imagesForBreed[0]]])
              : previews.set(breed[0], [[breed, imagesForBreed[0]]]),
          })
        }),
        ignoreElements()
      )
    })
  )

export const createBreedLookup = (fetchDogs$: Observable<{ message: string[] }>) =>
  fetchDogs$.pipe(pluck('message'), mergeMap(from), scan(collectBreedsByLetter, new Map()))

export const createMoveIndexCommands = (
  buttonEvent: Observable<number>,
  imageViewerState: Observable<ViewerState>,
  commandSubject: Subject<Partial<ViewerState>>
) =>
  buttonEvent.pipe(
    withLatestFrom(imageViewerState, (change: number, { letters, currentIndex }) => ({
      canUpdate: currentIndex + change >= 0 && currentIndex + change <= letters.length - 1,
      currentIndex,
      change,
    })),
    tap(
      ({ canUpdate, currentIndex, change }) =>
        canUpdate && commandSubject.next({ currentIndex: currentIndex + change })
    ),
    ignoreElements()
  )

export function createImagePreviewerState() {
  // list of breeds
  const breeds$ = fetchBreeds()
  // create lookup by first letter
  const breedLookup$ = createBreedLookup(breeds$)
  // could be fromEvent, but instead just `next` data from handler
  const buttonEvent$ = new Subject<number>()
  // user inside tap to update state
  const commandSubject$ = new Subject<Partial<ViewerState>>()
  const commands$ = merge(
    breedLookup$.pipe(map((breeds) => ({ breeds, letters: [...breeds.keys()] }))),
    commandSubject$.asObservable()
  )
  // state in one place, with final state replay-able for any subscriber
  const imageViewerState$: Observable<ViewerState> = createState<ViewerState>(
    commands$,
    initialState
  )
  // button index clicks update state via commandSubject
  const commandFromButton$ = createMoveIndexCommands(
    buttonEvent$,
    imageViewerState$,
    commandSubject$
  )
  // changes to index cause images to update
  const fetchImages$ = fetchImagesForLetter(imageViewerState$, commandSubject$)
  // handle keyboard nav
  const keyboardEvent$: Observable<number> = keyboardNavigation().pipe(
    // if breed in pathname we don't want to navigate under carousel
    filter(() => window.location.pathname === '/')
  )
  const commandFromKeyboard$ = createMoveIndexCommands(
    keyboardEvent$,
    imageViewerState$,
    commandSubject$
  )
  // ALL THE STATE
  // only one place to subscribe
  const state$ = merge(fetchImages$, commandFromButton$, commandFromKeyboard$, imageViewerState$)
  return { state$, commandSubject$, buttonEvent$, imageViewerState$ }
}

// initialize here so we can use in carousel state
// export state$ as state to avoid goofy $state$
export const {
  state$: state,
  commandSubject$,
  buttonEvent$,
  imageViewerState$,
} = createImagePreviewerState()

// transformation helpers
function collectBreedsByLetter(acc: Map<string, string[]>, breed: string) {
  const letter = breed[0]
  if (acc.has(letter)) acc.get(letter).push(breed)
  else acc.set(letter, [breed])
  return acc
}

export function queryChange<T, I extends keyof T>(
  key: string
): UnaryFunction<Observable<T>, Observable<T[I]>> {
  return pipe(pluck<T, I>(key as I), distinctUntilChanged<T[I]>())
}

export function getImagesFor(breed: string, state$: Observable<ViewerState>) {
  return state$.pipe(
    filter(({ images }) => breed && images.has(breed)),
    map(({ images }) => images.get(breed))
  )
}
