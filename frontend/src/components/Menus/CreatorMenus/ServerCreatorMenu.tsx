import { Button, Classes, Dialog, EditableText } from "@blueprintjs/core";
import { useState } from "react";
import { select } from "../../..";
import { createToast } from "../../../helpers/toaster";
import { ADD_SERVER } from "../../../state/servers";
import { sendOverRootWS } from "../../../state/sockets";
import { ProtoServer } from "../../../state/types/server";
import './CreatorMenu.css'

function newServer(): ProtoServer {
  return {
    name: '',
    address: '',
    port: '6060',
    useHTTP: true,
    deploymentIDs: [],
    enabled: true
  }
}

function ServerCreatorMenu({ 
  showDialog, closeDialog, maybeCloseSidebar
} : { 
  showDialog: boolean
  closeDialog: () => void
  maybeCloseSidebar: () => void 
}) {
  const [server, setServer] = useState(newServer())
  return (
    <Dialog
      isOpen={showDialog}
      onClose={() => {
        closeDialog()
        setServer(newServer())
      }}
      title='Create New Server'
      //icon='add'
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
          <div>
            Server Name:
          </div>
          <EditableText 
            placeholder='Name This Server' 
            value={server.name}
            onChange={name => setServer({ ...server, name })}
          />
        </div>
        <div className='ConfigItem'>
          <div>
            Server IP Address:
            </div>
          <EditableText 
            placeholder='IP Address for this Server'
            value={server.address}
            onChange={address => setServer({ ...server, address })}
          />
        </div>
        <div className='ConfigItem'>
          <div>
            Server Port:
            </div>
          <EditableText 
            placeholder='6060'
            value={server.port}
            onChange={port => setServer({ ...server, port })}
          />
        </div>
      </div>
      <div className={Classes.DIALOG_FOOTER} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
        <Button 
          rightIcon='confirm' 
          intent='success' 
          onClick={() => {
            const servers = select(state => state.servers)
            if (server.name.length === 0) {
              createToast('Name Too Short', 'danger')
            } else if (Object.keys(servers).map(key => servers[key].name).includes(server.name)) {
              createToast('Name Already Taken', 'danger')
            } else if (server.address.length === 0) {
              createToast('Address Too Short', 'danger')
            } else {
              sendOverRootWS(ADD_SERVER, { server })
              // createToast('Add Server Request Sent', 'warning')
              closeDialog()
              maybeCloseSidebar()
              setServer(newServer())
            }
          }}
        >
          Add New Server
        </Button>
      </div>
    </Dialog>
  )
}

export default ServerCreatorMenu