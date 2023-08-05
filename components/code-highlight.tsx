import { useEffect, useRef, useState } from "react";
import { CheckIcon, ClipboardIcon } from "lucide-react";
import ToolbarButtonChange from "./toolbar-button-change";
import { useConfig } from "@/hooks/useConfig";

interface CodeHighlightProps {
  code: string;
  language: string;
}

const CodeHighlight = ({ code, language }: CodeHighlightProps) => {
  const timeoutRef = useRef<number | null>(null);
  const [highlightedCode, setHighlightedCode] = useState<string>(code);
  const [copySuccess, setCopySuccess] = useState(false);
  const [colorized, setColorized] = useState(false);
  const { config } = useConfig();

  useEffect(() => {
    const colorize = async () => {
      setColorized(false);
      const monaco = await import("monaco-editor");
      monaco.editor.setTheme(config.darkMode ? "vs-dark" : "vs");
      const colorized = await monaco.editor.colorize(code, language, {});
      setHighlightedCode(colorized);
      setColorized(true);
    };
    colorize();
  }, [code, language, config.darkMode]);

  const onClickCopy = () => {
    navigator.clipboard.writeText(code);
    setCopySuccess(true);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };

  return (
    <>
      {colorized ? (
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      ) : (
        <code>{code}</code>
      )}
      <div className="absolute right-0 top-0 flex gap-2 p-2 text-xs opacity-20 transition-opacity [pre:hover_&]:opacity-100">
        {/* <span className="text-gray-400 print:opacity-100">{language}</span> */}
        <ToolbarButtonChange
          className="print:hidden"
          IconActive={CheckIcon}
          IconNotActive={ClipboardIcon}
          active={copySuccess}
          onClick={onClickCopy}
          aria-label="Copy"
        />
      </div>
    </>
  );
};

export default CodeHighlight; // TODO: Fix Re-rendering When Code is Not Changed
