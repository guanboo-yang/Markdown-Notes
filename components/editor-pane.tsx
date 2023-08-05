import { OnMount } from "@monaco-editor/react";
import { forwardRef, useEffect, useRef, useState } from "react";
import type { Editor as EditorType } from "@/types";
import { ToolbarButtonTooltip } from "./toolbar-button-tooltip";
import ToolbarButtonChange from "./toolbar-button-change";
import { cn, formatMarkdown } from "@/lib/utils";
import { BoldIcon, BrushIcon, CodeIcon, CalculatorIcon } from "lucide-react";
import { CheckIcon, ClipboardIcon, FilePlusIcon } from "lucide-react";
import { HeadingIcon, ImageIcon, ItalicIcon, ListIcon } from "lucide-react";
import { LinkIcon, MoreHorizontalIcon, RedoIcon } from "lucide-react";
import { StrikethroughIcon, TableIcon, UndoIcon } from "lucide-react";
import { WrapTextIcon } from "lucide-react";
import { useConfig } from "@/hooks/useConfig";
import Editor from "./editor";

const Splitter = () => (
  <div className="h-6 w-px bg-gray-200 transition-colors dark:bg-gray-600" />
);

interface EditorPaneProps {
  text: string;
  editorRef: React.MutableRefObject<EditorType | null>;
  onMount: OnMount;
  onChange: (value: string | undefined) => void;
}

const EditorPane = (
  { text, editorRef, onMount, onChange }: EditorPaneProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  const [copySuccess, setCopySuccess] = useState(false);
  // const toolbarRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const { config, setConfig } = useConfig();

  useEffect(() => {
    // console.log("darkMode", config.darkMode);
    editorRef.current?.updateOptions({
      // 'vs' (default), 'vs-dark', 'hc-black', 'hc-light'
      theme: config.darkMode ? "vs-dark" : "vs",
    });
  }, [config.darkMode, editorRef]);

  // useEffect(() => {
  //   const toolbar = toolbarRef.current;
  //   if (!toolbar) return;
  //   const observer = new ResizeObserver(() => {});
  //   observer.observe(toolbar);
  //   return () => observer.disconnect();
  // }, []);

  const onClick = (label: string) => {
    editorRef.current?.trigger(
      "editor",
      `vs.editor.ICodeEditor:1:markdown.extension.editing.toggle${label}`,
      null,
    );
    editorRef.current?.focus();
  };

  const onClickFormat = () => {
    formatMarkdown(editorRef.current);
  };

  const onClickWordWrap = () => {
    const editor = editorRef.current;
    if (!editor) return;
    setConfig((prev) => {
      editor.updateOptions({ wordWrap: prev.wordWrap ? "off" : "on" });
      return { ...prev, wordWrap: !prev.wordWrap };
    });
    editor.focus();
  };

  const onClickUndo = () => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.trigger("keyboard", "undo", null);
    editor.focus();
  };

  const onClickRedo = () => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.trigger("keyboard", "redo", null);
    editor.focus();
  };

  const onClickPageBreak = () => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.trigger("editor", "type", {
      text: '<div style="page-break-after: always; break-after: page;"></div>\n',
    });
    editor.focus();
  };

  const onClickCopy = () => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative float-left flex h-full w-full flex-col print:hidden",
        config.mode === "editor" && "!w-full",
        config.mode === "both" && "w-1/2 pr-2",
        config.mode === "preview" && "hidden",
      )}
    >
      <div className="no-scrollbar flex h-[44px] w-full flex-shrink-0 flex-wrap items-center gap-1.5 gap-y-1.5 overflow-x-auto p-1.5 hover:h-fit">
        <ToolbarButtonTooltip
          onClick={() => onClick("Bold")}
          tooltip="Bold"
          keybinding="⌘B"
        >
          <BoldIcon className="h-4.5 w-4.5" />
        </ToolbarButtonTooltip>
        <ToolbarButtonTooltip
          onClick={() => onClick("Italic")}
          tooltip="Italic"
          keybinding="⌘I"
        >
          <ItalicIcon className="h-4.5 w-4.5" />
        </ToolbarButtonTooltip>
        <ToolbarButtonTooltip
          onClick={() => onClick("Strikethrough")}
          tooltip="Strikethrough"
          keybinding="⌥S"
        >
          <StrikethroughIcon className="h-4.5 w-4.5" />
        </ToolbarButtonTooltip>
        <ToolbarButtonTooltip
          onClick={() => onClick("HeadingUp")}
          tooltip="Heading"
          keybinding="⌃⇧["
        >
          <HeadingIcon className="h-4.5 w-4.5" />
        </ToolbarButtonTooltip>
        <Splitter />
        <ToolbarButtonTooltip onClick={onClickFormat} tooltip="format">
          <BrushIcon className="h-4.5 w-4.5" />
        </ToolbarButtonTooltip>
        <ToolbarButtonTooltip
          active={config.wordWrap}
          onClick={onClickWordWrap}
          tooltip={config.wordWrap ? "Disable word wrap" : "Enable word wrap"}
        >
          <WrapTextIcon className="h-4.5 w-4.5" />
        </ToolbarButtonTooltip>
        <ToolbarButtonTooltip onClick={onClickUndo} tooltip="Undo">
          <UndoIcon className="h-4.5 w-4.5" />
        </ToolbarButtonTooltip>
        <ToolbarButtonTooltip onClick={onClickRedo} tooltip="Redo">
          <RedoIcon className="h-4.5 w-4.5" />
        </ToolbarButtonTooltip>
        <ToolbarButtonTooltip
          onClick={() => navigator.clipboard.writeText(JSON.stringify(text))}
          tooltip="String"
        >
          T
        </ToolbarButtonTooltip>
        <Splitter />
        <ToolbarButtonTooltip
          onClick={() => onClick("CodeSpan")}
          tooltip="Code"
        >
          <CodeIcon className="h-4.5 w-4.5" />
        </ToolbarButtonTooltip>
        <ToolbarButtonTooltip
          onClick={() => onClick("List")}
          tooltip="Unordered List"
          keybinding="⌘L"
        >
          <ListIcon className="h-4.5 w-4.5" />
        </ToolbarButtonTooltip>
        <ToolbarButtonTooltip onClick={() => {}} tooltip="Link" disabled>
          <LinkIcon className="h-4.5 w-4.5" />
        </ToolbarButtonTooltip>
        <ToolbarButtonTooltip onClick={() => {}} tooltip="Image" disabled>
          <ImageIcon className="h-4.5 w-4.5" />
        </ToolbarButtonTooltip>
        <ToolbarButtonTooltip onClick={() => {}} tooltip="Table" disabled>
          <TableIcon className="h-4.5 w-4.5" />
        </ToolbarButtonTooltip>
        <ToolbarButtonTooltip
          onClick={() => onClick("Math")}
          tooltip="Math"
          keybinding="⌘M"
        >
          <CalculatorIcon className="h-4.5 w-4.5" />
        </ToolbarButtonTooltip>
        <Splitter />
        <ToolbarButtonTooltip tooltip="Page Break" onClick={onClickPageBreak}>
          <FilePlusIcon className="h-4.5 w-4.5" />
        </ToolbarButtonTooltip>
        <ToolbarButtonChange
          IconActive={CheckIcon}
          IconNotActive={ClipboardIcon}
          active={copySuccess}
          onClick={onClickCopy}
        />
        <ToolbarButtonTooltip tooltip="More" onClick={() => {}}>
          <MoreHorizontalIcon className="h-4.5 w-4.5" />
        </ToolbarButtonTooltip>
        <div className="flex-1" />
      </div>
      <Editor
        value={text}
        onChange={onChange}
        onMount={onMount}
        editorRef={editorRef}
      />
    </div>
  );
};

export default forwardRef(EditorPane);
