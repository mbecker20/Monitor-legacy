import { Button, Tab, Tabs } from '@blueprintjs/core'
import { useState } from 'react'
import ConfigCard from './BuildConfigCard/BuildConfigCard'
import BuildUpdatesCard from './BuildUpdatesCard/BuildUpdatesCard'
import { navigate, select, useFullSelector } from '../../index'
import './BuildCard.css'
import BuildActionsCard from './BuildActionsCard/BuildActionsCard'
import Conditional from '../../kbin-blueprint/Conditional'
import BuildDeleteMenu from '../Menus/DeleteMenus/BuildDeleteMenu'
import { getIDFromName } from '../../helpers/general'

type Props = {
  buildID: string
  width: number
}

function BuildCard({ buildID, width }: Props) {
  const [showConfig, setShowConfig] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const toggleConfig = () => setShowConfig(!showConfig);
  const {
    builds,
    subbedUpdates,
    user
  } = useFullSelector();
  const build = builds[buildID]
  if (!build) {
    navigate('/')
    return <div/>
  }
  const { name, repoURL } = build;
  
  if (width > 1000) {
    return (
      <div className="MainLayout">
        <div className="GridLeftContainer">
          <div className="GridLeftContent">
            <div className="BuildHeader">
              <div className="BuildTitle">{name}</div>
              <div className="BuildIcons">
                <Conditional showIf={user.permissions >= 1}>
                  <Button
                    className="bp3-dark"
                    icon="cog"
                    intent={showConfig ? "primary" : "none"}
                    onClick={toggleConfig}
                    large
                    minimal
                  />
                  <Button
                    icon="trash"
                    large
                    intent="danger"
                    minimal
                    onClick={() => setShowDeleteDialog(!showDeleteDialog)}
                    className="bp3-dark"
                  />
                  <BuildDeleteMenu
                    showDialog={showDeleteDialog}
                    closeDialog={() => setShowDeleteDialog(!showDeleteDialog)}
                    buildID={buildID}
                  />
                </Conditional>
              </div>
            </div>
            <ConfigCard isOpen={showConfig} buildID={buildID} />
            <Conditional
              showIf={
                user.permissions >= 1 &&
                (repoURL && repoURL.length > 0 ? true : false)
              }
            >
              <BuildActionsCard buildID={buildID} />
            </Conditional>
            <BuildUpdatesCard updates={subbedUpdates} />
          </div>
        </div>

        <div className={"GridRightContent"}>
          <div> Deployments using this build </div>
        </div>
      </div>
    );
  } else {
    return (
      <Tabs>
        <Tab
          id="build"
          title="Build"
          className="DCTabs"
          panel={
            <div className="GridLeftContent">
              <div className="BuildHeader">
                <div className="BuildTitle">{name}</div>
                <div className="BuildIcons">
                  <Conditional showIf={user.permissions >= 1}>
                    <Button
                      className="bp3-dark"
                      icon="cog"
                      intent={showConfig ? "primary" : "none"}
                      onClick={toggleConfig}
                      large
                      minimal
                    />
                    <Button
                      icon="trash"
                      large
                      intent="danger"
                      minimal
                      onClick={() => setShowDeleteDialog(!showDeleteDialog)}
                      className="bp3-dark"
                    />
                    <BuildDeleteMenu
                      showDialog={showDeleteDialog}
                      closeDialog={() => setShowDeleteDialog(!showDeleteDialog)}
                      buildID={buildID}
                    />
                  </Conditional>
                </div>
              </div>
              <ConfigCard isOpen={showConfig} buildID={buildID} />
              <Conditional
                showIf={
                  user.permissions >= 1 &&
                  (repoURL && repoURL.length > 0 ? true : false)
                }
              >
                <BuildActionsCard buildID={buildID} />
              </Conditional>
              <BuildUpdatesCard updates={subbedUpdates} />
            </div>
          }
        />
        <Tab
          id="deploymentsOnBuild"
          title="Deployments Using This Build"
          className="DCTabs"
          panel={
            <div className={"GridRightContent"}>
              <div> Deployments using this build </div>
            </div>
          }
        />
      </Tabs>
    );
  }
}

export default BuildCard;

export const buildPage = (name: string, {width}: {width: number}) => <BuildCard width={width} buildID={getIDFromName(name, select(state => state.builds))} />

