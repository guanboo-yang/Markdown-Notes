import type { Editor as EditorType } from "@/types";
import { turndownService } from "./turn-down";

export const checkHasHtml = async () => {
  const clipboard = await navigator.clipboard.read();
  for (const item of clipboard) {
    if (item.types.includes("text/html")) {
      return true;
    }
  }
  return false;
};

export const toHtml = async (editor: EditorType | null) => {
  if (!editor) return;
  editor.focus();
  console.log(editor.getSupportedActions().map((a) => a.id));
  const clipboard = await navigator.clipboard.read();
  console.log(clipboard);
  for (const item of clipboard) {
    if (item.types.includes("text/html")) {
      const blob = await item.getType("text/html");
      const html = await blob.text();
      const markdown = turndownService.turndown(html);
      editor.trigger("keyboard", "paste", { text: markdown });
    } else if (item.types.includes("text/plain")) {
      const blob = await item.getType("text/plain");
      const text = await blob.text();
      // editor.trigger("keyboard", "paste", { text });
    }
  }
};
