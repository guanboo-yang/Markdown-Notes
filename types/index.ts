import { OnMount } from "@monaco-editor/react";
import { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

export type Editor = Parameters<OnMount>[0];

export type Mode = "editor" | "preview" | "both";

export interface ToolbarLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string; // Type 'string | undefined' is not assignable to type 'Url'
  isLink: true;
  active?: boolean;
}

export interface ToolbarButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLink?: false;
  active?: boolean;
}
