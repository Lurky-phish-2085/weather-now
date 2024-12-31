import { useAppContext } from "../Contexts/hooks";
import { TemperatureUnits } from "../api/enums";

function HeaderMoreButton() {
  const { theme, switchTheme, temperatureUnit, switchTempUnit } =
    useAppContext();

  const toggleDropdown = () => {
    ui("#dropdown");
  };
  const handleItemClick = (callback: () => void) => {
    toggleDropdown();
    callback();
  };

  return (
    <button className="circle transparent">
      <i>more_vert</i>
      <menu id="dropdown" className="left no-wrap">
        <nav onClick={() => handleItemClick(switchTempUnit)}>
          <i>device_thermostat</i>
          <a>
            {temperatureUnit === TemperatureUnits.CELSIUS ? (
              <span>Switch to F&deg; unit</span>
            ) : (
              <span>Switch to C&deg; unit</span>
            )}
          </a>
        </nav>
        <nav onClick={() => handleItemClick(switchTheme)}>
          <i>{theme === "dark" ? "light_mode" : "dark_mode"}</i>
          <a>{theme === "dark" ? "Light Mode" : "Dark Mode"}</a>
        </nav>
        <nav onClick={() => handleItemClick(() => {})}>
          <i>info</i>
          <a>About</a>
        </nav>
      </menu>
    </button>
  );
}

export default HeaderMoreButton;
