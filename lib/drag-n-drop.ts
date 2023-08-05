import { Editor } from "@/types";
import { turndownService } from "./turn-down";
// import { useCallback } from "react";

export const onDrop = (
  editor: Editor,
  event: React.DragEvent<Element>,
  position: {
    lineNumber: number;
    column: number;
  },
) => {
  // console.log(event.dataTransfer.files);
  // console.log(event.dataTransfer.items);
  // console.log(event.dataTransfer.types);
  // event.dataTransfer.clearData(); // No effect
  editor.setPosition(position);

  if (event.dataTransfer.types.includes("text/html")) {
    // Dealing with HTML
    const data = event.dataTransfer.getData("text/html");
    // Replace U+00a0 with U+0020 // TODO: Find a better way to do this
    const html = turndownService.turndown(data).replace(/\u00a0/g, " ");
    editor.trigger("keyboard", "paste", { text: html });
  } else if (event.dataTransfer.types.includes("text/uri-list")) {
    // Dealing with Links
    const data = event.dataTransfer.getData("text/uri-list");
    editor.trigger("keyboard", "paste", { text: `[${data}](${data})` });
    // select the text
    editor.setSelection({
      startLineNumber: position.lineNumber,
      startColumn: position.column + 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column + data.length + 1,
    });
  } else if (event.dataTransfer.types.includes("text/plain")) {
    // Dealing with Text
    const data = event.dataTransfer.getData("text/plain");
    editor.trigger("keyboard", "paste", { text: data });
  } else if (event.dataTransfer.types.includes("Files")) {
    const acceptedImages = ["image/png", "image/jpeg"];
    const acceptedTextFiles = ["application/json", "application/x-yaml"];
    const acceptedSize = 1024 * 1024; // 1MB
    Array.from(event.dataTransfer.files).forEach((file) => {
      // console.log(file.type);
      if (acceptedImages.includes(file.type)) {
        // Dealing with Images
        if (file.size > acceptedSize) return alert("File is too big!");
        const reader = new FileReader();
        reader.onload = function (e) {
          // TODO: Upload file to server and replace text with link
          const url = URL.createObjectURL(file);
          editor.trigger("keyboard", "paste", {
            text: `![${file.name}](${url})`,
          });
          editor.setSelection({
            startLineNumber: position.lineNumber,
            startColumn: position.column + 2,
            endLineNumber: position.lineNumber,
            endColumn: position.column + file.name.length + 2,
          });
        };
        reader.readAsDataURL(file);
      } else if (
        file.type.includes("text") ||
        acceptedTextFiles.includes(file.type)
      ) {
        // Dealing with Text
        const reader = new FileReader();
        reader.onload = function (e) {
          editor.trigger("keyboard", "paste", { text: reader.result });
        };
        reader.readAsText(file);
      } else {
        alert(`File type not accepted: ${file.type}`);
      }
    });
  } else {
    alert(`Data type not accepted: ${event.dataTransfer.types}`);
  }
};
