import { Button, Classes, Dialog } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import { roughStringsEqual } from "kbin-state";
import { useEffect, useMemo, useState } from "react";
import { renderConfig,  } from "../../../helpers/selector";
import { createToast } from "../../../helpers/toaster";
import { ADD_TO_COLLECTION } from "../../../state/collections";
import { sendOverRootWS } from "../../../state/sockets";
import { Collections } from "../../../state/types/collection";
import { Deployments } from "../../../state/types/deployment";

function CollectionMenu({ 
  showDialog, closeDialog, deploymentID, collections, deployments
} : { 
  showDialog: boolean
  closeDialog: () => void
  deploymentID: string
  collections: Collections
  deployments: Deployments
}) {
  const items = useMemo(() => Object.values(collections).map((collection) => ({
    ...collection,
    title: collection.name,
  })), [collections])
  const [queryItems, setQueryItems] = useState(items)
  const [collectionID, setCollectionID] = useState('')
  useEffect(() => {
    if (!showDialog) setQueryItems(items)
  }, [items, showDialog])
  return (
    <Dialog
      isOpen={showDialog}
      onClose={() => {
        closeDialog();
      }}
      title={`Add ${deployments[deploymentID]?.name} to Collection`}
      //icon='add'
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
          justifyContent: 'space-between',
          display: 'flex'
        }}
      >
        <Select
          items={queryItems}
          itemRenderer={renderConfig as any}
          onItemSelect={(item) => setCollectionID(item._id)}
          popoverProps={{ className: "bp3-dark" }}
          onQueryChange={(query) =>
            setQueryItems(
              items.filter(({ title }) => roughStringsEqual(query, title))
            )
          }
          resetOnClose
        >
          <Button intent="primary" rightIcon="chevron-down">
            {collectionID.length > 0
              ? collections[collectionID].name
              : "Select Collection"}
          </Button>
        </Select>
        <Button
          rightIcon="confirm"
          intent="success"
          onClick={() => {
            if (collectionID.length === 0) {
              createToast("Select a Collection", "danger");
            } else {
              sendOverRootWS(ADD_TO_COLLECTION, { deploymentID, collectionID });
              setCollectionID("")
              closeDialog()
            }
          }}
        >
          Confirm
        </Button>
      </div>
    </Dialog>
  );
}

export default CollectionMenu