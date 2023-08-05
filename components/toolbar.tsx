import { BookOpenIcon, EyeIcon, LibraryIcon, MonitorIcon } from "lucide-react";
import { MoonIcon, PencilIcon, SunIcon } from "lucide-react";
import ToolbarButton from "./toolbar-button";
import ToolbarButtonChange from "./toolbar-button-change";
import { useConfig } from "@/hooks/useConfig";
import { usePathname } from "next/navigation";

const Toolbar = () => {
  const { config, setConfig, setDarkMode } = useConfig();
  const pathname = usePathname();

  const onClickMode = (mode: "editor" | "both" | "preview") => {
    console.log("onClickMode", mode);
    setConfig({ ...config, mode });
  };

  const onClickDarkMode = (darkMode: boolean | undefined) => {
    console.log("onClickDarkMode", config.darkMode, darkMode);
    setDarkMode(darkMode);
  };

  return (
    <>
      <ToolbarButton
        isLink
        href="/"
        active={pathname === "/"}
        aria-label="Home"
      >
        <LibraryIcon className="h-4.5 w-4.5" />
      </ToolbarButton>
      <ToolbarButton
        active={config.mode === "editor"}
        onClick={() => onClickMode("editor")}
        aria-label="Editor"
      >
        <PencilIcon className="h-4.5 w-4.5" />
      </ToolbarButton>
      <div className="hidden md:flex">
        <ToolbarButton
          active={config.mode === "both"}
          onClick={() => onClickMode("both")}
          aria-label="Editor and Preview"
        >
          <BookOpenIcon className="h-4.5 w-4.5" />
        </ToolbarButton>
      </div>
      <ToolbarButton
        active={config.mode === "preview"}
        onClick={() => onClickMode("preview")}
        aria-label="Preview"
      >
        <EyeIcon className="h-4.5 w-4.5" />
      </ToolbarButton>
      <div className="flex-1" />
      <ToolbarButton
        onClick={() => onClickDarkMode(undefined)}
        active={config.darkMode === undefined}
        aria-label="System Theme"
      >
        <MonitorIcon className="h-4.5 w-4.5" />
      </ToolbarButton>
      <ToolbarButtonChange
        IconActive={SunIcon}
        IconNotActive={MoonIcon}
        active={config.darkMode || false}
        noRenderActive
        onClick={() => onClickDarkMode(!config.darkMode)}
        aria-label="Toggle Dark Mode"
      />
    </>
  );
};

export default Toolbar;
