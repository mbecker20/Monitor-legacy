import { Button } from '@blueprintjs/core'
import { useSelector } from '../../../..'
import IfElse from '../../../../kbin-blueprint/IfElse'
import { sendOverRootWS } from '../../../../state/sockets'
import { GITHUB_LISTENER_URL } from '../../../../state/updates'

function GitListnerCard({ buildID }: { buildID: string }) {
  const listenerURL = useSelector(state => state.githubListenerURL)
  return (
    <div className='ConfigCard'>
      <div className='ConfigCardBody'>
        <IfElse
          showIf={listenerURL.length > 0}
          show={listenerURL}
          showElse={
            <Button intent='primary' fill onClick={() => sendOverRootWS(GITHUB_LISTENER_URL, { buildID })}>
              Click to Get Github Listner URL
            </Button>
          }
        />
      </div>
    </div>
  )
}

export default GitListnerCard
