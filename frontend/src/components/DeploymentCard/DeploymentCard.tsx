import { Button, Icon, Tab, Tabs } from '@blueprintjs/core'
import { Tooltip2 } from '@blueprintjs/popover2'
import { useState } from 'react'
import LogCard from './LogCard/LogCard'
import { navigate, select, useFullSelector } from '../../index'
import './DeploymentCard.css'
import DeploymentUpdatesCard from './DeploymentUpdatesCard/DeploymentUpdatesCard'
import DeploymentActionsCard from './DeploymentActionsCard/DeploymentActionsCard'
import DeploymentConfigCard from './DeploymentConfigCard/DeploymentConfigCard'
import Conditional from '../../kbin-blueprint/Conditional'
import DeploymentDeleteMenu from '../Menus/DeleteMenus/DeploymentDeleteMenu'
import { getIDFromName } from '../../helpers/general'
import { getDeploymentStatus, getDeploymentStatusColor } from '../../helpers/statusColors'

function DeploymentCard({ deploymentID, width } : { deploymentID: string, width: number}) {
  const [showConfig, setShowConfig] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { containerLog, allContainerStatus, deployments, servers, subbedUpdates, user } = useFullSelector()
  const deployment = deployments[deploymentID]
  if (!deployment) {
    navigate('/')
    return <div />
  }
  const { name, containerName } = deployment;
  const status = allContainerStatus[containerName];
  const showLog = status && status !== "not created";
  
  if (width > 1000 ) {
    return (
      <div className={showLog ? "MainLayout" : "MainLayoutLogless"}>
        <div className="GridLeftContainer">
          <div
            className={showLog ? "GridLeftContent" : "GridLeftContentLogless"}
          >
            <div className="DeploymentHeader">
              <div className="DeploymentTitle">{name}</div>
              <div className="DeploymentIcons">
                <Tooltip2
                  content={getDeploymentStatus(deployment, status)}
                  placement="bottom"
                >
                  <Icon
                    icon="full-circle"
                    iconSize={16}
                    style={{
                      color: getDeploymentStatusColor(deployment, status),
                      marginRight: "0.5rem",
                    }}
                  />
                </Tooltip2>
                <Conditional showIf={user.permissions >= 1}>
                  <Button
                    icon="cog"
                    large
                    intent={showConfig ? "primary" : "none"}
                    minimal
                    onClick={() => setShowConfig(!showConfig)}
                    className="bp3-dark"
                  />
                  <Button
                    icon="trash"
                    large
                    intent="danger"
                    minimal
                    onClick={() => setShowDeleteDialog(!showDeleteDialog)}
                    className="bp3-dark"
                  />
                  <DeploymentDeleteMenu
                    showDialog={showDeleteDialog}
                    closeDialog={() => setShowDeleteDialog(!showDeleteDialog)}
                    deploymentID={deploymentID}
                  />
                </Conditional>
              </div>
            </div>
            <DeploymentConfigCard
              deploymentID={deploymentID}
              isOpen={showConfig}
            />
            <Conditional showIf={user.permissions >= 1}>
              <DeploymentActionsCard
                deploymentID={deploymentID}
                status={status}
                serverStatus={servers[deployment.serverID].status}
              />
            </Conditional>
            <DeploymentUpdatesCard updates={subbedUpdates} />
          </div>
        </div>
        <div className={showLog ? "GridRightContent" : ""}>
          {showLog === true && (
            <LogCard deploymentID={deploymentID} containerLog={containerLog} />
          )}
        </div>
      </div>
    );
  } else {
    return (
      <Tabs>
        <Tab
          id="deployment"
          title="Deployment"
          className="DCTabs"
          panel={
            <div className="GridLeftMobile">
              <div className="DeploymentHeader">
                <div className="DeploymentTitle">{name}</div>
                <div className="DeploymentIcons">
                  <Tooltip2
                    content={getDeploymentStatus(deployment, status)}
                    placement="bottom"
                  >
                    <Icon
                      icon="full-circle"
                      iconSize={16}
                      style={{
                        color: getDeploymentStatusColor(deployment, status),
                        marginRight: "0.5rem",
                      }}
                    />
                  </Tooltip2>
                  <Conditional showIf={user.permissions >= 1}>
                    <Button
                      icon="cog"
                      large
                      intent={showConfig ? "primary" : "none"}
                      minimal
                      onClick={() => setShowConfig(!showConfig)}
                      className="bp3-dark"
                    />
                    <Button
                      icon="trash"
                      large
                      intent="danger"
                      minimal
                      onClick={() => setShowDeleteDialog(!showDeleteDialog)}
                      className="bp3-dark"
                    />
                    <DeploymentDeleteMenu
                      showDialog={showDeleteDialog}
                      closeDialog={() => setShowDeleteDialog(!showDeleteDialog)}
                      deploymentID={deploymentID}
                    />
                  </Conditional>
                </div>
              </div>
              <DeploymentConfigCard
                deploymentID={deploymentID}
                isOpen={showConfig}
              />
              <Conditional showIf={user.permissions >= 1}>
                <DeploymentActionsCard
                  deploymentID={deploymentID}
                  status={status}
                  serverStatus={ servers[deployment.serverID].status }
                />
              </Conditional>
              <DeploymentUpdatesCard updates={subbedUpdates} />
            </div>
          }
        />
        <Tab
          id="log"
          title="Log"
          className="DCTabs"
          panel={
            <div className="GridRightContent" style={{ width: "100%" }}>
              {showLog === true && (
                <LogCard
                  deploymentID={deploymentID}
                  containerLog={containerLog}
                />
              )}
            </div>
          }
        />
      </Tabs>
    );
  }
}

export const deploymentPage = (name: string, {width}: {width: number}) => <DeploymentCard width={width} deploymentID={getIDFromName(name, select(state => state.deployments))} />

export default DeploymentCard
