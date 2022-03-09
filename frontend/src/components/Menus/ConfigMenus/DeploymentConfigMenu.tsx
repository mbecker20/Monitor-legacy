import { Button, Classes, Dialog } from "@blueprintjs/core";
import { deploymentChangelog } from "../../../helpers/changelogs";

function DeploymentConfigMenu({
  showDialog,
  closeDialog,
  onClick,
  oldDeployment,
  newDeployment,
}: {
  showDialog: boolean
  closeDialog: () => void
  onClick: () => void
  oldDeployment: any
  newDeployment: any
}) {
  return (
    <Dialog
      isOpen={showDialog}
      onClose={closeDialog}
      title="Confirm"
      usePortal
      className="bp3-dark"
    >
      <div className={Classes.DIALOG_BODY} style={{ whiteSpace: "pre-line" }}>
        <pre style={{ tabSize: 2, MozTabSize: 2, width: '90vw', maxWidth: '30rem' }}>
          {deploymentChangelog(oldDeployment, newDeployment)}
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

export default DeploymentConfigMenu;
