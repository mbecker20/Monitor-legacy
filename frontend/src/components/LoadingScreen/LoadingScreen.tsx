import { useState } from 'react'
import { animated, useSpring } from 'react-spring'
import Conditional from '../../kbin-blueprint/Conditional'
import { springConfig } from '../../kbin-blueprint/springConfig'
import './LoadingScreen.css'

function LoadingScreen({ initialized }: {
  initialized?: boolean
}) {
  const [exists, setExists] = useState(true)
  const loadedStyle = useSpring({
    top: initialized ? '0vh' : '-100vh',
    opacity: initialized ? 0 : 1,
    onRest: () => { if (initialized) setExists(false) },
    config: springConfig.xslow
  })
  return (
    <Conditional showIf={exists}>
      <animated.div
        className='FlexCol LoadingScreen'
        style={loadedStyle as any}
      >
        <img className='LoadingLogo' src='/logo/logoVText.png' alt='EthDev Technologies' />
      </animated.div>
    </Conditional>
  )
}

export default LoadingScreen