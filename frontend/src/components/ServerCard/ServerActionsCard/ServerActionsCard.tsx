import { useState } from 'react'
import { Button } from '@blueprintjs/core'
import { Tooltip2 } from '@blueprintjs/popover2'
import PruneActionMenu from '../../Menus/ActionMenus/PruneActionMenu'

function ServerActionsCard({ serverID, serverStatus } : { serverID: string, serverStatus: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="InnerCard" style={{ gridArea: "actions" }}>
      <div className="InnerCardHeader"> Actions </div>
      <div className="ActionsBody">
        <div className="Action">
          <div className="ActionTitle"> Prune </div>
          <Tooltip2
            content={serverStatus === "OK" ? 'Prune' : 'Server Unreachable'}
            placement="top"
          >
            <Button
              icon="cut"
              intent="warning"
              large={true}
              disabled={serverStatus === "OK" ? false : true}
              onClick={() => setMenuOpen(true)}
            />
          </Tooltip2>
          <PruneActionMenu
            showDialog={menuOpen}
            closeDialog={() => setMenuOpen(false)}
            serverID={serverID}
          />
        </div>
      </div>
    </div>
  );
}

export default ServerActionsCard
