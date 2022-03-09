import { Button, Classes, Dialog, EditableText } from "@blueprintjs/core";
import { useState } from "react";
import { createToast } from "../../../helpers/toaster";
import { useFullSelector } from "../../../index";
import Conditional from "../../../kbin-blueprint/Conditional";
import { REMOVE_SERVER } from "../../../state/servers";
import { sendOverRootWS } from "../../../state/sockets";
import './DeleteMenu.css'

function ServerDeleteMenu({ 
  showDialog, closeDialog, serverID
}: { 
  showDialog: boolean
  closeDialog: () => void
  serverID: string
}) {
  const [name, setName] = useState('')
  const { servers } = useFullSelector()
  const onClose = () => {
    closeDialog()
    setName('')
  }
  return (
    <Dialog
      isOpen={showDialog}
      onClose={onClose}
      title={`Delete ${servers[serverID].name}`}
      usePortal={true}
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
          Enter the name of this server below to delete it and all of its child deployments.
        </div>
        <div className='ConfigItem'>
          <EditableText 
            placeholder='Type Server Name' 
            value={name}
            onChange={name => setName(name)}
            className='ConfigTextInput'
          />
        </div>
      </div>
      <Conditional showIf={name === servers[serverID].name}>
        <div className={Classes.DIALOG_FOOTER} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
          <Button
            rightIcon='confirm'
            intent='danger'
            onClick={() => {
              sendOverRootWS(REMOVE_SERVER, { serverID })
              createToast('Server Delete Request Sent', 'warning')
            }}
          >
            Delete
          </Button>
        </div>
      </Conditional>
    </Dialog>
  )
}

export default ServerDeleteMenu