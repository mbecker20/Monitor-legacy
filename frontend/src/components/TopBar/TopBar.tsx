import { Button, Icon, Intent } from '@blueprintjs/core'
import './TopBar.css'
import { Popover2 } from '@blueprintjs/popover2'
import { dispatch, logout, navigate, useFullSelector } from '../../index';
import { Tooltip2 } from '@blueprintjs/popover2'
import { Fragment, useState } from 'react'
import { useEscapeToClose } from '../../helpers/hooks'
import Conditional from '../../kbin-blueprint/Conditional'
import { sendOverRootWS } from '../../state/sockets';
import GlobalUpdates from './GlobalUpdatesCard/GlobalUpdates';
import { switchSubAction } from '../../state/updates';
import { GET_CONTAINER_LOG } from '../../state/containers';

function TopBar({ toggleSidebar, width, onSearchClick }: { toggleSidebar: () => void, width: number, onSearchClick: () => void }) {
  const [updatesOpen, setUpdatesOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false) // the result / command menus
  useEscapeToClose(() => {
    if (!menuOpen) setUpdatesOpen(false)
  })
  const [refreshing, setRefreshing] = useState(false)
  const { allContainerStatus, deployments, subbed } = useFullSelector()
  let showLog = false
  if (subbed.type === 'deployment') {
    const status = allContainerStatus[deployments[subbed.id].containerName];
    showLog = status && status !== "not created";
  }
  return (
    <Fragment>
      <div className="TopBar">
        <div className="FlexRow CenterAlign">
          <div
            className="TopBarIcons"
            style={{ padding: width > 1000 ? "0rem 1rem" : "0rem" }}
          >
            <Button icon="menu" onClick={toggleSidebar} large minimal />
          </div>
          <div 
            className="TopBarHeader Pointer" 
            onClick={() => {
              dispatch(switchSubAction('', undefined))
              navigate('/')
            }}
          >
            <img
              src="/logo/logoHText.png"
              alt="Monitor"
              className="TopBarLogo"
            />
          </div>
        </div>
        <div
          className="TopBarIcons"
          style={{ padding: width > 1000 ? "0rem 1rem" : "0rem" }}
        >
          <Tooltip2 content="Search" position="bottom" className="bp3-dark">
            <Button
              icon="search"
              intent={Intent.PRIMARY}
              onClick={onSearchClick}
              large
              minimal
              style={{
                margin: width > 1000 ? "0rem 0.5rem" : "0rem 0.15rem",
              }}
            />
          </Tooltip2>
          <Popover2
            className="bp3-dark"
            position="bottom"
            popoverClassName="UpdatesPopover"
            content={<GlobalUpdates setMenuOpen={setMenuOpen} />}
            isOpen={updatesOpen}
          >
            <Tooltip2 content="Updates" position="bottom">
              <Button
                icon="notifications"
                intent={Intent.PRIMARY}
                onClick={() => setUpdatesOpen(!updatesOpen)}
                large
                minimal
                style={{
                  margin: width > 1000 ? "0rem 0.5rem" : "0rem 0.15rem",
                }}
              />
            </Tooltip2>
          </Popover2>

          <Tooltip2
            content="Refresh Log"
            placement="bottom"
            className="bp3-dark"
          >
            <Button
              icon={
                <Icon
                  icon="refresh"
                  className={refreshing ? "Spinning" : undefined}
                />
              }
              intent={Intent.PRIMARY}
              disabled={!showLog}
              minimal
              large
              style={{ margin: width > 1000 ? "0rem 0.5rem" : "0rem 0.15rem" }}
              onClick={() => {
                if (showLog) {
                  setRefreshing(true)
                  sendOverRootWS(GET_CONTAINER_LOG, { deploymentID: subbed.id })
                  window.setTimeout(() => setRefreshing(false), 2000)
                }
              }}
            />
          </Tooltip2>

          <Popover2
            className="bp3-dark"
            position="bottom"
            popoverClassName="LogoutPopover"
            content={
              <div
                className="FlexCol CenterAlign"
                style={{ padding: "1rem", width: "8rem" }}
              >
                <div style={{ marginBottom: "1rem" }}>Are You Sure?</div>
                <Button intent={Intent.DANGER} onClick={logout}>
                  Log Out
                </Button>
              </div>
            }
          >
            <Tooltip2 content="Logout" placement="bottom">
              <Button
                icon="log-out"
                intent={Intent.DANGER}
                large
                minimal
                style={{
                  margin: width > 1000 ? "0rem 0.5rem" : "0rem 0.15rem",
                }}
              />
            </Tooltip2>
          </Popover2>
        </div>
      </div>
      <Conditional showIf={updatesOpen}>
        <div
          className="UpdatesPopoverBG"
          onClick={() => setUpdatesOpen(false)}
        />
      </Conditional>
    </Fragment>
  );
}

export default TopBar