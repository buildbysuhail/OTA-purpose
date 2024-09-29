import { Popover, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";

type ERPPopoverProps = {
  popoverButton?: ReactNode;
  popoverList: React.ReactNode;
  className?: string;
  children?: ReactNode;
  buttonClassName?: string;
};

const ERPPopover = ({ popoverButton, popoverList, className, children, buttonClassName = "mt-2" }: ERPPopoverProps) => {
  return (
    <Popover>
      <Popover.Button className={`${buttonClassName} !outline-none`}>
        {popoverButton}
        {children}
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className={`absolute z-20 transform px-4 sm:px-0 lg:max-w-3xl ${className ? className : `right-4 mt-5`}`}>
          {/* <Popover.Button>{popoverList}</Popover.Button> */}
          {popoverList}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default ERPPopover;
