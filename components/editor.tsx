import React, { useState } from "react";
import { LoaderIcon } from "lucide-react";
import { useConfig } from "@/hooks/useConfig";
import MonacoEditor, { Monaco, OnMount } from "@monaco-editor/react";
import { onDrop } from "@/lib/drag-n-drop";
import { Editor as EditorType } from "@/types";
import { formatMarkdown } from "@/lib/utils";

interface EditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  onMount: (editor: any, monaco: any) => void;
  editorRef: React.MutableRefObject<EditorType | null>;
}

const Editor = ({
  value,
  onChange,
  onMount: onEditorMount,
  editorRef,
}: EditorProps) => {
  const { config } = useConfig();
  const [position, setPosition] = useState({
    lineNumber: 0,
    column: 0,
    lineCount: 0,
  });
  const { setConfig } = useConfig();

  const onMount: OnMount = async (editor: EditorType, monaco: Monaco) => {
    editorRef.current = editor;

    // add markdown extension
    const MonacoMarkdown = await import("monaco-markdown");
    const extension = new MonacoMarkdown.MonacoMarkdownExtension();
    extension.activate(editor as any); // version mismatch

    editor.onDidChangeCursorPosition((e) => {
      setPosition((prev) => ({ ...prev, ...e.position }));
    });

    editor.onDidContentSizeChange(() => {
      const lineCount = editor.getModel()?.getLineCount() ?? 0;
      setPosition((prev) => ({ ...prev, lineCount }));
    });

    // @ts-ignore (onDropIntoEditor has not been added to the typings yet, see https://github.com/microsoft/monaco-editor/issues/3359)
    editor.onDropIntoEditor((drop) => {
      const { position, event } = drop as {
        position: { lineNumber: number; column: number };
        event: React.DragEvent;
      };
      event.preventDefault();
      event.stopPropagation();
      onDrop(editor, event, position);
    });

    // // Paste: Command + V
    // editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, async () => {
    //   const text = await navigator.clipboard.readText();
    //   editor.trigger("keyboard", "paste", { text });
    //   const isHtml = await checkPasteHtml();
    //   if (isHtml) {
    //     console.log("do you want to paste html?");
    //     // await pasteHtml(editor);
    //     // const widget = {
    //     //   domNode: () => {
    //     //     const domNode = document.createElement("div");
    //     //     domNode.innerHTML = "hi";
    //     //     return domNode;
    //     //   },
    //     //   getId: () => "paste-html",
    //     //   getDomNode: function () {
    //     //     return this.domNode();
    //     //   },
    //     //   getPosition: () => ({
    //     //     position: {
    //     //       lineNumber: 1,
    //     //       column: 1,
    //     //     },
    //     //     preference: [monaco.editor.ContentWidgetPositionPreference.ABOVE],
    //     //   }),
    //     // };
    //     // console.log(widget);
    //     // editor.addContentWidget(widget);
    //   }
    // });

    // Toggle word wrap: Alt + Z
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyZ, () =>
      setConfig((prev) => ({ ...prev, wordWrap: !prev.wordWrap })),
    );

    // Show command palette: Command + Shift + P
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP,
      () => editor.getAction("editor.action.quickCommand")!.run(),
    );

    // Format markdown: Shift + Alt + F
    editor.addCommand(
      monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
      () => formatMarkdown(editor),
    );

    // Save (Download): Command + S
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      const button = document.getElementById("download-menu"); // See `preview-pane.tsx`
      if (button) button.click();
    });

    // To allow colors in @media print!
    const styles = document.querySelectorAll("style.monaco-colors");
    styles.forEach((style) => {
      style.removeAttribute("media");
    });

    onEditorMount(editor, monaco);
  };

  return (
    <>
      <MonacoEditor
        onMount={onMount}
        onChange={onChange}
        theme={config.darkMode ? "vs-dark" : "vs"}
        defaultLanguage="markdown"
        value={value}
        loading={
          <div className="flex items-center justify-center gap-2">
            <LoaderIcon className="h-4.5 w-4.5 animate-spin" />
            Loading...
          </div>
        }
        options={{
          // minimap: { enabled: false }, // TODO: Put Into Config?
          wordWrap: config.wordWrap ? "on" : "off",
          fontFamily: "Fira Code",
          fontSize: 14,
          renderWhitespace: "all",
          tabSize: 2, // TODO: Put Into Config? (should also be in prettier config)
          cursorSmoothCaretAnimation: "on",
          cursorSurroundingLines: 2,
          cursorBlinking: "smooth",
          cursorStyle: "block",
          // fontLigatures: true, // TODO: Put Into Config?
          contextmenu: false, // TODO: Disable Markdown in Context Menu
          // dragAndDrop: false, // prevent default (?
          acceptSuggestionOnEnter: "off", // use tab instead
          // automaticLayout: true, // no effect?
          // folding: false, // ?
          // overviewRulerBorder: false, // ?
          // overviewRulerLanes: 0, // ?
        }}
      />
      <div className="sticky bottom-0 flex w-full items-center gap-1 p-1.5">
        <div className="text-xs text-gray-400">
          Line{" "}
          <code>
            {position.lineNumber}/{position.lineCount}
          </code>
          {", "}
          Column <code>{position.column}</code>
        </div>
        <div className="flex-1" />
        <div className="text-xs text-gray-400">Markdown</div>
      </div>
    </>
  );
};

export default Editor;
