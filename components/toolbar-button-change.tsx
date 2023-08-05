import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import ToolbarButton from "./toolbar-button";
import { ToolbarButtonProps } from "@/types";

interface ToolbarButtonChangeProps extends ToolbarButtonProps {
  IconActive: React.ElementType;
  IconNotActive: React.ElementType;
  noRenderActive?: boolean; // if true, the button will not be rendered as active
}

// switch between on and off
const ToolbarButtonChange = (props: ToolbarButtonChangeProps) => {
  const { IconActive, IconNotActive, active, noRenderActive } = props;
  return (
    <ToolbarButton
      {...props}
      {...(!noRenderActive && { "aria-active": active })}
      active={!noRenderActive && active}
    >
      <Transition
        as={Fragment}
        show={!active}
        enter="transform transition duration-200 ease-in-out"
        enterFrom="opacity-0 scale-50"
        enterTo="opacity-100 scale-100"
        leave="transform duration-200 transition ease-in-out"
        leaveFrom="opacity-100 scale-100 "
        leaveTo="opacity-0 scale-95 "
      >
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
          <IconNotActive className="h-4 w-4" />
        </div>
      </Transition>
      <Transition
        as={Fragment}
        show={active}
        enter="transform transition duration-200 ease-in-out"
        enterFrom="opacity-0 scale-50"
        enterTo="opacity-100 scale-100"
        leave="transform duration-200 transition ease-in-out"
        leaveFrom="opacity-100 scale-100 "
        leaveTo="opacity-0 scale-95 "
      >
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
          <IconActive className="h-4 w-4" />
        </div>
      </Transition>
    </ToolbarButton>
  );
};

export default ToolbarButtonChange;
