"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { OnMount } from "@monaco-editor/react";
import EditorPane from "@/components/editor-pane";
import PreviewPane from "@/components/preview-pane";
import type { Editor } from "@/types";
import { cn } from "@/lib/utils";
import { useConfig } from "@/hooks/useConfig";

export default function Main() {
  const [text, setText] = useState("");
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [line, setLine] = useState(1);
  const editorPane = useRef<HTMLDivElement>(null);
  const previewPane = useRef<HTMLDivElement>(null);
  const resizer = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const editorLinesRef = useRef<number[]>([]);
  const previewLinesRef = useRef<number[]>([]);
  const targetScrollTop = useRef(0);
  const requestRef = useRef<number>(0);
  const { config, setConfig } = useConfig();

  useEffect(() => {
    if (window.innerWidth < 768) {
      setConfig((prev) => ({ ...prev, mode: "editor" }));
    }
  }, [setConfig]);

  const updatePreviewScroll = useCallback(() => {
    if (previewPane.current === null) return;
    const lineElements =
      previewPane.current.querySelectorAll<HTMLElement>("[data-sourcepos]");
    const lines = Array.from(lineElements).map((el) => {
      const [start, end] = el.dataset.sourcepos!.split("-").map((pos) => {
        const [line, column] = pos.split(":").map((n) => parseInt(n));
        return { line, column };
      });
      return start.line;
    });
    const prevLine = Math.max(...lines.filter((l) => l <= line));
    const nextLine = Math.min(...lines.filter((l) => l >= line));
    const prevItem = lineElements[lines.indexOf(prevLine)];
    const nextItem = lineElements[lines.indexOf(nextLine)];
    let frac = (line - prevLine) / (nextLine - prevLine);
    if (nextLine === prevLine) frac = 0;
    if (prevItem === undefined) {
      targetScrollTop.current = 0;
    } else if (nextItem === undefined) {
      targetScrollTop.current = prevItem.offsetTop;
    } else {
      const scrollTop =
        prevItem.offsetTop + frac * (nextItem.offsetTop - prevItem.offsetTop);
      // targetTop = scrollTop - offsetTop - paddingTop
      targetScrollTop.current = scrollTop - previewPane.current.offsetTop - 16;
    }
  }, [line]);

  const watchEditorScroll = () => {
    const editorLines = editorLinesRef.current;
    const scrollTop = editorRef.current!.getScrollTop();
    let line = 0;
    while (editorLines[line] < scrollTop) line++;
    const lineFraction =
      (scrollTop - editorLines[line - 1]) /
      (editorLines[line] - editorLines[line - 1]);
    if (isNaN(lineFraction)) return setLine(1);
    setLine(line + lineFraction);
  };

  const animate = useCallback(() => {
    if (previewPane.current === null) return;
    const currentValue = previewPane.current.scrollTop;
    const target = targetScrollTop.current;
    const speed = (target - currentValue) * 0.1;
    previewPane.current!.scrollTop = currentValue + speed;
    requestRef.current = requestAnimationFrame(animate);
    if (Math.abs(speed) < 0.5) {
      cancelAnimationFrame(requestRef.current);
    }
  }, []);

  useEffect(() => {
    updatePreviewScroll();
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [line, animate, updatePreviewScroll]);

  const onEditorMount: OnMount = async (editor) => {
    editor.onDidScrollChange((event) => {
      if (!event.scrollTopChanged) return;
      watchEditorScroll();
    });

    editor.onDidChangeConfiguration((event) => {
      updateEditorLines();
      updatePreviewLines();
      watchEditorScroll();
    });
  };

  const updateEditorLines = () => {
    if (editorRef.current === null) return;
    editorLinesRef.current = [];
    const lineCount = editorRef.current.getModel()!.getLineCount();
    for (let i = 1; i <= lineCount; i++) {
      editorLinesRef.current.push(editorRef.current.getTopForLineNumber(i));
    }
  };

  const updatePreviewLines = () => {
    if (previewPane.current === null) return;
    previewLinesRef.current = [];
    const lineElements =
      previewPane.current.querySelectorAll<HTMLElement>("[data-line]");
    for (let i = 0; i < lineElements.length; i++) {
      const line = parseInt(lineElements[i].dataset.line!);
      previewLinesRef.current[line] = lineElements[i].offsetTop;
    }
  };

  const onEditorChange = (value: string | undefined) => {
    setText(value!);
    updateEditorLines();
    updatePreviewLines();
  };

  const startResize = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    setStartX(event.clientX);
    setStartWidth(editorPane.current!.offsetWidth);
  };

  const resetSize = () => {
    editorPane.current!.style.width = "";
    resizer.current!.style.left = "";
  };

  const doDrag = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isResizing) return;
    event.preventDefault();
    let newWidth = startWidth + event.clientX - startX;
    const minWidth = 384; // 24rem
    if (newWidth < minWidth) newWidth = minWidth;
    if (newWidth > window.innerWidth - minWidth)
      newWidth = window.innerWidth - minWidth;
    editorPane.current!.style.width = `${newWidth}px`;
    resizer.current!.style.left = `${newWidth}px`;
  };

  const stopDrag = () => {
    if (!isResizing) return;
    setIsResizing(false);
    // lines already update by editor.onDidChangeConfiguration
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      onMouseMove={doDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
    >
      <EditorPane
        ref={editorPane}
        text={text}
        editorRef={editorRef}
        onMount={onEditorMount}
        onChange={onEditorChange}
      />
      <div
        ref={resizer}
        className={cn(
          "absolute left-1/2 top-0 h-full w-4 flex-shrink-0 -translate-x-1/2 cursor-ew-resize touch-none bg-gray-400/30 shadow-xl print:hidden",
          config.mode !== "both" && "hidden",
        )}
        onMouseDown={startResize}
        onDoubleClick={resetSize}
      >
        {/* {Math.round(line * 100) / 100} */}
      </div>
      <PreviewPane ref={previewPane} text={text} />
    </div>
  );
}
