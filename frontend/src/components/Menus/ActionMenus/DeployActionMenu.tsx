import { useState } from "react";
import { DEPLOY } from "../../../state/deployments";
import { sendOverRootWS } from "../../../state/sockets";
import ActionMenu, { ActionMenuType } from "./BaseActionMenu";

function DeployActionMenu({
  showDialog,
  closeDialog,
  deploymentID,
}: ActionMenuType & { deploymentID: string }) {
  const [note, setNote] = useState("");
  return (
    <ActionMenu
      title="Deploy Container"
      icon="play"
      confirmIntent="success"
      showDialog={showDialog}
      closeDialog={() => {
        closeDialog();
        setNote("");
      }}
      onConfirm={() => sendOverRootWS(DEPLOY, { deploymentID, note })}
      note={note}
      setNote={setNote}
      confirmText="Deploy"
    />
  );
}

export default DeployActionMenu;
