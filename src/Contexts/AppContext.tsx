import { createContext, ReactNode, useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import usePrefersColorScheme from "use-prefers-color-scheme";
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

type Theme = "dark" | "light" | "no-preference";

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

  const defaultTempUnit = TemperatureUnits.CELSIUS;
  const [selectedTempUnit, setSelectedTempUnit] =
    useLocalStorageState<TemperatureUnits>("temp_unit");

  const [temperatureUnit, setTemperatureUnit] = useState(defaultTempUnit);
  const switchTempUnit = () => {
    const newUnit =
      temperatureUnit === TemperatureUnits.CELSIUS
        ? TemperatureUnits.FAHRENHEIT
        : TemperatureUnits.CELSIUS;

    setSelectedTempUnit(newUnit);
  };

  useEffect(() => {
    const unit = selectedTempUnit ? selectedTempUnit : defaultTempUnit;
    setTemperatureUnit(unit);
  }, [selectedTempUnit, defaultTempUnit]);

  const systemPreferredTheme = usePrefersColorScheme();
  const defaultTheme =
    systemPreferredTheme || systemPreferredTheme === "no-preference"
      ? "light"
      : systemPreferredTheme;

  const [selectedTheme, setSelectedTheme] =
    useLocalStorageState<Theme>("theme");

  const [theme, setTheme] = useState<Theme>("light");
  const switchTheme = () => {
    setSelectedTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const theme = selectedTheme ? selectedTheme : defaultTheme;
    setTheme(theme);
    ui("mode", theme);
  }, [selectedTheme, defaultTheme]);

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
