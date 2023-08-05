import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export { formatMarkdown } from "./format";
export { remarkDirectivePlugin } from "./remark-directive";
export { toHtml, checkHasHtml } from "./paste-html";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const getCursorFromSelection = (
//   editorRef: MutableRefObject<EditorType | null>,
// ) => {
//   const selection = editorRef.current?.getSelections();
//   if (!selection) return;
//   return selection
//     .map(({ startLineNumber, startColumn, endLineNumber, endColumn }) => [
//       {
//         selectionStartLineNumber: startLineNumber,
//         selectionStartColumn: startColumn,
//         positionLineNumber: startLineNumber,
//         positionColumn: startColumn,
//       },
//       {
//         selectionStartLineNumber: endLineNumber,
//         selectionStartColumn: endColumn,
//         positionLineNumber: endLineNumber,
//         positionColumn: endColumn,
//       },
//     ])
//     .flat();
// };
