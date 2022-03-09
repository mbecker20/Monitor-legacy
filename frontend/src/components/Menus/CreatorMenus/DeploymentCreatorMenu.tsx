import { Button, Classes, Dialog, EditableText } from "@blueprintjs/core"
import { Select } from "@blueprintjs/select"
import { roughStringsEqual } from "kbin-state"
import { useEffect, useMemo, useState } from "react"
import { select, useFullSelector } from "../../../index"
import { renderConfig } from "../../../helpers/selector"
import { createToast } from "../../../helpers/toaster"
import { CREATE_DEPLOYMENT } from "../../../state/deployments"
import { sendOverRootWS } from "../../../state/sockets"
import { Deployment, ProtoDeployment } from "../../../state/types/deployment"

function newDeployment(): ProtoDeployment {
  return {
    name: '',
    serverID: '',
    owner: select(state => state.user.username)
  }
}

function DeploymentCreatorMenu({ 
  showDialog, closeDialog, maybeCloseSidebar
} : { 
  showDialog: boolean
  closeDialog: () => void
  maybeCloseSidebar: () => void
}) {
  const [deployment, setDeployment] = useState(newDeployment())
  return (
    <Dialog
      isOpen={showDialog}
      onClose={() => {
        closeDialog()
        setDeployment(newDeployment())
      }}
      title='Create New Deployment'
      //icon='add'
      className="bp3-dark"
    >
      <div
        className={Classes.DIALOG_BODY}
        style={{
          marginBottom: '1rem',
          backgroundColor: "var(--gray3)",
          maxHeight: "fit-content",
          overflowY: "scroll",
        }}
      >
        <div className='ConfigItem'>
          <div>
            Deployment Name:
          </div>
          <EditableText 
            placeholder='Name This Deployment' 
            //value={deployment.name}
            onChange={name => setDeployment({ ...deployment, name })}
          />
        </div>
        <div className='ConfigItem'>
          <div>
            Select Server:
          </div>
          <ServerSelector 
            deployment={deployment}
            setDeployment={setDeployment}
            showDialog={showDialog}
          />
        </div>
        <div className='ConfigItem'>
          <div>
            Copy Env From:
          </div>
          <EnvSelector 
            deployment={deployment}
            setDeployment={setDeployment}
            showDialog={showDialog}
          />
        </div>
      </div>
      <div className={Classes.DIALOG_FOOTER} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
        <Button 
          rightIcon='confirm' 
          intent='success' 
          onClick={() => {
            const deployments = select(state => state.deployments)
            if (deployment.name.length === 0) {
              createToast('Name Too Short', 'danger')
            } else if (Object.keys(deployments).map(key => deployments[key].name).includes(deployment.name)) {
              createToast('Name Already Taken', 'danger')
            } else if (deployment.serverID.length === 0) {
              createToast('Select A Server', 'danger')
            } else {
              sendOverRootWS(CREATE_DEPLOYMENT, { deployment })
              // createToast('Add Deployment Request Sent', 'warning')
              closeDialog()
              maybeCloseSidebar()
              setDeployment(newDeployment())
            }
          }}
        >
          Create New Deployment
        </Button>
      </div>
    </Dialog>
  )
}

export default DeploymentCreatorMenu


function ServerSelector({
  deployment, setDeployment, showDialog
} : {
  deployment: ProtoDeployment
  setDeployment: (deployment: ProtoDeployment) => void
  showDialog: boolean
}) {
  const { servers } = useFullSelector()
  const items = Object.values(servers).map(server => ({...server, title: server.name}))
  const [queryItems, setQueryItems] = useState(items)
  const [selectedServer, setSelectedServer] = useState('')
  useEffect(() => {
    if (!showDialog) setQueryItems(items)
  }, [showDialog, items])

  return(
    <Select
      items={queryItems}
      itemRenderer={renderConfig as any}
      onItemSelect={item => {
        setDeployment({ ...deployment, serverID: item._id })
        setSelectedServer(item.name)
      }}
      popoverProps={{ className: 'bp3-dark' }}
      onQueryChange={query => setQueryItems(items.filter(({ title }) => roughStringsEqual(query, title)))}
    >
      <Button 
        text={deployment.serverID ? selectedServer : 'None' }
        rightIcon='caret-down'
      />
    </Select>
  )
}

function EnvSelector({
  deployment, setDeployment, showDialog
} : {
  deployment: ProtoDeployment
  setDeployment: (deployment: ProtoDeployment) => void
  showDialog: boolean
}) {
  const { deployments } = useFullSelector()
  const items = useMemo(() => [{ title: 'None' }, ...Object.values(deployments)
    .filter(deployment => deployment.environment && deployment.environment.length > 0)
    .map(deployment => ({...deployment, title: deployment.name}))], [deployments])
  const [queryItems, setQueryItems] = useState(items)
  const [selectedDeployment, setSelectedDeployment] = useState('')
  useEffect(() => {
    if (!showDialog) setQueryItems(items)
  }, [showDialog, items])

  return(
    <Select
      items={queryItems}
      itemRenderer={renderConfig as any}
      onItemSelect={item => {
        if (item.title === 'None') {
          setDeployment({ ...deployment, environment: [] })
          setSelectedDeployment('None')
        } else {
          setDeployment({ ...deployment, environment: (item as Deployment).environment })
          setSelectedDeployment((item as Deployment).name)
        }
      }}
      popoverProps={{ className: 'bp3-dark' }}
      onQueryChange={query => setQueryItems(items.filter(({ title }) => roughStringsEqual(query, title)))}
    >
      <Button 
        text={selectedDeployment ? selectedDeployment : 'None' }
        rightIcon='caret-down'
      />
    </Select>
  )
}