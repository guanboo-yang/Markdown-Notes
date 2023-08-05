import React from "react";
import {
  LibraryIcon,
  PencilIcon,
  BookOpenIcon,
  EyeIcon,
  MonitorIcon,
  SunIcon,
  MoonIcon,
} from "lucide-react";
import ToolbarButton from "./toolbar-button";
import ToolbarButtonChange from "./toolbar-button-change";
import { useConfig } from "@/hooks/useConfig";
import { usePathname } from "next/navigation";

const Toolbar = () => {
  const { config, setConfig, setDarkMode } = useConfig();
  const pathname = usePathname();

  return (
    <>
      <ToolbarButton isLink active={pathname === "/"} linkProps={{ href: "/" }}>
        <LibraryIcon className="h-4.5 w-4.5" />
      </ToolbarButton>
      <ToolbarButton
        active={config.mode === "editor"}
        onClick={() => setConfig({ ...config, mode: "editor" })}
      >
        <PencilIcon className="h-4.5 w-4.5" />
      </ToolbarButton>
      <div className="hidden md:flex">
        <ToolbarButton
          active={config.mode === "both"}
          onClick={() => setConfig({ ...config, mode: "both" })}
        >
          <BookOpenIcon className="h-4.5 w-4.5" />
        </ToolbarButton>
      </div>
      <ToolbarButton
        active={config.mode === "preview"}
        onClick={() => setConfig({ ...config, mode: "preview" })}
      >
        <EyeIcon className="h-4.5 w-4.5" />
      </ToolbarButton>
      <div className="flex-1" />
      <ToolbarButton
        onClick={() => setDarkMode(undefined)}
        active={config.darkMode === undefined}
      >
        <MonitorIcon className="h-4.5 w-4.5" />
      </ToolbarButton>
      <ToolbarButtonChange
        IconActive={SunIcon}
        IconNotActive={MoonIcon}
        active={config.darkMode || false}
        noRenderActive
        onClick={() => setDarkMode(!config.darkMode)} // Regarding Media Query
      />
    </>
  );
};

export default Toolbar;
