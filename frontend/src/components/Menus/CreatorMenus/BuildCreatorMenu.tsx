import { Button, Classes, Dialog, EditableText } from "@blueprintjs/core"
import { useState } from "react"
import { select } from "../../.."
import { createToast } from "../../../helpers/toaster"
import { CREATE_BUILD } from "../../../state/builds"
import { sendOverRootWS } from "../../../state/sockets"
import { ProtoBuild } from "../../../state/types/build"
import './CreatorMenu.css'

function newBuild(): ProtoBuild {
  return {
    name: '',
    repoURL: '',
    owner: select(state => state.user.username)
  }
}

function BuildCreatorMenu({ 
  showDialog, closeDialog, maybeCloseSidebar
} : { 
  showDialog: boolean
  closeDialog: () => void
  maybeCloseSidebar: () => void 
}) {
  const [build, setBuild] = useState(newBuild())
  return (
    <Dialog
      isOpen={showDialog}
      onClose={() => {
        closeDialog()
        setBuild(newBuild())
      }}
      title='Create New Build'
      //icon='add'
      usePortal={true}
      className="bp3-dark"
    >
      <div
        className={Classes.DIALOG_BODY}
        style={{
          marginBottom: '1rem',
          backgroundColor: "var(--gray3)",
          maxHeight: "fit-content",
          overflowY: "scroll",
        }}
      >
        <div className='ConfigItem'>
          <div>
            Build Name:
          </div>
          <EditableText 
            placeholder='Name This Build'
            //value={build.name}
            onChange={name => setBuild({ ...build, name  })}
          />
        </div>
        <div className='ConfigItem'>
          <div>
            Repo URL:
          </div>
          <EditableText
            placeholder='Repo URL'
            //value={build.repoURL}
            onChange={repoURL => setBuild({ ...build, repoURL })}
          />
        </div>
      </div>
      <div className={Classes.DIALOG_FOOTER} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button 
          rightIcon='confirm' 
          intent='success' 
          onClick={() => {
            const builds = select(state => state.builds)
            if (build.name.length === 0) {
              createToast('Name Too Short', 'danger')
            } else if (Object.keys(builds).map(key => builds[key].name).includes(build.name)) {
              createToast('Name Already Taken', 'danger')
            } else {
              sendOverRootWS(CREATE_BUILD, { build })
              // createToast('Add Build Request Sent', 'warning')
              closeDialog()
              maybeCloseSidebar()
              setBuild(newBuild())
            }
          }}
        >
          Create New Build
        </Button>
      </div>
    </Dialog>
  )
}

export default BuildCreatorMenu