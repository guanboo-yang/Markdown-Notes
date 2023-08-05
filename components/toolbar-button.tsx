import { cn } from "@/lib/utils";
import { Popover, Transition } from "@headlessui/react";
import { ClassValue } from "clsx";
import Link, { LinkProps } from "next/link";
import { useRef, Fragment, useEffect, useState } from "react";

interface ToolbarLinkProps {
  isLink: true;
  children: React.ReactNode;
  active?: boolean;
  className?: ClassValue;
  linkProps: LinkProps;
}

interface ToolbarButtonProps {
  isLink?: false;
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: ClassValue;
  disabled?: boolean;
}

const ToolbarButton = (props: ToolbarLinkProps | ToolbarButtonProps) => {
  if (props.isLink) {
    return (
      <Link
        {...props.linkProps}
        className={cn(
          "relative inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 bg-opacity-70 align-bottom text-xs font-medium text-gray-700 text-opacity-70 transition-colors hover:bg-opacity-100 hover:text-opacity-100 focus:z-10 focus:outline-none disabled:cursor-pointer disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white",
          props.active &&
            "bg-blue-100 text-blue-700 dark:bg-gray-700 dark:text-blue-50",
          props.className,
        )}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      className={cn(
        "relative inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 bg-opacity-70 align-bottom text-xs font-medium text-gray-700 text-opacity-70 transition-colors hover:bg-opacity-100 hover:text-opacity-100 focus:z-10 focus:outline-none disabled:cursor-pointer disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white",
        props.active &&
          "bg-blue-100 text-blue-700 dark:bg-gray-700 dark:text-blue-50",
        props.className,
      )}
    >
      {props.children}
    </button>
  );
};

export default ToolbarButton;

const timeoutDuration = 120;
export const PopoverMenu = ({
  Icon,
  content,
  className,
}: {
  Icon: React.ReactNode;
  content: React.ReactNode;
  className?: ClassValue;
}) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const timeOutRef = useRef<number>(0);

  const handleEnter = (isOpen: boolean) => {
    clearTimeout(timeOutRef.current);
    !isOpen && triggerRef.current?.click();
  };

  const handleLeave = (isOpen: boolean) => {
    timeOutRef.current = window.setTimeout(() => {
      isOpen && triggerRef.current?.click();
    }, timeoutDuration);
  };

  // prevent out of screen
  useEffect(() => {
    const popover = popoverRef.current;
    if (!popover) return;
    const { left, width } = popover.getBoundingClientRect();
    const { width: windowWidth } = window.document.body.getBoundingClientRect();
    console.log(left, width, windowWidth);
    if (left < 0) {
      popover.style.left = width + "px";
    }
  }, [popoverRef]);

  return (
    <Popover className={cn("relative", className)}>
      {({ open }) => (
        <div
          onMouseEnter={() => handleEnter(open)}
          onMouseLeave={() => handleLeave(open)}
        >
          <Popover.Button as="div" ref={triggerRef} className="outline-none">
            {Icon}
          </Popover.Button>
          {/* <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              ref={popoverRef}
              className="absolute left-1/2 z-50 mt-1 -translate-x-1/2 transform whitespace-nowrap rounded-md border bg-gray-100 px-2 py-1 text-sm text-gray-700 shadow-md outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              {content}
            </Popover.Panel>
          </Transition> */}
        </div>
      )}
    </Popover>
  );
};

export const ToolbarButtonTooltip = ({
  children,
  tooltip,
  keybinding,
  onClick,
  active,
  disabled,
}: {
  children: React.ReactNode;
  tooltip: string;
  keybinding?: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) => (
  <PopoverMenu
    Icon={
      <ToolbarButton onClick={onClick} active={active} disabled={disabled}>
        {children}
      </ToolbarButton>
    }
    content={
      <span className="flex items-center gap-1">
        <span>{tooltip}</span>
        {keybinding && (
          <kbd className="rounded border border-gray-300 bg-gray-200 px-1 font-[inherit] dark:border-gray-500 dark:bg-gray-600">
            {keybinding}
          </kbd>
        )}
      </span>
    }
  />
);
