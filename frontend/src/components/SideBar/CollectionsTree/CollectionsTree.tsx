import { Tree, Button, Icon } from "@blueprintjs/core"
import { dispatch, useFullSelector } from "../../../index";
import './CollectionsTree.css'
import { useState } from "react";
import { navigateToDeployment } from "../../../state/deployments";
import { REMOVE_FROM_COLLECTION, toggleColTree } from "../../../state/collections";
import { getDeploymentStatusColor } from "../../../helpers/statusColors";
import CollectionCreatorMenu from "../../Menus/CollectionMenus/CollectionCreatorMenu";
import CollectionDeleteMenu from "../../Menus/CollectionMenus/CollectionDeleteMenu";
import { Tooltip2 } from "@blueprintjs/popover2";
import { sendOverRootWS } from "../../../state/sockets";

function CollectionsTree({ width, closeSidebar }: { width: number, closeSidebar: () => void }) {
  const { deployments, collections, allContainerStatus, servers } = useFullSelector()
  const [creatorMenuOpen, setCreatorMenuOpen] = useState(false)
  const [deleteMenuOpen, setDeleteMenuOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const onExpandCollapse = (node: any) => {
    if (node.className === 'Collection') {
      dispatch(toggleColTree(node.id))
      setEditMode(false)
    } else {
      navigateToDeployment(node.id)
      if (width <= 1000) closeSidebar()
    }
  }

  return (
    <div className="TreeContainer" style={{ marginBottom: "1rem" }}>
      <div
        className="FlexRow CenterAlign"
        style={{
          justifyContent: "space-between",
          margin: "0.5rem",
          whiteSpace: "nowrap",
        }}
      >
        <div
          className="NoTextCursor"
          style={{
            color: "white",
            fontSize: "1.25rem",
            borderRadius: "0.2rem",
            padding: "0.5rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          Collections
        </div>
        <Button
          icon="add"
          intent="success"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setCreatorMenuOpen(!creatorMenuOpen);
          }}
        />
        <CollectionCreatorMenu
          showDialog={creatorMenuOpen}
          closeDialog={() => setCreatorMenuOpen(!creatorMenuOpen)}
        />
      </div>
      <Tree
        className="CollectionsTree"
        onNodeClick={onExpandCollapse}
        onNodeExpand={onExpandCollapse}
        onNodeCollapse={onExpandCollapse}
        contents={Object.keys(collections).map((collectionID) => ({
          id: collectionID,
          label: (
            <div className="Collection Pointer">
              <div className="FlexRow SpaceBetween">
                <div>{collections[collectionID].name}</div>
                <div style={{display: 'flex'}}>
                  <Icon 
                    intent='primary'
                    icon='edit'
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditMode(!editMode);
                    }}
                    style={{marginRight: "1rem"}}
                  />
                  <Icon
                    intent="danger"
                    icon="trash"
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteMenuOpen(!deleteMenuOpen);
                    }}
                  />
                </div>
                <CollectionDeleteMenu
                  showDialog={deleteMenuOpen}
                  closeDialog={() => setDeleteMenuOpen(false)}
                  collectionID={collectionID}
                />
              </div>
            </div>
          ),
          className: "Collection",
          isExpanded: collections[collectionID].expanded,
          hasCarat: false,
          childNodes: collections[collectionID].deploymentIDs
            .filter((id) => deployments[id])
            .map((deploymentID) => {
              return {
                icon: editMode ? (
                  <Icon
                    icon="delete"
                    intent='danger'
                    className="Pointer DeleteIcon"
                    onClick={(e) => {
                      e.stopPropagation();
                      sendOverRootWS(REMOVE_FROM_COLLECTION, {
                        deploymentID,
                        collectionID,
                      });
                    }}
                    style={{marginRight: '0.5rem'}}
                    iconSize={14}
                  />
                ) : undefined,
                id: deploymentID,
                label: (
                  <div className="Deployment Pointer">
                    {deployments[deploymentID].name}
                    <Tooltip2
                      content={`${
                        servers[deployments[deploymentID].serverID].name
                      }`}
                    >
                      <Icon
                        icon="full-circle"
                        iconSize={12}
                        style={{
                          color: getDeploymentStatusColor(
                            deployments[deploymentID],
                            allContainerStatus[
                              deployments[deploymentID].containerName
                            ]
                          ),
                        }}
                      />
                    </Tooltip2>
                  </div>
                ),
              };
            }),
        }))}
      />
    </div>
  );
}

export default CollectionsTree
