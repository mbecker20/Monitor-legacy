import { Button } from '@blueprintjs/core'
import { useState } from 'react'
import BuildCreatorMenu from '../../Menus/CreatorMenus/BuildCreatorMenu'
import DeploymentCreatorMenu from '../../Menus/CreatorMenus/DeploymentCreatorMenu'
import ServerCreatorMenu from '../../Menus/CreatorMenus/ServerCreatorMenu'
import './CreatorButtons.css'

function CreatorButton({buttonName, onClick} : {buttonName: string, onClick: () => void}) {
  return(
    <Button
      //rightIcon='add'
      intent='success'
      outlined
      onClick={onClick}
    >
      {buttonName}
    </Button>
  )
}

function CreatorButtons() {
  const [openServerDialog, setOpenServerDialog] = useState(false)
  const [openBuildsDialog, setOpenBuildsDialog] = useState(false)
  const [openDeploymentsDialog, setOpenDeploymentsDialog] = useState(false)
  const maybeCloseSidebar = () => {}

  return (
    <div className='CreatorButtonsContainer1'>
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
      <ServerCreatorMenu showDialog={openServerDialog} closeDialog={() => setOpenServerDialog(!openServerDialog)} maybeCloseSidebar={maybeCloseSidebar} />
      <DeploymentCreatorMenu showDialog={openDeploymentsDialog} closeDialog={() => setOpenDeploymentsDialog(!openDeploymentsDialog)} maybeCloseSidebar={maybeCloseSidebar} />
      <BuildCreatorMenu showDialog={openBuildsDialog} closeDialog={() => setOpenBuildsDialog(!openBuildsDialog)} maybeCloseSidebar={maybeCloseSidebar} />
    </div>
  )
}

export default CreatorButtons
