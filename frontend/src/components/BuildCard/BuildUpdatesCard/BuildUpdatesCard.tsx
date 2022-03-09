import { Button, Icon } from '@blueprintjs/core'
import { Update, Updates } from '../../../state/types/update'
import { useState,  } from 'react'
import './BuildUpdatesCard.css'
import CommandDialog from '../../Menus/UpdatesMenus/CommandDialog'
import ResultDialog from '../../Menus/UpdatesMenus/ResultDialog'
import Conditional from '../../../kbin-blueprint/Conditional'
import NoteDialog from '../../Menus/UpdatesMenus/NoteDialog'

function BuildUpdatesCard({ updates }: { updates: Updates }) {
  return (
    <div className="InnerCard" style={{ gridArea: "updates" }}>
      <div className="InnerCardHeader">Updates</div>
      <div className="FlexCol" style={{height: '20rem'}}>
        <div className='UpdatesBody'>
          {Object.keys(updates).map((key, i) => <BuildUpdate update={updates[key]} key={i}/>)}
        </div>
      </div>
    </div>
  );
}

function BuildUpdate({ update }: { update: Update }) {
  const [openCommandDialog, setOpenCommandDialog] = useState(false);
  const [openResultDialog, setOpenResultDialog] = useState(false);
  const [openNoteDialog, setOpenNoteDialog] = useState(false);

  const { operation, timestamp, operator, isError, note, command, log } = update
  const { date, time } = timestamp
  return (
    <div className="Update">
      <div
        className="UpdateItem"
        style={{
          gridArea: "operation",
          fontSize: "1.15rem",
          fontWeight: "bold",
          color: isError ? "var(--error-update)" : "white",
        }}
      >
        {" "}
        {operation}{" "}
      </div>
      <div className="UpdateItem" style={{ gridArea: "timestamp" }}>
        {" "}
        {date} at {time}{" "}
      </div>
      <div className="UpdateItem" style={{ gridArea: "operator" }}>
        <Icon icon="user" iconSize={20} style={{ marginRight: "0.5rem" }} />
        <div> {`${operator}`} </div>
      </div>
      <div
        className="UpdateItem"
        style={{
          gridArea: "buttons",
          display: "flex",
          justifyContent: "space-between",
          padding: "0rem 0.5rem",
        }}
      >
        <Button
          intent="warning"
          icon="unarchive"
          minimal
          onClick={() => {
            setOpenCommandDialog(!openCommandDialog);
          }}
        />
        <Button
          intent="primary"
          icon="archive"
          minimal
          onClick={() => {
            setOpenResultDialog(!openResultDialog);
          }}
        />
        <Conditional showIf={note?.length > 0}>
          <Button
            intent="danger"
            icon="document"
            minimal
            onClick={() => {
              setOpenNoteDialog(!openNoteDialog);
            }}
          />
          <NoteDialog
            showDialog={openNoteDialog}
            closeDialog={() => {
              setOpenNoteDialog(!openNoteDialog);
            }}
            note={note}
          />
        </Conditional>
        <CommandDialog
          showDialog={openCommandDialog}
          closeDialog={() => {
            setOpenCommandDialog(!openCommandDialog);
          }}
          command={command}
        />
        <ResultDialog
          showDialog={openResultDialog}
          closeDialog={() => {
            setOpenResultDialog(!openResultDialog);
          }}
          log={log}
        />
      </div>
    </div>
  );
}

export default BuildUpdatesCard;
