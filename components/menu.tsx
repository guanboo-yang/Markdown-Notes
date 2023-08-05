import { cn } from "@/lib/utils";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import { Fragment } from "react";

const MenuItem = ({
  onClick,
  children,
  disabled,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) => (
  <HeadlessMenu.Item>
    {({ active }) => (
      <button
        onClick={onClick}
        className={cn(
          "flex w-full flex-shrink-0 items-center gap-2 bg-gray-100 bg-opacity-70 px-4 py-2 text-sm text-gray-700 text-opacity-70 hover:bg-opacity-100 hover:text-opacity-100 focus:z-10 focus:outline-none disabled:cursor-pointer disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:bg-opacity-100 dark:hover:text-opacity-100 dark:focus:bg-gray-700 dark:focus:bg-opacity-100 dark:focus:text-opacity-100",
          {
            "bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-900 dark:hover:text-gray-100 dark:focus:bg-gray-900 dark:focus:text-gray-100":
              active,
            "cursor-not-allowed": disabled,
          },
        )}
        disabled={disabled}
      >
        {children}
      </button>
    )}
  </HeadlessMenu.Item>
);

const Menu = ({
  id,
  handler,
  children,
}: {
  id?: string;
  handler: React.ReactNode;
  children: React.ReactNode;
}) => (
  <HeadlessMenu as="div" className="relative inline-block text-left">
    <HeadlessMenu.Button as="div" id={id}>
      {handler}
    </HeadlessMenu.Button>
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <HeadlessMenu.Items className="absolute right-0 z-50 mt-1.5 w-56 origin-top-right rounded-md border border-gray-200 bg-gray-100 focus:outline-none dark:border-gray-600 dark:bg-gray-800">
        <div className="py-1">{children}</div>
      </HeadlessMenu.Items>
    </Transition>
  </HeadlessMenu>
);

export { Menu, MenuItem };
