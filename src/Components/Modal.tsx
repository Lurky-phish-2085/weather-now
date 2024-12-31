import { ReactNode, useEffect } from "react";

type ModalProps = {
  children: ReactNode;
  id: string;
  header: string;
  confirmText?: string;
  cancelText?: string;
  open: boolean;
  onClose: (confirmed: boolean) => void;
};

function Modal({
  children,
  id,
  header,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onClose,
  open,
}: ModalProps) {
  const toggleDialog = () => {
    ui(`#${id}`);
  };

  const handleClick = (confirmed: boolean) => {
    onClose(confirmed);
    toggleDialog();
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    toggleDialog();
  }, [open]);

  return (
    <div className="dialog-code">
      <div className="overlay"></div>
      <dialog id={id} className="modal">
        <h5>{header}</h5>
        {children}
        <nav className="right-align no-space">
          <button
            onClick={() => handleClick(false)}
            className="transparent link"
          >
            {cancelText}
          </button>
          <button
            onClick={() => handleClick(true)}
            className="transparent link"
          >
            {confirmText}
          </button>
        </nav>
      </dialog>
    </div>
  );
}

export default Modal;
