import { useState } from "react";
import { STOP_CONTAINER } from "../../../state/deployments";
import { sendOverRootWS } from "../../../state/sockets";
import ActionMenu, { ActionMenuType } from "./BaseActionMenu";

export function StopActionMenu({ showDialog, closeDialog, deploymentID }: ActionMenuType & { deploymentID: string }) {
  const [note, setNote] = useState('')
  return (
    <ActionMenu
      title='Stop Container'
      icon='pause'
      confirmIntent='warning'
      showDialog={showDialog}
      closeDialog={() => { closeDialog(); setNote('') }}
      onConfirm={() => sendOverRootWS(STOP_CONTAINER, { deploymentID, note })}
      note={note}
      setNote={setNote}
      confirmText='Stop'
    />
  )
}