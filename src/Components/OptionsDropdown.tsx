import { useState } from "react";
import { useAppContext } from "../Contexts/hooks";
import { TemperatureUnits } from "../api/enums";
import AboutModal from "./AboutModal";
import DropdownMenuItem from "./DropdownMenuItem";

function OptionsDropdown() {
  const { theme, switchTheme, temperatureUnit, switchTempUnit } =
    useAppContext();

  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);

  const toggleDropdown = () => {
    ui("#dropdown");
  };
  const handleItemClick = (callback: () => void) => {
    toggleDropdown();
    callback();
  };

  return (
    <>
      <button className="circle transparent">
        <i>more_vert</i>
        <menu id="dropdown" className="left no-wrap">
          <DropdownMenuItem
            onClick={() => handleItemClick(switchTempUnit)}
            icon="device_thermostat"
            content={
              temperatureUnit === TemperatureUnits.CELSIUS ? (
                <span>Switch to F&deg; unit</span>
              ) : (
                <span>Switch to C&deg; unit</span>
              )
            }
          />
          <DropdownMenuItem
            onClick={() => handleItemClick(switchTheme)}
            icon={theme === "dark" ? "light_mode" : "dark_mode"}
            content={theme === "dark" ? "Light Mode" : "Dark Mode"}
          />
          <DropdownMenuItem
            onClick={() => handleItemClick(() => setAboutDialogOpen(true))}
            icon="info"
            content="About"
          />
        </menu>
      </button>
      <AboutModal
        onClose={() => setAboutDialogOpen(false)}
        open={aboutDialogOpen}
      />
    </>
  );
}

export default OptionsDropdown;
