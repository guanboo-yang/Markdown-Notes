import { ForwardedRef, forwardRef, memo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import ToolbarButton from "./toolbar-button";
import { DownloadIcon } from "lucide-react";
import { HtmlIcon, MarkdownIcon, PdfFileIcon } from "./svgs";
import { useConfig } from "@/hooks/useConfig";
import { Menu, MenuItem } from "./menu";
import Markdown from "./markdown";

interface PreviewPaneProps {
  text: string;
}

const PreviewPane = (
  { text }: PreviewPaneProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const { config, setDarkMode } = useConfig();
  const [storedDarkMode, setStoredDarkMode] = useState(config.darkMode);

  useEffect(() => {
    window.addEventListener("beforeprint", () => {
      setStoredDarkMode(config.darkMode);
      setDarkMode(false);
    });
    window.addEventListener("afterprint", () => {
      setDarkMode(storedDarkMode);
    });
  }, [config.darkMode, setDarkMode, storedDarkMode]);

  const downloadPDF = () => {
    // If dark mode (since beforeprint and afterprint events are not supported in Firefox)
    if (config.darkMode) {
      const switchMode = confirm(
        "Dark mode is enabled. Do you want to switch to light mode for printing?",
      );
      if (switchMode) setDarkMode(false);
      return;
    }

    // Also, Safari has different margins than other browsers
    window.print();
  };

  const downloadMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "markdown.md";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  // const toggleNav = () => {
  //   const nav = document.querySelector("nav.toc");
  //   nav?.classList.toggle("active");
  // };

  return (
    <div
      className={cn(
        "relative flex h-full flex-1 flex-col pl-2 print:pl-0",
        config.mode === "editor" && "hidden",
      )}
    >
      <div className="h-1.5 w-full shrink-0 print:hidden" />
      <div
        ref={ref}
        id="preview"
        className="scroll-pt-10 overflow-y-auto overflow-x-hidden break-words"
      >
        <div className="absolute right-0 top-0 flex w-full items-center gap-1.5 p-1.5 print:hidden">
          {/* <ToolbarButton onClick={toggleNav}>
            <DownloadIcon className="h-4.5 w-4.5" />
          </ToolbarButton> */}
          <div className="flex-1" />
          <Menu
            id="download-menu"
            handler={
              <ToolbarButton>
                <DownloadIcon className="h-4.5 w-4.5" />
              </ToolbarButton>
            }
          >
            <MenuItem onClick={downloadMarkdown}>
              <MarkdownIcon className="h-4.5 w-4.5" />
              Download Markdown
            </MenuItem>
            <MenuItem onClick={downloadPDF}>
              <PdfFileIcon className="h-4.5 w-4.5" />
              Download PDF
            </MenuItem>
            <MenuItem disabled>
              <HtmlIcon className="h-4.5 w-4.5" />
              Download HTML
            </MenuItem>
          </Menu>
        </div>
        <Markdown>{text}</Markdown>
      </div>
    </div>
  );
};

// export default forwardRef(PreviewPane);
export default memo(forwardRef(PreviewPane));
