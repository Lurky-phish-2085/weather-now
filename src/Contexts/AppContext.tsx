import { createContext, ReactNode, useContext, useState } from "react";

type AppContextType = {
  theme: string;
  switchTheme: () => void;
};

type AppContextProviderProps = {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

const AppContext = createContext({} as AppContextType);
const useAppContext = () => useContext(AppContext);

const AppContextProvider = ({
  children,
  ...props
}: AppContextProviderProps) => {
  const [theme, setTheme] = useState(ui("mode") as string);

  const switchTheme = () => {
    const newMode = theme === "dark" ? "light" : "dark";
    setTheme(newMode);
    ui("mode", newMode);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        switchTheme,
        ...props,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider, useAppContext };
