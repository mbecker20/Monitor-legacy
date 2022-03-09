import { Alignment, Switch } from '@blueprintjs/core'
import { Deployment } from '../../../../state/types/deployment'

function OptionsCard({ deployment, setDeployment }: { deployment: Deployment, setDeployment: (deployment: Deployment) => void }) {
  const { logToAWS, autoDeploy } = deployment
  return (
    <div className='ConfigCard'>
      {/* <div className='ConfigCardBody'>
        <div className='ConfigInputTitle'> Restart </div>
        <Switch 
          checked={restart} 
          onChange={changeRestart} 
          alignIndicator={Alignment.RIGHT} 
          style={{ margin: 0, color: 'white' }}
        />
      </div> */}
      <div className='ConfigCardBody'>
        <div className='ConfigInputTitle'> Log to AWS </div>
        <Switch 
          checked={logToAWS} 
          onChange={() => setDeployment({ ...deployment, logToAWS: !logToAWS })} 
          alignIndicator={Alignment.RIGHT} 
          style={{ margin: 0, color: 'white' }} 
        />
      </div>
      <div className='ConfigCardBody'>
        <div className='ConfigInputTitle'> Auto Deploy </div>
        <Switch 
          checked={autoDeploy} 
          onChange={() => setDeployment({ ...deployment, autoDeploy: !autoDeploy })} 
          alignIndicator={Alignment.RIGHT} 
          style={{ margin: 0, color: 'white' }}
        />
      </div>
    </div>
  )
}

export default OptionsCard
