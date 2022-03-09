import { Classes, Dialog } from '@blueprintjs/core'

function CommandDialog({
  showDialog, 
  closeDialog,
  command
} : {
  showDialog: boolean, 
  closeDialog: () => void,
  command: string
}) {
  return (
    <Dialog
      isOpen={showDialog}
      onClose={closeDialog}
      title="Command"
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
          overflowY: "auto",
          tabSize: 2, 
          MozTabSize: 2, 
        }}
      >
        {command}
      </pre>
    </Dialog>
  );
}

export default CommandDialog
