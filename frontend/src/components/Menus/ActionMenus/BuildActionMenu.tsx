import { useState } from "react";
import { BUILD } from "../../../state/builds";
import { sendOverRootWS } from "../../../state/sockets";
import ActionMenu, { ActionMenuType } from "./BaseActionMenu";

function BuildActionMenu({ showDialog, closeDialog, buildID }: ActionMenuType & { buildID: string }) {
  const [note, setNote] = useState('')
  return (
    <ActionMenu
      title='Build Image'
      icon='build'
      confirmIntent='success'
      showDialog={showDialog}
      closeDialog={() => { closeDialog(); setNote('') }}
      onConfirm={() => sendOverRootWS(BUILD, { buildID, note })}
      note={note}
      setNote={setNote}
      confirmText='Build'
    />
  )
}

export default BuildActionMenu