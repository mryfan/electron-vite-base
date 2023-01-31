import {
  dialog,
  type IpcMainInvokeEvent,
  type OpenDialogOptions,
} from "electron";

export function handle(event: IpcMainInvokeEvent, option: OpenDialogOptions) {
  return dialog.showOpenDialog(option);
}
