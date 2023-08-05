import TurndownService from "turndown";

export const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  fence: "```",
  emDelimiter: "*",
  strongDelimiter: "**",
  linkStyle: "inlined",
  linkReferenceStyle: "full",
  bulletListMarker: "-",
  hr: "---",
});
