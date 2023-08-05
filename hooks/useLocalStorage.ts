import { useCallback, useState, useEffect, useRef } from "react";

const useStorage = <T>(
  key: string,
  defaultValue: T | undefined,
): [
  T | undefined,
  React.Dispatch<React.SetStateAction<T | undefined>>,
  () => void,
] => {
  const [value, setValue] = useState<T>();
  const firstUpdate = useRef(true);

  // Initial load from local storage
  useEffect(() => {
    const jsonValue = window.localStorage.getItem(key);
    if (jsonValue === null) setValue(defaultValue);
    else setValue(JSON.parse(jsonValue!));
  }, [key, defaultValue]);

  // Listen for changes to local storage
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== key) return;
      // console.log("listen:", e.oldValue, "->", e.newValue);
      setValue(JSON.parse(e.newValue!));
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key]);

  // Update local storage when value changes (except on first render)
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (value === undefined) return window.localStorage.removeItem(key);
    // console.log("update:", value);
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  // Remove value from local storage
  const remove = useCallback(() => {
    setValue(undefined);
  }, []);

  return [value, setValue, remove];
};

export default useStorage;
