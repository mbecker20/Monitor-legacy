import { Button, Classes, Dialog, EditableText } from "@blueprintjs/core"
import { useState } from "react"
import { select, useFullSelector } from "../../.."
import Conditional from "../../../kbin-blueprint/Conditional"
import { DELETE_DEPLOYMENT } from "../../../state/deployments"
import { sendOverRootWS } from "../../../state/sockets"

function DeploymentDeleteMenu({ showDialog, closeDialog, deploymentID }: { showDialog: boolean, closeDialog: () => void, deploymentID: string}) {
  
  const [name, setName] = useState('')
  const { deployments } = useFullSelector()
  const onClose = () => {
    closeDialog()
    setName('')
  }

  return (
    <Dialog
      isOpen={showDialog}
      onClose={closeDialog}
      title={`Delete ${select(
        ({ deployments }) => deployments[deploymentID].name
      )}`}
      //icon='trash'
      usePortal={true}
      className="bp3-dark"
    >
      <div
        className={Classes.DIALOG_BODY}
        style={{
          marginBottom: "1rem",
          backgroundColor: "var(--gray3)",
          maxHeight: "fit-content",
          overflowY: "scroll",
        }}
      >
        <div className="ConfigItem">
          Enter the name of this deployment below to delete it.
        </div>
        <div className="ConfigItem">
          <EditableText
            placeholder="Enter Deployment Name Here"
            value={name}
            onChange={(name) => setName(name)}
            className="ConfigTextInput"
          />
        </div>
      </div>
      <div
        className={Classes.DIALOG_FOOTER}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Conditional showIf={name === deployments[deploymentID].name}>
          <Button
            rightIcon="confirm"
            intent="danger"
            onClick={() => {
              sendOverRootWS(DELETE_DEPLOYMENT, { deploymentID });
              onClose();
            }}
          >
            Delete
          </Button>
        </Conditional>
      </div>
    </Dialog>
  );
}

export default DeploymentDeleteMenu