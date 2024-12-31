import { ReactNode } from "react";

type DropdownMenuItemProps = {
  icon: string;
  content: ReactNode | string;
  onClick: () => void;
};

function DropdownMenuItem({ icon, content, onClick }: DropdownMenuItemProps) {
  return (
    <nav onClick={onClick}>
      <i>{icon}</i>
      <a>{content}</a>
    </nav>
  );
}

export default DropdownMenuItem;
