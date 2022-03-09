import { Button, Icon, Tab, Tabs } from '@blueprintjs/core'
import { Tooltip2 } from '@blueprintjs/popover2'
import { navigate, select, useFullSelector } from '../../index'
import './ServerCard.css'
import ServerUpdatesCard from './ServerUpdatesCard/ServerUpdatesCard'
import { useState } from 'react'
import ServerDeleteMenu from '../Menus/DeleteMenus/ServerDeleteMenu'
import { getServerStatus, getServerStatusColor } from '../../helpers/statusColors'
import { getIDFromName } from '../../helpers/general'
import ServerConfigCard from './ServerConfigCard/ServerConfigCard'
import Conditional from '../../kbin-blueprint/Conditional'
import ServerActionsCard from './ServerActionsCard/ServerActionsCard'

type Props = {
  serverID: string
  width: number
}

function ServerCard({ serverID, width }: Props) {
  const [showConfig, setShowConfig] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const toggleConfig = () => setShowConfig(!showConfig)
  const { servers, allContainerStatus, deployments, user } = useFullSelector()
  const server = servers[serverID]
  if (!server) {
    navigate('/')
    return <div/>
  }
  const { name } = server

  if (width > 1000) {
    return (
      <div className={"ServerMainLayout"}>
        <div className="GridLeftContainer">
          <div className={"GridLeftContent"}>
            <div className="ServerHeader">
              <div className="ServerTitle">{name}</div>
              <div className="ServerIcons">
                <Tooltip2
                  content={`${getServerStatus(
                    server,
                    deployments,
                    allContainerStatus
                  )}`}
                  placement="bottom"
                >
                  <Icon
                    icon="full-circle"
                    iconSize={16}
                    style={{
                      color: getServerStatusColor(
                        server,
                        deployments,
                        allContainerStatus
                      ),
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
                    onClick={toggleConfig}
                    className="bp3-dark"
                  />
                  <Button
                    icon="trash"
                    large
                    intent="danger"
                    minimal
                    onClick={() => setShowDeleteDialog(true)}
                    className="bp3-dark"
                  />
                  <ServerDeleteMenu
                    showDialog={showDeleteDialog}
                    closeDialog={() => setShowDeleteDialog(false)}
                    serverID={serverID}
                  />
                </Conditional>
              </div>
            </div>
            <ServerConfigCard serverID={serverID} isOpen={showConfig} />
            <Conditional showIf={user.permissions >= 1}>
              <ServerActionsCard 
                serverID={serverID} 
                serverStatus={server.status}
              />
            </Conditional>
            <ServerUpdatesCard />
          </div>
        </div>
        <div className={"StackLayoutRight"}>Analytics</div>
      </div>
    );
  } else {
    return (
      <Tabs>
        <Tab
          id="sever"
          title="Server"
          className="DCTabs"
          panel={
            <div className="GridLeftContainer">
              <div className={"GridLeftContent"}>
                <div className="ServerHeader">
                  <div className="ServerTitle">{name}</div>
                  <div className="ServerIcons">
                    <Tooltip2
                      content={`${getServerStatus(
                        server,
                        deployments,
                        allContainerStatus
                      )}`}
                      placement="bottom"
                    >
                      <Icon
                        icon="full-circle"
                        iconSize={16}
                        style={{
                          color: getServerStatusColor(
                            server,
                            deployments,
                            allContainerStatus
                          ),
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
                        onClick={toggleConfig}
                        className="bp3-dark"
                      />
                      <Button
                        icon="trash"
                        large
                        intent="danger"
                        minimal
                        onClick={() => setShowDeleteDialog(true)}
                        className="bp3-dark"
                      />
                      <ServerDeleteMenu
                        showDialog={showDeleteDialog}
                        closeDialog={() => setShowDeleteDialog(false)}
                        serverID={serverID}
                      />
                    </Conditional>
                  </div>
                </div>
                <ServerConfigCard serverID={serverID} isOpen={showConfig} />
                <ServerUpdatesCard />
              </div>
            </div>
          }
        />
        <Tab
          id="analytics"
          title="Analytics"
          className="DCTabs"
          panel={<div className={"StackLayoutRight"}>Analytics</div>}
        />
      </Tabs>
    );
  }

  
}

export default ServerCard

export const serverPage = (name: string, {width}: {width: number}) => <ServerCard width={width} serverID={getIDFromName(name, select(state => state.servers))} />

