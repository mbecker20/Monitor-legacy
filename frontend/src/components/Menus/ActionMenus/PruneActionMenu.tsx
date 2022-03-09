import { useState } from "react";
import { PRUNE_SERVER } from "../../../state/servers";
import { sendOverRootWS } from "../../../state/sockets";
import ActionMenu, { ActionMenuType } from "./BaseActionMenu";

function PruneActionMenu({
  showDialog,
  closeDialog,
  serverID,
}: ActionMenuType & { serverID: string }) {
  const [note, setNote] = useState("");
  return (
    <ActionMenu
      title="Prune Server"
      icon="cut"
      confirmIntent="success"
      showDialog={showDialog}
      closeDialog={() => {
        closeDialog();
        setNote("");
      }}
      onConfirm={() => sendOverRootWS(PRUNE_SERVER, { serverID, note })}
      note={note}
      setNote={setNote}
      confirmText="Prune"
    />
  );
}

export default PruneActionMenu;
