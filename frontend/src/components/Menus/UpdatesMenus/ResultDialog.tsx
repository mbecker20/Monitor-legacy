import { Classes, Dialog } from '@blueprintjs/core'
import { Log } from '../../../state/types/misc'

function ResultDialog({
  showDialog, 
  closeDialog,
  log,
} : {
  showDialog: boolean, 
  closeDialog: () => void,
  log: Log
}) {
  const _log = log ? log : {}
  const { stdout, stderr } = _log
  const outText = stdout ? (`stdout:\n\n${stdout}` + (stderr ? '\n\n' : '')) : ''
  const errText = stderr ? `stderr:\n\n${stderr}` : ''
  return (
    <Dialog
      isOpen={showDialog}
      onClose={closeDialog}
      title="Result"
      usePortal={true}
      className="bp3-dark"
      style={{
        width: "40rem",
        maxWidth: "95vw",
      }}
    >
      <pre
        className={Classes.DIALOG_BODY}
        style={{
          whiteSpace: "pre-line",
          overflowWrap: "anywhere",
          wordWrap: "break-word",
          maxHeight: "80vh",
          tabSize: 2, 
          MozTabSize: 2, 
          overflowY: "auto",
        }}
      >
        {outText + errText}
      </pre>
    </Dialog>
  );
}

export default ResultDialog
