import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface ButtonType {
  text: string;
  type?: "default" | "primary" | "danger";
}

type ERPModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  onClickButtonAt?: (index: number) => void;
  title: string;
  message: string;
  subText?: any;
  buttons?: Array<ButtonType | string>;
  children?: any;
  icon?: any;
};
const ERPAlertDialog = ({ isOpen, title, message, buttons, subText, onClickButtonAt, closeModal, children, icon }: ERPModalProps) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex gap-2">
                    {icon && <div>{icon}</div>}
                    <div className="w-full">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        {title}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">{message}</p>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 italic">{subText}</p>
                      </div>
                      <div className="mt-2 min-w-full">{children}</div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4 justify-end">
                    {buttons?.map((button, index) => {
                      let bgColor = "bg-blue-100";
                      let bgHover = "hover:bg-blue-200";
                      let textColor = "text-blue-900";
                      let title = "";
                      let tabIndex = 0;

                      if (typeof button !== "string") {
                        bgColor = button.type === "danger" ? "bg-red-100" : "bg-blue-100";
                        bgHover = button.type === "danger" ? "hover:bg-red-200" : "hover:bg-blue-200";
                        textColor = button.type === "danger" ? "text-red-900" : "text-blue-900";
                        title = button.text;
                        tabIndex = button.type === "danger" ? -1 : 0;
                      } else {
                        title = button;
                      }

                      return (
                        <button
                          tabIndex={tabIndex}
                          type="button"
                          key={`button-${index}`}
                          className={`${bgColor} ${textColor} ${bgHover} inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                          onClick={() => onClickButtonAt?.(index)}
                        >
                          {title}
                        </button>
                      );
                    })}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ERPAlertDialog;
