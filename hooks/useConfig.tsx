"use client";

import { createContext, ReactNode, useState, useContext } from "react";
import { useEffect, Dispatch, SetStateAction } from "react";
import useDarkMode from "./useDarkMode";
import { Mode } from "@/types";

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
  setConfig: Dispatch<SetStateAction<Config>>;
  setDarkMode: Dispatch<SetStateAction<boolean | undefined>>;
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
