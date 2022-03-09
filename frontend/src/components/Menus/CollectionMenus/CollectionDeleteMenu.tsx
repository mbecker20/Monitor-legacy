import { Button, Classes, Dialog, InputGroup } from "@blueprintjs/core";
import { useState } from "react";
import { select, useFullSelector } from "../../..";
import Conditional from "../../../kbin-blueprint/Conditional";
import { DELETE_COLLECTION } from "../../../state/collections";
import { sendOverRootWS } from "../../../state/sockets";

function CollectionDeleteMenu({
  showDialog,
  closeDialog,
  collectionID,
}: {
  showDialog: boolean
  closeDialog: () => void
  collectionID: string
}) {
  const [name, setName] = useState("");
  const { collections } = useFullSelector();
  const onClose = () => {
    closeDialog();
    setName("");
  };
  const onClick = () => {
    sendOverRootWS(DELETE_COLLECTION, { collectionID });
    // createToast("Delete Collection Request Sent", "warning");
    onClose();
  }

  return (
    <Dialog
      isOpen={showDialog}
      onClose={onClose}
      title={`Delete ${select(
        ({ collections }) => collections[collectionID].name
      )}`}
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
          Enter the name of this collection below to delete it.
        </div>
        <div className="ConfigItem">
          <InputGroup
            placeholder="Enter Collection Name Here"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="ConfigTextInput"
            onKeyDown={(e) => {
              if (e.key === "Enter") onClick();
            }}
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
        <Conditional showIf={name === collections[collectionID].name}>
          <Button
            rightIcon="confirm"
            intent="danger"
            onClick={onClick}
          >
            Delete
          </Button>
        </Conditional>
      </div>
    </Dialog>
  );
}

export default CollectionDeleteMenu