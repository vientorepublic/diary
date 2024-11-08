import type { IConfirmModalProps } from "../types";
import { confirmAlert } from "react-confirm-alert";

export function confirmModal(props: IConfirmModalProps) {
  const { title, message, callback } = props;
  confirmAlert({
    title,
    message,
    buttons: [
      {
        label: "예",
        onClick: () => {
          callback();
        },
      },
      {
        label: "아니요",
        onClick: () => {
          return;
        },
      },
    ],
  });
}
