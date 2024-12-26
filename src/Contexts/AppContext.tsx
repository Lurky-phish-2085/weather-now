import { createContext } from "react";
import { TemperatureUnits } from "../api/enums";
import { Location } from "../types";

type AppContextType = {
  location: Location;
  selectLocation: (location: Location) => void;
  searches: Location[];
  clearSearches: () => void;
  temperatureUnit: TemperatureUnits;
  switchTempUnit: () => void;
  theme: string;
  switchTheme: () => void;
};

const AppContext = createContext({} as AppContextType);

export default AppContext;
