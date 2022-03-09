import { useState } from "react";
import { REDEPLOY } from "../../../state/deployments";
import { sendOverRootWS } from "../../../state/sockets";
import ActionMenu, { ActionMenuType } from "./BaseActionMenu";

function RedeployActionMenu({ showDialog, closeDialog, deploymentID }: ActionMenuType & { deploymentID: string }) {
  const [note, setNote] = useState('')
  return (
    <ActionMenu
      title='Redeploy Container'
      icon='reset'
      confirmIntent='success'
      showDialog={showDialog}
      closeDialog={() => { closeDialog(); setNote('') }}
      onConfirm={() => sendOverRootWS(REDEPLOY, { deploymentID, note })}
      note={note}
      setNote={setNote}
      confirmText='Redeploy'
    />
  )
}

export default RedeployActionMenu