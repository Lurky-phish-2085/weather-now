import { useState } from "react";
import { useAppContext } from "../Contexts/AppContext";

function HeaderMoreButton() {
  const { theme, switchTheme } = useAppContext();

  const [open, setOpen] = useState(false);

  return (
    <>
      {!open ? (
        <button onClick={() => setOpen(true)} className="circle transparent">
          <i>more_vert</i>
        </button>
      ) : (
        <button onClick={() => setOpen(false)} className="circle transparent">
          <i>more_vert</i>
          <menu className="left no-wrap">
            <nav onClick={switchTheme}>
              <i>{theme === "dark" ? "light_mode" : "dark_mode"}</i>
              <a>{theme === "dark" ? "Light Mode" : "Dark Mode"}</a>
            </nav>
            <nav>
              <i>info</i>
              <a>About</a>
            </nav>
          </menu>
        </button>
      )}
    </>
  );
}

export default HeaderMoreButton;
