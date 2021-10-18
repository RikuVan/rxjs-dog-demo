import { catchError, from, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

import { fromFetch } from 'rxjs/fetch'

// api helpers
const API_ROOT = 'https://dog.ceo/api'
const BREED_LIST_URL = `${API_ROOT}/breeds/list`
const getImagesUrlFor = (breed: string) => `${API_ROOT}/breed/${breed}/images`

// fetch observables
export const fetchBreeds = () =>
  fromFetch(BREED_LIST_URL).pipe(
    switchMap((response) => {
      if (response.ok) {
        return response.json()
      } else {
        return of({ error: true, message: [] })
      }
    }),
    catchError((_err) => of({ error: true, message: [] }))
  )

export const fetchImagesForBreed = (breed: string) =>
  fromFetch(getImagesUrlFor(breed)).pipe(
    switchMap((response) => {
      if (response.ok) {
        return from(response.json()).pipe(map((data) => ({ breed, imagesForBreed: data.message })))
      } else {
        return of({ error: true, message: [] })
      }
    }),
    catchError((_err) => of({ error: true, message: [] }))
  )
