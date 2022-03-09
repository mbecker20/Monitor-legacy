import { Button } from '@blueprintjs/core'
import { useState } from 'react'
import BuildCreatorMenu from '../../Menus/CreatorMenus/BuildCreatorMenu'
import DeploymentCreatorMenu from '../../Menus/CreatorMenus/DeploymentCreatorMenu'
import ServerCreatorMenu from '../../Menus/CreatorMenus/ServerCreatorMenu'
import './CreatorButtons.css'

function CreatorButton({buttonName, onClick} : {buttonName: string, onClick: () => void}) {
  return(
    <Button
      intent='success'
      onClick={onClick}
    >
      {buttonName}
    </Button>
  )
}

function CreatorButtons({ width, closeSidebar }: { width: number, closeSidebar: () => void }) {
  const [openServerDialog, setOpenServerDialog] = useState(false)
  const [openBuildsDialog, setOpenBuildsDialog] = useState(false)
  const [openDeploymentsDialog, setOpenDeploymentsDialog] = useState(false)
  const maybeCloseSidebar = () => { if (width <= 1000) closeSidebar() }
  
  return (
    <div className='CreatorButtons OverflowHidden'>
      <div className='FlexRow CenterAlign' style={{ justifyContent: 'space-between', margin: ' 0.5rem' }}>
        <div className='NoTextCursor' style={{ color: 'white', fontSize: '1.25rem', borderRadius: '0.2rem', padding: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden' }}>
          Create
        </div>
      </div>
      <div className='FlexRow SpaceEvenly'>
        <CreatorButton
          buttonName='Server'
          onClick={() => setOpenServerDialog(!openServerDialog)}
        />
        <CreatorButton
          buttonName='Deployment'
          onClick={() => setOpenDeploymentsDialog(!openDeploymentsDialog)}
        />
        <CreatorButton
          buttonName='Build'
          onClick={() => setOpenBuildsDialog(!openBuildsDialog)}
        />
        <ServerCreatorMenu 
          showDialog={openServerDialog} 
          closeDialog={() => setOpenServerDialog(false)} 
          maybeCloseSidebar={maybeCloseSidebar}
        />
        <DeploymentCreatorMenu 
          showDialog={openDeploymentsDialog} 
          closeDialog={() => setOpenDeploymentsDialog(false)}
          maybeCloseSidebar={maybeCloseSidebar}
        />
        <BuildCreatorMenu 
          showDialog={openBuildsDialog} 
          closeDialog={() => setOpenBuildsDialog(false)}
          maybeCloseSidebar={maybeCloseSidebar}
        />
      </div>
    </div>
  )
}

export default CreatorButtons
