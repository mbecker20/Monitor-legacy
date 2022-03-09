import { Fragment, ReactNode } from 'react'

function Map<T>({ array, map }: {
  array: T[],
  map: (val: T, index: number) => ReactNode
}) {
  return (
    <Fragment>
      {array.map(map)}
    </Fragment>
  )
}

export default Map