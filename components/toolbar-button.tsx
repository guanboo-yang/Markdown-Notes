import { cn } from "@/lib/utils";
import { ToolbarLinkProps, ToolbarButtonProps } from "@/types";
import Link from "next/link";

const ToolbarButton = (props: ToolbarLinkProps | ToolbarButtonProps) => {
  const { isLink, active, className } = props;
  if (isLink) {
    return (
      <Link
        {...props}
        {...(active && { "aria-active": true })}
        className={cn(
          "relative inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 bg-opacity-70 align-bottom text-xs font-medium text-gray-700 text-opacity-70 transition-colors hover:bg-opacity-100 hover:text-opacity-100 focus:z-10 focus:outline-none disabled:cursor-pointer disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white",
          active &&
            "bg-blue-100 text-blue-700 dark:bg-gray-700 dark:text-blue-50",
          className,
        )}
      />
    );
  }
  return (
    <button
      {...props}
      {...(active && { "aria-active": true })}
      className={cn(
        "relative inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 bg-opacity-70 align-bottom text-xs font-medium text-gray-700 text-opacity-70 transition-colors hover:bg-opacity-100 hover:text-opacity-100 focus:z-10 focus:outline-none disabled:cursor-pointer disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white",
        active &&
          "bg-blue-100 text-blue-700 dark:bg-gray-700 dark:text-blue-50",
        className,
      )}
    />
  );
};

export default ToolbarButton;
