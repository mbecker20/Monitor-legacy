import { Button, Classes, Dialog } from "@blueprintjs/core";
import { buildChangelog } from "../../../helpers/changelogs";

function BuildConfigMenu({
  showDialog,
  closeDialog,
  onClick,
  oldBuild,
  newBuild
}: {
  showDialog: boolean;
  closeDialog: () => void;
  onClick: () => void;
  oldBuild: any,
  newBuild: any
}) {
  return (
    <Dialog
      isOpen={showDialog}
      onClose={closeDialog}
      title="Confirm"
      usePortal
      className="bp3-dark"
    >
      <div className={Classes.DIALOG_BODY} style={{whiteSpace: 'pre-line'}}>
        <pre style={{ tabSize: 2, MozTabSize: 2, width: '90vw', maxWidth: '30rem' }}>
          {buildChangelog(oldBuild, newBuild)}
        </pre>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <Button rightIcon="confirm" intent="success" onClick={() => { onClick(); closeDialog() }}>
          Confirm Changes
        </Button>
      </div>
    </Dialog>
  );
}

export default BuildConfigMenu;