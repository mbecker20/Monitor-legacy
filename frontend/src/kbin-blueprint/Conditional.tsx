import React, { Fragment, ReactNode } from 'react'

function Conditional({ children, showIf }: {
  children: ReactNode
  showIf: boolean
}) {
  return (
    <Fragment>
      {!showIf ? null : children}
    </Fragment>
  )
}

export default Conditional