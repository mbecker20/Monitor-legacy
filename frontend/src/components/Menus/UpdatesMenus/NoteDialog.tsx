import { Classes, Dialog } from "@blueprintjs/core";

function NoteDialog({
  showDialog,
  closeDialog,
  note,
}: {
  showDialog: boolean;
  closeDialog: () => void;
  note: string;
}) {
  return (
    <Dialog
      isOpen={showDialog}
      onClose={closeDialog}
      title="Note"
      usePortal={true}
      className="bp3-dark"
    >
      <div className={Classes.DIALOG_BODY}>{note}</div>
    </Dialog>
  );
}

export default NoteDialog;
