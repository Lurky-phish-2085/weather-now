import isEmpty from "lodash.isempty";
import { ReactNode, useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import usePrefersColorScheme from "use-prefers-color-scheme";
import useSessionStorageState from "use-session-storage-state";
import { TemperatureUnits } from "../api/enums";
import { Location } from "../types";
import AppContext from "./AppContext";

type Theme = "dark" | "light" | "no-preference";

type AppContextProviderProps = {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

const AppContextProvider = ({
  children,
  ...props
}: AppContextProviderProps) => {
  const [selectedLocation, setSelectedLocation] =
    useSessionStorageState<Location>("location");

  const [location, setLocation] = useState({} as Location);
  const selectLocation = (location: Location) => {
    setSelectedLocation(location);
  };

  useEffect(() => {
    const newLocation = selectedLocation ? selectedLocation : location;
    setLocation(newLocation);
  }, [selectedLocation, location]);

  const [recentSearches, setRecentSearches] = useLocalStorageState<Location[]>(
    "searches",
    { defaultValue: [] }
  );

  const [searches, setSearches] = useState(recentSearches);
  const clearSearches = () => {
    setSearches([]);
    setRecentSearches([]);
  };

  useEffect(() => {
    if (isEmpty(location)) {
      return;
    }

    let updatedSearches: Location[] = recentSearches ? recentSearches : [];
    const locationExists = updatedSearches.filter(
      (data) => data.place_id === location.place_id
    ).length;

    if (locationExists) {
      return;
    }

    updatedSearches = updatedSearches.filter((data) => !isEmpty(data));
    updatedSearches.push(location);

    setSearches(updatedSearches.reverse().slice());
    setRecentSearches(updatedSearches);
  }, [location]);

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
  const defaultTheme = systemPreferredTheme || "light";

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
        searches,
        clearSearches,
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

export default AppContextProvider;
