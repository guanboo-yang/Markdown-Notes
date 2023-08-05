import { useEffect, useState } from "react";
import useLocalStorage from "./useLocalStorage";

const useDarkMode = (): [
  boolean | undefined,
  React.Dispatch<React.SetStateAction<boolean | undefined>>,
  () => void,
] => {
  const [darkMode, setDarkMode, unset] = useLocalStorage<boolean>(
    "dark",
    undefined,
  );
  const [mediaQueryDarkMode, setMediaQueryDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // if (darkMode !== undefined) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setMediaQueryDarkMode(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    console.log("useDarkMode", darkMode, mediaQueryDarkMode);
    document.documentElement.classList.toggle(
      "dark",
      (darkMode ?? mediaQueryDarkMode) === true,
    );
  }, [darkMode, mediaQueryDarkMode]);

  return [darkMode ?? mediaQueryDarkMode, setDarkMode, unset];
};

export default useDarkMode;
