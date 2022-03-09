import { Button, ButtonGroup, Spinner, SpinnerSize } from '@blueprintjs/core'
import { Tooltip2 } from '@blueprintjs/popover2'
import { Fragment, useState } from 'react';
import { useSelector } from '../../..';
import Conditional from '../../../kbin-blueprint/Conditional';
import IfElse from '../../../kbin-blueprint/IfElse';
import { ContainerStatus } from '../../../state/types/container';
import DeleteActionMenu from '../../Menus/ActionMenus/DeleteActionMenu';
import DeployActionMenu from '../../Menus/ActionMenus/DeployActionMenu';
import RedeployActionMenu from '../../Menus/ActionMenus/RedeployActionMenu';
import StartActionMenu from '../../Menus/ActionMenus/StartActionMenu';
import { StopActionMenu } from '../../Menus/ActionMenus/StopActionMenu';
import './DeploymentActionsCard.css'

function DeploymentActionsCard({
  deploymentID,
  status,
  serverStatus,
}: {
  deploymentID: string;
  status: ContainerStatus | "not created";
  serverStatus: string;
}) {
  const [openRedeployMenu, setOpenRedeployMenu] = useState(false);
  const [openDeleteMenu, setOpenDeleteMeu] = useState(false);
  const [openStartMenu, setOpenStartMenu] = useState(false);
  const [openStopMenu, setOpenStopMenu] = useState(false);
  const [openDeployMenu, setOpenDeployMenu] = useState(false);
  const containerExists = status && status !== "not created" ? true : false;
  const containerRunning = containerExists
    ? (status as ContainerStatus).State === "running"
      ? true
      : false
    : false;
  const deploying = useSelector((state) => state.deploying);
  return (
    <div className="InnerCard" style={{ gridArea: "actions" }}>
      <div className="InnerCardHeader"> Actions </div>
      <div className="ActionsBody">
        <div className="Action">
          <div className="ActionTitle"> Deploy </div>
          <IfElse
            showIf={containerExists}
            show={
              <ButtonGroup>
                <Tooltip2
                  content={
                    serverStatus === "OK" ? "Redeploy" : "Server Unreachable"
                  }
                  placement="top"
                >
                  <Button
                    icon={deploying ? undefined : "reset"}
                    intent="success"
                    large={true}
                    onClick={() => setOpenRedeployMenu(!openRedeployMenu)}
                    disabled={serverStatus === "OK" ? false : true}
                  >
                    {deploying ? (
                      <Spinner size={SpinnerSize.SMALL} />
                    ) : undefined}
                  </Button>
                </Tooltip2>
                <RedeployActionMenu
                  showDialog={openRedeployMenu}
                  closeDialog={() => setOpenRedeployMenu(!openRedeployMenu)}
                  deploymentID={deploymentID}
                />
                <Tooltip2
                  content={
                    serverStatus === "OK" ? "Delete" : "Server Unreachable"
                  }
                  placement="top"
                >
                  <Button
                    icon={deploying ? undefined : "trash"}
                    intent="danger"
                    large={true}
                    onClick={() => setOpenDeleteMeu(!openDeleteMenu)}
                    disabled={serverStatus === "OK" ? false : true}
                  >
                    {deploying ? (
                      <Spinner size={SpinnerSize.SMALL} />
                    ) : undefined}
                  </Button>
                </Tooltip2>
                <DeleteActionMenu
                  showDialog={openDeleteMenu}
                  closeDialog={() => setOpenDeleteMeu(!openDeleteMenu)}
                  deploymentID={deploymentID}
                />
              </ButtonGroup>
            }
            showElse={
              <Fragment>
                <Tooltip2
                  content={
                    serverStatus === "OK"
                      ? "Deploy Container"
                      : "Server Unreachable"
                  }
                  placement="top"
                >
                  <Button
                    icon={deploying ? undefined : "play"}
                    intent="success"
                    large={true}
                    onClick={() => setOpenDeployMenu(!openDeployMenu)}
                    disabled={serverStatus === "OK" ? false : true}
                  >
                    {deploying ? (
                      <Spinner size={SpinnerSize.SMALL} />
                    ) : undefined}
                  </Button>
                </Tooltip2>
                <DeployActionMenu
                  showDialog={openDeployMenu}
                  closeDialog={() => setOpenDeployMenu(!openDeployMenu)}
                  deploymentID={deploymentID}
                />
              </Fragment>
            }
          />
        </div>
        <Conditional showIf={containerExists}>
          <div className="Action">
            <div className="ActionTitle"> Container </div>
            <IfElse
              showIf={containerRunning}
              show={
                <Fragment>
                  <Tooltip2
                    content={
                      serverStatus === "OK"
                        ? "Stop Container"
                        : "Server Unreachable"
                    }
                    placement="top"
                  >
                    <Button
                      icon={deploying ? undefined : "pause"}
                      intent="warning"
                      large={true}
                      onClick={() => setOpenStopMenu(!openStopMenu)}
                      disabled={serverStatus === "OK" ? false : true}
                    >
                      {deploying ? (
                        <Spinner size={SpinnerSize.SMALL} />
                      ) : undefined}
                    </Button>
                  </Tooltip2>
                  <StopActionMenu
                    showDialog={openStopMenu}
                    closeDialog={() => setOpenStopMenu(!openStopMenu)}
                    deploymentID={deploymentID}
                  />
                </Fragment>
              }
              showElse={
                <Fragment>
                  <Tooltip2
                    content={
                      serverStatus === "OK"
                        ? "Start Container"
                        : "Server Unreachable"
                    }
                    placement="top"
                  >
                    <Button
                      icon={deploying ? undefined : "play"}
                      intent="success"
                      large={true}
                      onClick={() => setOpenStartMenu(!openStartMenu)}
                      disabled={serverStatus === "OK" ? false : true}
                    >
                      {deploying ? (
                        <Spinner size={SpinnerSize.SMALL} />
                      ) : undefined}
                    </Button>
                  </Tooltip2>
                  <StartActionMenu
                    showDialog={openStartMenu}
                    closeDialog={() => setOpenStartMenu(!openStartMenu)}
                    deploymentID={deploymentID}
                  />
                </Fragment>
              }
            />
          </div>
        </Conditional>
      </div>
    </div>
  );
}

export default DeploymentActionsCard
