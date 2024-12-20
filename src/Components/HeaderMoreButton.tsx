import { useState } from "react";
import { useAppContext } from "../Contexts/hooks";

function HeaderMoreButton() {
  const { theme, switchTheme, temperatureUnit, switchTempUnit } =
    useAppContext();

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
            <nav onClick={switchTempUnit}>
              <i>device_thermostat</i>
              <a>
                {temperatureUnit === "celsius" ? (
                  <span>Switch to F&deg; unit</span>
                ) : (
                  <span>Switch to C&deg; unit</span>
                )}
              </a>
            </nav>
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
