import { Button } from '@blueprintjs/core'
import { Select } from '@blueprintjs/select'
import { useEffect, useState } from 'react';
import './DeploymentConfigCard.css'
import ImageCard from './ConfigCards/ImageCard';
import OptionsCard from './ConfigCards/OptionsCard';
import PortsCard from './ConfigCards/PortsCard';
import EnvCard from './ConfigCards/EnvCard';
import { roughStringsEqual } from 'kbin-state';
import { animated } from 'react-spring';
import { select } from '../../../index';
import VolumesCard from './ConfigCards/VolumesCard';
import { useConfigTransition } from '../../../helpers/spring';
import { ConfigItem, renderConfig } from '../../../helpers/selector';
import { useChangedState } from '../../../helpers/hooks';
import Conditional from '../../../kbin-blueprint/Conditional';
import { sendOverRootWS } from '../../../state/sockets';
import { UPDATE_DEPLOYMENT } from '../../../state/deployments';
import DeploymentConfigMenu from '../../Menus/ConfigMenus/DeploymentConfigMenu';

const DEFAULT_ITEMS: ConfigItem[] = [
  {title: 'Image'},
  {title: 'Env'},
  {title: 'Volumes'},
  {title: 'Ports'},
  {title: 'Options'}
]

function DeploymentConfigCard({ deploymentID, isOpen }: { deploymentID: string, isOpen: boolean }) {
  const [currentItem, setCurrentItem] = useState('Image')
  const [openConfigMenu, setOpenConfigMenu] = useState(false);
  const selectConfigItem = (item: ConfigItem) => {
    setCurrentItem(item.title)
  }
  const [queryItems, setQueryItems] = useState(DEFAULT_ITEMS)

  const [deployment, setDeployment, changed, resetChanged] = useChangedState(select(state => state.deployments[deploymentID]))

  //const [deployment, setDeployment, resetDeployment, isChanged] = useConfigState(select(state => state.deployments[deploymentID]))

  const transitions = useConfigTransition(isOpen)

  useEffect(() => {
    if (deploymentID !== deployment._id) {
      setDeployment(select(state => state.deployments[deploymentID]))
      resetChanged()
    }
  })

  return transitions(
    (styles, item) =>
      item && (
        <animated.div className="InnerCard" style={styles}>
          <div
            className="InnerCardHeader"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              overflow: "hidden",
            }}
          >
            Configure
            <Select
              items={queryItems}
              itemRenderer={renderConfig as any}
              onItemSelect={selectConfigItem}
              popoverProps={{ className: "bp3-dark" }}
              onQueryChange={(query) =>
                setQueryItems(
                  DEFAULT_ITEMS.filter(({ title }) =>
                    roughStringsEqual(query, title)
                  )
                )
              }
              resetOnClose
            >
              <Button intent="primary" rightIcon="chevron-down">
                {" "}
                {currentItem}{" "}
              </Button>
            </Select>
          </div>
          <div>
            {currentItem === "Image" && (
              <ImageCard
                deployment={deployment}
                setDeployment={setDeployment}
              />
            )}
            {currentItem === "Options" && (
              <OptionsCard
                deployment={deployment}
                setDeployment={setDeployment}
              />
            )}
            {currentItem === "Ports" && (
              <PortsCard
                deployment={deployment}
                setDeployment={setDeployment}
              />
            )}
            {currentItem === "Volumes" && (
              <VolumesCard
                deployment={deployment}
                setDeployment={setDeployment}
              />
            )}
            {currentItem === "Env" && (
              <EnvCard deployment={deployment} setDeployment={setDeployment} />
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              overflow: "hidden",
              marginTop: "1rem",
            }}
          >
            <Conditional showIf={changed}>
              <Button
                text="Discard"
                rightIcon="remove"
                intent="danger"
                onClick={() => {
                  setDeployment(
                    select(({ deployments }) => deployments[deploymentID])
                  );
                  resetChanged();
                }}
              />
              <Button
                text="Confirm"
                rightIcon="confirm"
                intent="success"
                style={{ marginLeft: "1rem" }}
                onClick={() => setOpenConfigMenu(!openConfigMenu)}
              />
              <DeploymentConfigMenu
                showDialog={openConfigMenu}
                closeDialog={() => setOpenConfigMenu(!openConfigMenu)}
                onClick={() => {
                  sendOverRootWS(UPDATE_DEPLOYMENT, { deployment });
                  resetChanged();
                }}
                oldDeployment={select(state => state.deployments[deploymentID])}
                newDeployment={deployment}
              />
            </Conditional>
          </div>
        </animated.div>
      )
  );
}

export default DeploymentConfigCard