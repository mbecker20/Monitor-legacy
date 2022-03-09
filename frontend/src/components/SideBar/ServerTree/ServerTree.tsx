import { Tree, Icon } from "@blueprintjs/core"
import { dispatch, useFullSelector } from "../../../index";
import { navigateToServer, toggleServerTree } from "../../../state/servers";
import './ServerTree.css'
import { navigateToDeployment } from "../../../state/deployments";
import { useState } from "react";
import { Tooltip2 } from "@blueprintjs/popover2";
import { getDeploymentStatusColor, getServerStatusColor } from "../../../helpers/statusColors";
import CollectionMenu from "../../Menus/CollectionMenus/CollectionMenu";

const SERVER = 'SERVER'
const DEPLOYMENT = 'DEPLOYMENT'

function ServerTree({ width, closeSidebar }: { width: number, closeSidebar: () => void }) {
  const { servers, deployments, allContainerStatus, collections } = useFullSelector()
  const [deploymentID, setDeploymentID] = useState('')

  const onExpandCollapse = (node: any) => {
    if (node.type === SERVER) {
      dispatch(toggleServerTree(node.id));
    } else {
      navigateToDeployment(node.id)
      if (width <= 1000) closeSidebar()
    }
  }

  return (
    <div className="TreeContainer">
      {/* <div className='FlexRow CenterAlign' style={{ justifyContent: 'space-between', margin: '0.5rem' }}>
        <div className='NoTextCursor' style={{ color: 'white', fontSize: '1.25rem', borderRadius: '0.2rem', padding: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden' }}>
          Servers
        </div>
      </div> */}
      <Tree
        className="ServerTree"
        onNodeClick={onExpandCollapse}
        onNodeExpand={onExpandCollapse}
        onNodeCollapse={onExpandCollapse}
        contents={Object.keys(servers).map((serverID) => ({
          id: serverID,
          type: SERVER,
          label: (
            <div className="Server Pointer">
              <div
                className="FlexRow"
                style={{ justifyContent: "space-between" }}
              >
                {servers[serverID].name}
                <Tooltip2 content="Show Server Page">
                  <Icon
                    icon="full-circle"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToServer(serverID)
                      if (width <= 1000) closeSidebar()
                    }}
                    iconSize={18}
                    style={{
                      alignSelf: "center",
                      color: getServerStatusColor(
                        servers[serverID],
                        deployments,
                        allContainerStatus
                      ),
                    }}
                  />
                </Tooltip2>
              </div>
            </div>
          ),
          isExpanded: servers[serverID].expanded,
          className: "Server",
          childNodes: servers[serverID].deploymentIDs.map((deploymentID) => ({
            icon: (
              <Icon
                icon="pin"
                className='Pointer Pin'
                onClick={(e) => {
                  e.stopPropagation()
                  setDeploymentID(deploymentID)
                }}
              />
            ),
            id: deploymentID,
            type: DEPLOYMENT,
            label: (
              <div className="Deployment Pointer">
                {deployments[deploymentID].name}
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
              </div>
            ),
          })),
        }))}
      />
      <CollectionMenu
        showDialog={deploymentID.length > 0}
        closeDialog={() => setDeploymentID('')}
        deploymentID={deploymentID}
        collections={collections}
        deployments={deployments}
      />
    </div>
  );
}

export default ServerTree

