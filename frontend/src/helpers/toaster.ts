import { IconName, Intent, Position, Toaster } from '@blueprintjs/core'

const ActionsToaster = Toaster.create({
  className: "Toast",
  position: Position.TOP,
});

export function createToast(message: string, intent: Intent = 'none', icon?: IconName) {
  ActionsToaster.show({
    message,
    intent,
    icon,
    timeout: 5000
  });
}