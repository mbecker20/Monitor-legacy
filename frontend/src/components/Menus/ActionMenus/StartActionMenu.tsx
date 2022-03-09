import { useState } from "react"
import { START_CONTAINER } from "../../../state/deployments";
import { sendOverRootWS } from "../../../state/sockets";
import ActionMenu, { ActionMenuType } from "./BaseActionMenu"

function StartActionMenu({ showDialog, closeDialog, deploymentID }: ActionMenuType & { deploymentID: string }) {
  const [note, setNote] = useState('')
  return (
    <ActionMenu
      title='Start Container'
      icon='play'
      confirmIntent='success'
      showDialog={showDialog}
      closeDialog={() => { closeDialog(); setNote('') }}
      onConfirm={() => sendOverRootWS(START_CONTAINER, { deploymentID, note })}
      note={note}
      setNote={setNote}
      confirmText='Start'
    />
  )
}

export default StartActionMenu