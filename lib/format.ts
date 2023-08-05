import type { Editor as EditorType } from "@/types";
import prettier from "prettier/standalone";
import parserMarkdown from "prettier/plugins/markdown";
import { Options as PrettierOptions } from "prettier";

const prettierOptions: PrettierOptions = {
  parser: "markdown",
  plugins: [parserMarkdown],
  tabWidth: 2,
};

export const formatMarkdown = async (editor: EditorType | null) => {
  if (editor === null) return;
  const text = editor.getValue();
  if (!text) return;
  editor.pushUndoStop();
  // check if already formatted
  console.log("check if already formatted");
  const isFormatted = await prettier.check(text, prettierOptions);
  if (isFormatted) return;
  const formatted = await prettier.format(text, prettierOptions);
  editor.executeEdits("format", [
    { range: editor.getModel()!.getFullModelRange(), text: formatted },
  ]);
  // this cannot be undone
  // editor.setValue(formatted);
  editor.pushUndoStop();
  editor.focus();
};
