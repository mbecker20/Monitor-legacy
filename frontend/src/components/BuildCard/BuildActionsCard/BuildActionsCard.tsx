import { Button, Spinner, SpinnerSize } from '@blueprintjs/core'
import { Tooltip2 } from '@blueprintjs/popover2'
import { useState } from 'react';
import { useSelector } from '../../..';
import BuildActionMenu from '../../Menus/ActionMenus/BuildActionMenu';
import './BuildActionsCard.css'

function BuildActionsCard({ buildID }: { buildID: string }) {
  const [isOpen, setOpenBuildMenu] = useState(false)
  const building = useSelector(state => state.building)
  return (
    <div className="InnerCard" style={{ gridArea: "actions" }}>
      <div className="InnerCardHeader"> Actions </div>
      <div className="ActionsBody">
        <div className="Action">
          <div className="ActionTitle"> Build </div>
          <Tooltip2 content="Build" placement="top">
            <Button
              icon={building ? undefined : "build"}
              intent="success"
              large={true}
              onClick={() => setOpenBuildMenu(true)}
            >
              {building ? <Spinner size={SpinnerSize.SMALL} /> : undefined}
            </Button>
          </Tooltip2>
          <BuildActionMenu
            showDialog={isOpen}
            closeDialog={() => setOpenBuildMenu(false)}
            buildID={buildID}
          />
        </div>
      </div>
    </div>
  );
}

export default BuildActionsCard
