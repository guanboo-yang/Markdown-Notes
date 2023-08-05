"use client";

import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useEffect,
} from "react";
import useDarkMode from "./useDarkMode";

type Mode = "editor" | "preview" | "both";

type Config = {
  darkMode: boolean | undefined;
  wordWrap: boolean;
  mode: Mode;
};

const defaultConfig = {
  darkMode: false,
  wordWrap: true,
  mode: "both" as Mode,
};

interface ConfigContextType {
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

const ConfigContext = createContext<ConfigContextType>({
  config: defaultConfig,
  setConfig: () => {},
  setDarkMode: () => {},
});

function ConfigProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useDarkMode();
  const [config, setConfig] = useState<Config>(defaultConfig);

  useEffect(() => {
    console.log("useConfig", config.mode);
  }, [config.mode]);

  useEffect(() => {
    setConfig((prev) => ({ ...prev, darkMode }));
  }, [darkMode]);

  return (
    <ConfigContext.Provider
      value={{
        config,
        setDarkMode,
        setConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

const useConfig = () => useContext(ConfigContext);

export { ConfigProvider, useConfig };
