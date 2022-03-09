import { Button } from '@blueprintjs/core'
import { Select } from '@blueprintjs/select'
import { useEffect, useState } from 'react';
import './BuildConfigCard.css'
import BuildCard from './ConfigCards/BuildCard';
import GitListnerCard from './ConfigCards/GitListnerCard';
import { roughStringsEqual } from 'kbin-state';
import { animated } from 'react-spring';
import { select } from '../../..';
import { useConfigTransition } from '../../../helpers/spring';
import { ConfigItem, renderConfig } from '../../../helpers/selector'
import { useChangedState } from '../../../helpers/hooks';
import Conditional from '../../../kbin-blueprint/Conditional';
import { sendOverRootWS } from '../../../state/sockets';
import { UPDATE_BUILD } from '../../../state/builds';
import BuildConfigMenu from '../../Menus/ConfigMenus/BuildConfigMenu';

const DEFAULT_ITEMS: ConfigItem[] = [
  {title: 'Build'},
  {title: 'Webhook'}
]
  
function BuildConfigCard({ isOpen, buildID }: { isOpen: boolean, buildID: string }) {
  const [currentItem, setCurrentItem] = useState('Build')
  const [openConfigMenu, setOpenConfigMenu] = useState(false);
  const selectConfigItem = (item: ConfigItem) => setCurrentItem(item.title)
  const [queryItems, setQueryItems] = useState(DEFAULT_ITEMS)
  const transitions = useConfigTransition(isOpen)

  const [build, setBuild, changed, resetChanged] = useChangedState(select(({ builds }) => builds[buildID]))

  useEffect(() => {
    if (buildID !== build._id) {
      setBuild(select(state => state.builds[buildID]))
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
            }}
          >
            Configure Build
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
            {currentItem === "Build" && (
              <BuildCard build={build} setBuild={setBuild} />
            )}
            {currentItem === "Webhook" && <GitListnerCard buildID={buildID} />}
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
                  setBuild(select(({ builds }) => builds[buildID]));
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
              <BuildConfigMenu
                showDialog={openConfigMenu}
                closeDialog={() => setOpenConfigMenu(!openConfigMenu)}
                onClick={() => {
                  sendOverRootWS(UPDATE_BUILD, { build });
                  resetChanged();
                }}
                oldBuild={select((state) => state.builds[buildID])}
                newBuild={build}
              />
            </Conditional>
          </div>
        </animated.div>
      )
  );
}

export default BuildConfigCard