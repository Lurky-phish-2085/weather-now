import { createContext, ReactNode, useState } from "react";
import { TemperatureUnits } from "../api/enums";
import { Location } from "../types";

type AppContextType = {
  location: Location;
  selectLocation: (location: Location) => void;
  temperatureUnit: TemperatureUnits;
  switchTempUnit: () => void;
  theme: string;
  switchTheme: () => void;
};

type AppContextProviderProps = {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export const AppContext = createContext({} as AppContextType);

export const AppContextProvider = ({
  children,
  ...props
}: AppContextProviderProps) => {
  const [location, setLocation] = useState({} as Location);
  const selectLocation = (location: Location) => {
    setLocation(location);
  };

  const [temperatureUnit, setTemperatureUnit] = useState(
    TemperatureUnits.CELSIUS
  );
  const switchTempUnit = () => {
    const newUnit =
      temperatureUnit === TemperatureUnits.CELSIUS
        ? TemperatureUnits.FAHRENHEIT
        : TemperatureUnits.CELSIUS;

    setTemperatureUnit(newUnit);
  };

  const [theme, setTheme] = useState(ui("mode") as string);
  const switchTheme = () => {
    const newMode = theme === "dark" ? "light" : "dark";
    setTheme(newMode);
    ui("mode", newMode);
  };

  return (
    <AppContext.Provider
      value={{
        location,
        selectLocation,
        temperatureUnit,
        switchTempUnit,
        theme,
        switchTheme,
        ...props,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
