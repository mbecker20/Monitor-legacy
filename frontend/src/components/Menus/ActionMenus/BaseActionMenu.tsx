import { Button, Classes, Dialog, EditableText, IconName, Intent } from "@blueprintjs/core";

export interface ActionMenuType {
  showDialog: boolean,
  closeDialog: () => void,
}

function ActionMenu({ 
  title, icon, confirmIntent, 
  showDialog, closeDialog, onConfirm,
  note, setNote, confirmText
}: { 
  title: string
  icon: IconName 
  confirmIntent: Intent
  showDialog: boolean
  closeDialog: () => void
  onConfirm: () => void
  note: string
  setNote: (note: string) => void
  confirmText: string
}) {
  const onClick = () => {
    onConfirm()
    closeDialog()
  }
  return (
    <Dialog
      isOpen={showDialog}
      onClose={closeDialog}
      title={title}
      //icon={icon}
      usePortal={true}
      className="bp3-dark"
      style={{paddingBottom: 0}}
    >
      <div
        className={Classes.DIALOG_BODY}
        style={{
          marginBottom: '1rem',
          backgroundColor: "var(--gray3)",
          maxHeight: 'fit-content',
        }}
      >
        <div className='FlexRow CenterAlign' style={{ backgroundColor: "var(--gray4)", padding: '1rem', marginBottom: '1rem' }}>
          <div className='FlexCol' style={{ width: '100%' }}>
            <div style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Notes</div>
            <EditableText 
              placeholder='Notes for this Action'
              value={note}
              onChange={note => setNote(note)}
              multiline 
              maxLines={10} 
            />
          </div>
        </div>
        <div className='FlexRow CenterAlign JustifyFlexEnd'>
          <Button 
            rightIcon={icon} 
            intent={confirmIntent} 
            onClick={onClick}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default ActionMenu