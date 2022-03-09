import { useState } from "react";
import { DELETE_CONTAINER } from "../../../state/deployments";
import { sendOverRootWS } from "../../../state/sockets";
import ActionMenu, { ActionMenuType } from "./BaseActionMenu";

function DeleteActionMenu({ showDialog, closeDialog, deploymentID }: ActionMenuType & { deploymentID: string }) {
  const [note, setNote] = useState('')
  return (
    <ActionMenu
      title='Delete Container'
      icon='trash'
      confirmIntent='danger'
      showDialog={showDialog}
      closeDialog={() => { closeDialog(); setNote('') }}
      onConfirm={() => sendOverRootWS(DELETE_CONTAINER, { deploymentID, note })}
      note={note}
      setNote={setNote}
      confirmText='Delete'
    />
  )
}

export default DeleteActionMenu