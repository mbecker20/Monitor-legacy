import { Button, Classes, Dialog, InputGroup } from "@blueprintjs/core";
import { useState } from "react";
import { select } from "../../.."
import { createToast } from "../../../helpers/toaster";
import { CREATE_COLLECTION } from "../../../state/collections";
import { sendOverRootWS } from "../../../state/sockets";

function CollectionCreatorMenu({
  showDialog,
  closeDialog,
}: {
  showDialog: boolean;
  closeDialog: () => void;
}) {

  const [name, setName] = useState('')
  return (
    <Dialog
      isOpen={showDialog}
      onClose={() => {
        closeDialog();
        setName("");
      }}
      title="Create New Collection"
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
          <div>Collection Name:</div>
          <InputGroup
            placeholder="Name This Collection"
            onChange={(e) => setName(e.target.value)}
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
        <Button
          rightIcon="confirm"
          intent="success"
          onClick={() => {
            const collections = select((state) => state.collections);
            if (name.length === 0) {
              createToast("Name Too Short", "danger");
            } else if (
              Object.keys(collections)
                .map((key) => collections[key].name)
                .includes(name)
            ) {
              createToast("Name Already Taken", "danger");
            } else {
              sendOverRootWS(CREATE_COLLECTION, { name });
              // createToast("Create Collection Request Sent", "warning");
              closeDialog();
              setName('');
            }
          }}
        >
          Create New Collection
        </Button>
      </div>
    </Dialog>
  );
}

export default CollectionCreatorMenu