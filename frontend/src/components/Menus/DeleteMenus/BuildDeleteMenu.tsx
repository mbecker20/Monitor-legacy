import { Button, Classes, Dialog, EditableText } from "@blueprintjs/core"
import { useState } from "react"
import { select, useFullSelector } from "../../../index"
import Conditional from "../../../kbin-blueprint/Conditional"
import { DELETE_BUILD } from "../../../state/builds"
import { sendOverRootWS } from "../../../state/sockets"
import './DeleteMenu.css'

function BuildDeleteMenu({ 
    showDialog, closeDialog, buildID 
}: { 
  showDialog: boolean
  closeDialog: () => void
  buildID: string
}) {
  const [name, setName] = useState('')
  const { builds } = useFullSelector()
  const onClose = () => {
    closeDialog()
    setName('')
  }
  return (
    <Dialog
      isOpen={showDialog}
      onClose={onClose}
      title={`Delete ${select(({ builds }) => builds[buildID].name)}`}
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
          Enter the name of this build below to delete it.
        </div>
        <div className='ConfigItem'>
          <EditableText 
            placeholder='Enter Build Name Here'
            value={name}
            onChange={name => setName(name)}
            className='ConfigTextInput'
          />
        </div>
      </div>
      <div className={Classes.DIALOG_FOOTER} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Conditional showIf={name === builds[buildID].name}>
            <Button
              rightIcon='confirm'
              intent='danger'
              onClick={() => {
                sendOverRootWS(DELETE_BUILD, { buildID })
                onClose()
              }}
            >
              Delete
            </Button>
        </Conditional>
      </div>
    </Dialog>
  )
}

export default BuildDeleteMenu